"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { saveQuestionnaireResponse } from "@/app/actions/questionnaire-response-actions"
import type { QuestionnaireQuestion, QuestionnaireTemplate } from "@/components/questionnaire-template-manager"

interface QuestionnaireResponseFormProps {
  clientId: number
  template: QuestionnaireTemplate
  initialResponses?: Record<string, any>
}

export function QuestionnaireResponseForm({
  clientId,
  template,
  initialResponses = {},
}: QuestionnaireResponseFormProps) {
  const [responses, setResponses] = useState<Record<string, any>>(initialResponses)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const handleInputChange = (questionId: string, value: any) => {
    setResponses((prev) => ({
      ...prev,
      [questionId]: value,
    }))

    // Clear error for this field if it exists
    if (errors[questionId]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[questionId]
        return newErrors
      })
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    template.questions.forEach((question) => {
      if (question.required) {
        const response = responses[question.id]

        if (response === undefined || response === null || response === "") {
          newErrors[question.id] = "This field is required"
        } else if (Array.isArray(response) && response.length === 0) {
          newErrors[question.id] = "Please select at least one option"
        }
      }
    })

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      setMessage({
        type: "error",
        text: "Please fill in all required fields",
      })
      return
    }

    setIsSaving(true)
    setMessage(null)

    try {
      const result = await saveQuestionnaireResponse({
        clientId,
        templateId: template.id,
        responses,
      })

      if (result.success) {
        setMessage({
          type: "success",
          text: "Responses saved successfully",
        })
      } else {
        setMessage({
          type: "error",
          text: result.message,
        })
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: error instanceof Error ? error.message : "Failed to save responses",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const renderQuestion = (question: QuestionnaireQuestion) => {
    const { id, type, label, required, options, placeholder } = question

    switch (type) {
      case "text":
        return (
          <div className="space-y-2">
            <Label htmlFor={id} className="flex">
              {label}
              {required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Input
              id={id}
              value={responses[id] || ""}
              onChange={(e) => handleInputChange(id, e.target.value)}
              placeholder={placeholder}
              className={errors[id] ? "border-red-500" : ""}
            />
            {errors[id] && <p className="text-sm text-red-500">{errors[id]}</p>}
          </div>
        )

      case "textarea":
        return (
          <div className="space-y-2">
            <Label htmlFor={id} className="flex">
              {label}
              {required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Textarea
              id={id}
              value={responses[id] || ""}
              onChange={(e) => handleInputChange(id, e.target.value)}
              placeholder={placeholder}
              className={errors[id] ? "border-red-500" : ""}
            />
            {errors[id] && <p className="text-sm text-red-500">{errors[id]}</p>}
          </div>
        )

      case "select":
        return (
          <div className="space-y-2">
            <Label htmlFor={id} className="flex">
              {label}
              {required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <select
              id={id}
              value={responses[id] || ""}
              onChange={(e) => handleInputChange(id, e.target.value)}
              className={`w-full p-2 border rounded-md ${errors[id] ? "border-red-500" : "border-gray-300 dark:border-gray-700"} bg-white dark:bg-gray-950`}
            >
              <option value="">Select an option</option>
              {options?.map((option, index) => (
                <option key={index} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {errors[id] && <p className="text-sm text-red-500">{errors[id]}</p>}
          </div>
        )

      case "radio":
        return (
          <div className="space-y-2">
            <div className="flex">
              <Label className="flex">
                {label}
                {required && <span className="text-red-500 ml-1">*</span>}
              </Label>
            </div>
            <RadioGroup
              value={responses[id] || ""}
              onValueChange={(value) => handleInputChange(id, value)}
              className={errors[id] ? "border border-red-500 p-3 rounded-md" : ""}
            >
              {options?.map((option, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value} id={`${id}-${option.value}`} />
                  <Label htmlFor={`${id}-${option.value}`}>{option.label}</Label>
                </div>
              ))}
            </RadioGroup>
            {errors[id] && <p className="text-sm text-red-500">{errors[id]}</p>}
          </div>
        )

      case "checkbox":
        return (
          <div className="space-y-2">
            <div className="flex">
              <Label className="flex">
                {label}
                {required && <span className="text-red-500 ml-1">*</span>}
              </Label>
            </div>
            <div className={`space-y-2 ${errors[id] ? "border border-red-500 p-3 rounded-md" : ""}`}>
              {options?.map((option, index) => {
                const checked = Array.isArray(responses[id]) ? responses[id]?.includes(option.value) : false

                return (
                  <div key={index} className="flex items-center space-x-2">
                    <Checkbox
                      id={`${id}-${option.value}`}
                      checked={checked}
                      onCheckedChange={(isChecked) => {
                        const currentValues = Array.isArray(responses[id]) ? [...responses[id]] : []

                        if (isChecked) {
                          handleInputChange(id, [...currentValues, option.value])
                        } else {
                          handleInputChange(
                            id,
                            currentValues.filter((v) => v !== option.value),
                          )
                        }
                      }}
                    />
                    <Label htmlFor={`${id}-${option.value}`}>{option.label}</Label>
                  </div>
                )
              })}
            </div>
            {errors[id] && <p className="text-sm text-red-500">{errors[id]}</p>}
          </div>
        )

      case "number":
        return (
          <div className="space-y-2">
            <Label htmlFor={id} className="flex">
              {label}
              {required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Input
              id={id}
              type="number"
              value={responses[id] || ""}
              onChange={(e) => handleInputChange(id, e.target.value)}
              placeholder={placeholder}
              className={errors[id] ? "border-red-500" : ""}
            />
            {errors[id] && <p className="text-sm text-red-500">{errors[id]}</p>}
          </div>
        )

      default:
        return null
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {message && (
        <div
          className={`p-4 rounded-md ${
            message.type === "success"
              ? "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400"
              : "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400"
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="space-y-6">
        {template.questions.map((question) => (
          <div
            key={question.id}
            className="p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-md"
          >
            {renderQuestion(question)}
          </div>
        ))}
      </div>

      <Button type="submit" disabled={isSaving} className="w-full sm:w-auto">
        {isSaving ? "Saving..." : "Save Responses"}
      </Button>
    </form>
  )
}
