"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { ClassCard } from "@/components/class-card"
import { JoinClassDialog } from "@/components/join-class-dialog"
import { classService } from "@/services/classService"
import { Class } from "@/models/class"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export default function StudentClassesPage() {
  const { user, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const [classes, setClasses] = useState<Class[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [joinDialogOpen, setJoinDialogOpen] = useState(false)

  useEffect(() => {
    if (!authLoading && (!user || user.role !== "student")) {
      router.push("/auth")
      return
    }

    if (user && user.role === "student") {
      loadClasses()
    }
  }, [user, authLoading, router])

  const loadClasses = async () => {
    if (!user) return
    
    setLoading(true)
    try {
      const data = await classService.getStudentClasses(user.id)
      setClasses(data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load classes")
    } finally {
      setLoading(false)
    }
  }

  const handleJoinClass = async (code: string) => {
    if (!user) return
    
    try {
      const joinedClass = await classService.joinClassByCode(code, user.id)
      setClasses(prev => [...prev, joinedClass])
    } catch (err) {
      throw err // Re-throw to let dialog handle error display
    }
  }

  if (authLoading || loading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <p className="text-muted-foreground">Loading classes...</p>
      </div>
    )
  }

  if (error && classes.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center flex-col gap-4">
        <p className="text-destructive">Error: {error}</p>
        <Button onClick={loadClasses} variant="outline">
          Retry
        </Button>
      </div>
    )
  }

  return (
    <div className="w-full h-full px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground">My Classes</h1>
          <p className="text-muted-foreground text-xs sm:text-sm lg:text-base mt-1">
            View and manage your enrolled classes
          </p>
        </div>
        <Button
          onClick={() => setJoinDialogOpen(true)}
          className="px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg font-medium transition-colors flex items-center justify-center gap-2 whitespace-nowrap text-sm sm:text-base"
        >
          <Plus className="w-4 h-4" />
          Join Class
        </Button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
          <p className="text-sm text-yellow-800 dark:text-yellow-200">{error}</p>
        </div>
      )}

      {classes.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg mb-4">You haven't joined any classes yet.</p>
          <Button
            onClick={() => setJoinDialogOpen(true)}
            className="bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-700 hover:to-blue-700 text-white"
          >
            Join Your First Class
          </Button>
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

      <JoinClassDialog
        open={joinDialogOpen}
        onOpenChange={setJoinDialogOpen}
        onJoin={handleJoinClass}
      />
    </div>
  )
}

