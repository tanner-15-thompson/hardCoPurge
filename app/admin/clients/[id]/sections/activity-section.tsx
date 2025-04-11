"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity, Clock } from "lucide-react"
import { format, formatDistanceToNow } from "date-fns"

interface ActivitySectionProps {
  activityLogs: any[]
  compact?: boolean
}

export default function ActivitySection({ activityLogs, compact = false }: ActivitySectionProps) {
  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader className="pb-2">
        <CardTitle className="text-white">Recent Activity</CardTitle>
        <CardDescription>Client activity history</CardDescription>
      </CardHeader>
      <CardContent>
        {activityLogs.length > 0 ? (
          <div className="space-y-4">
            {activityLogs.map((log) => (
              <div key={log.id} className="border-l-2 border-purple-500 pl-3">
                <div className="flex items-center">
                  <Activity className="h-4 w-4 text-purple-400 mr-2" />
                  <span className="text-white font-medium">{log.activity_type}</span>
                </div>
                <p className="text-gray-400 text-sm mt-1">{log.description}</p>
                <div className="flex items-center text-gray-500 text-xs mt-1">
                  <Clock className="h-3 w-3 mr-1" />
                  <span>{formatDistanceToNow(new Date(log.created_at), { addSuffix: true })}</span>
                  <span className="mx-1">•</span>
                  <span>{format(new Date(log.created_at), "MMM d, yyyy h:mm a")}</span>
                </div>
              </div>
            ))}

            {!compact && activityLogs.length > 5 && (
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white w-full mt-2">
                View all activity
              </Button>
            )}
          </div>
        ) : (
          <div className="text-center py-6">
            <Activity className="h-8 w-8 text-gray-500 mx-auto mb-2" />
            <p className="text-gray-400">No activity recorded yet</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
