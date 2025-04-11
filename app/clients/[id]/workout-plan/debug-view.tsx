"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

interface DebugViewProps {
  html: string
}

export function DebugView({ html }: DebugViewProps) {
  const [showDebug, setShowDebug] = useState(false)

  return (
    <div className="mt-4 border-t border-gray-700 pt-4">
      <Button
        variant="outline"
        size="sm"
        onClick={() => setShowDebug(!showDebug)}
        className="text-gray-400 hover:text-white"
      >
        {showDebug ? "Hide Debug Info" : "Show Debug Info"}
      </Button>

      {showDebug && (
        <div className="mt-4 p-4 bg-gray-800 rounded-md overflow-auto max-h-[300px]">
          <h3 className="text-sm font-medium text-gray-300 mb-2">HTML Structure:</h3>
          <pre className="text-xs text-gray-400 whitespace-pre-wrap">{html}</pre>
        </div>
      )}
    </div>
  )
}
