"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Dumbbell, Utensils, FileText, ClipboardList, FileQuestion } from "lucide-react"

interface ClientHeaderNavProps {
  clientId: number
  clientName: string
}

export function ClientHeaderNav({ clientId, clientName }: ClientHeaderNavProps) {
  const pathname = usePathname()

  const isActive = (path: string) => {
    return pathname === `/admin/clients/${clientId}${path}`
  }

  return (
    <div className="bg-gray-800 shadow-sm rounded-lg overflow-hidden mb-6">
      <div className="border-b border-gray-700 bg-gray-900 px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-white">{clientName}</h1>
          <Link
            href="/admin/clients"
            className="text-sm font-medium text-purple-400 hover:text-purple-300 flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                clipRule="evenodd"
              />
            </svg>
            Back to Clients
          </Link>
        </div>
      </div>

      <div className="flex border-b border-gray-700 overflow-x-auto">
        <Link
          href={`/admin/clients/${clientId}`}
          className={`flex items-center px-6 py-3 text-sm font-medium border-b-2 whitespace-nowrap ${
            isActive("")
              ? "border-purple-500 text-purple-400"
              : "border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-600"
          }`}
        >
          <ClipboardList className="h-5 w-5 mr-2" />
          Client Overview
        </Link>

        <Link
          href={`/admin/clients/${clientId}/workout`}
          className={`flex items-center px-6 py-3 text-sm font-medium border-b-2 whitespace-nowrap ${
            isActive("/workout")
              ? "border-purple-500 text-purple-400"
              : "border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-600"
          }`}
        >
          <Dumbbell className="h-5 w-5 mr-2" />
          Current Workout
        </Link>

        <Link
          href={`/admin/clients/${clientId}/nutrition`}
          className={`flex items-center px-6 py-3 text-sm font-medium border-b-2 whitespace-nowrap ${
            isActive("/nutrition")
              ? "border-purple-500 text-purple-400"
              : "border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-600"
          }`}
        >
          <Utensils className="h-5 w-5 mr-2" />
          Current Nutrition
        </Link>

        <Link
          href={`/admin/clients/${clientId}/questionnaires`}
          className={`flex items-center px-6 py-3 text-sm font-medium border-b-2 whitespace-nowrap ${
            isActive("/questionnaires")
              ? "border-purple-500 text-purple-400"
              : "border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-600"
          }`}
        >
          <FileQuestion className="h-5 w-5 mr-2" />
          Questionnaires
        </Link>

        <Link
          href={`/admin/clients/${clientId}/documents`}
          className={`flex items-center px-6 py-3 text-sm font-medium border-b-2 whitespace-nowrap ${
            isActive("/documents")
              ? "border-purple-500 text-purple-400"
              : "border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-600"
          }`}
        >
          <FileText className="h-5 w-5 mr-2" />
          Past Documents
        </Link>
      </div>
    </div>
  )
}
