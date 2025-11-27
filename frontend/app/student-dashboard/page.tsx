"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { classService } from "@/services/classService"
import { Class } from "@/models/class"
import { ClassCard } from "@/components/class-card"
import Link from "next/link"

const performanceData = [
  { week: "Week 1", score: 75 },
  { week: "Week 2", score: 82 },
  { week: "Week 3", score: 88 },
  { week: "Week 4", score: 85 },
  { week: "Week 5", score: 92 },
]

export default function StudentDashboard() {
  const { user, logout, isLoading } = useAuth()
  const router = useRouter()
  const [enrolledClasses, setEnrolledClasses] = useState<Class[]>([])
  const [classesLoading, setClassesLoading] = useState(true)

  useEffect(() => {
    if (!isLoading && (!user || user.role !== "student")) {
      router.push("/auth")
    }
  }, [user, isLoading, router])

  useEffect(() => {
    if (user && user.role === "student") {
      loadEnrolledClasses()
    }
  }, [user])

  const loadEnrolledClasses = async () => {
    if (!user) return
    
    setClassesLoading(true)
    try {
      const classes = await classService.getStudentClasses(user.id)
      setEnrolledClasses(classes)
    } catch (err) {
      console.error("Failed to load enrolled classes:", err)
    } finally {
      setClassesLoading(false)
    }
  }

  if (isLoading || !user) return null

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Welcome, {user.name}</h1>
          <p className="text-muted-foreground mt-1">Student Dashboard</p>
        </div>
        <Button onClick={logout} variant="outline" className="bg-background hover:bg-muted">
          Logout
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Enrolled Classes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">
              {classesLoading ? "..." : enrolledClasses.length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">All up to date</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending Assignments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">5</div>
            <p className="text-xs text-muted-foreground mt-1">Due this week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Submitted</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">18</div>
            <p className="text-xs text-muted-foreground mt-1">This semester</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Average Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">88%</div>
            <p className="text-xs text-muted-foreground mt-1">Overall performance</p>
          </CardContent>
        </Card>
      </div>

      {/* Performance Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Your Performance</CardTitle>
          <CardDescription>Assignment scores over time</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="score" stroke="hsl(var(--color-primary))" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link href="/student-classes" className="w-full">
              <Button className="w-full bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-700 hover:to-blue-700 text-white">
                View My Classes
              </Button>
            </Link>
            <Button className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white">
              My Assignments
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Updates</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-sm">
              <p className="font-medium">New assignment posted in Algorithms</p>
              <p className="text-xs text-muted-foreground">1 hour ago</p>
            </div>
            <div className="text-sm">
              <p className="font-medium">Your submission was graded</p>
              <p className="text-xs text-muted-foreground">2 hours ago</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Enrolled Classes Section */}
      {!classesLoading && enrolledClasses.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">My Classes</CardTitle>
                <CardDescription>Classes you're currently enrolled in</CardDescription>
              </div>
              <Link href="/student-classes">
                <Button variant="outline" size="sm">
                  View All
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {enrolledClasses.slice(0, 3).map((classItem) => (
                <ClassCard
                  key={classItem.id}
                  id={classItem.id}
                  name={classItem.title}
                  students={classItem.member_count || 0}
                  teacher={classItem.owner?.full_name || "N/A"}
                />
              ))}
            </div>
            {enrolledClasses.length > 3 && (
              <div className="mt-4 text-center">
                <Link href="/student-classes">
                  <Button variant="outline">
                    View {enrolledClasses.length - 3} more classes
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
