"use client"

import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function SubmissionDetailPage() {
  const params = useParams()
  const router = useRouter()
  const classId = params.id as string
  const assignmentId = params.assignmentId as string
  const submissionId = params.submissionId as string

  // Mock submission detail data
  const submissionDetail = {
    studentName: "Alex Chen",
    submittedAt: "2:45 PM",
    date: "Nov 14, 2024",
    score: 95,
    content: `
# Submission Content

## Question 1: Fibonacci Sequence
\`\`\`python
def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)
\`\`\`

## Question 2: List Reversal
\`\`\`python
def reverse_list(lst):
    return lst[::-1]
\`\`\`
    `,
  }

  return (
    <div className="w-full min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="px-4 sm:px-6 lg:px-8 py-4 border-b border-border">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-3">
            <Button variant="ghost" size="icon" onClick={() => router.back()} className="h-8 w-8">
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
              {submissionDetail.studentName}'s Submission
            </h1>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-sm text-muted-foreground ml-11">
            <span>{submissionDetail.date}</span>
            <span className="hidden sm:inline">•</span>
            <span>{submissionDetail.submittedAt}</span>
            <span className="hidden sm:inline">•</span>
            <span className="px-2 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 font-semibold">
              {submissionDetail.score}%
            </span>
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-6 lg:px-8 py-4 bg-muted/50 border-b border-border">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            <div className="bg-background border border-border rounded-lg p-3">
              <p className="text-xs text-muted-foreground font-medium mb-1">Bot Assistance</p>
              <p className="text-lg sm:text-xl font-semibold text-foreground">3 times</p>
            </div>
            <div className="bg-background border border-border rounded-lg p-3">
              <p className="text-xs text-muted-foreground font-medium mb-1">Time Spent</p>
              <p className="text-lg sm:text-xl font-semibold text-foreground">45 mins</p>
            </div>
            <div className="bg-background border border-border rounded-lg p-3">
              <p className="text-xs text-muted-foreground font-medium mb-1">Code Quality</p>
              <p className="text-lg sm:text-xl font-semibold text-accent">8.5/10</p>
            </div>
            <div className="bg-background border border-border rounded-lg p-3">
              <p className="text-xs text-muted-foreground font-medium mb-1">Plagiarism</p>
              <p className="text-lg sm:text-xl font-semibold text-green-500">0%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="px-4 sm:px-6 lg:px-8 py-6 md:py-8">
          <div className="max-w-6xl mx-auto prose dark:prose-invert max-w-none">
            <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
              <code>{submissionDetail.content}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  )
}
