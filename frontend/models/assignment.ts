import { Question } from "./question"

export interface Assignment {
  id: string
  title: string
  description: string
  openAt : string
  dueAt: string
  isActive: boolean
  max_score: number
  questions: Question[]
}