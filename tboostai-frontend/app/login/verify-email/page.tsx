"use client"

import { Suspense } from 'react'
import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"
import { authApi } from "@/lib/axios"  
import { getAuth, setAuth } from "@/lib/auth"    
import { AxiosError } from "axios"
import { eventService } from '@/lib/event'  // 添加这行

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyEmailContent />
    </Suspense>
  )
}

function VerifyEmailContent() {
  const [verificationCode, setVerificationCode] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const email = searchParams.get("email")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
  
    try {
      const { chatSessionId } = getAuth()
      const response = await authApi.post('/auth/email/verify', null, {
        params: {
          email: email,
          code: verificationCode,
          session_id: chatSessionId
        }
      })
  
      const { token, user, needsProfile, session_id } = response.data
      
      // 先触发 session 更新事件
      window.dispatchEvent(new Event('session-updated'))
      
      // 然后设置认证信息
      setAuth(token, user, session_id)

      toast({
        title: "Success",
        description: "Verification successful!",
        duration: 2000
      })
  
      if (needsProfile) {
        router.push('/signup/complete-profile')
      } else {
        router.push('/')
      }
  
    } catch (error: unknown) {
      console.error("Error in verification:", error)
      toast({
        title: "Verification Failed",
        description: error instanceof AxiosError ? error.response?.data?.detail || "Invalid verification code" : "An unknown error occurred",
        variant: "destructive",
        duration: 3000
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container relative min-h-screen flex flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      {/* 左侧装饰部分 */}
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
        {/* Absolute background with light blue color */}
        <div
          className="absolute inset-0"
          style={{ backgroundColor: "#9ABFF1" }}
        />

        {/* Centered content container */}
        <div className="relative z-20 flex flex-col items-center justify-center h-full text-center">
          {/* Logo and Title */}
          <div className="flex items-center justify-center mb-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-3 h-8 w-8"
            >
              <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
            </svg>
            <h1 className="text-3xl font-bold tracking-tight">CarQuest</h1>
          </div>

          {/* Optional Subtitle or Description */}
          <p className="text-sm text-white/80 max-w-xs text-center mb-6">
            Your ultimate destination for automotive exploration and discovery
          </p>
        </div>
      </div>

      {/* 右侧表单部分 */}
      <div className="w-full px-4 py-8 lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Check your email
            </h1>
            <p className="text-sm text-muted-foreground">
              We&apos;ve sent a verification code to {email}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="text"
              placeholder="Enter verification code"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              disabled={isLoading}
              required
            />
            {/* <Button type="submit" className="w-full" disabled={isLoading}> */}
            <Button type="submit" className="w-full text-white" disabled={isLoading} style={{ backgroundColor: '#2D5181' }}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Verify Code
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}