"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, CheckCircle2, Eye } from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"

interface Assignment {
  id: string
  title: string
  dueDate: string
  submissions: number
  total: number
}

const assignments: Assignment[] = [
  {
    id: "1",
    title: "Build a Python Data Analysis Tool",
    dueDate: "Nov 15, 2024",
    submissions: 18,
    total: 28,
  },
  {
    id: "2",
    title: "Advanced OOP Concepts Quiz",
    dueDate: "Nov 10, 2024",
    submissions: 28,
    total: 28,
  },
  {
    id: "3",
    title: "Performance Optimization Project",
    dueDate: "Nov 5, 2024",
    submissions: 25,
    total: 28,
  },
]

export function AssignmentsTab() {
  const params = useParams()
  const classId = params.id as string

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
                  <span>Due: {assignment.dueDate}</span>
                </div>
                <div className="flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                  <span>
                    {assignment.submissions}/{assignment.total} submitted
                  </span>
                </div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 flex-shrink-0">
              <Link href={`/classes/${classId}/assignments/${assignment.id}`}>
                <Button variant="outline" size="sm" className="gap-2">
                  <Eye className="w-4 h-4" />
                  <span className="hidden sm:inline">View</span>
                </Button>
              </Link>
              <Link href={`/classes/${classId}/assignments/${assignment.id}/submissions`}>
                <Button variant="secondary" size="sm" className="gap-2">
                  <span className="hidden sm:inline">Submissions</span>
                </Button>
              </Link>
              
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
