"use client"

import { useState } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { AlertCircle, Save, CheckCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface SimpleWorkoutLogFormProps {
  clientId: number
  dayId: string
  dayTitle: string
  existingLog?: any
  onSaved: () => void
}

export function SimpleWorkoutLogForm({ clientId, dayId, dayTitle, existingLog, onSaved }: SimpleWorkoutLogFormProps) {
  const [notes, setNotes] = useState<string>(existingLog?.notes || "")
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const supabase = createClientComponentClient()

  // Save log to database
  const saveWorkoutLog = async () => {
    setSaving(true)
    setError(null)
    setSuccess(false)

    try {
      console.log("Starting saveWorkoutLog with data:", { clientId, dayId, notes })

      // Prepare log data
      const logData = {
        client_id: clientId,
        day_id: dayId,
        notes: notes,
        logged_at: new Date().toISOString(),
      }

      console.log("Prepared log data:", logData)

      // First try to check if the record exists
      const { data: existingData, error: checkError } = await supabase
        .from("simple_workout_logs")
        .select("id")
        .eq("client_id", clientId)
        .eq("day_id", dayId)
        .maybeSingle()

      if (checkError) {
        console.log("Error checking for existing record:", checkError)
        throw new Error(`Failed to check for existing record: ${checkError.message}`)
      }

      console.log("Existing data check result:", existingData)

      let result

      if (existingData) {
        // Update existing record
        console.log("Updating existing record with ID:", existingData.id)
        result = await supabase
          .from("simple_workout_logs")
          .update({
            notes: notes,
            logged_at: new Date().toISOString(),
          })
          .eq("id", existingData.id)
      } else {
        // Insert new record
        console.log("Inserting new record")
        result = await supabase.from("simple_workout_logs").insert(logData)
      }

      console.log("Database operation result:", result)

      if (result.error) {
        console.error("Error with database operation:", result.error)
        throw new Error(`Failed to save workout log: ${result.error.message || JSON.stringify(result.error)}`)
      }

      // If we got here, everything succeeded
      console.log("Save successful")
      setSuccess(true)
      setTimeout(() => {
        setSuccess(false)
        onSaved()
      }, 1000) // Reduced to 1 second for faster feedback
    } catch (err: any) {
      console.error("Error saving workout log:", err)
      setError(err.message || "An unknown error occurred while saving your workout log")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-4 text-gray-100">
      {error && (
        <Alert variant="destructive" className="border-red-800 bg-red-900/20 text-red-300">
          <AlertCircle className="h-5 w-5" />
          <AlertDescription className="text-base">{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-3">
        <div>
          <Label htmlFor="notes" className="text-gray-200 mb-2 block text-lg font-medium">
            Did you deviate from the plan? (Optional)
          </Label>
          <Textarea
            id="notes"
            placeholder="Note any modifications or changes you made to the workout (leave blank if you followed the plan exactly)"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={5}
            className="bg-gray-800 border-gray-600 text-white resize-none text-base p-4 focus:border-gray-500 focus:ring-gray-500"
            style={{ fontSize: "16px", fontWeight: "400" }}
          />
        </div>
      </div>

      <div className="flex justify-end">
        <Button
          onClick={saveWorkoutLog}
          disabled={saving}
          size="lg"
          className="flex items-center gap-2 bg-gray-700 hover:bg-gray-800 text-white px-8 py-5 text-lg font-medium rounded-lg transition-colors"
        >
          {saving ? (
            <>Saving...</>
          ) : success ? (
            <>
              <CheckCircle className="h-6 w-6" />
              Saved
            </>
          ) : (
            <>
              <Save className="h-6 w-6" />
              Save
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
