"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

export default function SetupClientFieldsPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [migrationStatus, setMigrationStatus] = useState<{
    columns: { name: string; exists: boolean }[]
    clientDocumentsTable: boolean
  }>({
    columns: [
      { name: "created_at", exists: false },
      { name: "payment_amount", exists: false },
      { name: "payment_frequency", exists: false },
      { name: "last_payment_date", exists: false },
      { name: "notes", exists: false },
    ],
    clientDocumentsTable: false,
  })
  const supabase = createClientComponentClient()

  // Check migration status on page load
  useEffect(() => {
    checkMigrationStatus()
  }, [])

  const checkMigrationStatus = async () => {
    setIsLoading(true)

    try {
      // Check if clients table exists
      const { error: tableError } = await supabase.from("clients").select("id").limit(1)

      if (tableError) {
        console.error("Clients table not found:", tableError)
        setIsLoading(false)
        return
      }

      // Check each column
      const updatedColumns = [...migrationStatus.columns]

      for (let i = 0; i < updatedColumns.length; i++) {
        const column = updatedColumns[i]
        try {
          const { error } = await supabase.from("clients").select(column.name).limit(1)

          updatedColumns[i] = {
            ...column,
            exists: !error,
          }
        } catch (e) {
          // Column doesn't exist
          console.log(`Column ${column.name} check error:`, e)
        }
      }

      // Check if client_documents table exists
      let clientDocumentsExists = false
      try {
        const { error } = await supabase.from("client_documents").select("id").limit(1)

        clientDocumentsExists = !error
      } catch (e) {
        console.log("client_documents table check error:", e)
      }

      setMigrationStatus({
        columns: updatedColumns,
        clientDocumentsTable: clientDocumentsExists,
      })
    } catch (error) {
      console.error("Error checking migration status:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const allMigrationsComplete =
    migrationStatus.columns.every((col) => col.exists) && migrationStatus.clientDocumentsTable

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle>Client Fields Migration Status</CardTitle>
          <CardDescription>Check the status of payment tracking and document storage capabilities</CardDescription>
        </CardHeader>

        <CardContent>
          <div className="space-y-6">
            {isLoading ? (
              <div className="text-center p-4">
                <p>Checking migration status...</p>
              </div>
            ) : (
              <>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <h3 className="font-medium mb-4">Migration Status</h3>

                  <div className="space-y-2 mb-4">
                    <h4 className="font-medium">Client Table Columns:</h4>
                    <ul className="space-y-1 ml-4">
                      {migrationStatus.columns.map((column) => (
                        <li key={column.name} className="flex items-center">
                          <span
                            className={`w-4 h-4 mr-2 rounded-full ${column.exists ? "bg-green-500" : "bg-red-500"}`}
                          ></span>
                          <span>{column.name}</span>
                          <span className="ml-2 text-sm text-gray-500">{column.exists ? "(exists)" : "(missing)"}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium">Client Documents Table:</h4>
                    <div className="flex items-center ml-4">
                      <span
                        className={`w-4 h-4 mr-2 rounded-full ${migrationStatus.clientDocumentsTable ? "bg-green-500" : "bg-red-500"}`}
                      ></span>
                      <span>client_documents table</span>
                      <span className="ml-2 text-sm text-gray-500">
                        {migrationStatus.clientDocumentsTable ? "(exists)" : "(missing)"}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4">
                    <Button onClick={checkMigrationStatus} variant="outline" disabled={isLoading}>
                      Refresh Status
                    </Button>
                  </div>
                </div>

                {allMigrationsComplete ? (
                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <h3 className="font-medium text-green-800 mb-2">Migration Complete!</h3>
                    <p className="text-green-800 mb-4">All required database changes have been applied successfully.</p>
                    <Link href="/clients" className="inline-block text-blue-600 hover:text-blue-800">
                      Go to Clients
                    </Link>
                  </div>
                ) : (
                  <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                    <h3 className="font-medium text-yellow-800 mb-2">Migration Incomplete</h3>
                    <p className="text-yellow-800 mb-4">
                      Some database changes are still pending. Please run the following SQL in the Supabase SQL Editor:
                    </p>
                    <div className="bg-gray-900 text-gray-100 p-4 rounded overflow-auto text-sm">
                      <pre>{`
-- Add new fields to clients table
ALTER TABLE clients ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
ALTER TABLE clients ADD COLUMN IF NOT EXISTS payment_amount DECIMAL(10, 2);
ALTER TABLE clients ADD COLUMN IF NOT EXISTS payment_frequency INTEGER; -- in months
ALTER TABLE clients ADD COLUMN IF NOT EXISTS last_payment_date TIMESTAMP WITH TIME ZONE;
ALTER TABLE clients ADD COLUMN IF NOT EXISTS notes TEXT;

-- Create client_documents table if it doesn't exist
CREATE TABLE IF NOT EXISTS client_documents (
  id SERIAL PRIMARY KEY,
  client_id INTEGER NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_type TEXT,
  file_size INTEGER,
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  description TEXT
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_client_documents_client_id ON client_documents(client_id);
                      `}</pre>
                    </div>
                    <div className="mt-4">
                      <Button onClick={checkMigrationStatus} className="mt-2">
                        Check Again
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
