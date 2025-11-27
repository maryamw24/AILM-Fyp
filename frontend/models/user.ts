export type UserRole = "student" | "teacher" | "ta" | "admin"

export interface User {
  id: string
  email: string
  full_name?: string | null
  display_name?: string | null
  role: UserRole
  created_at?: string
  // Computed helper - for backward compatibility
  name?: string
}
