"use client"

import { useEffect, useState } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Dumbbell, Filter, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface Activity {
  id: number
  type: string
  title: string
  description: string
  relativeTime: string
}

// Helper function to format relative time
const formatRelativeTime = (date: Date) => {
  const now = new Date()
  const diffTime = Math.abs(now.getTime() - date.getTime())
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays === 0) {
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60))
    if (diffHours === 0) {
      const diffMinutes = Math.floor(diffTime / (1000 * 60))
      return `${diffMinutes} minute${diffMinutes !== 1 ? "s" : ""} ago`
    }
    return `${diffHours} hour${diffHours !== 1 ? "s" : ""} ago`
  } else if (diffDays === 1) {
    return "Yesterday"
  } else if (diffDays < 7) {
    return `${diffDays} days ago`
  } else {
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    })
  }
}

// Define activity types and their display properties
const activityTypes = [
  { id: "all", label: "All Activities", color: "gray" },
  { id: "workout", label: "Workouts", color: "purple" },
  { id: "nutrition", label: "Nutrition", color: "green" },
  { id: "profile", label: "Profile Updates", color: "blue" },
  { id: "goal", label: "Goals", color: "yellow" },
  { id: "feedback", label: "Feedback", color: "pink" },
  { id: "system", label: "System", color: "slate" },
]

export default function RealTimeActivities({ clientId }: { clientId: number }) {
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)
  const [activeFilter, setActiveFilter] = useState("all")
  const [showFilters, setShowFilters] = useState(false)
  const supabase = createClientComponentClient()

  useEffect(() => {
    // Initial fetch
    fetchActivities()

    // Set up real-time subscription
    const channel = supabase
      .channel("client-activities")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "client_activities", filter: `client_id=eq.${clientId}` },
        (payload) => {
          const newActivity = payload.new as any

          // Only add to state if it matches the current filter
          if (activeFilter === "all" || newActivity.activity_type === activeFilter) {
            setActivities((prev) => [
              {
                id: newActivity.id,
                type: newActivity.activity_type,
                title: newActivity.title,
                description: newActivity.description,
                relativeTime: formatRelativeTime(new Date(newActivity.created_at)),
              },
              ...prev.slice(0, 4),
            ]) // Keep only the 5 most recent
          }
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [clientId, supabase, activeFilter])

  async function fetchActivities() {
    setLoading(true)
    try {
      let query = supabase
        .from("client_activities")
        .select("*")
        .eq("client_id", clientId)
        .order("created_at", { ascending: false })
        .limit(10)

      // Apply type filter if not "all"
      if (activeFilter !== "all") {
        query = query.eq("activity_type", activeFilter)
      }

      const { data } = await query

      if (data) {
        setActivities(
          data.map((item) => ({
            id: item.id,
            type: item.activity_type,
            title: item.title,
            description: item.description,
            relativeTime: formatRelativeTime(new Date(item.created_at)),
          })),
        )
      }
    } catch (error) {
      console.error("Error fetching activities:", error)
    } finally {
      setLoading(false)
    }
  }

  // When filter changes, fetch activities with the new filter
  useEffect(() => {
    fetchActivities()
  }, [activeFilter])

  // Get color for activity type
  const getActivityTypeColor = (type: string) => {
    const activityType = activityTypes.find((t) => t.id === type)
    return activityType?.color || "gray"
  }

  // Get icon for activity type
  const getActivityIcon = (type: string) => {
    switch (type) {
      case "workout":
        return <Dumbbell className="h-5 w-5" />
      case "nutrition":
        return (
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M12 5V19M18 11H6"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )
      default:
        return <User className="h-5 w-5" />
    }
  }

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-4">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-start">
              <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 mr-3"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full mb-1"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Filter controls */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-1"
        >
          <Filter className="h-4 w-4" />
          <span>Filter</span>
          {activeFilter !== "all" && (
            <Badge variant="secondary" className="ml-2">
              {activityTypes.find((t) => t.id === activeFilter)?.label || activeFilter}
            </Badge>
          )}
        </Button>

        {activities.length > 0 && (
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Showing {activities.length} {activeFilter === "all" ? "activities" : activeFilter}
          </span>
        )}
      </div>

      {/* Filter options */}
      {showFilters && (
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-4 mb-4">
          <div className="flex flex-wrap gap-2">
            {activityTypes.map((type) => (
              <Button
                key={type.id}
                variant={activeFilter === type.id ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  setActiveFilter(type.id)
                  setShowFilters(false)
                }}
                className={`${
                  activeFilter === type.id
                    ? `bg-${type.color}-500 hover:bg-${type.color}-600`
                    : `hover:bg-${type.color}-100 dark:hover:bg-${type.color}-900/20`
                }`}
              >
                {type.label}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Activities list */}
      {activities.length === 0 ? (
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 text-center">
          <p className="text-gray-500 dark:text-gray-400">
            {activeFilter === "all" ? "No recent activities found." : `No ${activeFilter} activities found.`}
          </p>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
          {activities.map((activity, index) => (
            <div
              key={activity.id}
              className={`p-4 ${index < activities.length - 1 ? "border-b border-gray-200 dark:border-gray-800" : ""}`}
            >
              <div className="flex items-start">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${
                    activity.type === "workout"
                      ? "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400"
                      : activity.type === "nutrition"
                        ? "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400"
                        : activity.type === "goal"
                          ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400"
                          : activity.type === "feedback"
                            ? "bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400"
                            : activity.type === "system"
                              ? "bg-slate-100 dark:bg-slate-900/30 text-slate-600 dark:text-slate-400"
                              : "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                  }`}
                >
                  {getActivityIcon(activity.type)}
                </div>
                <div>
                  <div className="flex items-center">
                    <h3 className="font-medium">{activity.title}</h3>
                    <Badge
                      variant="outline"
                      className={`ml-2 text-xs ${
                        activity.type === "workout"
                          ? "border-purple-200 text-purple-700 dark:border-purple-800 dark:text-purple-300"
                          : activity.type === "nutrition"
                            ? "border-green-200 text-green-700 dark:border-green-800 dark:text-green-300"
                            : activity.type === "goal"
                              ? "border-yellow-200 text-yellow-700 dark:border-yellow-800 dark:text-yellow-300"
                              : activity.type === "feedback"
                                ? "border-pink-200 text-pink-700 dark:border-pink-800 dark:text-pink-300"
                                : activity.type === "system"
                                  ? "border-slate-200 text-slate-700 dark:border-slate-800 dark:text-slate-300"
                                  : "border-blue-200 text-blue-700 dark:border-blue-800 dark:text-blue-300"
                      }`}
                    >
                      {activity.type}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{activity.description}</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">{activity.relativeTime}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
