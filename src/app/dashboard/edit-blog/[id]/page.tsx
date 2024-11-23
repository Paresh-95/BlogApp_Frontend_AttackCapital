'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import axios from 'axios'
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { ArrowLeft, Calendar, User, Tag } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

interface Post {
  _id: string
  title: string
  content: string
  author: { _id: string; name: string }
  createdAt: string
  image: string
  category: string
}

export default function ShowBlogPage() {
  const { id } = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [post, setPost] = useState<Post | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPost = async () => {
      if (!id || id === 'undefined') {
        toast({
          title: "Error",
          description: "Invalid blog post ID",
          variant: "destructive",
        })
        router.push('/dashboard')
        return
      }
      setLoading(true)
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/blog/${id}`)
        if (response.data.success) {
          setPost(response.data.blog)
        } else {
          toast({
            title: "Error",
            description: "Failed to fetch blog post",
            variant: "destructive",
          })
          router.push('/dashboard')
        }
      } catch (error) {
        console.error('Error fetching blog post:', error)
        toast({
          title: "Error",
          description: "An error occurred while fetching the blog post",
          variant: "destructive",
        })
        router.push('/dashboard')
      } finally {
        setLoading(false)
      }
    }

    fetchPost()
  }, [id, toast, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <Skeleton className="h-8 w-3/4 mb-4" />
          <Skeleton className="h-4 w-1/4 mb-8" />
          <Skeleton className="h-64 w-full mb-8" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-3/4" />
        </main>
        <Footer />
      </div>
    )
  }

  if (!post) {
    return null 
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <Button onClick={() => router.push('/dashboard')} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
        </Button>
        <article>
          <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
          <div className="flex flex-wrap items-center text-gray-400 mb-6">
            <div className="flex items-center mr-4 mb-2">
              <User className="mr-2 h-4 w-4" />
              <span>{post.author.name}</span>
            </div>
            <div className="flex items-center mr-4 mb-2">
              <Calendar className="mr-2 h-4 w-4" />
              <time dateTime={post.createdAt}>
                {new Date(post.createdAt).toLocaleDateString()}
              </time>
            </div>
            <div className="flex items-center mb-2">
              <Tag className="mr-2 h-4 w-4" />
              <span>{post.category}</span>
            </div>
          </div>
          {post.image && (
            <div className="mb-8">
              <Image
                src={post.image}
                alt={post.title}
                width={1200}
                height={630}
                className="rounded-lg object-cover w-full"
              />
            </div>
          )}
          <Card className="bg-[#0f1218] border-gray-800">
            <CardContent className="prose prose-invert max-w-none pt-6">
              <div dangerouslySetInnerHTML={{ __html: post.content }} />
            </CardContent>
          </Card>
        </article>
      </main>
      <Footer />
    </div>
  )
}

