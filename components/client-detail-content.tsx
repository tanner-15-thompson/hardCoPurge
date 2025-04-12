"use client"

import Link from "next/link"
import {
  User,
  FileText,
  Calendar,
  Clipboard,
  MessageSquare,
  FileSpreadsheet,
  CreditCard,
  FileQuestion,
  Lightbulb,
} from "lucide-react"

interface ClientDetailContentProps {
  client: any
}

export function ClientDetailContent({ client }: ClientDetailContentProps) {
  return (
    <div className="space-y-6">
      <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-white mb-2">{client.name}</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-300">
            <div className="flex items-center">
              <User className="h-5 w-5 text-purple-400 mr-2" />
              <span>ID: {client.id}</span>
            </div>
            <div className="flex items-center">
              <MessageSquare className="h-5 w-5 text-purple-400 mr-2" />
              <span>Email: {client.email}</span>
            </div>
            {client.phone && (
              <div className="flex items-center">
                <MessageSquare className="h-5 w-5 text-purple-400 mr-2" />
                <span>Phone: {client.phone}</span>
              </div>
            )}
            {client.created_at && (
              <div className="flex items-center">
                <Calendar className="h-5 w-5 text-purple-400 mr-2" />
                <span>Created: {new Date(client.created_at).toLocaleDateString()}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Link
          href={`/admin/clients/${client.id}/edit`}
          className="bg-gray-800 border border-gray-700 hover:border-purple-500 rounded-lg p-6 transition-colors"
        >
          <div className="flex flex-col items-center text-center">
            <User className="h-8 w-8 text-purple-400 mb-2" />
            <h3 className="text-lg font-semibold text-white">Edit Client</h3>
            <p className="text-gray-400 text-sm mt-1">Update client information</p>
          </div>
        </Link>

        <Link
          href={`/admin/clients/${client.id}/questionnaires`}
          className="bg-gray-800 border border-gray-700 hover:border-purple-500 rounded-lg p-6 transition-colors"
        >
          <div className="flex flex-col items-center text-center">
            <FileQuestion className="h-8 w-8 text-purple-400 mb-2" />
            <h3 className="text-lg font-semibold text-white">Questionnaires</h3>
            <p className="text-gray-400 text-sm mt-1">Manage client questionnaires</p>
          </div>
        </Link>

        <Link
          href={`/admin/clients/${client.id}/plans`}
          className="bg-gray-800 border border-gray-700 hover:border-purple-500 rounded-lg p-6 transition-colors"
        >
          <div className="flex flex-col items-center text-center">
            <Clipboard className="h-8 w-8 text-purple-400 mb-2" />
            <h3 className="text-lg font-semibold text-white">Plans</h3>
            <p className="text-gray-400 text-sm mt-1">Manage client plans</p>
          </div>
        </Link>

        <Link
          href={`/admin/clients/${client.id}/workout`}
          className="bg-gray-800 border border-gray-700 hover:border-purple-500 rounded-lg p-6 transition-colors"
        >
          <div className="flex flex-col items-center text-center">
            <FileText className="h-8 w-8 text-purple-400 mb-2" />
            <h3 className="text-lg font-semibold text-white">Workout</h3>
            <p className="text-gray-400 text-sm mt-1">Manage workout plans</p>
          </div>
        </Link>

        <Link
          href={`/admin/clients/${client.id}/nutrition`}
          className="bg-gray-800 border border-gray-700 hover:border-purple-500 rounded-lg p-6 transition-colors"
        >
          <div className="flex flex-col items-center text-center">
            <FileSpreadsheet className="h-8 w-8 text-purple-400 mb-2" />
            <h3 className="text-lg font-semibold text-white">Nutrition</h3>
            <p className="text-gray-400 text-sm mt-1">Manage nutrition plans</p>
          </div>
        </Link>

        <Link
          href={`/admin/clients/${client.id}/payment`}
          className="bg-gray-800 border border-gray-700 hover:border-purple-500 rounded-lg p-6 transition-colors"
        >
          <div className="flex flex-col items-center text-center">
            <CreditCard className="h-8 w-8 text-purple-400 mb-2" />
            <h3 className="text-lg font-semibold text-white">Payment</h3>
            <p className="text-gray-400 text-sm mt-1">Manage payment information</p>
          </div>
        </Link>

        <Link
          href={`/admin/clients/${client.id}/documents`}
          className="bg-gray-800 border border-gray-700 hover:border-purple-500 rounded-lg p-6 transition-colors"
        >
          <div className="flex flex-col items-center text-center">
            <FileText className="h-8 w-8 text-purple-400 mb-2" />
            <h3 className="text-lg font-semibold text-white">Documents</h3>
            <p className="text-gray-400 text-sm mt-1">Manage client documents</p>
          </div>
        </Link>

        <Link
          href={`/admin/clients/${client.id}/prompt-generator`}
          className="bg-gray-800 border border-gray-700 hover:border-purple-500 rounded-lg p-6 transition-colors"
        >
          <div className="flex flex-col items-center text-center">
            <Lightbulb className="h-8 w-8 text-purple-400 mb-2" />
            <h3 className="text-lg font-semibold text-white">Prompt Generator</h3>
            <p className="text-gray-400 text-sm mt-1">Generate AI prompts</p>
          </div>
        </Link>
      </div>
    </div>
  )
}
