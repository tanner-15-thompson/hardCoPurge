"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileText, Dumbbell, Apple, Calendar, ClipboardList, MessageSquare, FileOutput, PlusCircle } from "lucide-react"

interface ClientDetailContentProps {
  client: any
  workoutHtml?: string
  nutritionHtml?: string
}

export function ClientDetailContent({ client, workoutHtml, nutritionHtml }: ClientDetailContentProps) {
  const router = useRouter()
  const supabase = createClientComponentClient()
  const [activeTab, setActiveTab] = useState("overview")
  const [loading, setLoading] = useState(false)

  const hasWorkoutPlan = !!workoutHtml
  const hasNutritionPlan = !!nutritionHtml

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-white">{client.name}</h1>
        <div className="flex flex-wrap gap-2">
          <Link href={`/admin/clients/${client.id}/edit`}>
            <Button variant="outline" size="sm">
              Edit Client
            </Button>
          </Link>
          <Link href={`/admin/clients/${client.id}/comprehensive-questionnaire`}>
            <Button
              variant="outline"
              size="sm"
              className="bg-purple-600 hover:bg-purple-700 border-purple-500 text-white"
            >
              <ClipboardList className="h-4 w-4 mr-2" />
              Questionnaire
            </Button>
          </Link>
          <Link href={`/admin/clients/${client.id}/prompt-generator`}>
            <Button variant="outline" size="sm" className="bg-amber-600 hover:bg-amber-700 border-amber-500 text-white">
              <FileOutput className="h-4 w-4 mr-2" />
              Generate Plans
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
          <div className="flex items-center text-gray-400 mb-2">
            <MessageSquare className="h-4 w-4 mr-2" />
            <span className="text-sm">Contact</span>
          </div>
          <div className="space-y-2">
            <p className="text-white">{client.email}</p>
            <p className="text-white">{client.phone || "No phone number"}</p>
          </div>
        </div>

        <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
          <div className="flex items-center text-gray-400 mb-2">
            <Calendar className="h-4 w-4 mr-2" />
            <span className="text-sm">Client Since</span>
          </div>
          <p className="text-white">
            {new Date(client.created_at).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>

        <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
          <div className="flex items-center text-gray-400 mb-2">
            <FileText className="h-4 w-4 mr-2" />
            <span className="text-sm">Plans Status</span>
          </div>
          <div className="flex space-x-4">
            <div className="flex items-center">
              <div className={`h-3 w-3 rounded-full mr-2 ${hasWorkoutPlan ? "bg-green-500" : "bg-red-500"}`}></div>
              <span className="text-white text-sm">Workout</span>
            </div>
            <div className="flex items-center">
              <div className={`h-3 w-3 rounded-full mr-2 ${hasNutritionPlan ? "bg-green-500" : "bg-red-500"}`}></div>
              <span className="text-white text-sm">Nutrition</span>
            </div>
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-gray-700">
          <TabsTrigger value="overview" className="data-[state=active]:bg-gray-600">
            Overview
          </TabsTrigger>
          <TabsTrigger value="workout" className="data-[state=active]:bg-purple-600">
            Workout Plan
          </TabsTrigger>
          <TabsTrigger value="nutrition" className="data-[state=active]:bg-green-600">
            Nutrition Plan
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
              <div className="flex items-center mb-4">
                <Dumbbell className="h-5 w-5 text-purple-400 mr-2" />
                <h3 className="text-lg font-medium text-white">Workout Plan</h3>
              </div>

              {hasWorkoutPlan ? (
                <div className="space-y-4">
                  <p className="text-gray-300">
                    This client has a workout plan. You can view and edit it in the Workout Plan tab.
                  </p>
                  <Button
                    onClick={() => setActiveTab("workout")}
                    variant="outline"
                    className="w-full bg-purple-600 hover:bg-purple-700 border-purple-500 text-white"
                  >
                    View Workout Plan
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-gray-300">
                    This client doesn't have a workout plan yet. Create one to get started.
                  </p>
                  <div className="flex flex-col space-y-2">
                    <Link href={`/admin/clients/${client.id}/comprehensive-questionnaire`}>
                      <Button variant="outline" className="w-full">
                        <ClipboardList className="h-4 w-4 mr-2" />
                        Complete Questionnaire
                      </Button>
                    </Link>
                    <Link href={`/admin/clients/${client.id}/prompt-generator`}>
                      <Button variant="outline" className="w-full">
                        <FileOutput className="h-4 w-4 mr-2" />
                        Generate Plan
                      </Button>
                    </Link>
                    <Link href={`/admin/clients/${client.id}/workout`}>
                      <Button
                        variant="outline"
                        className="w-full bg-purple-600 hover:bg-purple-700 border-purple-500 text-white"
                      >
                        <PlusCircle className="h-4 w-4 mr-2" />
                        Create Workout Plan
                      </Button>
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
              <div className="flex items-center mb-4">
                <Apple className="h-5 w-5 text-green-400 mr-2" />
                <h3 className="text-lg font-medium text-white">Nutrition Plan</h3>
              </div>

              {hasNutritionPlan ? (
                <div className="space-y-4">
                  <p className="text-gray-300">
                    This client has a nutrition plan. You can view and edit it in the Nutrition Plan tab.
                  </p>
                  <Button
                    onClick={() => setActiveTab("nutrition")}
                    variant="outline"
                    className="w-full bg-green-600 hover:bg-green-700 border-green-500 text-white"
                  >
                    View Nutrition Plan
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-gray-300">
                    This client doesn't have a nutrition plan yet. Create one to get started.
                  </p>
                  <div className="flex flex-col space-y-2">
                    <Link href={`/admin/clients/${client.id}/comprehensive-questionnaire`}>
                      <Button variant="outline" className="w-full">
                        <ClipboardList className="h-4 w-4 mr-2" />
                        Complete Questionnaire
                      </Button>
                    </Link>
                    <Link href={`/admin/clients/${client.id}/prompt-generator`}>
                      <Button variant="outline" className="w-full">
                        <FileOutput className="h-4 w-4 mr-2" />
                        Generate Plan
                      </Button>
                    </Link>
                    <Link href={`/admin/clients/${client.id}/nutrition`}>
                      <Button
                        variant="outline"
                        className="w-full bg-green-600 hover:bg-green-700 border-green-500 text-white"
                      >
                        <PlusCircle className="h-4 w-4 mr-2" />
                        Create Nutrition Plan
                      </Button>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="workout" className="mt-6">
          {hasWorkoutPlan ? (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-white">Workout Plan</h3>
                <Link href={`/admin/clients/${client.id}/workout`}>
                  <Button variant="outline" size="sm">
                    Edit Plan
                  </Button>
                </Link>
              </div>
              <div
                className="bg-gray-700 p-6 rounded-lg border border-gray-600 prose prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: workoutHtml || "" }}
              />
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-700 rounded-lg">
              <Dumbbell className="h-12 w-12 mx-auto text-gray-500 mb-3" />
              <h3 className="text-lg font-medium text-white mb-2">No Workout Plan</h3>
              <p className="text-gray-400 mb-4">
                This client doesn't have a workout plan yet. Create one to get started.
              </p>
              <Link href={`/admin/clients/${client.id}/workout`}>
                <Button className="bg-purple-600 hover:bg-purple-700">
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Create Workout Plan
                </Button>
              </Link>
            </div>
          )}
        </TabsContent>

        <TabsContent value="nutrition" className="mt-6">
          {hasNutritionPlan ? (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-white">Nutrition Plan</h3>
                <Link href={`/admin/clients/${client.id}/nutrition`}>
                  <Button variant="outline" size="sm">
                    Edit Plan
                  </Button>
                </Link>
              </div>
              <div
                className="bg-gray-700 p-6 rounded-lg border border-gray-600 prose prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: nutritionHtml || "" }}
              />
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-700 rounded-lg">
              <Apple className="h-12 w-12 mx-auto text-gray-500 mb-3" />
              <h3 className="text-lg font-medium text-white mb-2">No Nutrition Plan</h3>
              <p className="text-gray-400 mb-4">
                This client doesn't have a nutrition plan yet. Create one to get started.
              </p>
              <Link href={`/admin/clients/${client.id}/nutrition`}>
                <Button className="bg-green-600 hover:bg-green-700">
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Create Nutrition Plan
                </Button>
              </Link>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
