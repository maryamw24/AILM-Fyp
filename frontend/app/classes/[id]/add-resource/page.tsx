"use client"

import type React from "react"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Upload } from "lucide-react"
import Link from "next/link"

export default function AddResourcePage() {
  const params = useParams()
  const router = useRouter()
  const classId = params.id as string

  const [resourceType, setResourceType] = useState<"file" | "text">("file")
  const [resourceTitle, setResourceTitle] = useState("")
  const [resourceDescription, setResourceDescription] = useState("")
  const [textContent, setTextContent] = useState("")
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedFile(e.target.files[0])
    }
  }

  const handleSubmit = () => {
    // Handle submission logic here
    console.log({
      title: resourceTitle,
      description: resourceDescription,
      type: resourceType,
      content: resourceType === "file" ? uploadedFile : textContent,
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

          {/* Resource Type Selection */}
          <Card className="p-4 sm:p-6 border border-border">
            <h2 className="text-lg font-semibold text-foreground mb-4">Resource Type</h2>
            <div className="space-y-4">
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    value="file"
                    checked={resourceType === "file"}
                    onChange={(e) => setResourceType(e.target.value as "file")}
                    className="w-4 h-4"
                  />
                  <span className="text-sm font-medium text-foreground">Upload File</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    value="text"
                    checked={resourceType === "text"}
                    onChange={(e) => setResourceType(e.target.value as "text")}
                    className="w-4 h-4"
                  />
                  <span className="text-sm font-medium text-foreground">Add Text</span>
                </label>
              </div>
            </div>
          </Card>

          {/* Content Section */}
          <Card className="p-4 sm:p-6 border border-border">
            {resourceType === "file" ? (
              <div>
                <h2 className="text-lg font-semibold text-foreground mb-4">Upload File</h2>
                <div className="border-2 border-dashed border-border rounded-lg p-6 sm:p-8 text-center hover:border-accent/50 transition-colors cursor-pointer">
                  <Input type="file" onChange={handleFileChange} className="hidden" id="file-upload" />
                  <label htmlFor="file-upload" className="block cursor-pointer">
                    <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm font-medium text-foreground">Click to upload or drag and drop</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {uploadedFile ? uploadedFile.name : "PDF, DOC, DOCX, PPT up to 50MB"}
                    </p>
                  </label>
                </div>
              </div>
            ) : (
              <div>
                <h2 className="text-lg font-semibold text-foreground mb-4">Text Content</h2>
                <Textarea
                  placeholder="Enter your resource text content here..."
                  value={textContent}
                  onChange={(e) => setTextContent(e.target.value)}
                  className="min-h-64"
                />
              </div>
            )}
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-end">
            <Link href={`/classes/${classId}`}>
              <Button variant="outline" className="w-full sm:w-auto bg-transparent">
                Cancel
              </Button>
            </Link>
            <Button onClick={handleSubmit} className="w-full sm:w-auto">
              Add Resource
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
