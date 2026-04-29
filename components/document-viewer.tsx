"use client"

import { useState } from "react"
import {
  ZoomIn,
  ZoomOut,
  RotateCw,
  Download,
  Maximize2,
  ChevronLeft,
  ChevronRight,
  Highlighter,
  MessageSquarePlus,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import type { UploadedFile } from "./file-upload"

interface DocumentViewerProps {
  file: UploadedFile | null
  onAddNote?: (text: string) => void
}

export function DocumentViewer({ file, onAddNote }: DocumentViewerProps) {
  const [zoom, setZoom] = useState(100)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages] = useState(12) // Demo value
  const [selectedText, setSelectedText] = useState("")

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 25, 200))
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 25, 50))

  const handleTextSelection = () => {
    const selection = window.getSelection()
    if (selection && selection.toString().trim()) {
      setSelectedText(selection.toString().trim())
    }
  }

  if (!file) {
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
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-semibold mb-2">No Document Selected</h3>
        <p className="text-sm text-muted-foreground max-w-xs">
          Upload a document or select one from your library to view it here
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="flex items-center justify-between p-3 border-b border-border/30">
        <div className="flex items-center gap-1">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={handleZoomOut}>
                  <ZoomOut className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Zoom Out</TooltipContent>
            </Tooltip>

            <span className="text-sm text-muted-foreground min-w-[3rem] text-center">
              {zoom}%
            </span>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={handleZoomIn}>
                  <ZoomIn className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Zoom In</TooltipContent>
            </Tooltip>

            <Separator orientation="vertical" className="h-6 mx-2" />

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon">
                  <RotateCw className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Rotate</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Maximize2 className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Fullscreen</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Download className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Download</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <div className="flex items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className={selectedText ? "text-primary" : ""}
                >
                  <Highlighter className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Highlight Selection</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => selectedText && onAddNote?.(selectedText)}
                  disabled={!selectedText}
                >
                  <MessageSquarePlus className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Add Note to Selection</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      {/* Document Content */}
      <div
        className="flex-1 overflow-auto p-6 bg-secondary/20"
        onMouseUp={handleTextSelection}
      >
        <div
          className="mx-auto bg-card rounded-xl shadow-2xl shadow-black/20 p-8 transition-transform duration-200"
          style={{
            transform: `scale(${zoom / 100})`,
            transformOrigin: "top center",
            maxWidth: "800px",
          }}
        >
          {/* Demo Document Content */}
          <div className="space-y-6 select-text">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold mb-2">{file.name}</h1>
              <p className="text-sm text-muted-foreground">
                Document Preview - Page {currentPage} of {totalPages}
              </p>
            </div>

            <div className="space-y-4 text-sm leading-relaxed">
              <h2 className="text-lg font-semibold">Introduction</h2>
              <p>
                This is a sample document preview. In a production environment, this would
                display the actual content of your uploaded PDF, DOCX, or TXT file using
                a proper document rendering library.
              </p>
              <p>
                Select any text in this document to highlight it or add notes. The AI
                assistant can help you understand and analyze the content of your
                documents.
              </p>

              <h2 className="text-lg font-semibold mt-6">Key Features</h2>
              <ul className="list-disc list-inside space-y-2">
                <li>Upload and view PDF, DOCX, and TXT files</li>
                <li>Highlight important text passages</li>
                <li>Add notes and comments to specific sections</li>
                <li>Ask AI questions about document content</li>
                <li>Generate summaries and mind maps</li>
              </ul>

              <h2 className="text-lg font-semibold mt-6">How It Works</h2>
              <p>
                NotebookLM uses advanced AI to analyze your documents and provide
                intelligent insights. Simply upload your files, and start asking
                questions in the chat panel.
              </p>
              <p>
                The AI can explain complex concepts, summarize lengthy documents, and
                help you prepare for exams or presentations.
              </p>

              <div className="mt-8 p-4 rounded-xl bg-primary/10 border border-primary/20">
                <p className="text-sm font-medium text-primary">
                  Tip: Try selecting this text and clicking the highlight or note button!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Page Navigation */}
      <div className="flex items-center justify-center gap-4 p-3 border-t border-border/30">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage <= 1}
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <span className="text-sm text-muted-foreground">
          Page {currentPage} of {totalPages}
        </span>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage >= totalPages}
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}
