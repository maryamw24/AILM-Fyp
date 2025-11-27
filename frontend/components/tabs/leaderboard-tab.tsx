"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Trophy, Medal, CheckCircle2 } from "lucide-react"
import { leaderboardService, LeaderboardEntry } from "@/services/leaderboardService"

export function LeaderboardTab() {
  const params = useParams()
  const classId = params.id as string
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadLeaderboard()
  }, [classId])

  const loadLeaderboard = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await leaderboardService.getByClass(classId)
      setLeaderboard(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load leaderboard")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="text-center py-8 text-muted-foreground">Loading leaderboard...</div>
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-destructive mb-4">{error}</p>
        <button onClick={loadLeaderboard} className="text-sm text-primary hover:underline">
          Retry
        </button>
      </div>
    )
  }

  if (leaderboard.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No leaderboard data available yet.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {leaderboard.slice(0, 3).map((entry, index) => (
          <Card
            key={entry.user_id}
            className={`p-4 sm:p-6 text-center border-2 ${
              index === 0
                ? "border-yellow-500 bg-yellow-50/50 dark:bg-yellow-900/10"
                : index === 1
                  ? "border-gray-400 bg-gray-50/50 dark:bg-gray-900/10"
                  : "border-orange-400 bg-orange-50/50 dark:bg-orange-900/10"
            }`}
          >
            <div className="flex justify-center mb-2">
              {index === 0 && <Trophy className="w-8 h-8 text-yellow-500" />}
              {index === 1 && <Medal className="w-8 h-8 text-gray-400" />}
              {index === 2 && <Medal className="w-8 h-8 text-orange-400" />}
            </div>
            <h3 className="text-base sm:text-lg font-bold text-foreground">{entry.name}</h3>
            <p className="text-xs sm:text-sm text-muted-foreground">#{entry.rank}</p>
            <div className="mt-2 text-lg sm:text-xl font-bold text-primary">
              {entry.completion_count}/{entry.total_assignments}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {Math.round(entry.completion_percentage)}% Complete
            </p>
          </Card>
        ))}
      </div>

      <Card className="border border-border">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="px-3 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold text-foreground">Rank</th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold text-foreground">Name</th>
                <th className="px-3 sm:px-6 py-3 text-center text-xs sm:text-sm font-semibold text-foreground">
                  Completed
                </th>
                <th className="px-3 sm:px-6 py-3 text-center text-xs sm:text-sm font-semibold text-foreground hidden sm:table-cell">
                  Total
                </th>
                <th className="px-3 sm:px-6 py-3 text-center text-xs sm:text-sm font-semibold text-foreground hidden sm:table-cell">
                  Progress
                </th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((entry) => (
                <tr key={entry.user_id} className="border-b border-border hover:bg-muted/50 transition-colors">
                  <td className="px-3 sm:px-6 py-4 text-sm font-bold text-primary">#{entry.rank}</td>
                  <td className="px-3 sm:px-6 py-4 text-sm font-medium text-foreground">{entry.name}</td>
                  <td className="px-3 sm:px-6 py-4 text-center text-sm font-semibold text-foreground">
                    {entry.completion_count}
                  </td>
                  <td className="px-3 sm:px-6 py-4 text-center text-sm hidden sm:table-cell text-foreground">
                    {entry.total_assignments}
                  </td>
                  <td className="px-3 sm:px-6 py-4 text-center text-sm hidden sm:table-cell">
                    <div className="flex items-center justify-center gap-1 text-accent">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{Math.round(entry.completion_percentage)}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
