import type React from "react"
import Link from "next/link"

export default function ClientsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-800">
            <Link href="/crm" className="hover:text-blue-600 transition-colors">
              <span className="text-blue-600">HARD</span> CRM
            </Link>
          </h1>
          <nav>
            <ul className="flex space-x-6">
              <li>
                <Link href="/crm" className="text-gray-600 hover:text-blue-600 transition-colors">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/clients" className="text-gray-600 hover:text-blue-600 transition-colors">
                  Clients
                </Link>
              </li>
              <li>
                <Link href="/clients/new" className="text-gray-600 hover:text-blue-600 transition-colors">
                  Add Client
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">{children}</main>
      <footer className="bg-white border-t border-gray-200 py-4">
        <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} HARD Fitness CRM
        </div>
      </footer>
    </div>
  )
}
