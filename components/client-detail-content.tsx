"use client"

import { useState, useEffect } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

interface ClientDetailContentProps {
  clientId: number
  clientData: {
    id: number
    name: string
    email: string
    phone: string | null
    created_at: string
  }
}

export function ClientDetailContent({ clientId, clientData }: ClientDetailContentProps) {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const supabase = createClientComponentClient()

  useEffect(() => {
    async function fetchAvatar() {
      try {
        const { data } = supabase.storage.from("avatars").getPublicUrl(`client-${clientId}/avatar.png`)
        setAvatarUrl(data.publicUrl)
      } catch (error) {
        console.error("Error fetching avatar:", error)
      }
    }

    fetchAvatar()
  }, [clientId, supabase])

  return (
    <div className="bg-gray-800 rounded-lg shadow-md p-6 border border-gray-700">
      <div className="flex items-center mb-6">
        <Avatar className="h-16 w-16 mr-4">
          <AvatarImage src={avatarUrl || `/placeholder.svg?height=64&width=64`} alt={clientData.name} />
          <AvatarFallback>{clientData.name.substring(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div>
          <h2 className="text-2xl font-bold text-white">{clientData.name}</h2>
          <p className="text-gray-400">{clientData.email}</p>
          {clientData.phone && <p className="text-gray-400">{clientData.phone}</p>}
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-white">Client Information</h3>
          <Badge className="bg-purple-600 hover:bg-purple-700 text-white">Active</Badge>
        </div>

        <div className="text-gray-300">
          <p>
            <strong>Client ID:</strong> {clientData.id}
          </p>
          <p>
            <strong>Member Since:</strong> {new Date(clientData.created_at).toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  )
}
