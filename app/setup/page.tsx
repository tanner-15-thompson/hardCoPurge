"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function SetupPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<{
    success?: boolean
    message?: string
    error?: string
    sql?: string
    errors?: string[]
  } | null>(null)

  const runMigration = async () => {
    setIsLoading(true)
    setResult(null)

    try {
      const response = await fetch("/api/setup-client-fields")
      const data = await response.json()
      setResult(data)
    } catch (error) {
      setResult({ success: false, error: "An unexpected error occurred" })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle>System Setup</CardTitle>
          <CardDescription>Configure your application database and settings</CardDescription>
        </CardHeader>

        <CardContent>
          <Tabs defaultValue="migrations">
            <TabsList className="mb-4">
              <TabsTrigger value="migrations">Database Migrations</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="migrations">
              <div className="space-y-6">
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <h3 className="font-medium mb-2">Client Fields Migration</h3>
                  <p className="text-gray-600 mb-4">
                    This migration adds payment tracking fields to clients and creates a documents table for storing
                    client files.
                  </p>
                  <Button onClick={runMigration} disabled={isLoading} className="w-full sm:w-auto">
                    {isLoading ? "Running Migration..." : "Run Migration"}
                  </Button>
                </div>

                <Link href="/setup/sql" className="block mt-4">
                  <Button variant="outline" className="w-full">
                    Manual SQL Migration
                  </Button>
                </Link>

                {result && (
                  <div
                    className={`p-4 rounded-lg ${result.success ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"}`}
                  >
                    <h3 className={`font-medium mb-2 ${result.success ? "text-green-800" : "text-red-800"}`}>
                      {result.success ? "Migration Successful" : "Migration Failed"}
                    </h3>
                    <p className={result.success ? "text-green-800" : "text-red-800"}>
                      {result.message || result.error}
                    </p>

                    {result.sql && (
                      <div className="mt-4">
                        <h4 className="font-medium mb-2">Manual SQL Execution Required</h4>
                        <p className="mb-2 text-sm">Please run the following SQL in the Supabase SQL Editor:</p>
                        <div className="bg-gray-900 text-gray-100 p-4 rounded overflow-auto text-sm">
                          <pre>{result.sql}</pre>
                        </div>
                        <div className="mt-4">
                          <h4 className="font-medium mb-2">Instructions:</h4>
                          <ol className="list-decimal list-inside space-y-2 text-sm">
                            <li>Go to your Supabase dashboard</li>
                            <li>Navigate to the SQL Editor</li>
                            <li>Paste the SQL above</li>
                            <li>Click "Run" to execute the SQL</li>
                            <li>Return to this page and refresh</li>
                          </ol>
                        </div>
                      </div>
                    )}

                    {result.errors && result.errors.length > 0 && (
                      <div className="mt-4">
                        <h4 className="font-medium mb-2">Errors:</h4>
                        <ul className="list-disc list-inside space-y-1 text-sm">
                          {result.errors.map((error, index) => (
                            <li key={index} className="text-red-800">
                              {error}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {result.success && (
                      <div className="mt-4">
                        <Link href="/clients" className="inline-block text-blue-600 hover:text-blue-800">
                          Go to Clients
                        </Link>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="settings">
              <div className="space-y-4">
                <p>Additional settings will be available here in future updates.</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  <Link href="/clients">
                    <Card className="h-full hover:bg-gray-50 transition-colors">
                      <CardContent className="pt-6">
                        <div className="flex items-center">
                          <div className="mr-4 bg-blue-100 p-2 rounded-full">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-6 w-6 text-blue-600"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                              />
                            </svg>
                          </div>
                          <div>
                            <h3 className="font-medium">Manage Clients</h3>
                            <p className="text-sm text-gray-600">View and manage your client list</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>

                  <Link href="/">
                    <Card className="h-full hover:bg-gray-50 transition-colors">
                      <CardContent className="pt-6">
                        <div className="flex items-center">
                          <div className="mr-4 bg-green-100 p-2 rounded-full">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-6 w-6 text-green-600"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                              />
                            </svg>
                          </div>
                          <div>
                            <h3 className="font-medium">Dashboard</h3>
                            <p className="text-sm text-gray-600">Return to the main dashboard</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
