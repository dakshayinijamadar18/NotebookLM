"use client"

import { useState } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { AppHeader } from "@/components/app-header"
import { DocumentViewer } from "@/components/document-viewer"
import { AIChat } from "@/components/ai-chat"
import { NotesPanel, type Note } from "@/components/notes-panel"
import { FileUpload, type UploadedFile } from "@/components/file-upload"
import { FeatureActions } from "@/components/feature-actions"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import { Sheet, SheetContent } from "@/components/ui/sheet"

export default function HomePage() {
  const [activeTab, setActiveTab] = useState("chat")
  const [files, setFiles] = useState<UploadedFile[]>([])
  const [selectedFile, setSelectedFile] = useState<UploadedFile | null>(null)
  const [notes, setNotes] = useState<Note[]>([
    {
      id: "1",
      content: "Important concept to remember for the exam",
      highlightedText: "The main principles of effective learning",
      documentName: "Study Guide.pdf",
      createdAt: new Date(Date.now() - 86400000),
      color: "yellow",
    },
    {
      id: "2",
      content: "Follow up on this topic later",
      createdAt: new Date(Date.now() - 172800000),
      color: "blue",
    },
  ])
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleAddNote = (highlightedText: string) => {
    const newNote: Note = {
      id: Date.now().toString(),
      content: "",
      highlightedText,
      documentName: selectedFile?.name,
      createdAt: new Date(),
      color: "yellow",
    }
    setNotes([newNote, ...notes])
  }

  const renderMainContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <div className="flex flex-col items-center justify-center h-full p-8">
            <div className="max-w-2xl w-full space-y-8 text-center">
              <div className="space-y-4">
                <h1 className="text-4xl font-bold gradient-text">
                  Welcome to NotebookLM
                </h1>
                <p className="text-muted-foreground text-lg">
                  Your AI-powered knowledge workspace for learning and research
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
                <div className="p-6 rounded-2xl glass border border-border/30 text-center">
                  <div className="w-12 h-12 rounded-xl gradient-primary mx-auto mb-4 flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-primary-foreground"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      />
                    </svg>
                  </div>
                  <h3 className="font-semibold mb-1">Upload Documents</h3>
                  <p className="text-sm text-muted-foreground">
                    PDF, DOCX, or TXT files
                  </p>
                </div>

                <div className="p-6 rounded-2xl glass border border-border/30 text-center">
                  <div className="w-12 h-12 rounded-xl gradient-primary mx-auto mb-4 flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-primary-foreground"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                      />
                    </svg>
                  </div>
                  <h3 className="font-semibold mb-1">Chat with AI</h3>
                  <p className="text-sm text-muted-foreground">
                    Ask questions about your docs
                  </p>
                </div>

                <div className="p-6 rounded-2xl glass border border-border/30 text-center">
                  <div className="w-12 h-12 rounded-xl gradient-primary mx-auto mb-4 flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-primary-foreground"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                      />
                    </svg>
                  </div>
                  <h3 className="font-semibold mb-1">Get Insights</h3>
                  <p className="text-sm text-muted-foreground">
                    Notes, summaries & mind maps
                  </p>
                </div>
              </div>

              <div className="pt-8">
                <FileUpload
                  files={files}
                  onFilesChange={setFiles}
                  onFileSelect={(file) => {
                    setSelectedFile(file)
                    setActiveTab("chat")
                  }}
                />
              </div>
            </div>
          </div>
        )

      case "documents":
        return (
          <div className="flex flex-col h-full p-6">
            <h2 className="text-xl font-semibold mb-4">My Documents</h2>
            <FileUpload
              files={files}
              onFilesChange={setFiles}
              onFileSelect={(file) => {
                setSelectedFile(file)
                setActiveTab("chat")
              }}
            />
          </div>
        )

      case "chat":
        return (
          <ResizablePanelGroup direction="horizontal" className="h-full">
            <ResizablePanel defaultSize={55} minSize={30}>
              <div className="h-full glass-strong rounded-2xl m-3 mr-0 overflow-hidden">
                <DocumentViewer file={selectedFile} onAddNote={handleAddNote} />
              </div>
            </ResizablePanel>

            <ResizableHandle withHandle className="mx-2" />

            <ResizablePanel defaultSize={45} minSize={30}>
              <div className="h-full flex flex-col glass-strong rounded-2xl m-3 ml-0 overflow-hidden">
                <AIChat documentContext={selectedFile?.name} />
                <FeatureActions hasDocument={!!selectedFile} />
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        )

      case "notes":
        return (
          <div className="h-full p-3">
            <div className="h-full glass-strong rounded-2xl overflow-hidden">
              <NotesPanel notes={notes} onNotesChange={setNotes} />
            </div>
          </div>
        )

      case "settings":
        return (
          <div className="flex flex-col items-center justify-center h-full p-8 text-center">
            <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
              <svg
                className="w-10 h-10 text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Settings</h3>
            <p className="text-sm text-muted-foreground">
              Settings panel coming soon
            </p>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <AppSidebar activeTab={activeTab} onTabChange={setActiveTab} />
      </div>

      {/* Mobile Sidebar */}
      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetContent side="left" className="p-0 w-[280px]">
          <AppSidebar
            activeTab={activeTab}
            onTabChange={(tab) => {
              setActiveTab(tab)
              setMobileMenuOpen(false)
            }}
          />
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <AppHeader onMenuClick={() => setMobileMenuOpen(true)} />

        <main className="flex-1 overflow-hidden">
          {renderMainContent()}
        </main>
      </div>

      {/* Right Panel - Notes (Desktop only, for chat view) */}
      {activeTab === "chat" && (
        <div className="hidden xl:block w-[320px] border-l border-border/30">
          <div className="h-full glass-strong">
            <NotesPanel notes={notes} onNotesChange={setNotes} />
          </div>
        </div>
      )}
    </div>
  )
}
