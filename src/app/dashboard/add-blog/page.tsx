"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import dynamic from "next/dynamic";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import axios from "axios";
import { FaPaperclip } from "react-icons/fa";

// Dynamically import TinyMCE Editor
// @ts-expect-error: Dynamic import may cause type issues
const Editor = dynamic(() => import("@tinymce/tinymce-react").then((mod) => mod.Editor), {
  ssr: false,
});

export default function CreatePost() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const router = useRouter();
  const { toast } = useToast();

  const handleEditorChange = (newContent: string) => {
    setContent(newContent);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content || !thumbnail) {
      toast({
        variant: "destructive",
        title: "Missing Fields",
        description: "Please fill in all the fields before submitting.",
      });
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    if (thumbnail) formData.append("thumbnail", thumbnail);

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/blog/create`,
        formData,
        { withCredentials: true }
      );
      toast({
        title: "Post Created Successfully",
        description: response.data.message || "Your blog post has been created!",
      });
      router.push("/dashboard");
    } catch (error: unknown) {
      const errorMessage =
        (error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        "An error occurred while creating the post.";
      toast({
        variant: "destructive",
        title: "Error Creating Post",
        description: errorMessage,
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
      <Header />
      <main className="flex-grow flex px-4 py-12">
        <Card className="w-full mx-10 bg-black text-white rounded-lg shadow-lg">
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
                <div className="col-span-1 md:col-span-2 flex flex-col justify-center space-y-6 h-full">
                  <div className="space-y-3 w-4/5 mx-auto">
                    <CardHeader className="text-center">
                      <CardTitle className="text-5xl font-bold">
                        Create a New Blog Post
                      </CardTitle>
                    </CardHeader>
                    <label
                      htmlFor="title"
                      className="text-lg font-medium leading-none"
                    >
                      Title
                    </label>
                    <Input
                      id="title"
                      type="text"
                      placeholder="Enter post title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="bg-black border-gray-700 text-white placeholder-gray-500 w-full"
                      required
                    />
                  </div>

                  <div className="space-y-2 w-4/5 mx-auto">
                    <label
                      htmlFor="thumbnail"
                      className="text-lg font-medium leading-none"
                    >
                      Thumbnail
                    </label>
                    <div
                      className="flex items-center bg-black border-gray-700 text-white w-full p-2 rounded-md cursor-pointer"
                      onClick={() =>
                        document.getElementById("thumbnail")?.click()
                      }
                    >
                      <FaPaperclip className="h-6 w-6 text-yellow-400 mr-2" />
                      <Input
                        id="thumbnail"
                        type="file"
                        onChange={(e) =>
                          setThumbnail(e.target.files?.[0] || null)
                        }
                        className="bg-black border-0 text-white placeholder-gray-500 w-full hidden"
                        required
                      />
                      <span className="text-gray-500">Choose a file...</span>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-3/5 mx-auto px-6 py-2 text-lg bg-yellow-400 text-black hover:bg-yellow-500 rounded-md"
                  >
                    Create Post
                  </Button>
                </div>

                <div className="col-span-1 md:col-span-2 space-y-2">
                  <label
                    htmlFor="content"
                    className="text-lg font-medium leading-none"
                  >
                    Content
                  </label>
                  <Editor
                    apiKey="qg4h3478b92gl3uby2xljkutvidqwkmabuu6byccu2jen3g9"
                    value={content}
                    onEditorChange={handleEditorChange}
                    init={{
                      height: 600,
                      width: "100%",
                      menubar: false,
                      plugins: ["link", "lists", "code", "image", "fullscreen"],
                      toolbar:
                        "undo redo | formatselect | bold italic | alignleft aligncenter alignright | bullist numlist outdent indent | link image code fullscreen",
                      content_style: `
                        body {
                          background-color: #1a1f29;
                          color: white;
                          font-family: Arial, sans-serif;
                        }
                      `,
                    }}
                  />
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
