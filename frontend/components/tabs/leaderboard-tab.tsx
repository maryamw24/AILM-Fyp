import { Card } from "@/components/ui/card"
import { Trophy, Flame, Medal } from "lucide-react"

interface LeaderboardEntry {
  rank: number
  name: string
  score: number
  streak: number
  assignments: number
}

const leaderboard: LeaderboardEntry[] = [
  { rank: 1, name: "Alice Chen", score: 9850, streak: 15, assignments: 28 },
  { rank: 2, name: "Bob Williams", score: 9720, streak: 12, assignments: 27 },
  { rank: 3, name: "Carol Martinez", score: 9580, streak: 10, assignments: 26 },
  { rank: 4, name: "David Park", score: 9340, streak: 8, assignments: 25 },
  { rank: 5, name: "Emma Taylor", score: 9120, streak: 6, assignments: 24 },
]

export function LeaderboardTab() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {leaderboard.slice(0, 3).map((entry, index) => (
          <Card
            key={entry.rank}
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
            <div className="mt-2 text-lg sm:text-xl font-bold text-primary">{entry.score} pts</div>
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
                  Score
                </th>
                <th className="px-3 sm:px-6 py-3 text-center text-xs sm:text-sm font-semibold text-foreground hidden sm:table-cell">
                  Streak
                </th>
                <th className="px-3 sm:px-6 py-3 text-center text-xs sm:text-sm font-semibold text-foreground hidden sm:table-cell">
                  Assignments
                </th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((entry) => (
                <tr key={entry.rank} className="border-b border-border hover:bg-muted/50 transition-colors">
                  <td className="px-3 sm:px-6 py-4 text-sm font-bold text-primary">#{entry.rank}</td>
                  <td className="px-3 sm:px-6 py-4 text-sm font-medium text-foreground">{entry.name}</td>
                  <td className="px-3 sm:px-6 py-4 text-center text-sm font-semibold text-foreground">{entry.score}</td>
                  <td className="px-3 sm:px-6 py-4 text-center text-sm hidden sm:table-cell">
                    <div className="flex items-center justify-center gap-1 text-accent">
                      <Flame className="w-4 h-4" />
                      <span>{entry.streak}</span>
                    </div>
                  </td>
                  <td className="px-3 sm:px-6 py-4 text-center text-sm hidden sm:table-cell text-foreground">
                    {entry.assignments}
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
