"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"

export default function Page() {
  const router = useRouter()
  const { user, isLoading, isAuthenticated } = useAuth()

  useEffect(() => {
    if (isLoading) return

    if (!isAuthenticated) {
      router.push("/auth")
    } else if (user?.role === "teacher") {
      router.push("/teacher-dashboard")
    } else if (user?.role === "student") {
      router.push("/student-dashboard")
    }
  }, [isAuthenticated, user, isLoading, router])

  // Show loading state while checking auth
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-muted-foreground">Loading...</div>
    </div>
  )
}
