"use client"

import { useState, useEffect } from "react"
import { ClassCard } from "@/components/class-card"
import { CreateClassDialog } from "@/components/create-class-dialog"
import { classService } from "@/services/classService"
import { Class } from "@/models/class"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"

export default function ClassesPage() {
  const { user, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const [classes, setClasses] = useState<Class[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  useEffect(() => {
    if (!authLoading && (!user || user.role !== "teacher")) {
      router.push("/auth")
      return
    }

    if (user && user.role === "teacher") {
      classService.getAll(user.id)
        .then((res) => {
          setClasses(res)
          setLoading(false)
        })
        .catch((err) => {
          setError(err.message)
          setLoading(false)
        })
    }
  }, [user, authLoading, router])

  const handleCreateClass = async (data: { title: string; description: string; code: string; is_public: boolean }) => {
    if (!user) return
    try {
      const newClass = await classService.create(data, user.id)
      setClasses(prev => [...prev, newClass])
      setDialogOpen(false)
      router.push(`/classes/${newClass.id}`)
    } catch (error) {
      console.error("Failed to create class:", error)
      alert("Failed to create class. Please try again.")
    }
  }

  if (authLoading || loading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <p className="text-muted-foreground">Loading classes...</p>
      </div>
    )
  }



  // Error state
  if (error) {
    return (
      <div className="w-full h-full flex items-center justify-center flex-col gap-4">
        <p className="text-destructive">Error: {error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg"
        >
          Retry
        </button>
      </div>
    )
  }

  return (
    <div className="w-full h-full px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground">Class Management</h1>
          <p className="text-muted-foreground text-xs sm:text-sm lg:text-base mt-1">
            Manage and monitor your AI-powered lab classes
          </p>
        </div>
        <button
          onClick={() => setDialogOpen(true)}
          className="px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg font-medium transition-colors flex items-center justify-center gap-2 whitespace-nowrap text-sm sm:text-base"
        >
          <span>+</span>
          Create Class
        </button>
      </div>

      {classes.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">No classes found. Create your first one!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
          {classes.map((classItem) => (
            <ClassCard
              key={classItem.id}
              id={classItem.id}
              name={classItem.title}
              students={classItem.member_count || 0}
              teacher={classItem.owner?.display_name || classItem.owner?.full_name || classItem.owner?.email || "Unknown"}
            />
          ))}
        </div>
      )}

      <CreateClassDialog open={dialogOpen} onOpenChange={setDialogOpen} onCreate={handleCreateClass} />
    </div>
  )
}