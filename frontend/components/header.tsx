"use client"

import { useState, useEffect } from "react"
import { Moon, Sun, Bell, User, Menu, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useSidebar } from "@/components/sidebar-provider"

export function Header() {
  const [isDark, setIsDark] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const { toggleSidebar } = useSidebar()

  useEffect(() => {
    setMounted(true)
    const isDarkMode = document.documentElement.classList.contains("dark")
    setIsDark(isDarkMode)
  }, [])

  const toggleTheme = () => {
    if (!mounted) return

    const html = document.documentElement
    if (isDark) {
      html.classList.remove("dark")
      setIsDark(false)
      localStorage.theme = "light"
    } else {
      html.classList.add("dark")
      setIsDark(true)
      localStorage.theme = "dark"
    }
  }

  return (
    <header className="bg-card border-b border-border sticky top-0 z-40">
      <div className="px-4 sm:px-6 lg:px-8 py-3 sm:py-4 flex items-center justify-between gap-3 sm:gap-4">
        <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
          <Button onClick={toggleSidebar} variant="ghost" size="icon" className="md:hidden flex-shrink-0">
            <Menu className="w-5 h-5" />
          </Button>

          <div className="hidden sm:flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-sm">A</span>
            </div>
            <span className="font-bold text-base lg:text-lg text-foreground">AILM</span>
          </div>

          <div className="hidden sm:flex items-center gap-2 flex-1 max-w-md">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search classes..."
                className="w-full pl-9 pr-4 py-2 bg-muted rounded-lg text-sm border border-border focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          {/* Mobile search button */}
          <Button variant="ghost" size="icon" className="sm:hidden" onClick={() => setSearchOpen(!searchOpen)}>
            <Search className="w-5 h-5" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full hover:bg-muted"
            title="Notifications"
          >
            <Bell className="w-4 sm:w-5 h-4 sm:h-5 text-muted-foreground" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full hover:bg-muted"
            title="Profile"
          >
            <User className="w-4 sm:w-5 h-4 sm:h-5 text-muted-foreground" />
          </Button>

          <Button
            onClick={toggleTheme}
            variant="ghost"
            size="icon"
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full hover:bg-muted"
          >
            {mounted &&
              (isDark ? (
                <Sun className="w-4 sm:w-5 h-4 sm:h-5 text-accent" />
              ) : (
                <Moon className="w-4 sm:w-5 h-4 sm:h-5 text-primary" />
              ))}
          </Button>
        </div>
      </div>

      {searchOpen && (
        <div className="sm:hidden px-4 py-3 border-t border-border">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-9 pr-4 py-2 bg-muted rounded-lg text-sm border border-border focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors"
              autoFocus
            />
          </div>
        </div>
      )}
    </header>
  )
}
