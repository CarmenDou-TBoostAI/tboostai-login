"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { userApi } from "@/lib/axios"  // 导入 userApi
import { getAuth, setAuth } from "@/lib/auth"  // 导入 auth 工具
import { AxiosError } from "axios"  // 添加导入


export default function CompleteProfile() {
  const [fullName, setFullName] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const { user, token, chatSessionId } = getAuth()
      console.log("=== Complete Profile Submit ===")
      console.log("User data:", user)
      
      const response = await userApi.post('/user/complete-profile', {
        email: user.email,
        full_name: fullName
      }
    )

      console.log("Response:", response.data)

      setAuth(token || '', {  // Add null check with empty string fallback
        ...user,
        full_name: fullName
      }, chatSessionId || undefined)

      toast({
        title: "Success",
        description: "Profile updated successfully!",
        duration: 2000
      })

      router.push('/')

    } catch (error: AxiosError | unknown) {
      toast({
        title: "Error",
        description: error instanceof AxiosError 
          ? error.response?.data?.detail || "Failed to update profile"
          : "An unknown error occurred",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container relative flex min-h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
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
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Complete Your Profile
            </h1>
            <p className="text-sm text-muted-foreground">
              Please enter your full name to continue
            </p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                disabled={isLoading}
                required
              />
            </div>
            {/* <Button type="submit" className="w-full" disabled={isLoading}> */}
            <Button type="submit" className="w-full text-white" disabled={isLoading} style={{ backgroundColor: '#2D5181' }}>
              Complete Profile
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}