"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

interface PromptGeneratorProps {
  clientId: number
  clientName: string
}

export function PromptGenerator({ clientId, clientName }: PromptGeneratorProps) {
  const [prompt, setPrompt] = useState("")
  const [generatedPrompt, setGeneratedPrompt] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const generatePrompt = () => {
    setIsLoading(true)
    // Simulate AI prompt generation
    setTimeout(() => {
      const generated = `Create a personalized workout and nutrition plan for ${clientName} (Client ID: ${clientId}). Focus on [Specific Goals] and consider [Limitations].`
      setGeneratedPrompt(generated)
      setIsLoading(false)
    }, 1000)
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedPrompt)
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-white">AI Prompt Generator</h2>
      <p className="text-gray-300">Generate a prompt for AI to create a personalized plan for this client.</p>

      <div>
        <Label htmlFor="prompt">Prompt Template</Label>
        <Textarea
          id="prompt"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter your prompt template here..."
          className="bg-gray-700 border-gray-600 text-white"
          rows={4}
        />
      </div>

      <Button onClick={generatePrompt} disabled={isLoading} className="bg-blue-600 hover:bg-blue-700 text-white">
        {isLoading ? "Generating..." : "Generate Prompt"}
      </Button>

      {generatedPrompt && (
        <div className="bg-gray-800 rounded-lg p-4">
          <h3 className="text-lg font-medium text-white mb-2">Generated Prompt</h3>
          <p className="text-gray-300 whitespace-pre-wrap">{generatedPrompt}</p>
          <Button onClick={copyToClipboard} className="mt-4">
            Copy to Clipboard
          </Button>
        </div>
      )}
    </div>
  )
}
