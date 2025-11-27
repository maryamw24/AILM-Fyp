"use client"

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

interface JoinClassDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onJoin: (code: string) => Promise<void>
}

export function JoinClassDialog({ open, onOpenChange, onJoin }: JoinClassDialogProps) {
  const [code, setCode] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!code.trim()) {
      setError("Please enter a class code")
      return
    }

    setIsLoading(true)
    try {
      await onJoin(code.trim())
      setCode("")
      onOpenChange(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to join class")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-primary">Join Class</DialogTitle>
          <DialogDescription>
            Enter the class code provided by your teacher to join the class.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="code" className="text-foreground">Class Code</Label>
            <Input
              id="code"
              placeholder="e.g., Xy12ZQ"
              value={code}
              onChange={(e) => {
                setCode(e.target.value)
                setError("")
              }}
              className="border-border focus-visible:ring-primary"
              disabled={isLoading}
              autoFocus
            />
            {error && (
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                onOpenChange(false)
                setCode("")
                setError("")
              }}
              disabled={isLoading}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={!code.trim() || isLoading}
              className="bg-gradient-to-r from-primary to-accent text-primary-foreground"
            >
              {isLoading ? "Joining..." : "Join Class"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

