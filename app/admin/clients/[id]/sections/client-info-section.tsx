"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Edit2, Save, X } from "lucide-react"
import { updateClient } from "@/app/admin/clients/[id]/edit/actions"
import { format } from "date-fns"

interface ClientInfoSectionProps {
  client: any
}

export default function ClientInfoSection({ client }: ClientInfoSectionProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: client.name,
    email: client.email,
    phone: client.phone || "",
    goals: client.goals || "",
    fitness_level: client.fitness_level || "",
    health_conditions: client.health_conditions || "",
    dietary_restrictions: client.dietary_restrictions || "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await updateClient(client.id, formData)
      setIsEditing(false)
    } catch (error) {
      console.error("Error updating client:", error)
    }
  }

  const createdAt = client.created_at ? new Date(client.created_at) : new Date()

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-white">Client Information</CardTitle>
          <CardDescription>Client since {format(createdAt, "MMMM d, yyyy")}</CardDescription>
        </div>
        {!isEditing ? (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditing(true)}
            className="text-gray-400 border-gray-600 hover:text-white hover:bg-gray-700"
          >
            <Edit2 className="h-4 w-4 mr-2" />
            Edit
          </Button>
        ) : (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditing(false)}
            className="text-gray-400 border-gray-600 hover:text-white hover:bg-gray-700"
          >
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-gray-300">
                  Full Name
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-300">
                  Email Address
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-gray-300">
                  Phone Number
                </Label>
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fitness_level" className="text-gray-300">
                  Fitness Level
                </Label>
                <Input
                  id="fitness_level"
                  name="fitness_level"
                  value={formData.fitness_level}
                  onChange={handleChange}
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="goals" className="text-gray-300">
                Goals
              </Label>
              <Textarea
                id="goals"
                name="goals"
                value={formData.goals}
                onChange={handleChange}
                className="bg-gray-700 border-gray-600 text-white min-h-[80px]"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="health_conditions" className="text-gray-300">
                  Health Conditions
                </Label>
                <Textarea
                  id="health_conditions"
                  name="health_conditions"
                  value={formData.health_conditions}
                  onChange={handleChange}
                  className="bg-gray-700 border-gray-600 text-white min-h-[80px]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dietary_restrictions" className="text-gray-300">
                  Dietary Restrictions
                </Label>
                <Textarea
                  id="dietary_restrictions"
                  name="dietary_restrictions"
                  value={formData.dietary_restrictions}
                  onChange={handleChange}
                  className="bg-gray-700 border-gray-600 text-white min-h-[80px]"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <Button type="submit" className="bg-blue-600 hover:bg-blue-500">
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-gray-400">Contact Information</h3>
                <div className="mt-2 space-y-1">
                  <p className="text-white">{client.name}</p>
                  <p className="text-gray-300">{client.email}</p>
                  <p className="text-gray-300">{client.phone || "No phone number"}</p>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-400">Fitness Level</h3>
                <p className="mt-2 text-white">{client.fitness_level || "Not specified"}</p>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-400">Goals</h3>
              <p className="mt-2 text-white whitespace-pre-wrap">{client.goals || "No goals specified"}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-gray-400">Health Conditions</h3>
                <p className="mt-2 text-white whitespace-pre-wrap">{client.health_conditions || "None specified"}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-400">Dietary Restrictions</h3>
                <p className="mt-2 text-white whitespace-pre-wrap">{client.dietary_restrictions || "None specified"}</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
