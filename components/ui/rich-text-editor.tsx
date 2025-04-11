"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Bold, Italic, List, Heading, AlignLeft, AlignCenter, AlignRight, Undo, Redo } from "lucide-react"

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  minHeight?: string
}

export function RichTextEditor({
  value,
  onChange,
  placeholder = "Enter content here...",
  minHeight = "300px",
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null)
  const [isFocused, setIsFocused] = useState(false)

  // Initialize editor content
  useEffect(() => {
    if (editorRef.current) {
      if (value) {
        editorRef.current.innerHTML = value
      }
    }
  }, [])

  // Handle content changes
  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML)
    }
  }

  // Handle paste to preserve formatting
  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()

    // Get clipboard data as HTML
    const text = e.clipboardData.getData("text/html") || e.clipboardData.getData("text")

    // Insert at cursor position
    document.execCommand("insertHTML", false, text)
  }

  // Format commands
  const formatDoc = (command: string, value?: string) => {
    document.execCommand(command, false, value)
    handleInput()
    editorRef.current?.focus()
  }

  return (
    <div className={`border rounded-md ${isFocused ? "border-purple-400" : "border-purple-900/50"}`}>
      <div className="bg-black border-b border-purple-900/30 p-2 flex flex-wrap gap-1">
        <Button type="button" variant="ghost" size="sm" onClick={() => formatDoc("bold")} className="h-8 w-8 p-0">
          <Bold className="h-4 w-4" />
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={() => formatDoc("italic")} className="h-8 w-8 p-0">
          <Italic className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => formatDoc("insertUnorderedList")}
          className="h-8 w-8 p-0"
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => formatDoc("formatBlock", "<h2>")}
          className="h-8 w-8 p-0"
        >
          <Heading className="h-4 w-4" />
        </Button>
        <div className="h-6 w-px bg-purple-900/30 mx-1"></div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => formatDoc("justifyLeft")}
          className="h-8 w-8 p-0"
        >
          <AlignLeft className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => formatDoc("justifyCenter")}
          className="h-8 w-8 p-0"
        >
          <AlignCenter className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => formatDoc("justifyRight")}
          className="h-8 w-8 p-0"
        >
          <AlignRight className="h-4 w-4" />
        </Button>
        <div className="h-6 w-px bg-purple-900/30 mx-1"></div>
        <Button type="button" variant="ghost" size="sm" onClick={() => formatDoc("undo")} className="h-8 w-8 p-0">
          <Undo className="h-4 w-4" />
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={() => formatDoc("redo")} className="h-8 w-8 p-0">
          <Redo className="h-4 w-4" />
        </Button>
      </div>

      <div
        ref={editorRef}
        contentEditable
        className="p-4 outline-none min-h-[300px]"
        style={{ minHeight }}
        onInput={handleInput}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onPaste={handlePaste}
        dangerouslySetInnerHTML={{
          __html: value || `<div data-placeholder="${placeholder}" class="text-gray-400"></div>`,
        }}
      />
    </div>
  )
}
