"use client"

import * as React from "react"
import { Loader2, Chrome } from 'lucide-react'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from 'next/navigation'
import { authApi, chatApi } from '@/lib/axios'
import { getAuth } from "@/lib/auth"
// interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export function UserAuthForm({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  const [email, setEmail] = React.useState("")
  const { toast } = useToast()
  const router = useRouter()

  async function onSubmit(event: React.SyntheticEvent) {
    event.preventDefault()
    setIsLoading(true)
  
    try {
      await authApi.post('/auth/email/request-code', {
        email: email  // 确保这是一个字符串
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      
      // 直接跳转到验证码页面
      router.push(`/login/verify-email?email=${encodeURIComponent(email)}`)
    } catch (error) {
      console.error('Request error:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
}

  const handleGoogleSignIn = async () => {
    setIsLoading(true)
    try {
      const { chatSessionId } = getAuth() 
      console.log("=== Starting Google Login ===")
      console.log("Current chat_session_id:", chatSessionId)

      if (!chatSessionId) {
        const createResponse = await chatApi.post('/sessions/create')
        const newSessionId = createResponse.data.chatSessionId
        localStorage.setItem('chat_session_id', newSessionId)
      }

      console.log('Requesting Google auth URL...')
      const { data } = await authApi.get('/auth/google/url', {
            params: {
                session_id: getAuth().chatSessionId
            }
        })
      console.log('Received response:', data)  // 检查完整响应
      
      if (data.url) {  // 确保 url 存在
        window.location.href = data.url
      } else {
        throw new Error('No URL received from server')
      }
    } catch (error) {
      console.error('Full error:', error)
      toast({
        title: "Error signing in with Google",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={cn("grid gap-6", className)} {...props}>
    <form onSubmit={onSubmit}>
      <div className="grid gap-2">
        <div className="grid gap-1">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
            required
          />
        </div>
        <Button disabled={isLoading} className="w-full text-white" style={{ backgroundColor: '#2D5181' }}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Continue with Email
        </Button>
      </div>
    </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or
          </span>
        </div>
      </div>

      <Button
        variant="outline"
        type="button"
        disabled={isLoading}
        onClick={handleGoogleSignIn}
      >
        {isLoading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Chrome className="mr-2 h-4 w-4" />
        )}
        Continue with Google
      </Button>
    </div>
  )
}