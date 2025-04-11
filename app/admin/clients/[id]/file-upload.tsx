"use client"

import type React from "react"

import { useState, useRef } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

export default function FileUpload({ clientId }: { clientId: number }) {
  const [uploading, setUploading] = useState(false)
  const [files, setFiles] = useState<any[]>([])
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)
  const supabase = createClientComponentClient()

  // Fetch existing files
  useState(() => {
    const fetchFiles = async () => {
      try {
        const { data, error } = await supabase.storage.from("client-files").list(`client-${clientId}`)

        if (data && !error) {
          setFiles(data)
        }
      } catch (err) {
        console.error("Error fetching files:", err)
      }
    }

    fetchFiles()
  }, [clientId, supabase])

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      return
    }

    const file = e.target.files[0]
    const fileExt = file.name.split(".").pop()
    const fileName = `${Date.now()}.${fileExt}`
    const filePath = `client-${clientId}/${fileName}`

    setUploading(true)
    setError("")
    setSuccess("")

    try {
      // Create bucket if it doesn't exist
      const { data: buckets } = await supabase.storage.listBuckets()

      if (!buckets?.find((b) => b.name === "client-files")) {
        await supabase.storage.createBucket("client-files", {
          public: false,
        })
      }

      // Upload file
      const { error } = await supabase.storage.from("client-files").upload(filePath, file)

      if (error) throw error

      // Refresh file list
      const { data, error: listError } = await supabase.storage.from("client-files").list(`client-${clientId}`)

      if (listError) throw listError

      setFiles(data || [])
      setSuccess("File uploaded successfully!")

      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    } catch (err: any) {
      setError(err.message || "Error uploading file")
    } finally {
      setUploading(false)
    }
  }

  const handleDownload = async (fileName: string) => {
    try {
      const { data, error } = await supabase.storage.from("client-files").download(`client-${clientId}/${fileName}`)

      if (error) throw error

      // Create download link
      const url = URL.createObjectURL(data)
      const a = document.createElement("a")
      a.href = url
      a.download = fileName
      document.body.appendChild(a)
      a.click()
      URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (err) {
      console.error("Error downloading file:", err)
    }
  }

  const handleDelete = async (fileName: string) => {
    if (!confirm("Are you sure you want to delete this file?")) return

    try {
      const { error } = await supabase.storage.from("client-files").remove([`client-${clientId}/${fileName}`])

      if (error) throw error

      // Refresh file list
      const { data, error: listError } = await supabase.storage.from("client-files").list(`client-${clientId}`)

      if (listError) throw listError

      setFiles(data || [])
    } catch (err) {
      console.error("Error deleting file:", err)
    }
  }

  return (
    <div className="bg-white shadow-sm rounded-lg overflow-hidden">
      <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
        <h2 className="text-lg font-medium text-gray-800">Client Documents</h2>
      </div>

      <div className="p-6">
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Upload Document</label>
          <div className="flex items-center">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              disabled={uploading}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            {uploading && (
              <svg
                className="animate-spin ml-2 h-5 w-5 text-blue-500"
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
            )}
          </div>
          {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
          {success && <p className="mt-2 text-sm text-green-600">{success}</p>}
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-3">Uploaded Documents</h3>

          {files.length === 0 ? (
            <p className="text-sm text-gray-500 italic">No documents uploaded yet.</p>
          ) : (
            <ul className="divide-y divide-gray-200">
              {files.map((file) => (
                <li key={file.name} className="py-3 flex justify-between items-center">
                  <div className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-gray-400 mr-2"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7a1 1 0 100 2z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-sm text-gray-900">{file.name}</span>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleDownload(file.name)}
                      className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                      Download
                    </button>
                    <button onClick={() => handleDelete(file.name)} className="text-red-600 hover:text-red-800 text-sm">
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}
