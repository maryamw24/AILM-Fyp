"use client"

import { useParams, useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, AlertTriangle } from "lucide-react"
import Link from "next/link"

interface Submission {
  id: string
  studentName: string
  submittedAt: string
  date: string
  isPlagiarized: boolean
  score?: number
}

export default function SubmissionsPage() {
  const params = useParams()
  const router = useRouter()
  const classId = params.id as string
  const assignmentId = params.assignmentId as string

  // Mock submission data - in production, fetch from API
  const submissions: Submission[] = [
    {
      id: "1",
      studentName: "Alex Chen",
      submittedAt: "2:45 PM",
      date: "Nov 14, 2024",
      isPlagiarized: false,
      score: 95,
    },
    {
      id: "2",
      studentName: "Jordan Smith",
      submittedAt: "11:30 AM",
      date: "Nov 14, 2024",
      isPlagiarized: true,
      score: 68,
    },
    {
      id: "3",
      studentName: "Casey Rodriguez",
      submittedAt: "3:15 PM",
      date: "Nov 13, 2024",
      isPlagiarized: false,
      score: 87,
    },
    {
      id: "4",
      studentName: "Morgan Taylor",
      submittedAt: "9:20 AM",
      date: "Nov 13, 2024",
      isPlagiarized: false,
      score: 92,
    },
    {
      id: "5",
      studentName: "Riley Martinez",
      submittedAt: "5:40 PM",
      date: "Nov 12, 2024",
      isPlagiarized: true,
      score: 54,
    },
  ]

  return (
    <div className="w-full min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="px-4 sm:px-6 lg:px-8 py-4 border-b border-border">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-3">
            <Button variant="ghost" size="icon" onClick={() => router.back()} className="h-8 w-8">
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Submissions</h1>
          </div>
          <p className="text-sm text-muted-foreground ml-11">Assignment ID: {assignmentId}</p>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="px-4 sm:px-6 lg:px-8 py-6 md:py-8">
          <div className="max-w-6xl mx-auto space-y-4">
            {submissions.map((submission) => (
              <Card
                key={submission.id}
                className="p-4 sm:p-6 border border-border hover:border-accent/50 transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-base sm:text-lg font-semibold text-foreground">{submission.studentName}</h3>
                      {submission.isPlagiarized && (
                        <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-red-100 dark:bg-red-900/30">
                          <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400" />
                          <span className="text-xs font-medium text-red-600 dark:text-red-400">Plagiarized</span>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                      <span>{submission.date}</span>
                      <span className="hidden sm:inline">•</span>
                      <span>{submission.submittedAt}</span>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 flex-shrink-0">
                    {submission.score !== undefined && (
                      <div className="px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-center">
                        <span className="text-sm font-semibold text-blue-700 dark:text-blue-400">
                          {submission.score}%
                        </span>
                      </div>
                    )}
                    <Link href={`/classes/${classId}/assignments/${assignmentId}/submissions/${submission.id}`}>
                      <Button size="sm" className="w-full sm:w-auto">
                        View Submission
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
