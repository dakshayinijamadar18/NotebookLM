"use client"

import { useState, useRef, useEffect } from "react"
import {
  Send,
  Mic,
  Sparkles,
  User,
  Copy,
  ThumbsUp,
  ThumbsDown,
  RotateCcw,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

interface AIChatProps {
  documentContext?: string
}

const suggestedPrompts = [
  "Summarize this document",
  "What are the key points?",
  "Explain the main concepts",
  "Create study notes",
]

export function AIChat({ documentContext }: AIChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content:
        "Hello! I'm your AI assistant. Upload a document and I'll help you understand, analyze, and learn from it. You can ask me questions, request summaries, or get explanations tailored to your level.",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [explainLevel, setExplainLevel] = useState("normal")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault()
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsTyping(true)

    // Simulate AI response
    setTimeout(() => {
      const responses = [
        "Based on the document you've shared, I can see several key themes emerging. Let me break this down for you in a clear and structured way.",
        "That's a great question! Looking at the content, I can provide you with a detailed explanation. The main points are...",
        "I've analyzed the relevant sections of your document. Here's what I found most important for your query...",
        "Let me help you understand this better. The document discusses several interconnected concepts that I'll explain step by step.",
      ]

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: responses[Math.floor(Math.random() * responses.length)],
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, aiMessage])
      setIsTyping(false)
    }, 1500)
  }

  const handleSuggestedPrompt = (prompt: string) => {
    setInput(prompt)
    inputRef.current?.focus()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Chat Header */}
      <div className="flex items-center justify-between p-4 border-b border-border/30">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h3 className="font-semibold">AI Assistant</h3>
            <p className="text-xs text-muted-foreground">
              {documentContext ? "Analyzing document..." : "Ready to help"}
            </p>
          </div>
        </div>

        {/* Explain Level Selector */}
        <Select value={explainLevel} onValueChange={setExplainLevel}>
          <SelectTrigger className="w-[140px] h-9 text-xs">
            <SelectValue placeholder="Explain like..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="child">5-year-old</SelectItem>
            <SelectItem value="beginner">Beginner</SelectItem>
            <SelectItem value="normal">Normal</SelectItem>
            <SelectItem value="expert">Expert</SelectItem>
            <SelectItem value="exam">Exam Mode</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={message.id}
            className={cn(
              "flex gap-3 animate-fade-in",
              message.role === "user" ? "flex-row-reverse" : ""
            )}
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            <Avatar
              className={cn(
                "w-8 h-8 shrink-0",
                message.role === "assistant"
                  ? "bg-primary/20"
                  : "bg-secondary"
              )}
            >
              <AvatarFallback
                className={cn(
                  message.role === "assistant"
                    ? "bg-primary/20 text-primary"
                    : "bg-secondary text-secondary-foreground"
                )}
              >
                {message.role === "assistant" ? (
                  <Sparkles className="w-4 h-4" />
                ) : (
                  <User className="w-4 h-4" />
                )}
              </AvatarFallback>
            </Avatar>

            <div
              className={cn(
                "flex flex-col max-w-[80%]",
                message.role === "user" ? "items-end" : ""
              )}
            >
              <div
                className={cn(
                  "px-4 py-3 rounded-2xl text-sm leading-relaxed",
                  message.role === "assistant"
                    ? "bg-secondary/50 rounded-tl-sm"
                    : "gradient-primary text-primary-foreground rounded-tr-sm"
                )}
              >
                {message.content}
              </div>

              {/* Message Actions (for AI messages) */}
              {message.role === "assistant" && (
                <div className="flex items-center gap-1 mt-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="ghost" size="icon" className="h-7 w-7">
                    <Copy className="w-3.5 h-3.5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-7 w-7">
                    <ThumbsUp className="w-3.5 h-3.5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-7 w-7">
                    <ThumbsDown className="w-3.5 h-3.5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-7 w-7">
                    <RotateCcw className="w-3.5 h-3.5" />
                  </Button>
                </div>
              )}

              <span className="text-[10px] text-muted-foreground mt-1 px-1">
                {message.timestamp.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          </div>
        ))}

        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex gap-3 animate-fade-in">
            <Avatar className="w-8 h-8 bg-primary/20">
              <AvatarFallback className="bg-primary/20 text-primary">
                <Sparkles className="w-4 h-4" />
              </AvatarFallback>
            </Avatar>
            <div className="px-4 py-3 rounded-2xl rounded-tl-sm bg-secondary/50">
              <div className="flex gap-1">
                <span className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" />
                <span
                  className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce"
                  style={{ animationDelay: "0.1s" }}
                />
                <span
                  className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Prompts */}
      {messages.length <= 1 && (
        <div className="px-4 pb-2">
          <p className="text-xs text-muted-foreground mb-2">Suggested prompts</p>
          <div className="flex flex-wrap gap-2">
            {suggestedPrompts.map((prompt) => (
              <button
                key={prompt}
                onClick={() => handleSuggestedPrompt(prompt)}
                className="px-3 py-1.5 text-xs rounded-full bg-secondary/50 hover:bg-secondary border border-border/30 transition-colors"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="p-4 border-t border-border/30">
        <form onSubmit={handleSubmit} className="relative">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask anything about your document..."
            rows={1}
            className="w-full resize-none rounded-xl bg-secondary/50 border border-border/30 px-4 py-3 pr-24 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
            style={{ minHeight: "48px", maxHeight: "120px" }}
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-foreground"
            >
              <Mic className="w-4 h-4" />
            </Button>
            <Button
              type="submit"
              size="icon"
              className="h-8 w-8 gradient-primary"
              disabled={!input.trim() || isTyping}
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
