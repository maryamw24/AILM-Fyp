"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Send } from "lucide-react"

interface Message {
  id: string
  sender: string
  senderRole: "student" | "instructor"
  message: string
  timestamp: string
}

const initialMessages: Message[] = [
  {
    id: "1",
    sender: "Dr. Sarah Johnson",
    senderRole: "instructor",
    message: "Hello everyone! Feel free to ask any questions about the advanced Python concepts.",
    timestamp: "10:30 AM",
  },
  {
    id: "2",
    sender: "Alice Chen",
    senderRole: "student",
    message: "Can you explain decorators in more detail?",
    timestamp: "10:35 AM",
  },
  {
    id: "3",
    sender: "Dr. Sarah Johnson",
    senderRole: "instructor",
    message: "Of course! Decorators are functions that modify other functions. Let me share a resource...",
    timestamp: "10:36 AM",
  },
]

export function ChatTab() {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [inputValue, setInputValue] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = () => {
    if (inputValue.trim()) {
      const newMessage: Message = {
        id: String(messages.length + 1),
        sender: "You",
        senderRole: "student",
        message: inputValue,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      }
      setMessages([...messages, newMessage])
      setInputValue("")
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-200px)] sm:h-[calc(100vh-340px)] border border-border rounded-lg bg-card overflow-hidden">
      {/* Messages Area - Scrollable */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.senderRole === "instructor" ? "justify-start" : "justify-end"}`}>
            <div
              className={`max-w-xs sm:max-w-md lg:max-w-lg px-4 py-2 rounded-lg ${
                msg.senderRole === "instructor" ? "bg-accent/10 text-foreground" : "bg-primary text-primary-foreground"
              }`}
            >
              <p className="text-xs sm:text-sm font-semibold">{msg.sender}</p>
              <p className="text-sm mt-1 break-words">{msg.message}</p>
              <p className="text-xs mt-1 opacity-70">{msg.timestamp}</p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area - Fixed at Bottom */}
      <div className="border-t border-border p-4 sm:p-6 bg-muted/50 flex-shrink-0">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Type your message..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            className="flex-1 px-4 py-2 rounded-lg bg-background border border-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent text-sm"
          />
          <Button onClick={handleSendMessage} className="gap-2 flex-shrink-0">
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline">Send</span>
          </Button>
        </div>
      </div>
    </div>
  )
}
