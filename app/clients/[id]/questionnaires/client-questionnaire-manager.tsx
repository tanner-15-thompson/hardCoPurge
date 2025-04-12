"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { PlusCircle, FileText, Trash2, Edit } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { QuestionnaireTemplateManager } from "@/components/questionnaire-template-manager"
import { QuestionnaireResponseForm } from "@/components/questionnaire-response-form"
import { saveQuestionnaireTemplate, deleteQuestionnaireTemplate } from "@/app/actions/questionnaire-template-actions"

interface ClientQuestionnaireManagerProps {
  clientId: number
  category: "workout" | "nutrition"
  templates: Array<{
    id: string
    template_id: string
    name: string
    description: string
    questions: any[]
    created_at: string
    updated_at: string
  }>
}

export function ClientQuestionnaireManager({ clientId, category, templates }: ClientQuestionnaireManagerProps) {
  const router = useRouter()
  const [isCreating, setIsCreating] = useState(false)
  const [isEditing, setIsEditing] = useState<string | null>(null)
  const [isResponding, setIsResponding] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState<string | null>(null)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const handleSaveTemplate = async (template: any) => {
    try {
      await saveQuestionnaireTemplate(clientId, template)
      setIsCreating(false)
      setIsEditing(null)
      router.refresh()
      return { success: true }
    } catch (error) {
      console.error("Error saving template:", error)
      return { success: false, message: "Failed to save template" }
    }
  }

  const handleDeleteTemplate = async (templateId: string) => {
    try {
      await deleteQuestionnaireTemplate(templateId)
      setIsDeleting(null)
      router.refresh()
      setMessage({
        type: "success",
        text: "Questionnaire template deleted successfully",
      })
    } catch (error) {
      setMessage({
        type: "error",
        text: "Failed to delete template",
      })
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

      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">{category === "workout" ? "Workout" : "Nutrition"} Questionnaires</h2>
        <Button onClick={() => setIsCreating(true)}>
          <PlusCircle className="h-4 w-4 mr-2" />
          Create New
        </Button>
      </div>

      {templates.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
          <FileText className="h-12 w-12 mx-auto text-gray-400" />
          <h3 className="mt-4 text-lg font-medium">No questionnaires yet</h3>
          <p className="mt-1 text-gray-500 dark:text-gray-400">
            Create your first {category} questionnaire for this client
          </p>
          <Button onClick={() => setIsCreating(true)} className="mt-4">
            <PlusCircle className="h-4 w-4 mr-2" />
            Create Questionnaire
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {templates.map((template) => (
            <div
              key={template.id}
              className="border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden bg-white dark:bg-gray-900"
            >
              <div className="p-4 border-b border-gray-200 dark:border-gray-800">
                <h3 className="font-medium truncate">{template.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">{template.description}</p>
              </div>

              <div className="p-4 bg-gray-50 dark:bg-gray-950 flex justify-between">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <FileText className="h-4 w-4 mr-2" />
                      Fill Out
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>{template.name}</DialogTitle>
                    </DialogHeader>
                    <QuestionnaireResponseForm
                      clientId={clientId}
                      template={{
                        id: template.template_id,
                        name: template.name,
                        description: template.description,
                        category: category,
                        questions: template.questions,
                      }}
                    />
                  </DialogContent>
                </Dialog>

                <div className="flex space-x-2">
                  <Button variant="ghost" size="sm" onClick={() => setIsEditing(template.id)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="text-red-500" onClick={() => setIsDeleting(template.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Template Dialog */}
      <Dialog open={isCreating} onOpenChange={setIsCreating}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New {category === "workout" ? "Workout" : "Nutrition"} Questionnaire</DialogTitle>
          </DialogHeader>
          <QuestionnaireTemplateManager category={category} onSave={handleSaveTemplate} />
        </DialogContent>
      </Dialog>

      {/* Edit Template Dialog */}
      {isEditing && (
        <Dialog open={!!isEditing} onOpenChange={() => setIsEditing(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Questionnaire</DialogTitle>
            </DialogHeader>
            <QuestionnaireTemplateManager
              category={category}
              initialTemplate={{
                id: templates.find((t) => t.id === isEditing)?.template_id || "",
                name: templates.find((t) => t.id === isEditing)?.name || "",
                description: templates.find((t) => t.id === isEditing)?.description || "",
                category: category,
                questions: templates.find((t) => t.id === isEditing)?.questions || [],
              }}
              onSave={handleSaveTemplate}
            />
          </DialogContent>
        </Dialog>
      )}

      {/* Delete Confirmation Dialog */}
      {isDeleting && (
        <Dialog open={!!isDeleting} onOpenChange={() => setIsDeleting(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Questionnaire</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <p>Are you sure you want to delete this questionnaire? This action cannot be undone.</p>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsDeleting(null)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={() => handleDeleteTemplate(isDeleting)}>
                Delete
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
