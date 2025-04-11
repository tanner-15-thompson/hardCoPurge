"use client"

import type React from "react"

import { useState } from "react"
import { createClientSupabaseClient } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react"

export function ImageUploader() {
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [path, setPath] = useState("")
  const [bucket, setBucket] = useState("fitness-images")
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null)
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0])
    }
  }

  const handleUpload = async () => {
    if (!file || !path) {
      setStatus({
        type: "error",
        message: "Please select a file and specify a path",
      })
      return
    }

    setUploading(true)
    setStatus(null)
    setUploadedUrl(null)

    try {
      const supabase = createClientSupabaseClient()

      // Upload the file
      const { data, error } = await supabase.storage.from(bucket).upload(path, file, {
        cacheControl: "3600",
        upsert: true,
      })

      if (error) {
        throw error
      }

      // Get the public URL
      const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(path)

      setUploadedUrl(urlData.publicUrl)
      setStatus({
        type: "success",
        message: "Image uploaded successfully!",
      })
    } catch (error: any) {
      setStatus({
        type: "error",
        message: error.message || "Failed to upload image",
      })
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-6 p-6 border border-purple-900/50 rounded-lg">
      <h2 className="text-2xl font-bold">Upload Image to Supabase Storage</h2>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="bucket">Storage Bucket</Label>
          <Input
            id="bucket"
            value={bucket}
            onChange={(e) => setBucket(e.target.value)}
            placeholder="e.g., fitness-images"
            className="bg-black border-purple-900/50"
          />
          <p className="text-xs text-gray-400">
            Make sure this bucket exists in your Supabase project and has public access enabled
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="path">File Path</Label>
          <Input
            id="path"
            value={path}
            onChange={(e) => setPath(e.target.value)}
            placeholder="e.g., fitness-runner.jpg"
            className="bg-black border-purple-900/50"
          />
          <p className="text-xs text-gray-400">
            This will be the path used in your code, e.g., src="/fitness-runner.jpg"
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="file">Select Image</Label>
          <Input
            id="file"
            type="file"
            onChange={handleFileChange}
            accept="image/*"
            className="bg-black border-purple-900/50"
          />
        </div>

        <Button
          onClick={handleUpload}
          disabled={uploading || !file || !path}
          className="w-full bg-purple-950 hover:bg-purple-900"
        >
          {uploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Uploading...
            </>
          ) : (
            "Upload Image"
          )}
        </Button>

        {status && (
          <Alert
            variant={status.type === "error" ? "destructive" : "default"}
            className={status.type === "success" ? "border-green-600 bg-green-950/20" : ""}
          >
            {status.type === "success" ? (
              <CheckCircle2 className="h-4 w-4 text-green-400" />
            ) : (
              <AlertCircle className="h-4 w-4" />
            )}
            <AlertDescription>{status.message}</AlertDescription>
          </Alert>
        )}

        {uploadedUrl && (
          <div className="p-4 border border-purple-900/50 rounded-lg">
            <p className="font-medium mb-2">Image URL:</p>
            <code className="block p-2 bg-black/50 rounded text-sm overflow-x-auto">{uploadedUrl}</code>
            <p className="mt-2 text-sm text-gray-400">
              In your code, you can use: <code className="text-purple-400">{path}</code>
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
