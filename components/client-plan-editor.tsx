"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import type { ClientPlan } from "@/lib/questionnaire-service"
import { saveClientPlan } from "@/app/actions/questionnaire-actions"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"

interface ClientPlanEditorProps {
  clientId: number
  initialData?: ClientPlan
}

export function ClientPlanEditor({ clientId, initialData }: ClientPlanEditorProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const [planData, setPlanData] = useState<ClientPlan>({
    client_id: clientId,
    workout_html: initialData?.workout_html || "",
    nutrition_html: initialData?.nutrition_html || "",
    workout_ics: initialData?.workout_ics || "",
    nutrition_ics: initialData?.nutrition_ics || "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setPlanData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setMessage(null)

    try {
      const result = await saveClientPlan(planData)

      if (result.success) {
        setMessage({ type: "success", text: result.message })
        router.refresh()
      } else {
        setMessage({ type: "error", text: result.message })
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: error instanceof Error ? error.message : "An unknown error occurred",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {message && (
        <div
          className={`p-4 rounded-md ${
            message.type === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="space-y-6">
        <h2 className="text-xl font-semibold">Workout Plan</h2>

        <div>
          <Label htmlFor="workout_html" className="block text-sm font-medium mb-1">
            Workout HTML
          </Label>
          <Textarea
            id="workout_html"
            name="workout_html"
            value={planData.workout_html}
            onChange={handleChange}
            placeholder="<div>Workout plan HTML content</div>"
            className="w-full p-2 border rounded-md font-mono text-sm h-64"
          />
        </div>
      </div>

      <div className="space-y-6">
        <h2 className="text-xl font-semibold">Nutrition Plan</h2>

        <div>
          <Label htmlFor="nutrition_html" className="block text-sm font-medium mb-1">
            Nutrition HTML
          </Label>
          <Textarea
            id="nutrition_html"
            name="nutrition_html"
            value={planData.nutrition_html}
            onChange={handleChange}
            placeholder="<div>Nutrition plan HTML content</div>"
            className="w-full p-2 border rounded-md font-mono text-sm h-64"
          />
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Saving..." : "Save Client Plan"}
      </Button>
    </form>
  )
}
