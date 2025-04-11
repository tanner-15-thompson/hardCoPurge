"use client"

import { useState, useEffect } from "react"
import { format, differenceInDays, parseISO } from "date-fns"
import Link from "next/link"

interface ClientPaymentStatusProps {
  clientId: number
  stripeSubscriptionId?: string | null
  lastPaymentDate?: string | null
  paymentAmount?: number | null
  paymentFrequency?: number | null
}

export function ClientPaymentStatus({
  clientId,
  stripeSubscriptionId,
  lastPaymentDate,
  paymentAmount,
  paymentFrequency,
}: ClientPaymentStatusProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [status, setStatus] = useState<string | null>(null)
  const [nextPaymentDate, setNextPaymentDate] = useState<Date | null>(null)
  const [daysUntilPayment, setDaysUntilPayment] = useState<number | null>(null)
  const [cancelAtPeriodEnd, setCancelAtPeriodEnd] = useState<boolean>(false)

  useEffect(() => {
    if (stripeSubscriptionId) {
      fetchPaymentStatus()
    } else if (lastPaymentDate && paymentFrequency) {
      // Calculate next payment date based on last payment and frequency
      const lastPayment = parseISO(lastPaymentDate)
      const next = new Date(lastPayment)
      next.setMonth(next.getMonth() + paymentFrequency)
      setNextPaymentDate(next)
      setDaysUntilPayment(differenceInDays(next, new Date()))
    }
  }, [clientId, stripeSubscriptionId, lastPaymentDate, paymentFrequency])

  const fetchPaymentStatus = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/stripe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "get_payment_status",
          clientId,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to fetch payment status")
      }

      const data = await response.json()
      setStatus(data.status)
      setNextPaymentDate(data.currentPeriodEnd ? parseISO(data.currentPeriodEnd) : null)
      setCancelAtPeriodEnd(data.cancelAtPeriodEnd)

      if (data.currentPeriodEnd) {
        setDaysUntilPayment(differenceInDays(parseISO(data.currentPeriodEnd), new Date()))
      }
    } catch (err: any) {
      console.error("Error fetching payment status:", err)
      setError(err.message || "An error occurred while fetching payment status")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="text-gray-500 italic">Loading payment information...</div>
  }

  if (error) {
    return <div className="text-red-600 text-sm">{error}</div>
  }

  if (!stripeSubscriptionId && (!lastPaymentDate || !paymentAmount)) {
    return (
      <div className="text-gray-500 italic">
        No payment information available for this client yet.
        <Link href={`/clients/${clientId}/payment`} className="ml-2 text-blue-600 hover:text-blue-800">
          Set up automatic payments
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {paymentAmount && (
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
            <span className="text-gray-700">${paymentAmount.toFixed(2)}</span>
            {paymentFrequency && (
              <span className="text-gray-500 ml-1">
                / {paymentFrequency === 1 ? "month" : `${paymentFrequency} months`}
              </span>
            )}
          </div>
        </div>
      )}

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
            {daysUntilPayment !== null && (
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
            )}
          </div>
        </div>
      )}

      {lastPaymentDate && (
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
            <span className="text-gray-700">{format(parseISO(lastPaymentDate), "MMMM d, yyyy")}</span>
          </div>
        </div>
      )}

      {status && (
        <div>
          <div className="text-xs text-gray-500 mb-1">Subscription Status</div>
          <div className="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-400 mr-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                clipRule="evenodd"
              />
            </svg>
            <span
              className={`px-2 py-1 text-xs rounded-full ${
                status === "active"
                  ? "bg-green-100 text-green-800"
                  : status === "past_due"
                    ? "bg-red-100 text-red-800"
                    : status === "trialing"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-gray-100 text-gray-800"
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1).replace("_", " ")}
              {cancelAtPeriodEnd && " (Canceling)"}
            </span>
          </div>
        </div>
      )}

      {stripeSubscriptionId && (
        <div className="mt-2">
          <Link
            href={`/clients/${clientId}/payment`}
            className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
                clipRule="evenodd"
              />
            </svg>
            Manage subscription
          </Link>
        </div>
      )}
    </div>
  )
}
