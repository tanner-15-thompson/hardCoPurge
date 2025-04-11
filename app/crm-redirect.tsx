"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function CRMRedirect() {
  const router = useRouter()

  useEffect(() => {
    router.push("/admin/clients")
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-500">Redirecting to Admin CRM...</p>
    </div>
  )
}
