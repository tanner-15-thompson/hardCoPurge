"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ClientInfoSection from "./sections/client-info-section"
import QuestionnaireSection from "./sections/questionnaire-section"
import FullQuestionnaireView from "./sections/full-questionnaire-view"
import PromptGenerationSection from "./sections/prompt-generation-section"
import PlansSection from "./sections/plans-section"
import ActivitySection from "./sections/activity-section"
import type { QuestionnaireData } from "@/lib/questionnaire-service"

interface ClientManagementInterfaceProps {
  client: any
  questionnaire: QuestionnaireData | null
  workoutPlans: any[]
  nutritionPlans: any[]
  activityLogs: any[]
}

export default function ClientManagementInterface({
  client,
  questionnaire,
  workoutPlans,
  nutritionPlans,
  activityLogs,
}: ClientManagementInterfaceProps) {
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <div className="container mx-auto py-6 px-4 max-w-7xl">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">{client.name}</h1>
        <p className="text-gray-400">
          {client.email} • {client.phone || "No phone"}
        </p>
      </header>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid grid-cols-5 w-full max-w-4xl">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="questionnaire">Questionnaire</TabsTrigger>
          <TabsTrigger value="prompts">Prompts</TabsTrigger>
          <TabsTrigger value="plans">Plans</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <ClientInfoSection client={client} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <QuestionnaireSection client={client} questionnaire={questionnaire} compact />
            <PromptGenerationSection client={client} questionnaire={questionnaire} compact />
          </div>
          <PlansSection
            client={client}
            workoutPlans={workoutPlans.slice(0, 3)}
            nutritionPlans={nutritionPlans.slice(0, 3)}
            compact
          />
          <ActivitySection activityLogs={activityLogs.slice(0, 5)} compact />
        </TabsContent>

        <TabsContent value="questionnaire" className="space-y-6">
          <FullQuestionnaireView questionnaire={questionnaire} />
        </TabsContent>

        <TabsContent value="prompts" className="space-y-6">
          <PromptGenerationSection client={client} questionnaire={questionnaire} />
        </TabsContent>

        <TabsContent value="plans" className="space-y-6">
          <PlansSection client={client} workoutPlans={workoutPlans} nutritionPlans={nutritionPlans} />
        </TabsContent>

        <TabsContent value="activity" className="space-y-6">
          <ActivitySection activityLogs={activityLogs} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
