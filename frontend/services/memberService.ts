import { apiFetch } from "@/lib/api";

export interface ClassMember {
  id: string;
  user_id: string;
  role: string;
  joined_at: string;
  is_active: boolean;
  user?: {
    id: string;
    email: string;
    full_name?: string | null;
    display_name?: string | null;
    role: string;
  } | null;
}

export const memberService = {
  getByClass: async (classId: string): Promise<ClassMember[]> => {
    return apiFetch(`/classes/${classId}/members`);
  },
};

