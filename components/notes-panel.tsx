"use client"

import { useState } from "react"
import {
  StickyNote,
  Highlighter,
  Plus,
  Trash2,
  Edit3,
  Check,
  X,
  FileText,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export interface Note {
  id: string
  content: string
  documentId?: string
  documentName?: string
  highlightedText?: string
  createdAt: Date
  color: "yellow" | "green" | "blue" | "pink"
}

interface NotesPanelProps {
  notes: Note[]
  onNotesChange: (notes: Note[]) => void
}

const colorClasses = {
  yellow: "bg-yellow-500/20 border-yellow-500/30",
  green: "bg-green-500/20 border-green-500/30",
  blue: "bg-blue-500/20 border-blue-500/30",
  pink: "bg-pink-500/20 border-pink-500/30",
}

const highlightColors = {
  yellow: "bg-yellow-500/30",
  green: "bg-green-500/30",
  blue: "bg-blue-500/30",
  pink: "bg-pink-500/30",
}

export function NotesPanel({ notes, onNotesChange }: NotesPanelProps) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editContent, setEditContent] = useState("")
  const [isAdding, setIsAdding] = useState(false)
  const [newNoteContent, setNewNoteContent] = useState("")
  const [newNoteColor, setNewNoteColor] = useState<Note["color"]>("yellow")

  const highlights = notes.filter((n) => n.highlightedText)
  const plainNotes = notes.filter((n) => !n.highlightedText)

  const handleAddNote = () => {
    if (!newNoteContent.trim()) return

    const newNote: Note = {
      id: Date.now().toString(),
      content: newNoteContent,
      createdAt: new Date(),
      color: newNoteColor,
    }

    onNotesChange([newNote, ...notes])
    setNewNoteContent("")
    setIsAdding(false)
  }

  const handleEditNote = (note: Note) => {
    setEditingId(note.id)
    setEditContent(note.content)
  }

  const handleSaveEdit = (noteId: string) => {
    onNotesChange(
      notes.map((n) => (n.id === noteId ? { ...n, content: editContent } : n))
    )
    setEditingId(null)
    setEditContent("")
  }

  const handleDeleteNote = (noteId: string) => {
    onNotesChange(notes.filter((n) => n.id !== noteId))
  }

  const renderNote = (note: Note) => {
    const isEditing = editingId === note.id

    return (
      <div
        key={note.id}
        className={cn(
          "p-3 rounded-xl border transition-all animate-fade-in",
          colorClasses[note.color]
        )}
      >
        {note.highlightedText && (
          <div className="mb-2 pb-2 border-b border-border/30">
            <div className="flex items-center gap-2 mb-1">
              <Highlighter className="w-3 h-3 text-muted-foreground" />
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider">
                Highlighted Text
              </span>
            </div>
            <p
              className={cn(
                "text-xs italic px-2 py-1 rounded",
                highlightColors[note.color]
              )}
            >
              {`"${note.highlightedText}"`}
            </p>
          </div>
        )}

        {note.documentName && (
          <div className="flex items-center gap-1.5 mb-2 text-[10px] text-muted-foreground">
            <FileText className="w-3 h-3" />
            <span className="truncate">{note.documentName}</span>
          </div>
        )}

        {isEditing ? (
          <div className="space-y-2">
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="w-full min-h-[60px] p-2 text-sm rounded-lg bg-background/50 border border-border/30 resize-none focus:outline-none focus:ring-1 focus:ring-primary/30"
              autoFocus
            />
            <div className="flex justify-end gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={() => setEditingId(null)}
              >
                <X className="w-3.5 h-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-green-500"
                onClick={() => handleSaveEdit(note.id)}
              >
                <Check className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        ) : (
          <>
            <p className="text-sm leading-relaxed">{note.content}</p>
            <div className="flex items-center justify-between mt-2 pt-2 border-t border-border/20">
              <span className="text-[10px] text-muted-foreground">
                {note.createdAt.toLocaleDateString()}
              </span>
              <div className="flex items-center gap-0.5">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => handleEditNote(note)}
                >
                  <Edit3 className="w-3 h-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-destructive"
                  onClick={() => handleDeleteNote(note.id)}
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border/30">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <StickyNote className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold">Notes</h3>
            <p className="text-xs text-muted-foreground">
              {notes.length} {notes.length === 1 ? "note" : "notes"}
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsAdding(true)}
          className="h-9 w-9"
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>

      {/* Add Note Form */}
      {isAdding && (
        <div className="p-4 border-b border-border/30 animate-fade-in">
          <textarea
            value={newNoteContent}
            onChange={(e) => setNewNoteContent(e.target.value)}
            placeholder="Write your note..."
            className="w-full min-h-[80px] p-3 text-sm rounded-xl bg-secondary/50 border border-border/30 resize-none focus:outline-none focus:ring-2 focus:ring-primary/30"
            autoFocus
          />
          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center gap-1.5">
              {(["yellow", "green", "blue", "pink"] as const).map((color) => (
                <button
                  key={color}
                  onClick={() => setNewNoteColor(color)}
                  className={cn(
                    "w-6 h-6 rounded-full transition-all",
                    color === "yellow" && "bg-yellow-500",
                    color === "green" && "bg-green-500",
                    color === "blue" && "bg-blue-500",
                    color === "pink" && "bg-pink-500",
                    newNoteColor === color && "ring-2 ring-offset-2 ring-offset-background ring-foreground"
                  )}
                />
              ))}
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setIsAdding(false)
                  setNewNoteContent("")
                }}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                className="gradient-primary"
                onClick={handleAddNote}
                disabled={!newNoteContent.trim()}
              >
                Add Note
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Notes Tabs */}
      <Tabs defaultValue="all" className="flex-1 flex flex-col">
        <div className="px-4 pt-3">
          <TabsList className="w-full grid grid-cols-3 h-9">
            <TabsTrigger value="all" className="text-xs">
              All ({notes.length})
            </TabsTrigger>
            <TabsTrigger value="highlights" className="text-xs">
              Highlights ({highlights.length})
            </TabsTrigger>
            <TabsTrigger value="notes" className="text-xs">
              Notes ({plainNotes.length})
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="all" className="flex-1 overflow-y-auto p-4 space-y-3 mt-0">
          {notes.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-8">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-3">
                <StickyNote className="w-7 h-7 text-primary" />
              </div>
              <p className="text-sm font-medium mb-1">No notes yet</p>
              <p className="text-xs text-muted-foreground max-w-[200px]">
                Add notes or highlight text in your documents
              </p>
            </div>
          ) : (
            notes.map(renderNote)
          )}
        </TabsContent>

        <TabsContent value="highlights" className="flex-1 overflow-y-auto p-4 space-y-3 mt-0">
          {highlights.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-8">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-3">
                <Highlighter className="w-7 h-7 text-primary" />
              </div>
              <p className="text-sm font-medium mb-1">No highlights yet</p>
              <p className="text-xs text-muted-foreground max-w-[200px]">
                Select text in your documents to highlight
              </p>
            </div>
          ) : (
            highlights.map(renderNote)
          )}
        </TabsContent>

        <TabsContent value="notes" className="flex-1 overflow-y-auto p-4 space-y-3 mt-0">
          {plainNotes.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-8">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-3">
                <StickyNote className="w-7 h-7 text-primary" />
              </div>
              <p className="text-sm font-medium mb-1">No notes yet</p>
              <p className="text-xs text-muted-foreground max-w-[200px]">
                Click the + button to add a note
              </p>
            </div>
          ) : (
            plainNotes.map(renderNote)
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
