"use client"

import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"
import { AdminService } from "@/lib/admin-service"
import { useRouter } from "next/navigation"

export function AdminSignout() {
  const router = useRouter()

  const handleSignOut = () => {
    AdminService.signOut()
    router.push("/admin")
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleSignOut}
      className="text-gray-400 hover:text-white hover:bg-gray-800"
    >
      <LogOut className="h-4 w-4 mr-2" />
      Sign Out
    </Button>
  )
}
