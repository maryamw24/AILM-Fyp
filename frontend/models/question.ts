import { TestCase } from "./testCase"

export interface Question {
  id: string
  title: string
  prompt: string
  points: number
  position: number
  testcases: TestCase[]
}