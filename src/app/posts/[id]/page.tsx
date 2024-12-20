'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { ArrowLeft, Calendar, User, Share2 } from 'lucide-react'

interface Post {
  _id: string
  title: string
  content: string
  author: { _id: string; name: string }
  createdAt: string
  image: string
}

export default function ShowBlogPage() {
  const { id } = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [post, setPost] = useState<Post | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/blog/getBlog/${id}`)
        if (response.data.success) {
          setPost(response.data.blog)
        } else {
          toast({
            title: "Error",
            description: "Failed to fetch blog post",
            variant: "destructive",
          })
        }
      } catch (error) {
        console.error('Error fetching blog post:', error)
        toast({
          title: "Error",
          description: "An error occurred while fetching the blog post",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchPost()
    }
  }, [id, toast])

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: post?.title,
          text: 'Check out this blog post!',
          url: window.location.href,
        })
      } catch (error) {
        console.error('Error sharing:', error)
      }
    } else {
      await navigator.clipboard.writeText(window.location.href)
      toast({
        title: "Link copied",
        description: "The blog post link has been copied to your clipboard",
      })
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white">

        <main className="container mx-auto px-4 py-8">
          <Skeleton className="h-8 w-3/4 mb-4" />
          <Skeleton className="h-4 w-1/4 mb-8" />
          <Skeleton className="h-64 w-full mb-8" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-3/4" />
        </main>
   
      </div>
    )
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-black text-white">
    
        <main className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-4 ">Blog Post Not Found</h1>
          <Button onClick={() => router.push('/')} className="mt-4">
            <ArrowLeft className="mr-2 h-4 w-4 text-black" /> Back to Home
          </Button>
        </main> 
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
 
      <main className="container mx-auto px-4 py-8">
        <nav className="mb-6 flex justify-between items-center">
          <Button onClick={() => router.push('/')} variant="outline"  className='text-black'>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
          </Button>
          <Button onClick={handleShare} variant="outline" className='text-black'>
            <Share2 className="mr-2 h-4 w-4 " /> Share
          </Button>
        </nav>
        <article>
          <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
          <div className="flex items-center text-gray-400 mb-6">
            <User className="mr-2 h-4 w-4" aria-hidden="true" />
            <span className="mr-4">By {post.author.name}</span>
            <Calendar className="mr-2 h-4 w-4" aria-hidden="true" />
            <time dateTime={post.createdAt}>
              {new Date(post.createdAt).toLocaleDateString()}
            </time>
          </div>
          {post.image && (
            <div className="mb-8">
              <Image
                src={post.image}
                alt=""
                width={1200}
                height={630}
                className="rounded-lg object-cover w-full"
                priority
              />
            </div>
          )}
          <Card className="bg-black border-gray-800">
            <CardContent className="prose prose-invert max-w-none pt-6 text-white overflow-auto">
              <div dangerouslySetInnerHTML={{ __html: post.content }} />
            </CardContent>
          </Card>
        </article>
      </main>
 
    </div>
  )
}

