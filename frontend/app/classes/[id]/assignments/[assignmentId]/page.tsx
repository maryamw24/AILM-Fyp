"use client"

import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft, CheckCircle2, EyeOff } from "lucide-react"
import { assignmentService } from "@/services/assignemntService"

interface TestCase {
  id: number
  input: string
  expected_output: string
  is_hidden: boolean
}

interface Question {
  id: number
  title: string
  prompt: string
  points: number
  testcases: TestCase[]
}

interface Assignment {
  id: number
  title: string
  description: string
  due_at: string
  max_score: number
  questions: Question[]
}

export default function ViewAssignmentPage() {
  const params = useParams()
  const router = useRouter()
  const classId = params.id as string
  const assignmentId = params.assignmentId as string

  const [assignment, setAssignment] = useState<Assignment | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadAssignment = async () => {
      try {
        setLoading(true)
        const data = await assignmentService.getAssignmentDetails(assignmentId)
        setAssignment(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load assignment")
      } finally {
        setLoading(false)
      }
    }

    loadAssignment()
  }, [classId, assignmentId])

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading assignment...</p>
        </div>
      </div>
    )
  }

  if (error || !assignment) {
    return (
      <div className="w-full min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || "Assignment not found"}</p>
          <Button onClick={() => router.back()}>Go Back</Button>
        </div>
      </div>
    )
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
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">{assignment.title}</h1>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground ml-11">
            <CheckCircle2 className="w-4 h-4" />
            <span>
              Max Score: {assignment.max_score} | Due: {assignment.due_at}
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="px-4 sm:px-6 lg:px-8 py-6 md:py-8">
          <div className="max-w-6xl mx-auto space-y-6">
            {/* Assignment Details */}
            <Card className="p-4 sm:p-6 border border-border">
              <h2 className="text-xl font-bold text-foreground mb-4">Assignment Details</h2>
              <div className="space-y-3 text-sm sm:text-base">
                <div>
                  <strong className="text-foreground">Description:</strong>
                  <p className="text-muted-foreground mt-1">{assignment.description}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <strong className="text-foreground">Max Score:</strong>
                    <p className="text-muted-foreground">{assignment.max_score} points</p>
                  </div>
                  <div>
                    <strong className="text-foreground">Due Date:</strong>
                    <p className="text-muted-foreground">{assignment.due_at}</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Questions */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-foreground">Questions ({assignment.questions.length})</h2>
              {assignment.questions.length === 0 ? (
                <Card className="p-6 text-center text-muted-foreground">No questions added yet</Card>
              ) : (
                assignment.questions.map((question) => (
                  <Card key={question.id} className="p-4 sm:p-6 border border-border">
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-lg font-semibold text-foreground">{question.title}</h3>
                        <p className="text-sm font-medium text-muted-foreground mt-1">Points: {question.points}</p>
                      </div>

                      <div>
                        <h4 className="font-medium text-foreground mb-2">Prompt:</h4>
                        <p className="text-sm text-muted-foreground whitespace-pre-wrap bg-muted p-3 rounded-lg">
                          {question.prompt}
                        </p>
                      </div>

                      {/* Test Cases */}
                      <div>
                        <h4 className="font-medium text-foreground mb-3">Test Cases:</h4>
                        <div className="space-y-3">
                          {question.testcases.length === 0 ? (
                            <p className="text-sm text-muted-foreground">No test cases</p>
                          ) : (
                            question.testcases.map((testCase, index) => (
                              <Card key={testCase.id} className="p-3 bg-muted border border-border/50 space-y-2">
                                <div className="flex items-center justify-between">
                                  <span className="font-medium text-sm">Test Case {index + 1}</span>
                                  {testCase.is_hidden && (
                                    <span className="flex items-center gap-1 px-2 py-1 text-xs rounded bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
                                      <EyeOff className="w-3 h-3" />
                                      Hidden
                                    </span>
                                  )}
                                </div>
                                <div className="text-sm text-muted-foreground space-y-1">
                                  <div>
                                    <strong>Input:</strong>
                                    <div className="bg-background p-2 rounded mt-1 font-mono text-xs">
                                      {testCase.input}
                                    </div>
                                  </div>
                                  <div>
                                    <strong>Expected Output:</strong>
                                    <div className="bg-background p-2 rounded mt-1 font-mono text-xs">
                                      {testCase.expected_output}
                                    </div>
                                  </div>
                                </div>
                              </Card>
                            ))
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
