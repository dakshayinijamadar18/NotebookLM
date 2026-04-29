"use client"

import { useState } from "react"
import {
  LayoutDashboard,
  FileText,
  MessageSquare,
  StickyNote,
  Settings,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface AppSidebarProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

const navItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "documents", label: "My Documents", icon: FileText },
  { id: "chat", label: "AI Chat", icon: MessageSquare },
  { id: "notes", label: "Notes", icon: StickyNote },
  { id: "settings", label: "Settings", icon: Settings },
]

export function AppSidebar({ activeTab, onTabChange }: AppSidebarProps) {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <TooltipProvider delayDuration={0}>
      <aside
        className={cn(
          "flex flex-col h-full glass-strong transition-all duration-300 ease-in-out",
          collapsed ? "w-[72px]" : "w-[240px]"
        )}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 p-4 border-b border-border/30">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl gradient-primary animate-pulse-glow">
            <Sparkles className="w-5 h-5 text-primary-foreground" />
          </div>
          {!collapsed && (
            <div className="animate-fade-in">
              <h1 className="text-lg font-semibold gradient-text">NotebookLM</h1>
              <p className="text-xs text-muted-foreground">AI Workspace</p>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = activeTab === item.id

            return (
              <Tooltip key={item.id}>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => onTabChange(item.id)}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200",
                      "hover:bg-secondary/80 group",
                      isActive && "bg-primary/10 border border-primary/20"
                    )}
                  >
                    <Icon
                      className={cn(
                        "w-5 h-5 shrink-0 transition-colors",
                        isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                      )}
                    />
                    {!collapsed && (
                      <span
                        className={cn(
                          "text-sm font-medium transition-colors animate-fade-in",
                          isActive ? "text-foreground" : "text-muted-foreground group-hover:text-foreground"
                        )}
                      >
                        {item.label}
                      </span>
                    )}
                    {isActive && !collapsed && (
                      <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                    )}
                  </button>
                </TooltipTrigger>
                {collapsed && (
                  <TooltipContent side="right" className="glass">
                    {item.label}
                  </TooltipContent>
                )}
              </Tooltip>
            )
          })}
        </nav>

        {/* User Profile */}
        <div className="p-3 border-t border-border/30">
          <div
            className={cn(
              "flex items-center gap-3 p-2 rounded-xl hover:bg-secondary/80 transition-colors cursor-pointer",
              collapsed && "justify-center"
            )}
          >
            <Avatar className="w-9 h-9 border-2 border-primary/30">
              <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=user" />
              <AvatarFallback className="bg-primary/20 text-primary text-sm">JD</AvatarFallback>
            </Avatar>
            {!collapsed && (
              <div className="flex-1 min-w-0 animate-fade-in">
                <p className="text-sm font-medium truncate">John Doe</p>
                <p className="text-xs text-muted-foreground truncate">john@example.com</p>
              </div>
            )}
          </div>
        </div>

        {/* Collapse Toggle */}
        <div className="p-3 border-t border-border/30">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCollapsed(!collapsed)}
            className="w-full justify-center hover:bg-secondary/80"
          >
            {collapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <>
                <ChevronLeft className="w-4 h-4 mr-2" />
                <span className="text-xs">Collapse</span>
              </>
            )}
          </Button>
        </div>
      </aside>
    </TooltipProvider>
  )
}
