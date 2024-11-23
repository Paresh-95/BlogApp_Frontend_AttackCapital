'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Plus, MoreVertical, Edit, Trash } from 'lucide-react';
import axios, { AxiosError } from 'axios';
import { useToast } from '@/hooks/use-toast';

interface AxiosErrorResponse {
  message?: string;
}


import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface Post {
  _id: string;
  title: string;
  content: string;
  author: { _id: string; name: string };
  createdAt: Date;
  image: string;
  thumbnail: string;
}

export default function UserDashboard() {
  const { toast } = useToast();
  const router = useRouter();
  const [progress, setProgress] = useState(0);
  const [blogs, setBlogs] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [user, setUser] = useState<{ _id: string; name: string }>({ _id: '', name: 'Guest' });

  const fetchUser = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/user`, { withCredentials: true });
      if (response.data.success) {
        setUser(response.data.user);
      }
    } catch (error) {
      console.log('Error fetching user data:', error);
    }
  };

  const fetchUserBlogs = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/blog/getAuthorBlogs?author=${user._id}`,
        { withCredentials: true }
      );
  
      if (response.data.success) {
        setBlogs(response.data.blogs);
        toast({
          title: 'Blogs Fetched Successfully',
        });
      } else {
        toast({
          title: response.data.message || 'No Blogs Found',
        });
      }
      setLoading(false);
    } catch (error: unknown) {
      const axiosError = error as AxiosError<AxiosErrorResponse>;
      const errorMessage =
        axiosError.response?.data?.message || 'An error occurred during fetching blogs.';
      toast({
        variant: 'destructive',
        title: 'Error Fetching Blogs',
        description: errorMessage,
      });
    }
  };
  
  const handleDelete = async (postId: string) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        const response = await axios.delete(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/blog/delete/${postId}`,
          { withCredentials: true }
        );
  
        if (response.data.success) {
          setBlogs(blogs.filter(blog => blog._id !== postId));
          toast({
            title: 'Blog Deleted Successfully',
          });
        } else {
          toast({
            variant: 'destructive',
            title: 'Error Deleting Blog',
            description: response.data.message || 'An error occurred while deleting the blog.',
          });
        }
      } catch (error: unknown) {
        const axiosError = error as AxiosError<AxiosErrorResponse>;
        const errorMessage =
          axiosError.response?.data?.message || 'An error occurred during deleting the blog.';
        toast({
          variant: 'destructive',
          title: 'Error Deleting Blog',
          description: errorMessage,
        });
      }
    }
  };
  

  const handleEdit = (postId: string) => {
    router.push(`/dashboard/edit-blog/${postId}`);
  };

 

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    if (user._id) {
      fetchUserBlogs();
    }
  }, [user]);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => (prev < 90 ? prev + 10 : prev));
    }, 200);

    return () => clearInterval(interval);
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

      <main className="container mx-auto px-4 py-6">
        <div className="flex flex-col sm:flex-row justify-between items-center  border-gray-800 pb-6 mt-24 mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-0">Welcome, {user.name}</h2>
          <Button
            onClick={() => router.push('/dashboard/add-blog')}
            className="bg-white text-black hover:bg-gray-200 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add New Post
          </Button>
        </div>

        <div>
          <h3 className="text-2xl sm:text-3xl font-semibold mb-6">Your Posts</h3>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {blogs.map((post) => (
              <Card key={post._id} className="h-full bg-black border-gray-800 overflow-hidden transition-transform duration-300 hover:scale-[1.02]">
                <div className="relative aspect-video w-full overflow-hidden">
                  <Image
                    src={post.thumbnail}
                    alt={post.title}
                    layout="fill"
                    objectFit="cover"
                    className="transition-transform duration-300 hover:scale-105"
                  />
                </div>
                <CardHeader className="flex flex-row justify-between items-start gap-4">
                  <h3 className="text-xl font-bold line-clamp-2 text-white">
                    {post.title}
                  </h3>
                  <DropdownMenu >
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0 text-black bg-white">
                        <span className="sr-only">Open menu</span>
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className='' >
                      <DropdownMenuItem onClick={() => handleEdit(post._id)}>
                        <Edit className="mr-2 h-4 w-4" />
                        <span>Edit</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDelete(post._id)}>
                        <Trash className="mr-2 h-4 w-4" />
                        <span>Delete</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </CardHeader>
                <CardContent>
                  <div
                    className="text-gray-300 line-clamp-3 text-sm"
                    dangerouslySetInnerHTML={{ __html: post.content }}
                  />
                </CardContent>
                <CardFooter>
                  <p className="text-sm text-gray-400">By {post.author.name}</p>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

