"use client";

import { useState } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,

  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Header from "@/components/Header";

import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import { useRouter } from "next/navigation";

type LoginForm = {
  email: string;
  password: string;
}

export default function Login() {
  const { toast } = useToast();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = async (formData:LoginForm) => {
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/login`,
        formData,
        { withCredentials: true }
      );
      toast({
        title: "User Logged In Successfully",
        description: "Welcome back!",
        duration: 3000,
      });
      router.push("/dashboard");
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: "Please check your credentials and try again.",
        duration: 3000,
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = {
      email,
      password,
    };
    login(formData);
  };

  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
      <Header />

      <main className="flex-grow flex items-center justify-center  px-4 py-12">
        <Card className="w-full max-w-xl bg-black text-white rounded-lg  shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-5xl font-bold">
              Login to your account
            </CardTitle>
            <div className="flex justify-center items-center mt-2">
              <span className="text-lg text-gray-400">Don&apost have an account?</span>
              <Link href="/sign-up" className="ml-1 text-yellow-400 hover:underline">
                Sign Up
              </Link>
            </div>
          </CardHeader>
          <CardContent >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="text-lg font-medium leading-none"
                >
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-black border-gray-700 w-[100%] text-white placeholder-white"
                  required
                />
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="password"
                  className="text-sm font-medium leading-none"
                >
                  Password
                </label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-black border-gray-700 w-[100%] text-white placeholder-white"
                  required
                />
                <Link
                  href="/forgot-password"
                  className="text-sm text-gray-400 hover:text-white float-right"
                >
                  Forgot Password?
                </Link>
              </div>
              <Button
                type="submit"
                className="w-full text-xl bg-yellow-400 text-black hover:bg-yellow-500"
              >
                Sign In
              </Button>
            </form>
          </CardContent>
        
        </Card>
      </main>
    </div>
  );
}

