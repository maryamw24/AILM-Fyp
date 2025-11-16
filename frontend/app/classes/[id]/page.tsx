"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BookOpen, Users, Trophy, MessageCircle, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AssignmentsTab } from "@/components/tabs/assignment-tab"
import { ResourcesTab } from "@/components/tabs/resources-tab"
import { LeaderboardTab } from "@/components/tabs/leaderboard-tab"
import { ChatTab } from "@/components/tabs/chat-tab"
import Link from "next/link"

interface ClassDetail {
  id: string
  name: string
  teacher: string
  students: number
  description: string
  color?: string
}

export default function ClassDetailPage() {
  const params = useParams()
  const classId = params.id as string
  const [activeTab, setActiveTab] = useState("assignments")

  // Mock class data - in production, fetch from API
  const classData: ClassDetail = {
    id: classId,
    name: "Advanced Python Programming",
    teacher: "Dr. Sarah Johnson",
    students: 28,
    description: "Master advanced Python concepts and best practices",
    color: "from-blue-500 to-violet-500",
  }

  return (
    <div className="w-full min-h-screen bg-background flex flex-col">
      <div className="bg-gradient-to-r from-violet-400 via-blue-400 to-cyan-300 rounded-b-2xl shadow-lg px-4 sm:px-6 lg:px-8 py-4 md:py-5">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1">{classData.name}</h1>
          <p className="text-white/90 text-xs sm:text-sm flex items-center gap-2">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-white/60"></span>
            Instructor: {classData.teacher}
          </p>
        </div>
      </div>

      <div className="bg-background border-b border-border px-4 sm:px-6 lg:px-8 sticky top-0 z-30">
        <div className="max-w-6xl mx-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-0">
              <TabsTrigger value="assignments" className="text-xs sm:text-sm flex items-center gap-2">
                <BookOpen className="w-4 h-4 hidden sm:block" />
                <span>Assignments</span>
              </TabsTrigger>
              <TabsTrigger value="resources" className="text-xs sm:text-sm flex items-center gap-2">
                <Users className="w-4 h-4 hidden sm:block" />
                <span>Resources</span>
              </TabsTrigger>
              <TabsTrigger value="leaderboard" className="text-xs sm:text-sm flex items-center gap-2">
                <Trophy className="w-4 h-4 hidden sm:block" />
                <span>Leaderboard</span>
              </TabsTrigger>
              <TabsTrigger value="chat" className="text-xs sm:text-sm flex items-center gap-2">
                <MessageCircle className="w-4 h-4 hidden sm:block" />
                <span>Chat</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="px-4 sm:px-6 lg:px-8 py-6 md:py-8">
          <div className="max-w-6xl mx-auto">
            {activeTab === "assignments" && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <h2 className="text-xl sm:text-2xl font-semibold text-foreground">Assignments</h2>
                  <Link href={`/classes/${classId}/add-assignment`} className="w-full sm:w-auto">
                    <Button className="gap-2 w-full">
                      <Plus className="w-4 h-4" />
                      Create Assignment
                    </Button>
                  </Link>
                </div>
                <AssignmentsTab />
              </div>
            )}

            {activeTab === "resources" && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <h2 className="text-xl sm:text-2xl font-semibold text-foreground">Resources</h2>
                  <Link href={`/classes/${classId}/add-resource`} className="w-full sm:w-auto">
                    <Button className="gap-2 w-full">
                      <Plus className="w-4 h-4" />
                      Add Resources
                    </Button>
                  </Link>
                </div>
                <ResourcesTab />
              </div>
            )}

            {activeTab === "leaderboard" && (
              <div className="space-y-6">
                <h2 className="text-xl sm:text-2xl font-semibold text-foreground">Leaderboard</h2>
                <LeaderboardTab />
              </div>
            )}

            {activeTab === "chat" && (
              <div className="h-full">
                <ChatTab />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
