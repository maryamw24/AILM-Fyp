"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { User } from "@/models/user"
import { userService } from "@/services/userService"


interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (email: string, password: string, full_name?: string, display_name?: string, role?: string) => Promise<void>
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
      const userData = await userService.login( {email, password})
      setUser(userData as User)
      localStorage.setItem("ailm_user", JSON.stringify(userData))
    } finally {
      setIsLoading(false)
    }
  }

  const signup = async (email: string, password: string, full_name?: string, display_name?: string, role?: string) => {
    setIsLoading(true)
    try {
      const userData = await userService.signup({ email, password, full_name, display_name, role })
      setUser(userData as User)
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
    <AuthContext.Provider value={{ user, isLoading, login, signup, logout, isAuthenticated: !!user }}>
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
