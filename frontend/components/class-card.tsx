"use client"

import { ArrowRight, Users, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Link from "next/link"

interface ClassCardProps {
  id: string
  name: string
  students: number
  teacher: string
}

export function ClassCard({ id, name, students, teacher }: ClassCardProps) {
  return (
    <Card className="group hover:shadow-lg transition-all duration-300 border border-border hover:border-accent overflow-hidden">
      <div className="p-6">
        {/* Gradient accent line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-accent"></div>

        {/* Class Name */}
        <h3 className="text-lg font-bold text-foreground mb-4 line-clamp-2 group-hover:text-accent transition-colors">
          {name}
        </h3>

        {/* Stats */}
        <div className="space-y-3 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Users className="w-4 h-4 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Students</p>
              <p className="text-sm font-semibold text-foreground">{students}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
              <User className="w-4 h-4 text-accent" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Instructor</p>
              <p className="text-sm font-semibold text-foreground">{teacher}</p>
            </div>
          </div>
        </div>

        <Link href={`/classes/${id}`}>
          <Button
            className="w-full bg-gradient-to-r from-primary to-accent hover:shadow-lg transition-all group/btn"
            size="sm"
          >
            View Details
            <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
          </Button>
        </Link>
      </div>
    </Card>
  )
}
