"use client"

import { useState, useCallback } from "react"
import { Upload, FileText, File, X, CheckCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export interface UploadedFile {
  id: string
  name: string
  size: number
  type: string
  status: "uploading" | "complete" | "error"
  progress: number
}

interface FileUploadProps {
  files: UploadedFile[]
  onFilesChange: (files: UploadedFile[]) => void
  onFileSelect: (file: UploadedFile) => void
}

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return "0 Bytes"
  const k = 1024
  const sizes = ["Bytes", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
}

const getFileIcon = (type: string) => {
  if (type.includes("pdf")) return FileText
  return File
}

export function FileUpload({ files, onFilesChange, onFileSelect }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false)

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)

      const droppedFiles = Array.from(e.dataTransfer.files)
      processFiles(droppedFiles)
    },
    [files, onFilesChange]
  )

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files)
      processFiles(selectedFiles)
    }
  }

  const processFiles = (newFiles: File[]) => {
    const validTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "text/plain",
    ]

    const processedFiles: UploadedFile[] = newFiles
      .filter((file) => validTypes.includes(file.type))
      .map((file) => ({
        id: Math.random().toString(36).substr(2, 9),
        name: file.name,
        size: file.size,
        type: file.type,
        status: "uploading" as const,
        progress: 0,
      }))

    const updatedFiles = [...files, ...processedFiles]
    onFilesChange(updatedFiles)

    // Simulate upload progress
    processedFiles.forEach((file) => {
      simulateUpload(file.id, updatedFiles)
    })
  }

  const simulateUpload = (fileId: string, currentFiles: UploadedFile[]) => {
    let progress = 0
    const interval = setInterval(() => {
      progress += Math.random() * 30
      if (progress >= 100) {
        progress = 100
        clearInterval(interval)
        onFilesChange(
          currentFiles.map((f) =>
            f.id === fileId ? { ...f, progress: 100, status: "complete" as const } : f
          )
        )
      } else {
        onFilesChange(
          currentFiles.map((f) => (f.id === fileId ? { ...f, progress } : f))
        )
      }
    }, 200)
  }

  const removeFile = (fileId: string) => {
    onFilesChange(files.filter((f) => f.id !== fileId))
  }

  return (
    <div className="space-y-4">
      {/* Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          "relative flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-2xl transition-all duration-300 cursor-pointer",
          isDragging
            ? "border-primary bg-primary/10 scale-[1.02]"
            : "border-border/50 hover:border-primary/50 hover:bg-secondary/30"
        )}
      >
        <input
          type="file"
          multiple
          accept=".pdf,.docx,.txt"
          onChange={handleFileInput}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        <div
          className={cn(
            "w-14 h-14 rounded-2xl flex items-center justify-center mb-4 transition-all",
            isDragging ? "gradient-primary" : "bg-primary/10"
          )}
        >
          <Upload
            className={cn(
              "w-7 h-7 transition-colors",
              isDragging ? "text-primary-foreground" : "text-primary"
            )}
          />
        </div>
        <p className="text-sm font-medium mb-1">
          {isDragging ? "Drop files here" : "Drag & drop files here"}
        </p>
        <p className="text-xs text-muted-foreground mb-3">or click to browse</p>
        <div className="flex items-center gap-2">
          <span className="px-2 py-1 rounded-lg bg-secondary/50 text-xs text-muted-foreground">
            PDF
          </span>
          <span className="px-2 py-1 rounded-lg bg-secondary/50 text-xs text-muted-foreground">
            DOCX
          </span>
          <span className="px-2 py-1 rounded-lg bg-secondary/50 text-xs text-muted-foreground">
            TXT
          </span>
        </div>
      </div>

      {/* Uploaded Files List */}
      {files.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">
            Uploaded Files ({files.length})
          </p>
          <div className="space-y-2 max-h-[200px] overflow-y-auto pr-2">
            {files.map((file) => {
              const FileIcon = getFileIcon(file.type)
              return (
                <div
                  key={file.id}
                  onClick={() => file.status === "complete" && onFileSelect(file)}
                  className={cn(
                    "flex items-center gap-3 p-3 rounded-xl bg-secondary/30 border border-border/30 transition-all",
                    file.status === "complete" && "cursor-pointer hover:bg-secondary/50"
                  )}
                >
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <FileIcon className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{file.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatFileSize(file.size)}
                    </p>
                    {file.status === "uploading" && (
                      <div className="mt-1.5 h-1 rounded-full bg-secondary overflow-hidden">
                        <div
                          className="h-full gradient-primary transition-all duration-300"
                          style={{ width: `${file.progress}%` }}
                        />
                      </div>
                    )}
                  </div>
                  {file.status === "complete" ? (
                    <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
                  ) : (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="shrink-0 h-8 w-8"
                      onClick={(e) => {
                        e.stopPropagation()
                        removeFile(file.id)
                      }}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
