"use client"

import { useState } from "react"
import {
  FileText,
  Mic,
  Network,
  Sparkles,
  Loader2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface FeatureActionsProps {
  hasDocument: boolean
}

export function FeatureActions({ hasDocument }: FeatureActionsProps) {
  const [activeFeature, setActiveFeature] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const features = [
    {
      id: "notes",
      label: "Generate Notes",
      icon: FileText,
      description: "AI will analyze your document and create comprehensive study notes",
    },
    {
      id: "viva",
      label: "Start Viva Mode",
      icon: Mic,
      description: "Practice answering questions about your document content",
    },
    {
      id: "mindmap",
      label: "Create Mind Map",
      icon: Network,
      description: "Generate a visual mind map of key concepts and relationships",
    },
  ]

  const handleFeatureClick = (featureId: string) => {
    if (!hasDocument) return
    setActiveFeature(featureId)
    setIsLoading(true)

    // Simulate processing
    setTimeout(() => {
      setIsLoading(false)
    }, 2000)
  }

  const activeFeatureData = features.find((f) => f.id === activeFeature)

  return (
    <>
      <div className="flex items-center gap-2 p-4 border-t border-border/30">
        {features.map((feature) => {
          const Icon = feature.icon
          return (
            <Button
              key={feature.id}
              variant="outline"
              size="sm"
              className="flex-1 gap-2 h-10 text-xs"
              onClick={() => handleFeatureClick(feature.id)}
              disabled={!hasDocument}
            >
              <Icon className="w-4 h-4" />
              <span className="hidden sm:inline">{feature.label}</span>
            </Button>
          )
        })}
      </div>

      <Dialog open={!!activeFeature} onOpenChange={() => setActiveFeature(null)}>
        <DialogContent className="glass-strong max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              {activeFeatureData && (
                <>
                  <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
                    <activeFeatureData.icon className="w-5 h-5 text-primary-foreground" />
                  </div>
                  {activeFeatureData.label}
                </>
              )}
            </DialogTitle>
            <DialogDescription>
              {activeFeatureData?.description}
            </DialogDescription>
          </DialogHeader>

          <div className="py-8">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center gap-4">
                <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center animate-pulse-glow">
                  <Loader2 className="w-8 h-8 text-primary-foreground animate-spin" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium">Processing your document...</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    This may take a few moments
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {activeFeature === "notes" && (
                  <div className="space-y-3">
                    <div className="p-4 rounded-xl bg-secondary/30 border border-border/30">
                      <h4 className="font-medium mb-2 flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-primary" />
                        Generated Notes
                      </h4>
                      <div className="space-y-2 text-sm text-muted-foreground">
                        <p className="font-medium text-foreground">Key Concepts:</p>
                        <ul className="list-disc list-inside space-y-1">
                          <li>Main topic overview and introduction</li>
                          <li>Core principles and methodologies</li>
                          <li>Important definitions and terminology</li>
                          <li>Practical applications and examples</li>
                        </ul>
                        <p className="font-medium text-foreground mt-3">Summary:</p>
                        <p>
                          The document covers fundamental concepts related to the subject
                          matter, providing both theoretical foundations and practical
                          applications for better understanding.
                        </p>
                      </div>
                    </div>
                    <Button className="w-full gradient-primary">
                      Save to Notes
                    </Button>
                  </div>
                )}

                {activeFeature === "viva" && (
                  <div className="space-y-4">
                    <div className="p-4 rounded-xl bg-secondary/30 border border-border/30">
                      <p className="text-sm font-medium mb-3 flex items-center gap-2">
                        <Mic className="w-4 h-4 text-primary" />
                        Practice Question:
                      </p>
                      <p className="text-lg">
                        What are the main principles discussed in this document and how
                        do they apply to real-world scenarios?
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" className="flex-1">
                        Skip Question
                      </Button>
                      <Button className="flex-1 gradient-primary">
                        Answer with Voice
                      </Button>
                    </div>
                  </div>
                )}

                {activeFeature === "mindmap" && (
                  <div className="space-y-4">
                    <div className="p-8 rounded-xl bg-secondary/30 border border-border/30 flex items-center justify-center">
                      <div className="relative">
                        {/* Central Node */}
                        <div className="w-24 h-24 rounded-full gradient-primary flex items-center justify-center text-primary-foreground font-medium text-sm text-center p-2">
                          Main Topic
                        </div>
                        
                        {/* Branch Nodes */}
                        <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-16 h-8 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-xs">
                          Concept A
                        </div>
                        <div className="absolute top-1/2 -right-20 -translate-y-1/2 w-16 h-8 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center text-xs">
                          Concept B
                        </div>
                        <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 w-16 h-8 rounded-full bg-yellow-500/20 border border-yellow-500/30 flex items-center justify-center text-xs">
                          Concept C
                        </div>
                        <div className="absolute top-1/2 -left-20 -translate-y-1/2 w-16 h-8 rounded-full bg-pink-500/20 border border-pink-500/30 flex items-center justify-center text-xs">
                          Concept D
                        </div>

                        {/* Connection Lines */}
                        <div className="absolute top-0 left-1/2 w-px h-6 bg-border/50 -translate-x-1/2 -translate-y-6" />
                        <div className="absolute right-0 top-1/2 w-6 h-px bg-border/50 translate-x-6 -translate-y-1/2" />
                        <div className="absolute bottom-0 left-1/2 w-px h-6 bg-border/50 -translate-x-1/2 translate-y-6" />
                        <div className="absolute left-0 top-1/2 w-6 h-px bg-border/50 -translate-x-6 -translate-y-1/2" />
                      </div>
                    </div>
                    <Button className="w-full gradient-primary">
                      Download Mind Map
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
