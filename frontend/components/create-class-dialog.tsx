"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { classService } from "@/services/classService"; // <-- IMPORTANT

interface CreateClassDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate: (data: { title: string; description: string; code: string; is_public: boolean }) => void
}

export function CreateClassDialog({ open, onOpenChange, onCreate }: CreateClassDialogProps) {
  const [className, setClassName] = useState("");
  const [description, setDescription] = useState("");
  const [code, setCode] = useState("");
  const [isPublic, setIsPublic] = useState(true);

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!className.trim() || !code.trim()) return;

    try {
      setIsLoading(true);

      // Clear fields
      setClassName("");
      setDescription("");
      setCode("");
      setIsPublic(true);

      onCreate({
        title: className,
        description,
        code,
        is_public: isPublic,
      });
          // Notify parent
      onOpenChange(false);  // Close modal

    } catch (error) {
      console.error("Failed to create class:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-primary">Create New Class</DialogTitle>
          <DialogDescription>
            Add a new class to your AILM system.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Class Name */}
          <div className="space-y-2">
            <Label htmlFor="className" className="text-foreground">Class Name</Label>
            <Input
              id="className"
              placeholder="e.g., Deep Learning Mastery"
              value={className}
              onChange={(e) => setClassName(e.target.value)}
              className="border-border focus-visible:ring-primary"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-foreground">Description</Label>
            <textarea
              id="description"
              placeholder="Enter class description..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full min-h-24 px-3 py-2 border border-border rounded-md bg-background text-foreground placeholder-muted-foreground focus-visible:ring-primary resize-none"
            />
          </div>

          {/* Class Code */}
          <div className="space-y-2">
            <Label htmlFor="code" className="text-foreground">Class Code</Label>
            <Input
              id="code"
              placeholder="e.g., Xy12ZQ"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="border-border focus-visible:ring-primary"
            />
          </div>

          {/* Public/Private Toggle */}
          <div className="flex items-center space-x-2 mt-2">
            <input
              type="checkbox"
              id="isPublic"
              checked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
              className="w-4 h-4"
            />
            <Label htmlFor="isPublic" className="text-foreground">
              Make Class Public
            </Label>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={!className.trim() || !code.trim() || isLoading}
              className="bg-gradient-to-r from-primary to-accent text-primary-foreground"
            >
              {isLoading ? "Creating..." : "Create Class"}
            </Button>
          </DialogFooter>

        </form>
      </DialogContent>
    </Dialog>
  );
}
