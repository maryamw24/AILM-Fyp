"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface CreateClassDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreate: (data: { name: string; description: string }) => void
}

export function CreateClassDialog({ open, onOpenChange, onCreate }: CreateClassDialogProps) {
  const [className, setClassName] = useState("")
  const [description, setDescription] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (className.trim()) {
      setIsLoading(true)
      // Simulate API call
      setTimeout(() => {
        onCreate({
          name: className,
          description: description,
        })
        setClassName("")
        setDescription("")
        setIsLoading(false)
      }, 500)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-primary">Create New Class</DialogTitle>
          <DialogDescription>
            Add a new class to your AILM system. Enter the class name and description.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="className" className="text-foreground">
              Class Name
            </Label>
            <Input
              id="className"
              placeholder="e.g., Advanced Data Science"
              value={className}
              onChange={(e) => setClassName(e.target.value)}
              className="border-border focus-visible:ring-primary"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-foreground">
              Description
            </Label>
            <textarea
              id="description"
              placeholder="Enter class description and objectives..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full min-h-24 px-3 py-2 border border-border rounded-md bg-background text-foreground placeholder-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary resize-none"
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="border-border">
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!className.trim() || isLoading}
              className="bg-gradient-to-r from-primary to-accent hover:shadow-lg text-primary-foreground"
            >
              {isLoading ? "Creating..." : "Create Class"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
