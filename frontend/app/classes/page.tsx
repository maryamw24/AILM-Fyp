"use client"

import { useState } from "react"
import { ClassCard } from "@/components/class-card"
import { CreateClassDialog } from "@/components/create-class-dialog"

interface Class {
  id: string
  name: string
  students: number
  teacher: string
}

export default function ClassesPage() {
  const [classes, setClasses] = useState<Class[]>([
    { id: "1", name: "Advanced Python Programming", students: 28, teacher: "Dr. Sarah Johnson" },
    { id: "2", name: "Machine Learning Fundamentals", students: 35, teacher: "Prof. Michael Chen" },
    { id: "3", name: "Web Development 101", students: 42, teacher: "Jane Smith" },
    { id: "4", name: "Data Science with AI", students: 31, teacher: "Dr. Aisha Patel" },
    { id: "5", name: "Cloud Computing Essentials", students: 24, teacher: "Robert Wilson" },
    { id: "6", name: "AI Ethics & Governance", students: 19, teacher: "Prof. Lisa Anderson" },
  ])

  const [dialogOpen, setDialogOpen] = useState(false)

  const handleCreateClass = (classData: { name: string; description: string }) => {
    const newClass: Class = {
      id: String(classes.length + 1),
      name: classData.name,
      students: 0,
      teacher: "Unassigned",
    }
    setClasses([...classes, newClass])
    setDialogOpen(false)
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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
        {classes.map((classItem) => (
          <ClassCard
            id={classItem.id}
            name={classItem.name}
            students={classItem.students}
            teacher={classItem.teacher}
          />
        ))}
      </div>

      <CreateClassDialog open={dialogOpen} onOpenChange={setDialogOpen} onCreate={handleCreateClass} />
    </div>
  )
}
