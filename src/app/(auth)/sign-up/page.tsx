'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Header from '@/components/Header';
import { useSearchParams } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import axios, { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';

type RegisterFormData = {
  name: string;
  email: string;
  password: string;
};

interface AxiosErrorResponse {
  message?: string;
}

const RegisterPage = () => {
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const register = async (formData: RegisterFormData) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/signup`,
        formData,
        { withCredentials: true }
      );
      toast({
        title: 'Registration Successful',
        description: response.data.message || 'Your account has been created!',
        duration: 3000,
      });

      // Save the token to localStorage after successful registration
      const token = response.data.token; // Adjust this if your API returns the token with a different key
      if (token) {
        if (typeof window !== 'undefined') {
          localStorage.setItem('authToken', token); // Save token to localStorage
        }
      }

      router.push('/dashboard');
    } catch (error: unknown) {
      const axiosError = error as AxiosError<AxiosErrorResponse>;
      const errorMessage =
        axiosError.response?.data?.message || 'An error occurred during Registration.';
      console.error('Registration Error:', errorMessage);
      toast({
        variant: 'destructive',
        title: 'Registration Failed',
        description: errorMessage,
        duration: 3000,
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast({
        variant: 'destructive',
        title: 'Passwords Do Not Match',
        description: 'Please ensure the passwords match before submitting.',
        duration: 3000,
      });
      return;
    }

    const formData = { name, email, password };
    register(formData);
  };

  useEffect(() => {
    const reason = searchParams.get('reason');

    if (reason === 'already_authenticated') {
      toast({
        title: 'Already Logged In',
        description: 'You are already authenticated. Redirecting to your dashboard.',
      });
    }
  }, [searchParams, toast]);

  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
      <Header />

      <main className="flex-grow flex items-center justify-center px-4 py-12">
        <Card className="w-full max-w-xl bg-black text-white rounded-lg shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-5xl font-bold">Create an Account</CardTitle>
            <div className="flex justify-center items-center mt-2">
              <span className="text-lg text-gray-400">Already have an account?</span>
              <Link href="/sign-in" className="ml-1 text-yellow-400 hover:underline">
                Log In
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="name" className="text-lg font-medium leading-none">
                  Name
                </label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-black border-gray-700 w-[100%] text-white placeholder-white"
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="email" className="text-lg font-medium leading-none">
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
                <label htmlFor="password" className="text-lg font-medium leading-none">
                  Password
                </label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-black border-gray-700 w-[100%] text-white placeholder-white"
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="confirm-password" className="text-lg font-medium leading-none">
                  Confirm Password
                </label>
                <Input
                  id="confirm-password"
                  type="password"
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="bg-black border-gray-700 w-[100%] text-white placeholder-white"
                  required
                />
              </div>
              <Button type="submit" className="w-full text-xl bg-yellow-400 text-black hover:bg-yellow-500">
                Register
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

const RegisterPageWithSuspense = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <RegisterPage />
  </Suspense>
);

export default RegisterPageWithSuspense;
