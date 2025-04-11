import type React from "react"

export default function ClientsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <div className="min-h-screen bg-gray-50 dark:bg-gray-950">{children}</div>
}
