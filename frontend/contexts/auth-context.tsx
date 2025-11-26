"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { User } from "@/models/user"


interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  isAuthenticated: boolean
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Check for stored user on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("ailm_user")
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (error) {
        localStorage.removeItem("ailm_user")
      }
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      // Simulate API call with demo users
      await new Promise((resolve) => setTimeout(resolve, 500))

      let userData: User
      if (email === "teacher@ailm.com" && password === "password") {
        userData = {
          id: "1",
          email: "teacher@ailm.com",
          name: "John Teacher",
          role: "teacher",
        }
      } else if (email === "student@ailm.com" && password === "password") {
        userData = {
          id: "2",
          email: "student@ailm.com",
          name: "Jane Student",
          role: "student",
        }
      } else {
        throw new Error("Invalid credentials")
      }

      setUser(userData)
      localStorage.setItem("ailm_user", JSON.stringify(userData))
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("ailm_user")
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return context
}
