"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Trash2, ArrowLeft } from "lucide-react"
import Link from "next/link"

interface TestCase {
  id: string
  input: string
  expectedOutput: string
  isHidden: boolean
}

interface Question {
  id: string
  title: string
  problemStatement: string
  testCases: TestCase[]
}

export default function AddAssignmentPage() {
  const params = useParams()
  const router = useRouter()
  const classId = params.id as string

  const [assignmentTitle, setAssignmentTitle] = useState("")
  const [assignmentDescription, setAssignmentDescription] = useState("")
  const [dueDate, setDueDate] = useState("")
  const [questions, setQuestions] = useState<Question[]>([])

  const addQuestion = () => {
    const newQuestion: Question = {
      id: Date.now().toString(),
      title: "",
      problemStatement: "",
      testCases: [],
    }
    setQuestions([...questions, newQuestion])
  }

  const updateQuestion = (id: string, field: string, value: string) => {
    setQuestions(
      questions.map((q) =>
        q.id === id
          ? {
              ...q,
              [field]: value,
            }
          : q,
      ),
    )
  }

  const addTestCase = (questionId: string) => {
    setQuestions(
      questions.map((q) =>
        q.id === questionId
          ? {
              ...q,
              testCases: [
                ...q.testCases,
                {
                  id: Date.now().toString(),
                  input: "",
                  expectedOutput: "",
                  isHidden: false,
                },
              ],
            }
          : q,
      ),
    )
  }

  const updateTestCase = (questionId: string, testCaseId: string, field: string, value: string | boolean) => {
    setQuestions(
      questions.map((q) =>
        q.id === questionId
          ? {
              ...q,
              testCases: q.testCases.map((tc) =>
                tc.id === testCaseId
                  ? {
                      ...tc,
                      [field]: value,
                    }
                  : tc,
              ),
            }
          : q,
      ),
    )
  }

  const removeTestCase = (questionId: string, testCaseId: string) => {
    setQuestions(
      questions.map((q) =>
        q.id === questionId
          ? {
              ...q,
              testCases: q.testCases.filter((tc) => tc.id !== testCaseId),
            }
          : q,
      ),
    )
  }

  const removeQuestion = (questionId: string) => {
    setQuestions(questions.filter((q) => q.id !== questionId))
  }

  const handleSubmit = () => {
    // Handle submission logic here
    console.log({
      title: assignmentTitle,
      description: assignmentDescription,
      dueDate,
      questions,
    })
    router.back()
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-violet-500 rounded-b-2xl shadow-lg px-4 sm:px-6 lg:px-8 py-4 md:py-5">
        <div className="max-w-6xl mx-auto flex items-center gap-4">
          <Link href={`/classes/${classId}`}>
            <Button variant="ghost" size="sm" className="gap-2 text-white hover:bg-white/20">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Create Assignment</h1>
        </div>
      </div>

      <div className="px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Assignment Details */}
          <Card className="p-4 sm:p-6 border border-border">
            <h2 className="text-lg font-semibold text-foreground mb-4">Assignment Details</h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground">Assignment Title</label>
                <Input
                  placeholder="Enter assignment title"
                  value={assignmentTitle}
                  onChange={(e) => setAssignmentTitle(e.target.value)}
                  className="mt-2"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Description</label>
                <Textarea
                  placeholder="Enter assignment description"
                  value={assignmentDescription}
                  onChange={(e) => setAssignmentDescription(e.target.value)}
                  className="mt-2"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Due Date</label>
                <Input
                  type="datetime-local"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="mt-2"
                />
              </div>
            </div>
          </Card>

          {/* Questions */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground">Questions</h2>
              <Button onClick={addQuestion} className="gap-2">
                <Plus className="w-4 h-4" />
                Add Question
              </Button>
            </div>

            {questions.map((question, qIndex) => (
              <Card key={question.id} className="p-4 sm:p-6 border border-border">
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-base font-semibold text-foreground">Question {qIndex + 1}</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeQuestion(question.id)}
                      className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground">Question Title</label>
                    <Input
                      placeholder="Enter question title"
                      value={question.title}
                      onChange={(e) => updateQuestion(question.id, "title", e.target.value)}
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground">Problem Statement</label>
                    <Textarea
                      placeholder="Enter problem statement"
                      value={question.problemStatement}
                      onChange={(e) => updateQuestion(question.id, "problemStatement", e.target.value)}
                      className="mt-2"
                      rows={5}
                    />
                  </div>

                  {/* Test Cases */}
                  <div className="space-y-3 border-t border-border pt-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-semibold text-foreground">Test Cases</h4>
                      <Button onClick={() => addTestCase(question.id)} variant="outline" size="sm" className="gap-2">
                        <Plus className="w-3 h-3" />
                        Add Test Case
                      </Button>
                    </div>

                    {question.testCases.map((testCase, tcIndex) => (
                      <div
                        key={testCase.id}
                        className="bg-secondary/30 p-3 rounded-lg space-y-2 border border-border/50"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs font-medium text-muted-foreground">Test Case {tcIndex + 1}</span>
                          <div className="flex items-center gap-2">
                            <label className="flex items-center gap-2 text-xs">
                              <input
                                type="checkbox"
                                checked={testCase.isHidden}
                                onChange={(e) => updateTestCase(question.id, testCase.id, "isHidden", e.target.checked)}
                                className="w-4 h-4"
                              />
                              <span>Hidden</span>
                            </label>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeTestCase(question.id, testCase.id)}
                              className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 h-6 w-6 p-0"
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <Input
                            placeholder="Input value"
                            value={testCase.input}
                            onChange={(e) => updateTestCase(question.id, testCase.id, "input", e.target.value)}
                            size={10}
                          />
                          <Input
                            placeholder="Expected output"
                            value={testCase.expectedOutput}
                            onChange={(e) => updateTestCase(question.id, testCase.id, "expectedOutput", e.target.value)}
                            size={10}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-end">
            <Link href={`/classes/${classId}`}>
              <Button variant="outline" className="w-full sm:w-auto bg-transparent">
                Cancel
              </Button>
            </Link>
            <Button onClick={handleSubmit} className="w-full sm:w-auto">
              Create Assignment
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
