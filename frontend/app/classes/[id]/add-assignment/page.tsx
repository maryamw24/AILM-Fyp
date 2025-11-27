"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { assignmentService } from "@/services/assignemntService"
import { useAuth } from "@/contexts/auth-context"

export default function AddAssignmentPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const classId = params.id as string

  const [class_id, setClassId] = useState(classId)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [allowedLanguages, setAllowedLanguages] = useState("")
  const [maxScore, setMaxScore] = useState("")
  const [dueAt, setDueAt] = useState("")
  const [allowMultipleSubmissions, setAllowMultipleSubmissions] = useState(false)
  const [openImmediately, setOpenImmediately] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async () => {
    if (!title || !description || !maxScore || !dueAt) {
      alert("Please fill in all required fields")
      return
    }

    if (!user) {
      alert("You must be logged in to create an assignment")
      return
    }

    setIsLoading(true)
    try {
      const newAssignment = await assignmentService.create({
        class_id,
        title,
        description,
        allowedLanguages: allowedLanguages
          .split(",")
          .map((l) => l.trim())
          .filter((l) => l),
        maxScore: Number.parseInt(maxScore),
        openAt: openImmediately ? new Date().toISOString() : "",
        dueAt: new Date(dueAt).toISOString(),
        allowMultipleSubmissions,
      }, user.id)

      router.push(`/classes/${classId}/assignments/${newAssignment.id}/add-questions`)
    } catch (error) {
      console.error("Error creating assignment:", error)
      alert("Error creating assignment")
    } finally {
      setIsLoading(false)
    }
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
        <div className="max-w-2xl mx-auto">
          {/* Assignment Details */}
          <Card className="p-4 sm:p-6 border border-border">
            <h2 className="text-lg font-semibold text-foreground mb-4">Assignment Details</h2>
            <div className="space-y-4">
              <Input
                  type="hidden"
                  value={classId}
                  className="mt-2"
                />
              <div>
                <label className="text-sm font-medium text-foreground">Assignment Title *</label>
                <Input
                  placeholder="Enter assignment title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="mt-2"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Description *</label>
                <Textarea
                  placeholder="Enter assignment description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="mt-2"
                  rows={4}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Allowed Languages</label>
                <Input
                  placeholder="e.g., Python, JavaScript, Java (comma-separated)"
                  value={allowedLanguages}
                  onChange={(e) => setAllowedLanguages(e.target.value)}
                  className="mt-2"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-foreground">Max Score *</label>
                  <Input
                    type="number"
                    placeholder="Enter max score"
                    value={maxScore}
                    onChange={(e) => setMaxScore(e.target.value)}
                    className="mt-2"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">Due Date *</label>
                  <Input
                    type="datetime-local"
                    value={dueAt}
                    onChange={(e) => setDueAt(e.target.value)}
                    className="mt-2"
                  />
                </div>
              </div>
              <div className="space-y-3 border-t border-border pt-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={allowMultipleSubmissions}
                    onChange={(e) => setAllowMultipleSubmissions(e.target.checked)}
                    className="w-4 h-4"
                  />
                  <span className="text-sm font-medium text-foreground">Allow Multiple Submissions</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={openImmediately}
                    onChange={(e) => setOpenImmediately(e.target.checked)}
                    className="w-4 h-4"
                  />
                  <span className="text-sm font-medium text-foreground">Open Assignment Now</span>
                </label>
              </div>
            </div>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-end mt-6">
            <Link href={`/classes/${classId}`}>
              <Button variant="outline" className="w-full sm:w-auto bg-transparent">
                Cancel
              </Button>
            </Link>
            <Button onClick={handleSubmit} disabled={isLoading} className="w-full sm:w-auto">
              {isLoading ? "Creating..." : "Create Assignment"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
