import type React from "react"
import { AdminNavigation } from "@/components/admin-navigation"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex">
      <AdminNavigation />
      <main className="flex-1 p-4">
        <div className="flex items-center justify-center min-h-screen">
          <div className="w-full max-w-5xl">{children}</div>
        </div>
      </main>
    </div>
  )
}
