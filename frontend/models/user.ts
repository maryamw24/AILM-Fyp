export type UserRole = "student" | "teacher"

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
}
