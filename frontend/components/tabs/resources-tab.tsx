"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, Video, BookOpen, ExternalLink, Trash2 } from "lucide-react"
import { resourceService, Resource } from "@/services/resourceService"
import { useAuth } from "@/contexts/auth-context"
import { format } from "date-fns"

export function ResourcesTab() {
  const params = useParams()
  const { user } = useAuth()
  const classId = params.id as string
  const [resources, setResources] = useState<Resource[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const isTeacher = user?.role === "teacher"

  useEffect(() => {
    loadResources()
  }, [classId])

  const loadResources = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await resourceService.getByClass(classId)
      setResources(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load resources")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (resourceId: string) => {
    if (!confirm("Are you sure you want to delete this resource?")) return
    
    try {
      await resourceService.delete(resourceId)
      setResources(prev => prev.filter(r => r.id !== resourceId))
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete resource")
    }
  }

  const getIcon = (fileType: string | null, fileUrl: string | null) => {
    if (fileUrl) {
      const url = fileUrl.toLowerCase()
      if (url.includes("youtube") || url.includes("video") || url.includes(".mp4") || url.includes(".mov")) {
        return <Video className="w-5 h-5" />
      }
      if (url.includes("article") || url.includes("blog") || url.includes("medium")) {
        return <BookOpen className="w-5 h-5" />
      }
    }
    return <FileText className="w-5 h-5" />
  }

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM d, yyyy")
    } catch {
      return dateString
    }
  }

  if (loading) {
    return <div className="text-center py-8 text-muted-foreground">Loading resources...</div>
  }

  if (error && resources.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-destructive mb-4">{error}</p>
        <Button onClick={loadResources} variant="outline">Retry</Button>
      </div>
    )
  }

  if (resources.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No resources available yet.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {resources.map((resource) => (
        <Card key={resource.id} className="p-4 sm:p-6 border border-border hover:border-accent/50 transition-colors">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-start sm:items-center gap-3 sm:gap-4 flex-1 min-w-0">
              <div className="p-2 bg-primary/10 rounded-lg text-primary flex-shrink-0">
                {getIcon(resource.file_type, resource.file_url)}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-base sm:text-lg font-semibold text-foreground break-words">
                  {resource.title || "Untitled Resource"}
                </h3>
                {resource.description && (
                  <p className="text-xs sm:text-sm text-muted-foreground mt-1 line-clamp-2">
                    {resource.description}
                  </p>
                )}
                <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                  Uploaded {formatDate(resource.uploaded_at)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              {resource.file_url && (
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-2"
                  onClick={() => window.open(resource.file_url!, "_blank")}
                >
                  <ExternalLink className="w-4 h-4" />
                  <span className="hidden sm:inline">Open</span>
                </Button>
              )}
              {isTeacher && (
                <Button
                  size="sm"
                  variant="ghost"
                  className="gap-2 text-destructive hover:text-destructive"
                  onClick={() => handleDelete(resource.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
