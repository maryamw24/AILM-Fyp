"use client"

import { useState, useRef, useEffect } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Send } from "lucide-react"
import { messageService, Message } from "@/services/messageService"
import { useAuth } from "@/contexts/auth-context"
import { format } from "date-fns"

export function ChatTab() {
  const params = useParams()
  const { user } = useAuth()
  const classId = params.id as string
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState("")
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    loadMessages()
    // Poll for new messages every 5 seconds
    const interval = setInterval(loadMessages, 5000)
    return () => clearInterval(interval)
  }, [classId])

  const loadMessages = async () => {
    try {
      const data = await messageService.getByClass(classId)
      // Reverse to show oldest first
      setMessages(data.reverse())
    } catch (error) {
      console.error("Error loading messages:", error)
    } finally {
      setLoading(false)
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async () => {
    if (!inputValue.trim() || !user) return

    setSending(true)
    try {
      const newMessage = await messageService.create(
        {
          class_id: classId,
          content: inputValue.trim(),
          message_type: "chat",
        },
        user.id
      )
      setMessages(prev => [...prev, newMessage])
      setInputValue("")
    } catch (error) {
      console.error("Error sending message:", error)
      alert("Failed to send message")
    } finally {
      setSending(false)
    }
  }

  const formatTime = (dateString: string) => {
    try {
      return format(new Date(dateString), "h:mm a")
    } catch {
      return dateString
    }
  }

  const getSenderName = (message: Message) => {
    if (message.sender) {
      return message.sender.display_name || message.sender.full_name || message.sender.email || "Unknown"
    }
    return "Unknown"
  }

  const isInstructor = (message: Message) => {
    return message.sender?.role === "teacher" || message.sender?.role === "ta"
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-200px)] sm:h-[calc(100vh-340px)]">
        <p className="text-muted-foreground">Loading messages...</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-[calc(100vh-200px)] sm:h-[calc(100vh-340px)] border border-border rounded-lg bg-card overflow-hidden">
      {/* Messages Area - Scrollable */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            No messages yet. Start the conversation!
          </div>
        ) : (
          messages.map((msg) => {
            const isOwnMessage = msg.sender_id === user?.id
            const senderName = getSenderName(msg)
            const isInstructorMsg = isInstructor(msg)
            
            return (
              <div key={msg.id} className={`flex ${isOwnMessage ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-xs sm:max-w-md lg:max-w-lg px-4 py-2 rounded-lg ${
                    isInstructorMsg
                      ? "bg-accent/10 text-foreground"
                      : isOwnMessage
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-foreground"
                  }`}
                >
                  {!isOwnMessage && (
                    <p className="text-xs sm:text-sm font-semibold">{senderName}</p>
                  )}
                  <p className="text-sm mt-1 break-words">{msg.content}</p>
                  <p className="text-xs mt-1 opacity-70">{formatTime(msg.created_at)}</p>
                </div>
              </div>
            )
          })
        )}
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
            onKeyPress={(e) => e.key === "Enter" && !sending && handleSendMessage()}
            disabled={sending}
            className="flex-1 px-4 py-2 rounded-lg bg-background border border-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent text-sm disabled:opacity-50"
          />
          <Button onClick={handleSendMessage} disabled={sending || !inputValue.trim()} className="gap-2 flex-shrink-0">
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline">Send</span>
          </Button>
        </div>
      </div>
    </div>
  )
}
