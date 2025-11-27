"use client"

import { ChevronLeft, LayoutDashboard, BookOpen, Users, Settings, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useSidebar } from "@/components/sidebar-provider"
import { useAuth } from "@/contexts/auth-context"
import Link from "next/link"
import { usePathname } from "next/navigation"

export function Sidebar() {
  const { isOpen, toggleSidebar } = useSidebar()
  const { user, logout } = useAuth()
  const pathname = usePathname()

  const isTeacher = user?.role === "teacher"
  const isStudent = user?.role === "student"

  const menuItems = [
    { 
      icon: LayoutDashboard, 
      label: "Dashboard", 
      href: isTeacher ? "/teacher-dashboard" : isStudent ? "/student-dashboard" : "/",
      active: pathname === "/teacher-dashboard" || pathname === "/student-dashboard" || pathname === "/"
    },
    { 
      icon: BookOpen, 
      label: "Classes", 
      href: isTeacher ? "/classes" : "/student-classes",
      active: pathname === "/classes" || pathname === "/student-classes"
    },
    ...(isTeacher ? [
      { icon: Users, label: "Students", href: "/students", active: pathname === "/students" },
    ] : []),
    { icon: Settings, label: "Settings", href: "/settings", active: pathname === "/settings" },
  ]

  return (
    <>
      <div
        className={`bg-sidebar border-r border-sidebar-border transition-all duration-300 overflow-hidden flex-shrink-0 ${
          isOpen ? "w-64" : "w-20"
        }`}
        style={{ height: "100vh", position: "sticky", top: 0 }}
      >
        <div className="p-6 h-full flex flex-col">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between mb-8">
            <div className={`flex items-center gap-3 ${isOpen ? "opacity-100" : "opacity-0"} transition-opacity`}>
              <div className="w-10 h-10 bg-gradient-to-br from-sidebar-primary to-sidebar-accent rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-sidebar-primary-foreground font-bold">L</span>
              </div>
              <h2 className="font-bold text-sidebar-foreground text-lg">Lab</h2>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSidebar}
              className="text-sidebar-foreground hover:bg-sidebar-accent/20"
            >
              <ChevronLeft className={`w-5 h-5 transition-transform ${isOpen ? "rotate-0" : "rotate-180"}`} />
            </Button>
          </div>

          {/* Navigation Menu */}
          <nav className="space-y-2 flex-1">
            {menuItems.map((item, idx) => {
              const Icon = item.icon
              return (
                <Link key={idx} href={item.href}>
                  <button
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                      item.active
                        ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-md"
                        : "text-sidebar-foreground hover:bg-sidebar-accent/20"
                    }`}
                    title={!isOpen ? item.label : undefined}
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    {isOpen && <span className="font-medium text-sm">{item.label}</span>}
                  </button>
                </Link>
              )
            })}
          </nav>

          {/* Sidebar Footer */}
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent/20 transition-all duration-200"
            title={!isOpen ? "Logout" : undefined}
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {isOpen && <span className="font-medium text-sm">Logout</span>}
          </button>
        </div>
      </div>
    </>
  )
}
