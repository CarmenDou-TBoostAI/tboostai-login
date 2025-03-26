"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getAuth } from '@/lib/auth'

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter()

  useEffect(() => {
    const auth = getAuth()
    if (!auth.token) {
      router.push('/login')
    }
  }, [router])

  return <>{children}</>
}