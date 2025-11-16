"use client"

import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Calendar, Users } from "lucide-react"

export default function AssignmentPreviewPage() {
  const params = useParams()
  const router = useRouter()
  const classId = params.id as string
  const assignmentId = params.assignmentId as string

  // Mock assignment data
  const assignment = {
    title: "Build a Python Data Analysis Tool",
    dueDate: "Nov 15, 2024",
    totalQuestions: 3,
    totalStudents: 28,
    submitted: 18,
    problemStatement: `
# Problem Statement

Create a Python program that can analyze datasets and generate statistical reports.

## Requirements:
1. Read data from CSV files
2. Calculate basic statistics (mean, median, mode, std deviation)
3. Generate visualizations (histogram, scatter plot)
4. Export results to a formatted report

## Constraints:
- Must use pandas and matplotlib libraries
- Handle missing data gracefully
- Optimize for datasets with 1M+ rows
- Code must be well-commented
    `,
    questions: [
      {
        id: "1",
        title: "Data Loading and Validation",
        description: "Implement a function to load and validate CSV data",
        points: 30,
      },
      {
        id: "2",
        title: "Statistical Analysis",
        description: "Calculate and display statistical metrics",
        points: 40,
      },
      {
        id: "3",
        title: "Visualization and Export",
        description: "Generate charts and export reports",
        points: 30,
      },
    ],
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
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-sm text-muted-foreground ml-11 flex-wrap">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>Due: {assignment.dueDate}</span>
            </div>
            <span className="hidden sm:inline">•</span>
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span>
                {assignment.submitted}/{assignment.totalStudents} submitted
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="px-4 sm:px-6 lg:px-8 py-6 md:py-8">
          <div className="max-w-6xl mx-auto space-y-8">
            {/* Problem Statement */}
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-4">Problem Statement</h2>
              <div className="bg-muted p-4 sm:p-6 rounded-lg border border-border whitespace-pre-wrap text-sm text-foreground">
                {assignment.problemStatement}
              </div>
            </section>

            {/* Questions */}
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-4">Questions ({assignment.totalQuestions})</h2>
              <div className="space-y-3">
                {assignment.questions.map((question) => (
                  <div
                    key={question.id}
                    className="border border-border rounded-lg p-4 hover:border-accent/50 transition-colors"
                  >
                    <div className="flex justify-between items-start gap-4 mb-2">
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground">{question.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{question.description}</p>
                      </div>
                      <span className="px-3 py-1 rounded-full text-sm font-medium bg-accent/10 text-accent whitespace-nowrap">
                        {question.points} pts
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
