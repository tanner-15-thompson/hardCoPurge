"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronRight, FilePlus, FileText } from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"

interface PlansSectionProps {
  client: any
  workoutPlans: any[]
  nutritionPlans: any[]
  compact?: boolean
}

export default function PlansSection({ client, workoutPlans, nutritionPlans, compact = false }: PlansSectionProps) {
  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader className="pb-2">
        <CardTitle className="text-white">Client Plans</CardTitle>
        <CardDescription>Workout and nutrition plans</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-white font-medium">Workout Plans</h3>
            <Link href={`/admin/clients/${client.id}/workout/new`}>
              <Button variant="outline" size="sm" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                <FilePlus className="h-4 w-4 mr-1" />
                New Plan
              </Button>
            </Link>
          </div>

          {workoutPlans.length > 0 ? (
            <div className="space-y-2">
              {workoutPlans.map((plan) => (
                <Link
                  key={plan.id}
                  href={`/admin/clients/${client.id}/workout/${plan.id}`}
                  className="flex items-center justify-between p-3 bg-gray-700/50 hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <div>
                    <p className="text-white font-medium">{plan.title || "Workout Plan"}</p>
                    <p className="text-sm text-gray-400">Created {format(new Date(plan.created_at), "MMM d, yyyy")}</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </Link>
              ))}

              {!compact && workoutPlans.length > 3 && (
                <Link href={`/admin/clients/${client.id}?tab=plans`} className="block text-center">
                  <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white mt-2">
                    View all workout plans
                  </Button>
                </Link>
              )}
            </div>
          ) : (
            <div className="text-center py-6 bg-gray-700/30 rounded-lg">
              <FileText className="h-8 w-8 text-gray-500 mx-auto mb-2" />
              <p className="text-gray-400">No workout plans yet</p>
              <Link href={`/admin/clients/${client.id}/workout/new`}>
                <Button variant="outline" size="sm" className="mt-3 border-gray-600 text-gray-300 hover:bg-gray-700">
                  Create Workout Plan
                </Button>
              </Link>
            </div>
          )}
        </div>

        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-white font-medium">Nutrition Plans</h3>
            <Link href={`/admin/clients/${client.id}/nutrition/new`}>
              <Button variant="outline" size="sm" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                <FilePlus className="h-4 w-4 mr-1" />
                New Plan
              </Button>
            </Link>
          </div>

          {nutritionPlans.length > 0 ? (
            <div className="space-y-2">
              {nutritionPlans.map((plan) => (
                <Link
                  key={plan.id}
                  href={`/admin/clients/${client.id}/nutrition/${plan.id}`}
                  className="flex items-center justify-between p-3 bg-gray-700/50 hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <div>
                    <p className="text-white font-medium">{plan.title || "Nutrition Plan"}</p>
                    <p className="text-sm text-gray-400">Created {format(new Date(plan.created_at), "MMM d, yyyy")}</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </Link>
              ))}

              {!compact && nutritionPlans.length > 3 && (
                <Link href={`/admin/clients/${client.id}?tab=plans`} className="block text-center">
                  <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white mt-2">
                    View all nutrition plans
                  </Button>
                </Link>
              )}
            </div>
          ) : (
            <div className="text-center py-6 bg-gray-700/30 rounded-lg">
              <FileText className="h-8 w-8 text-gray-500 mx-auto mb-2" />
              <p className="text-gray-400">No nutrition plans yet</p>
              <Link href={`/admin/clients/${client.id}/nutrition/new`}>
                <Button variant="outline" size="sm" className="mt-3 border-gray-600 text-gray-300 hover:bg-gray-700">
                  Create Nutrition Plan
                </Button>
              </Link>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
