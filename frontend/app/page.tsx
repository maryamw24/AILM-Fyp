"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { ClassCard } from "@/components/class-card"
import { CreateClassDialog } from "@/components/create-class-dialog"
import { Sidebar } from "@/components/sidebar"
import { useSidebar } from "@/components/sidebar-provider"

interface Class {
  id: string
  name: string
  students: number
  teacher: string
}

export default function Page() {

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
    <div className="flex h-screen bg-background">

      <main className="flex-1 flex flex-col overflow-hidden">
        Dashboard
      </main>
        
    </div>
  )
}
