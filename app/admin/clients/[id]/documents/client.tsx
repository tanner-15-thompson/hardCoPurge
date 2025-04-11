"use client"
import { format, parseISO } from "date-fns"
import FileUpload from "../file-upload"

interface ClientDocumentsClientProps {
  clientId: number
  clientName: string
  workoutHistory: any[]
  nutritionHistory: any[]
  documents: any[]
}

export function ClientDocumentsClient({
  clientId,
  clientName,
  workoutHistory,
  nutritionHistory,
  documents,
}: ClientDocumentsClientProps) {
  return (
    <div className="bg-white shadow-sm rounded-lg overflow-hidden mb-6">
      <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
        <h1 className="text-xl font-bold text-gray-800">{clientName} - Documents</h1>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Workout Plan History */}
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h2 className="text-lg font-semibold text-blue-800 mb-4">Workout Plan History</h2>

            {workoutHistory && workoutHistory.length > 0 ? (
              <div className="space-y-3">
                {workoutHistory.map((plan) => (
                  <div key={plan.id} className="bg-white p-3 rounded-lg border border-blue-200 shadow-sm">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-blue-700">
                          {plan.title || `Workout Plan ${format(parseISO(plan.created_at), "MMM d, yyyy")}`}
                        </h3>
                        <p className="text-sm text-gray-500">
                          Created: {format(parseISO(plan.created_at), "MMMM d, yyyy")}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                          onClick={() => {
                            // View plan functionality
                          }}
                        >
                          View
                        </button>
                        <button
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                          onClick={() => {
                            // Download plan functionality
                          }}
                        >
                          Download
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 bg-white rounded-lg border border-blue-200">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-12 w-12 mx-auto text-blue-300 mb-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <p className="text-blue-600">No workout plan history available</p>
              </div>
            )}
          </div>

          {/* Nutrition Plan History */}
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <h2 className="text-lg font-semibold text-green-800 mb-4">Nutrition Plan History</h2>

            {nutritionHistory && nutritionHistory.length > 0 ? (
              <div className="space-y-3">
                {nutritionHistory.map((plan) => (
                  <div key={plan.id} className="bg-white p-3 rounded-lg border border-green-200 shadow-sm">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-green-700">
                          {plan.title || `Nutrition Plan ${format(parseISO(plan.created_at), "MMM d, yyyy")}`}
                        </h3>
                        <p className="text-sm text-gray-500">
                          Created: {format(parseISO(plan.created_at), "MMMM d, yyyy")}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          className="text-green-600 hover:text-green-800 text-sm font-medium"
                          onClick={() => {
                            // View plan functionality
                          }}
                        >
                          View
                        </button>
                        <button
                          className="text-green-600 hover:text-green-800 text-sm font-medium"
                          onClick={() => {
                            // Download plan functionality
                          }}
                        >
                          Download
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 bg-white rounded-lg border border-green-200">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-12 w-12 mx-auto text-green-300 mb-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <p className="text-green-600">No nutrition plan history available</p>
              </div>
            )}
          </div>
        </div>

        {/* Other Documents */}
        <div className="mt-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Other Documents</h2>

          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <FileUpload clientId={clientId} />

            {documents && documents.length > 0 ? (
              <div className="mt-6 space-y-3">
                {documents.map((doc) => (
                  <div key={doc.id} className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-medium text-gray-700">{doc.file_name}</h3>
                        <p className="text-sm text-gray-500">
                          Uploaded: {format(parseISO(doc.uploaded_at), "MMMM d, yyyy")}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <a
                          href={doc.file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                          Download
                        </a>
                        <button
                          className="text-red-600 hover:text-red-800 text-sm font-medium"
                          onClick={() => {
                            // Delete document functionality
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-6 text-center py-6 bg-white rounded-lg border border-gray-200">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-12 w-12 mx-auto text-gray-300 mb-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <p className="text-gray-600">No documents uploaded yet</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
