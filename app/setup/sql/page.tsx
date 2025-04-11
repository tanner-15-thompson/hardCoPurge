"use client"

import { useState } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, CheckCircle2 } from "lucide-react"
import Link from "next/link"

export default function SqlMigrationPage() {
  const [isExecuting, setIsExecuting] = useState(false)
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null)
  const supabase = createClientComponentClient()

  const clientFieldsSql = `
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
  `

  const executeSql = async () => {
    setIsExecuting(true)
    setResult(null)

    try {
      // Execute each statement directly
      const { error } = await supabase.from("clients").select("id").limit(1)

      if (error) {
        setResult({
          success: false,
          message: `Error accessing clients table: ${error.message}`,
        })
        setIsExecuting(false)
        return
      }

      // Add columns one by one
      const columns = [
        { name: "created_at", type: "timestamp with time zone", default: "NOW()" },
        { name: "payment_amount", type: "decimal(10,2)", default: null },
        { name: "payment_frequency", type: "integer", default: null },
        { name: "last_payment_date", type: "timestamp with time zone", default: null },
        { name: "notes", type: "text", default: null },
      ]

      for (const column of columns) {
        // Check if column exists
        const { data, error: checkError } = await supabase
          .from("clients")
          .select(column.name)
          .limit(1)
          .catch(() => ({ data: null, error: { message: `Column ${column.name} doesn't exist` } }))

        if (checkError) {
          // Column doesn't exist, try to add it
          const alterSql = `ALTER TABLE clients ADD COLUMN IF NOT EXISTS ${column.name} ${column.type}${column.default ? ` DEFAULT ${column.default}` : ""}`

          // Use raw query to execute SQL
          const { error: alterError } = await supabase.rpc("execute_sql", { sql: alterSql }).catch(() => ({
            error: { message: `Failed to add column ${column.name}` },
          }))

          if (alterError) {
            setResult({
              success: false,
              message: `Error adding column ${column.name}: ${alterError.message}`,
            })
            setIsExecuting(false)
            return
          }
        }
      }

      // Check if client_documents table exists
      const { error: docTableError } = await supabase
        .from("client_documents")
        .select("id")
        .limit(1)
        .catch(() => ({ error: { message: "Table doesn't exist" } }))

      if (docTableError) {
        // Create the table
        const createTableSql = `
          CREATE TABLE IF NOT EXISTS client_documents (
            id SERIAL PRIMARY KEY,
            client_id INTEGER NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
            file_name TEXT NOT NULL,
            file_url TEXT NOT NULL,
            file_type TEXT,
            file_size INTEGER,
            uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            description TEXT
          )
        `

        const { error: createError } = await supabase.rpc("execute_sql", { sql: createTableSql }).catch(() => ({
          error: { message: "Failed to create client_documents table" },
        }))

        if (createError) {
          setResult({
            success: false,
            message: `Error creating client_documents table: ${createError.message}`,
          })
          setIsExecuting(false)
          return
        }

        // Create index
        const createIndexSql = `
          CREATE INDEX IF NOT EXISTS idx_client_documents_client_id ON client_documents(client_id)
        `

        await supabase.rpc("execute_sql", { sql: createIndexSql }).catch(() => {
          // Index creation failure is not critical
          console.error("Failed to create index, but continuing")
        })
      }

      setResult({
        success: true,
        message: "Database migration completed successfully",
      })
    } catch (error: any) {
      setResult({
        success: false,
        message: `Error: ${error.message}`,
      })
    } finally {
      setIsExecuting(false)
    }
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle>Database Migration</CardTitle>
          <CardDescription>Run SQL to add client fields and create document tables</CardDescription>
        </CardHeader>

        <CardContent>
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h3 className="font-medium mb-2">Client Fields Migration</h3>
              <p className="text-gray-600 mb-4">
                This will add payment tracking fields to clients and create a documents table for storing client files.
              </p>

              <div className="bg-gray-900 text-gray-100 p-4 rounded overflow-auto text-sm mb-4">
                <pre>{clientFieldsSql}</pre>
              </div>

              <Button onClick={executeSql} disabled={isExecuting} className="w-full sm:w-auto">
                {isExecuting ? "Running Migration..." : "Run Migration"}
              </Button>
            </div>

            {result && (
              <Alert variant={result.success ? "default" : "destructive"}>
                {result.success ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                <AlertTitle>{result.success ? "Success" : "Error"}</AlertTitle>
                <AlertDescription>
                  {result.message}
                  {result.success && (
                    <div className="mt-2">
                      <Link href="/clients" className="text-blue-600 hover:text-blue-800">
                        Go to Clients
                      </Link>
                    </div>
                  )}
                </AlertDescription>
              </Alert>
            )}

            {!result?.success && (
              <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <h3 className="font-medium mb-2 text-yellow-800">Manual SQL Execution</h3>
                <p className="text-yellow-800 mb-4">
                  If the automatic migration fails, you can run the SQL manually in the Supabase SQL Editor:
                </p>
                <ol className="list-decimal list-inside space-y-2 text-sm text-yellow-800">
                  <li>Go to your Supabase dashboard</li>
                  <li>Navigate to the SQL Editor</li>
                  <li>Paste the SQL above</li>
                  <li>Click "Run" to execute the SQL</li>
                  <li>Return to this page and refresh</li>
                </ol>
              </div>
            )}
          </div>
        </CardContent>

        <CardFooter className="flex justify-between">
          <Link href="/setup">
            <Button variant="outline">Back to Setup</Button>
          </Link>
          {result?.success && (
            <Link href="/clients">
              <Button>Go to Clients</Button>
            </Link>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}
