"use client"

import React, { useEffect, Suspense } from 'react'
import Link from "next/link"
import { useSearchParams } from "next/navigation"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { UserAuthForm } from "@/components/user-auth-form"
import { toast } from '@/hooks/use-toast'

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginContent />
    </Suspense>
  )
}

function LoginContent() {
  const searchParams = useSearchParams()

  useEffect(() => {
    const error = searchParams.get('error')
    if (error) {
      setTimeout(() => {
        toast({
          title: "Authentication Error",
          description: error,
          variant: "destructive",
          duration: 5000
        })
      }, 0)
    }
  }, [searchParams])
  
  // useEffect(() => {
  //   console.log("=== Login Page ===")
  //   if (searchParams.get('status') === 'session_expired') {
  //     console.log("=== Session Expired ===")
  //     setTimeout(() => {
  //       toast({
  //         title: "Session Expired",
  //         description: "Your session has expired. Please login again.",
  //         variant: "destructive",
  //         duration: 5000
  //       })
  //     }, 0)
  //   }
  // }, [searchParams])
  return (
    <div className="container relative min-h-screen flex flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      {/* <div className="absolute top-0 left-0 w-full h-[200px] md:hidden">
        <Image
          src="/examples/authentication-light.png"
          fill
          alt="Authentication"
          className="object-cover block dark:hidden"
        />
        <Image
          src="/examples/authentication-dark.png"
          fill
          alt="Authentication"
          className="object-cover hidden dark:block"
        />
      </div> */}

      <Link
        href="/signup"
        className={cn(
          buttonVariants({ variant: "ghost" }),
          "absolute right-4 top-4 md:right-8 md:top-8"
        )}
      >
        Sign Up
      </Link>

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
              Let's get you started!
            </h1>
            <p className="text-sm text-muted-foreground">
              Enter your email below to continue
            </p>
          </div>
          <UserAuthForm />
          <p className="px-8 text-center text-sm text-muted-foreground">
            By clicking continue, you agree to our{" "}
            <Link
              href="/terms"
              className="underline underline-offset-4 hover:text-primary"
            >
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link
              href="/privacy"
              className="underline underline-offset-4 hover:text-primary"
            >
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  )
}

