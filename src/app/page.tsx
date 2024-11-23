"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Card,
  CardContent,

  CardHeader,
} from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";
import axios from "axios";

interface Post {
  _id: string;
  title: string;
  content: string;
  author: { _id: string; name: string };
  createdAt: Date;
  thumbnail: string;
}

export default function Home() {
  const [progress, setProgress] = useState(0);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [featuredPost, setFeaturedPost] = useState<Post | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => (prev < 90 ? prev + 10 : prev));
    }, 200);
    return () => clearInterval(interval);
  }, []);

  const fetchBlogs = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/blog/getAllBlogs`,
        { withCredentials: true }
      );
      if (response.data.success) {
        setPosts(response.data.blogs);
        if (response.data.blogs.length > 0) {
          setFeaturedPost(response.data.blogs[0]);
        }
      } else {
        toast({
          variant: "destructive",
          title: "Error Fetching Blogs",
          description: response.data.message || "Could not fetch blogs.",
        });
      }
      setProgress(100);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching blogs:", error);
      toast({
        variant: "destructive",
        title: "Error Fetching Blogs",
        description: "An error occurred while fetching the blog data.",
      });
      setProgress(100);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <Progress value={progress} className="w-[60%] max-w-md" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />

      <main className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        {featuredPost && (
          <div className="mb-12 sm:mb-16 lg:mb-20">
            <Link href={`/posts/${featuredPost._id}`} className="block group">
              <div className="relative aspect-[21/9] w-full overflow-hidden rounded-lg">
                <Image
                  src={featuredPost.thumbnail}
                  alt={`Featured Image`}
                  layout="fill"
                  objectFit="cover"
                  className="transform transition-transform duration-300 group-hover:scale-105"
                  priority
                />
              </div>
              <div className="mt-6 sm:mt-8 max-w-3xl">
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-tight text-gray-300 transition-colors">
                  {featuredPost.title}
                </h2>
                <div
                  className="mt-3 sm:mt-4 text-base sm:text-lg md:text-xl text-gray-300 line-clamp-2"
                  dangerouslySetInnerHTML={{ __html: featuredPost.content }}
                />
                <p className="mt-4 text-lg sm:text-xl text-gray-400">
                  By {featuredPost.author.name}
                </p>
              </div>
            </Link>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 auto-rows-fr">
          {posts.slice(1).map((post, idx) => (
            <Link key={idx} href={`/posts/${post._id}`} className="group">
              <Card className="h-full bg-black border-gray-800 overflow-hidden">
                <div className="relative aspect-[16/9] w-full overflow-hidden">
                  <Image
                    src={post.thumbnail}
                    alt={post.title}
                    layout="fill"
                    objectFit="cover"
                    className="transform transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <CardHeader className="space-y-2">
                  <h3 className="text-3xl font-bold line-clamp-2 text-white">
                    {post.title}
                  </h3>

                  <p className="text-sm text-white">By {post.author.name}</p>
                </CardHeader>
                <CardContent>
                  <div
                    className="text-sm sm:text-base text-gray-300 line-clamp-2"
                    dangerouslySetInnerHTML={{ __html: post.content }}
                  />
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
