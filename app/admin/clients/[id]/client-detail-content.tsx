"use client"

import Link from "next/link"
import { format, differenceInDays, parseISO, addMonths } from "date-fns"
import QuestionnaireView from "./questionnaire-view"

interface ClientDetailContentProps {
  client: any
  clientId: number
  questionnaire: any
  workoutCompletions: any[]
  mealCompletions: any[]
  paymentTrackingSetup: boolean
  phaseProgress: number
  overallGoalProgress: number
}

export function ClientDetailContent({
  client,
  clientId,
  questionnaire,
  workoutCompletions,
  mealCompletions,
  paymentTrackingSetup,
  phaseProgress,
  overallGoalProgress,
}: ClientDetailContentProps) {
  // Calculate next payment date (if we have payment data)
  let nextPaymentDate = null
  let daysUntilPayment = null

  if (client.last_payment_date && client.payment_frequency) {
    const lastPaymentDate = parseISO(client.last_payment_date)
    nextPaymentDate = addMonths(lastPaymentDate, client.payment_frequency)
    daysUntilPayment = differenceInDays(nextPaymentDate, new Date())
  }

  // Format the client's start date
  const startDate = client.created_at ? format(parseISO(client.created_at), "MMMM d, yyyy") : "Unknown"

  return (
    <div className="bg-white shadow-sm rounded-lg overflow-hidden mb-6">
      <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
        <h1 className="text-xl font-bold text-gray-800">{client.name} - Overview</h1>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Client Information Card */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">Client Information</h2>

            <div className="space-y-3">
              <div>
                <div className="text-xs text-gray-500 mb-1">Email Address</div>
                <div className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-gray-400 mr-2"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                  <a href={`mailto:${client.email}`} className="text-blue-600 hover:text-blue-800">
                    {client.email}
                  </a>
                </div>
              </div>

              {client.phone && (
                <div>
                  <div className="text-xs text-gray-500 mb-1">Phone Number</div>
                  <div className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-gray-400 mr-2"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                    </svg>
                    <a href={`tel:${client.phone}`} className="text-blue-600 hover:text-blue-800">
                      {client.phone}
                    </a>
                  </div>
                </div>
              )}

              <div>
                <div className="text-xs text-gray-500 mb-1">Client Since</div>
                <div className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-gray-400 mr-2"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-gray-700">{startDate}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Information Card */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">Payment Information</h2>

            {paymentTrackingSetup ? (
              <div className="space-y-3">
                {client.payment_amount ? (
                  <>
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Payment Amount</div>
                      <div className="flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-gray-400 mr-2"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span className="text-gray-700">${client.payment_amount.toFixed(2)}</span>
                        {client.payment_frequency && (
                          <span className="text-gray-500 ml-1">
                            / {client.payment_frequency === 1 ? "month" : `${client.payment_frequency} months`}
                          </span>
                        )}
                      </div>
                    </div>

                    {nextPaymentDate && (
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Next Payment Due</div>
                        <div className="flex items-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-gray-400 mr-2"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <span className="text-gray-700">{format(nextPaymentDate, "MMMM d, yyyy")}</span>
                          <span
                            className={`ml-2 px-2 py-1 text-xs rounded-full ${
                              daysUntilPayment < 0
                                ? "bg-red-100 text-red-800"
                                : daysUntilPayment < 7
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-green-100 text-green-800"
                            }`}
                          >
                            {daysUntilPayment < 0
                              ? `${Math.abs(daysUntilPayment)} days overdue`
                              : daysUntilPayment === 0
                                ? "Due today"
                                : `${daysUntilPayment} days left`}
                          </span>
                        </div>
                      </div>
                    )}

                    {client.last_payment_date && (
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Last Payment</div>
                        <div className="flex items-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-gray-400 mr-2"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <span className="text-gray-700">
                            {format(parseISO(client.last_payment_date), "MMMM d, yyyy")}
                          </span>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-gray-500 italic">No payment information available for this client yet</div>
                )}
              </div>
            ) : (
              <div className="text-gray-500 italic">
                Payment tracking is not set up.
                <Link href="/setup" className="ml-2 text-blue-600 hover:text-blue-800">
                  Set up payment tracking
                </Link>
              </div>
            )}
          </div>

          {/* Progress Section */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">Your Progress</h2>
            <div className="space-y-3">
              <div>
                <div className="text-xs text-gray-500 mb-1">Phase Progress</div>
                <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                  <div
                    className="bg-blue-600 h-2.5 rounded-full dark:bg-blue-500"
                    style={{ width: `${phaseProgress}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-500 mt-1">{phaseProgress}% towards the end of this phase</p>
              </div>

              <div>
                <div className="text-xs text-gray-500 mb-1">Overall Goal Progress</div>
                <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                  <div
                    className="bg-green-600 h-2.5 rounded-full dark:bg-green-500"
                    style={{ width: `${overallGoalProgress}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-500 mt-1">{overallGoalProgress}% towards your overall goal</p>
              </div>
            </div>
          </div>

          {/* Actions Card */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">Actions</h2>

            <div className="space-y-2">
              <Link
                href={`/admin/clients/${clientId}/questionnaire`}
                className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                    clipRule="evenodd"
                  />
                </svg>
                {questionnaire ? "Update Questionnaire" : "Add Questionnaire"}
              </Link>

              <Link
                href={`/admin/clients/${clientId}/edit`}
                className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2 text-gray-500"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                  <path
                    fillRule="evenodd"
                    d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"
                    clipRule="evenodd"
                  />
                </svg>
                Edit Client
              </Link>

              <button className="w-full flex items-center justify-center px-4 py-2 border border-red-300 rounded-md shadow-sm text-sm font-medium text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                Delete Client
              </button>
            </div>
          </div>
        </div>

        {/* Questionnaire Section */}
        {questionnaire ? (
          <div className="mt-6">
            <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
                  clipRule="evenodd"
                />
              </svg>
              Questionnaire Summary
            </h2>
            <QuestionnaireView questionnaire={questionnaire} clientId={clientId} />
          </div>
        ) : (
          <div className="mt-6 bg-gray-50 p-4 rounded-lg text-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 mx-auto text-gray-400"
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
            <h3 className="mt-2 text-sm font-medium text-gray-900">No questionnaire data</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by adding a questionnaire for this client.</p>
            <div className="mt-6">
              <Link
                href={`/admin/clients/${clientId}/questionnaire`}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="-ml-1 mr-2 h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                    clipRule="evenodd"
                  />
                </svg>
                Add Questionnaire
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
