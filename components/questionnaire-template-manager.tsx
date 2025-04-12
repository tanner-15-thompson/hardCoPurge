"use client"

import { useState } from "react"
import { PlusCircle, Trash2, Save, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

export type QuestionType = "text" | "textarea" | "select" | "radio" | "checkbox" | "number"

export interface QuestionOption {
  label: string
  value: string
}

export interface QuestionnaireQuestion {
  id: string
  type: QuestionType
  label: string
  required: boolean
  options?: QuestionOption[]
  placeholder?: string
  defaultValue?: string | string[] | number
}

export interface QuestionnaireTemplate {
  id: string
  name: string
  description: string
  category: "workout" | "nutrition"
  questions: QuestionnaireQuestion[]
}

interface QuestionnaireTemplateManagerProps {
  initialTemplate?: QuestionnaireTemplate
  category: "workout" | "nutrition"
  onSave: (template: QuestionnaireTemplate) => Promise<void>
}

export function QuestionnaireTemplateManager({ initialTemplate, category, onSave }: QuestionnaireTemplateManagerProps) {
  const [template, setTemplate] = useState<QuestionnaireTemplate>(
    initialTemplate || {
      id: `template-${Date.now()}`,
      name: `New ${category.charAt(0).toUpperCase() + category.slice(1)} Questionnaire`,
      description: `Customized ${category} questionnaire`,
      category,
      questions: [],
    },
  )

  const [editingQuestion, setEditingQuestion] = useState<QuestionnaireQuestion | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const addQuestion = () => {
    const newQuestion: QuestionnaireQuestion = {
      id: `question-${Date.now()}`,
      type: "text",
      label: "New Question",
      required: false,
      placeholder: "Enter your answer",
    }

    setEditingQuestion(newQuestion)
  }

  const saveQuestion = () => {
    if (!editingQuestion) return

    setTemplate((prev) => {
      const existingIndex = prev.questions.findIndex((q) => q.id === editingQuestion.id)
      const updatedQuestions = [...prev.questions]

      if (existingIndex >= 0) {
        updatedQuestions[existingIndex] = editingQuestion
      } else {
        updatedQuestions.push(editingQuestion)
      }

      return {
        ...prev,
        questions: updatedQuestions,
      }
    })

    setEditingQuestion(null)
  }

  const editQuestion = (question: QuestionnaireQuestion) => {
    setEditingQuestion({ ...question })
  }

  const deleteQuestion = (questionId: string) => {
    setTemplate((prev) => ({
      ...prev,
      questions: prev.questions.filter((q) => q.id !== questionId),
    }))
  }

  const addOption = () => {
    if (!editingQuestion) return

    setEditingQuestion((prev) => {
      if (!prev) return prev

      const options = prev.options || []
      return {
        ...prev,
        options: [...options, { label: `Option ${options.length + 1}`, value: `option-${options.length + 1}` }],
      }
    })
  }

  const updateOption = (index: number, field: "label" | "value", value: string) => {
    if (!editingQuestion || !editingQuestion.options) return

    setEditingQuestion((prev) => {
      if (!prev || !prev.options) return prev

      const updatedOptions = [...prev.options]
      updatedOptions[index] = {
        ...updatedOptions[index],
        [field]: value,
      }

      return {
        ...prev,
        options: updatedOptions,
      }
    })
  }

  const deleteOption = (index: number) => {
    if (!editingQuestion || !editingQuestion.options) return

    setEditingQuestion((prev) => {
      if (!prev || !prev.options) return prev

      return {
        ...prev,
        options: prev.options.filter((_, i) => i !== index),
      }
    })
  }

  const handleSaveTemplate = async () => {
    setIsSaving(true)
    setMessage(null)

    try {
      await onSave(template)
      setMessage({
        type: "success",
        text: "Questionnaire template saved successfully",
      })
    } catch (error) {
      setMessage({
        type: "error",
        text: error instanceof Error ? error.message : "Failed to save template",
      })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-6">
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

      <div className="space-y-4">
        <div>
          <Label htmlFor="template-name">Questionnaire Name</Label>
          <Input
            id="template-name"
            value={template.name}
            onChange={(e) => setTemplate((prev) => ({ ...prev, name: e.target.value }))}
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="template-description">Description</Label>
          <Textarea
            id="template-description"
            value={template.description}
            onChange={(e) => setTemplate((prev) => ({ ...prev, description: e.target.value }))}
            className="mt-1"
          />
        </div>
      </div>

      <div className="border-t border-gray-200 dark:border-gray-800 pt-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Questions</h3>
          <Button onClick={addQuestion} variant="outline" size="sm">
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Question
          </Button>
        </div>

        {template.questions.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400 border border-dashed border-gray-300 dark:border-gray-700 rounded-md">
            No questions added yet. Click "Add Question" to get started.
          </div>
        ) : (
          <ul className="space-y-3">
            {template.questions.map((question) => (
              <li
                key={question.id}
                className="p-4 border border-gray-200 dark:border-gray-800 rounded-md bg-white dark:bg-gray-900"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">{question.label}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Type: {question.type.charAt(0).toUpperCase() + question.type.slice(1)}
                      {question.required && " • Required"}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <Button onClick={() => editQuestion(question)} variant="ghost" size="sm">
                      Edit
                    </Button>
                    <Button
                      onClick={() => deleteQuestion(question.id)}
                      variant="ghost"
                      size="sm"
                      className="text-red-500"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {editingQuestion && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Edit Question</h3>
                <Button onClick={() => setEditingQuestion(null)} variant="ghost" size="sm">
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="question-label">Question Text</Label>
                  <Input
                    id="question-label"
                    value={editingQuestion.label}
                    onChange={(e) => setEditingQuestion((prev) => (prev ? { ...prev, label: e.target.value } : null))}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="question-type">Question Type</Label>
                  <select
                    id="question-type"
                    value={editingQuestion.type}
                    onChange={(e) =>
                      setEditingQuestion((prev) => (prev ? { ...prev, type: e.target.value as QuestionType } : null))
                    }
                    className="w-full p-2 border rounded-md mt-1 bg-white dark:bg-gray-950"
                  >
                    <option value="text">Short Text</option>
                    <option value="textarea">Long Text</option>
                    <option value="select">Dropdown</option>
                    <option value="radio">Multiple Choice</option>
                    <option value="checkbox">Checkboxes</option>
                    <option value="number">Number</option>
                  </select>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="question-required"
                    checked={editingQuestion.required}
                    onCheckedChange={(checked) =>
                      setEditingQuestion((prev) => (prev ? { ...prev, required: checked } : null))
                    }
                  />
                  <Label htmlFor="question-required">Required</Label>
                </div>

                {(editingQuestion.type === "text" ||
                  editingQuestion.type === "textarea" ||
                  editingQuestion.type === "number") && (
                  <div>
                    <Label htmlFor="question-placeholder">Placeholder Text</Label>
                    <Input
                      id="question-placeholder"
                      value={editingQuestion.placeholder || ""}
                      onChange={(e) =>
                        setEditingQuestion((prev) => (prev ? { ...prev, placeholder: e.target.value } : null))
                      }
                      className="mt-1"
                    />
                  </div>
                )}

                {(editingQuestion.type === "select" ||
                  editingQuestion.type === "radio" ||
                  editingQuestion.type === "checkbox") && (
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <Label>Options</Label>
                      <Button onClick={addOption} variant="outline" size="sm">
                        <PlusCircle className="h-4 w-4 mr-2" />
                        Add Option
                      </Button>
                    </div>

                    {!editingQuestion.options || editingQuestion.options.length === 0 ? (
                      <div className="text-center py-4 text-gray-500 dark:text-gray-400 border border-dashed border-gray-300 dark:border-gray-700 rounded-md">
                        No options added yet. Click "Add Option" to get started.
                      </div>
                    ) : (
                      <ul className="space-y-2">
                        {editingQuestion.options.map((option, index) => (
                          <li key={index} className="flex items-center space-x-2">
                            <Input
                              value={option.label}
                              onChange={(e) => updateOption(index, "label", e.target.value)}
                              placeholder="Option label"
                              className="flex-1"
                            />
                            <Input
                              value={option.value}
                              onChange={(e) => updateOption(index, "value", e.target.value)}
                              placeholder="Value"
                              className="w-1/3"
                            />
                            <Button
                              onClick={() => deleteOption(index)}
                              variant="ghost"
                              size="sm"
                              className="text-red-500"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button onClick={() => setEditingQuestion(null)} variant="outline">
                  Cancel
                </Button>
                <Button onClick={saveQuestion}>Save Question</Button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="border-t border-gray-200 dark:border-gray-800 pt-6">
        <Button onClick={handleSaveTemplate} disabled={isSaving} className="w-full sm:w-auto">
          {isSaving ? "Saving..." : "Save Questionnaire Template"}
          {!isSaving && <Save className="ml-2 h-4 w-4" />}
        </Button>
      </div>
    </div>
  )
}
