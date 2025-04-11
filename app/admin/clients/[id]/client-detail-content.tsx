"use client"

interface ClientDetailContentProps {
  client: any
  clientId: number
  questionnaire: any
  workoutCompletions: any[]
  mealCompletions: any[]
  paymentTrackingSetup: boolean
  phaseProgress: number
  overallGoalProgress: number
}

export default function ClientDetailContent({
  client,
  clientId,
  questionnaire,
  workoutCompletions,
  mealCompletions,
  paymentTrackingSetup,
  phaseProgress,
  overallGoalProgress,
}: ClientDetailContentProps) {
  return (
    <div>
      <h2>Client Detail Content</h2>
      <p>Client ID: {clientId}</p>
      <p>Client Name: {client?.name}</p>
      {/* Add more client details here */}
    </div>
  )
}
