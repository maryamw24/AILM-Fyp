import { apiFetch } from "@/lib/api";

export interface LeaderboardEntry {
  rank: number;
  user_id: string;
  name: string;
  email: string;
  completion_count: number;
  total_assignments: number;
  completion_percentage: number;
}

export const leaderboardService = {
  getByClass: async (classId: string): Promise<LeaderboardEntry[]> => {
    return apiFetch(`/classes/${classId}/leaderboard`);
  },
};

