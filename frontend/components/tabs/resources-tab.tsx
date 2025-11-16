"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, FileText, Video, BookOpen, Eye } from "lucide-react"

interface Resource {
  id: string
  title: string
  type: "document" | "video" | "article"
  uploadDate: string
  downloads: number
}

const resources: Resource[] = [
  {
    id: "1",
    title: "Python Advanced Concepts - Complete Guide",
    type: "document",
    uploadDate: "Nov 1, 2024",
    downloads: 156,
  },
  {
    id: "2",
    title: "Object-Oriented Programming Tutorial",
    type: "video",
    uploadDate: "Oct 28, 2024",
    downloads: 203,
  },
  {
    id: "3",
    title: "Decorators and Metaclasses Explained",
    type: "article",
    uploadDate: "Oct 25, 2024",
    downloads: 87,
  },
]

export function ResourcesTab() {
  const getIcon = (type: string) => {
    switch (type) {
      case "document":
        return <FileText className="w-5 h-5" />
      case "video":
        return <Video className="w-5 h-5" />
      case "article":
        return <BookOpen className="w-5 h-5" />
      default:
        return <FileText className="w-5 h-5" />
    }
  }

  return (
    <div className="space-y-4">
      {resources.map((resource) => (
        <Card key={resource.id} className="p-4 sm:p-6 border border-border hover:border-accent/50 transition-colors">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-start sm:items-center gap-3 sm:gap-4 flex-1 min-w-0">
              <div className="p-2 bg-primary/10 rounded-lg text-primary flex-shrink-0">{getIcon(resource.type)}</div>
              <div className="flex-1 min-w-0">
                <h3 className="text-base sm:text-lg font-semibold text-foreground break-words">{resource.title}</h3>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1">Uploaded {resource.uploadDate}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <span className="text-xs sm:text-sm text-muted-foreground">{resource.downloads} downloads</span>
              <Button size="sm" className="gap-2">
                <Eye className="w-4 h-4" />
                <span className="hidden sm:inline">Preview</span>
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
