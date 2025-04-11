"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { FileText, Upload, AlertCircle } from "lucide-react"

interface PDFWorkoutUploaderProps {
  onHtmlExtracted: (html: string) => void
}

export function PDFWorkoutUploader({ onHtmlExtracted }: PDFWorkoutUploaderProps) {
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0]

      // Check if file is a PDF
      if (selectedFile.type !== "application/pdf") {
        setError("Please upload a PDF file")
        setFile(null)
        return
      }

      setFile(selectedFile)
      setError(null)
    }
  }

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file first")
      return
    }

    setLoading(true)
    setError(null)

    try {
      // Create form data to send the file
      const formData = new FormData()
      formData.append("pdf", file)

      // In a real implementation, you would send this to your server
      // For now, we'll simulate the conversion with a timeout
      // and return some placeholder HTML

      // Simulating API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // This would normally come from your server after PDF processing
      const extractedHtml = `
        <div>
          <h2>Plan Overview</h2>
          <ul>
            <li><strong>Client:</strong> ${file.name.replace(".pdf", "")}</li>
            <li><strong>Start Date:</strong> 2025-04-01</li>
            <li><strong>End Date (Phase 1):</strong> 2025-05-01</li>
            <li><strong>Goal:</strong> Fitness Improvement</li>
            <li><strong>Training Days:</strong> 5 days per week</li>
          </ul>
          
          <h3>Day 1: 2025-04-01 (Tuesday) - Strength Training</h3>
          <ul>
            <li><strong>Warm-up (5 min):</strong> Dynamic stretches</li>
            <li><strong>Main (30 min):</strong> Compound exercises</li>
            <li><strong>Cool-down (5 min):</strong> Static stretches</li>
          </ul>
          
          <h3>Day 2: 2025-04-02 (Wednesday) - Cardio</h3>
          <ul>
            <li><strong>Warm-up (5 min):</strong> Light jogging</li>
            <li><strong>Main (30 min):</strong> Interval training</li>
            <li><strong>Cool-down (5 min):</strong> Walking and stretching</li>
          </ul>
        </div>
      `

      // Pass the extracted HTML to the parent component
      onHtmlExtracted(extractedHtml)
    } catch (err) {
      console.error("Error processing PDF:", err)
      setError("Failed to process PDF. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
        <FileText className="h-12 w-12 mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Upload Workout PDF</h3>
        <p className="text-sm text-gray-500 mb-4">Upload a PDF workout plan to convert it to a trackable format</p>

        <Input type="file" accept=".pdf" onChange={handleFileChange} className="max-w-xs mx-auto" />

        {file && (
          <p className="mt-2 text-sm text-gray-600">
            Selected: {file.name} ({Math.round(file.size / 1024)} KB)
          </p>
        )}
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="flex justify-end">
        <Button onClick={handleUpload} disabled={!file || loading} className="flex items-center">
          {loading ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Processing...
            </>
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4" />
              Process PDF
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
