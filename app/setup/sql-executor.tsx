"use client"

import { useState } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, CheckCircle2 } from "lucide-react"

export default function SqlExecutor({ defaultSql }: { defaultSql?: string }) {
  const [sql, setSql] = useState(defaultSql || "")
  const [isExecuting, setIsExecuting] = useState(false)
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null)
  const supabase = createClientComponentClient()

  const executeSql = async () => {
    if (!sql.trim()) return

    setIsExecuting(true)
    setResult(null)

    try {
      // Split SQL into individual statements
      const statements = sql
        .split(";")
        .map((stmt) => stmt.trim())
        .filter((stmt) => stmt.length > 0)

      // Execute each statement
      for (const statement of statements) {
        const { error } = await supabase.rpc("execute_sql", { sql: statement })

        if (error) {
          setResult({
            success: false,
            message: `Error executing SQL: ${error.message}`,
          })
          setIsExecuting(false)
          return
        }
      }

      setResult({
        success: true,
        message: "SQL executed successfully",
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
    <div className="space-y-4">
      <Textarea
        value={sql}
        onChange={(e) => setSql(e.target.value)}
        placeholder="Enter SQL statements..."
        className="font-mono text-sm h-64"
      />

      <Button onClick={executeSql} disabled={isExecuting || !sql.trim()} className="w-full">
        {isExecuting ? "Executing..." : "Execute SQL"}
      </Button>

      {result && (
        <Alert variant={result.success ? "default" : "destructive"}>
          {result.success ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
          <AlertTitle>{result.success ? "Success" : "Error"}</AlertTitle>
          <AlertDescription>{result.message}</AlertDescription>
        </Alert>
      )}
    </div>
  )
}
