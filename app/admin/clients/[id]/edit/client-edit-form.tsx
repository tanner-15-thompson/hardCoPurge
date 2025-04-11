"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

export function ClientEditForm({ client }: { client: any }) {
  const [name, setName] = useState(client.name || "")
  const [email, setEmail] = useState(client.email || "")
  const [phone, setPhone] = useState(client.phone || "")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const router = useRouter()
  const supabase = createClientComponentClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setSuccess("")

    try {
      // Update client in Supabase
      const { error } = await supabase
        .from("clients")
        .update({
          name,
          email,
          phone,
          updated_at: new Date().toISOString(),
        })
        .eq("id", client.id)

      if (error) {
        throw error
      }

      setSuccess("Client updated successfully!")

      // Refresh the page data
      router.refresh()

      // Redirect back to client details after a short delay
      setTimeout(() => {
        router.push(`/admin/clients/${client.id}`)
      }, 1500)
    } catch (err: any) {
      console.error("Error updating client:", err)
      setError(err.message || "Failed to update client")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          <p>{error}</p>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
          <p>{success}</p>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Phone</Label>
        <Input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
      </div>

      <div className="flex gap-4">
        <Button type="submit" disabled={isLoading} className="bg-purple-600 hover:bg-purple-700">
          {isLoading ? "Saving..." : "Save Changes"}
        </Button>

        <Button type="button" variant="outline" onClick={() => router.push(`/admin/clients/${client.id}`)}>
          Cancel
        </Button>
      </div>
    </form>
  )
}
