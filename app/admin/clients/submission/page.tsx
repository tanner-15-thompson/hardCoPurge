import { ClientSubmissionForm } from "@/components/client-submission-form"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"

export default function ClientSubmissionPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <Link
          href="/admin/clients"
          className="inline-flex items-center text-sm font-medium text-purple-400 hover:text-purple-300"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Clients
        </Link>
      </div>

      <div className="max-w-2xl mx-auto bg-gray-800 rounded-lg shadow-md p-6 border border-gray-700">
        <h1 className="text-2xl font-bold text-white mb-6">Client Submission Form</h1>
        <p className="text-gray-300 mb-6">
          Use this form to create a new client from a submission. All fields marked with an asterisk (*) are required.
        </p>

        <ClientSubmissionForm />
      </div>
    </div>
  )
}
