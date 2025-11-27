"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, CheckCircle2, Eye, Plus, Play } from "lucide-react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { assignmentService } from "@/services/assignemntService"
import { Assignment } from "@/models/assignment"
import { useAuth } from "@/contexts/auth-context"

export function AssignmentsTab() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const classId = params.id as string
  const [loadingId, setLoadingId] = useState<string | null>(null)
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const isTeacher = user?.role === "teacher"

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const data = await assignmentService.getAssignemntsByClass(classId)
        setAssignments(data)
      } catch (error) {
        console.error("Error fetching assignments:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchAssignments()
  }, [classId])

  // const handleStartAssignment = async (assignmentId: string) => {
  //   setLoadingId(assignmentId)
  //   try {
  //     await startAssignment(classId, assignmentId)
  //     router.refresh()
  //   } catch (error) {
  //     console.error("Error starting assignment:", error)
  //   } finally {
  //     setLoadingId(null)
  //   }
  // }

  if (isLoading) {
    return <div className="text-center py-8 text-muted-foreground">Loading assignments...</div>
  }

  return (
    <div className="space-y-4">
      {assignments.map((assignment) => (
        <Card key={assignment.id} className="p-4 sm:p-6 border border-border hover:border-accent/50 transition-colors">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex-1 min-w-0">
              <h3 className="text-base sm:text-lg font-semibold text-foreground break-words">{assignment.title}</h3>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-2 text-xs sm:text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4 flex-shrink-0" />
                  <span>Due: {assignment.dueAt}</span>
                </div>
                
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 flex-shrink-0">
              {isTeacher && !assignment.isActive && (
                <Link href={`/classes/${classId}/assignments/${assignment.id}/add-questions`}>
                  <Button variant="outline" size="sm" className="gap-2 bg-transparent w-full sm:w-auto">
                    <Plus className="w-4 h-4" />
                    <span className="hidden sm:inline">Add Questions</span>
                  </Button>
                </Link>
              )}

              {isTeacher && !assignment.isActive && (
                <Button
                  size="sm"
                  className="gap-2 w-full sm:w-auto"
                  disabled={loadingId === assignment.id}
                >
                  <Play className="w-4 h-4" />
                  <span className="hidden sm:inline">{loadingId === assignment.id ? "Starting..." : "Start"}</span>
                </Button>
              )}

              <Link href={`/classes/${classId}/assignments/${assignment.id}`}>
                <Button variant="outline" size="sm" className="gap-2 bg-transparent w-full sm:w-auto">
                  <Eye className="w-4 h-4" />
                  <span className="hidden sm:inline">{isTeacher ? "Preview" : "View"}</span>
                </Button>
              </Link>
              
              {isTeacher && (
                <Link href={`/classes/${classId}/assignments/${assignment.id}/submissions`}>
                  <Button variant="outline" size="sm" className="gap-2 bg-transparent w-full sm:w-auto">
                    <Eye className="w-4 h-4" />
                    <span className="hidden sm:inline">Submissions</span>
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
