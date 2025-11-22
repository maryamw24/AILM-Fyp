"use client"

import { useState, useEffect } from "react"
import { ClassCard } from "@/components/class-card"
import { CreateClassDialog } from "@/components/create-class-dialog"
import { classService } from "@/services/classService"
import { Class } from "@/models/class"

export default function ClassesPage() {
  const [classes, setClasses] = useState<Class[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)


  useEffect(() => {
  classService.getAll()
    .then((res) => {
      const data = res;
      setClasses(res);
      setLoading(false)
    })
    .catch((err) => {
      setError(err.message)
      setLoading(false)
    })
}, [])


const handleCreateClass = async (data: { title: string; description: string; code: string; is_public : boolean }) => {
  const newClass = await classService.create(data, "bfb5f450-e5b4-42b3-a1de-c5cd92618a90");
  setClasses(prev => [...prev, newClass]);
  setDialogOpen(false);
};



  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <p className="text-muted-foreground">Loading classes...</p>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="w-full h-full flex items-center justify-center flex-col gap-4">
        <p className="text-destructive">Error: {error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg"
        >
          Retry
        </button>
      </div>
    )
  }

  return (
    <div className="w-full h-full px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground">Class Management</h1>
          <p className="text-muted-foreground text-xs sm:text-sm lg:text-base mt-1">
            Manage and monitor your AI-powered lab classes
          </p>
        </div>
        <button
          onClick={() => setDialogOpen(true)}
          className="px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg font-medium transition-colors flex items-center justify-center gap-2 whitespace-nowrap text-sm sm:text-base"
        >
          <span>+</span>
          Create Class
        </button>
      </div>

      {classes.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">No classes found. Create your first one!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
          {classes.map((classItem) => (
            <ClassCard
              key={classItem.id}
              id={classItem.id}
              name={classItem.title}
              students= {30}
              teacher={"Maida Shahid"}
            />
          ))}
        </div>
      )}

      <CreateClassDialog open={dialogOpen} onOpenChange={setDialogOpen} onCreate={handleCreateClass} />
    </div>
  )
}