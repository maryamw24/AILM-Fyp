"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Users, Mail, Calendar, User } from "lucide-react"
import { memberService, ClassMember } from "@/services/memberService"
import { format } from "date-fns"

export function MembersTab() {
  const params = useParams()
  const classId = params.id as string
  const [members, setMembers] = useState<ClassMember[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadMembers()
  }, [classId])

  const loadMembers = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await memberService.getByClass(classId)
      setMembers(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load members")
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM d, yyyy")
    } catch {
      return dateString
    }
  }

  const getMemberName = (member: ClassMember) => {
    if (member.user) {
      return member.user.display_name || member.user.full_name || member.user.email || "Unknown"
    }
    return "Unknown"
  }

  const studentMembers = members.filter(m => m.role === "student")
  const taMembers = members.filter(m => m.role === "ta")

  if (loading) {
    return <div className="text-center py-8 text-muted-foreground">Loading members...</div>
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-destructive mb-4">{error}</p>
        <button onClick={loadMembers} className="text-sm text-primary hover:underline">
          Retry
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Users className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Members</p>
              <p className="text-2xl font-bold text-foreground">{members.length}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <User className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Students</p>
              <p className="text-2xl font-bold text-foreground">{studentMembers.length}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-500/10 rounded-lg">
              <User className="w-5 h-5 text-purple-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Teaching Assistants</p>
              <p className="text-2xl font-bold text-foreground">{taMembers.length}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Members List */}
      <Card className="border border-border">
        <div className="p-4 sm:p-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">All Members</h2>
          <div className="space-y-3">
            {members.length === 0 ? (
              <p className="text-center py-8 text-muted-foreground">No members found</p>
            ) : (
              members.map((member) => (
                <div
                  key={member.id}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      member.role === "ta" ? "bg-purple-500/10 text-purple-500" : "bg-primary/10 text-primary"
                    }`}>
                      <User className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-foreground">{getMemberName(member)}</p>
                        {member.role === "ta" && (
                          <span className="px-2 py-0.5 text-xs rounded-full bg-purple-500/10 text-purple-500">
                            TA
                          </span>
                        )}
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-1">
                        <div className="flex items-center gap-1 text-xs sm:text-sm text-muted-foreground">
                          <Mail className="w-3 h-3" />
                          <span>{member.user?.email || "No email"}</span>
                        </div>
                        <div className="flex items-center gap-1 text-xs sm:text-sm text-muted-foreground">
                          <Calendar className="w-3 h-3" />
                          <span>Joined {formatDate(member.joined_at)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </Card>
    </div>
  )
}

