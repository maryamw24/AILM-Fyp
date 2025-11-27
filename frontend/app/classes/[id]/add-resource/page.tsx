"use client"

import type React from "react"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { resourceService } from "@/services/resourceService"
import { useAuth } from "@/contexts/auth-context"

export default function AddResourcePage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const classId = params.id as string

  const [resourceTitle, setResourceTitle] = useState("")
  const [resourceDescription, setResourceDescription] = useState("")
  const [resourceUrl, setResourceUrl] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async () => {
    if (!resourceTitle.trim() || !resourceUrl.trim()) {
      alert("Please fill in title and URL")
      return
    }

    if (!user) {
      alert("You must be logged in to add a resource")
      return
    }

    // Basic URL validation
    try {
      new URL(resourceUrl)
    } catch {
      alert("Please enter a valid URL")
      return
    }

    setIsLoading(true)
    try {
      await resourceService.create(
        {
          class_id: classId,
          title: resourceTitle,
          description: resourceDescription || undefined,
          file_url: resourceUrl,
          file_type: undefined, // Could detect from URL if needed
        },
        user.id
      )
      router.push(`/classes/${classId}`)
    } catch (error) {
      console.error("Error creating resource:", error)
      alert("Failed to create resource")
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
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Add Resource</h1>
        </div>
      </div>

      <div className="px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Resource Details */}
          <Card className="p-4 sm:p-6 border border-border">
            <h2 className="text-lg font-semibold text-foreground mb-4">Resource Details</h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground">Resource Title</label>
                <Input
                  placeholder="Enter resource title"
                  value={resourceTitle}
                  onChange={(e) => setResourceTitle(e.target.value)}
                  className="mt-2"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Description</label>
                <Textarea
                  placeholder="Enter resource description"
                  value={resourceDescription}
                  onChange={(e) => setResourceDescription(e.target.value)}
                  className="mt-2"
                />
              </div>
            </div>
          </Card>

          {/* Resource URL */}
          <Card className="p-4 sm:p-6 border border-border">
            <h2 className="text-lg font-semibold text-foreground mb-4">Resource URL</h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground">Resource URL *</label>
                <Input
                  type="url"
                  placeholder="https://example.com/resource"
                  value={resourceUrl}
                  onChange={(e) => setResourceUrl(e.target.value)}
                  className="mt-2"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Enter a URL to a document, video, article, or other resource
                </p>
              </div>
            </div>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-end">
            <Link href={`/classes/${classId}`}>
              <Button variant="outline" className="w-full sm:w-auto bg-transparent">
                Cancel
              </Button>
            </Link>
            <Button onClick={handleSubmit} disabled={isLoading} className="w-full sm:w-auto">
              {isLoading ? "Adding..." : "Add Resource"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
