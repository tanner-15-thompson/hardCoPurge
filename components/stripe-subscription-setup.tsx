"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { loadStripe } from "@stripe/stripe-js"
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js"

// Make sure to initialize Stripe with the correct publishable key
// This should be outside the component to avoid recreating on each render
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "")

interface StripeSubscriptionSetupProps {
  clientId: number
  clientName: string
  clientEmail: string
}

export function StripeSubscriptionSetup({ clientId, clientName, clientEmail }: StripeSubscriptionSetupProps) {
  const [step, setStep] = useState<"initial" | "payment">("initial")
  const [amount, setAmount] = useState<number>(100)
  const [interval, setInterval] = useState<"month" | "year">("month")
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const router = useRouter()

  // Update the handleSubmit function to better handle the Stripe setup process
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // First, create a Stripe customer for this client if they don't have one
      const customerResponse = await fetch("/api/stripe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "create_customer",
          clientId,
          email: clientEmail,
          name: clientName,
        }),
      })

      if (!customerResponse.ok) {
        const data = await customerResponse.json()
        throw new Error(data.error || "Failed to create Stripe customer")
      }

      // Now, create a subscription for this customer
      const subscriptionResponse = await fetch("/api/stripe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "create_subscription",
          clientId,
          amount,
          interval,
          email: clientEmail,
          name: clientName,
        }),
      })

      if (!subscriptionResponse.ok) {
        const data = await subscriptionResponse.json()
        throw new Error(data.error || "Failed to create subscription")
      }

      const subscriptionData = await subscriptionResponse.json()

      // Check if we have a valid client secret
      if (!subscriptionData.clientSecret) {
        throw new Error("No client secret returned from the server")
      }

      console.log("Received client secret:", subscriptionData.clientSecret)
      setClientSecret(subscriptionData.clientSecret)
      setStep("payment")
    } catch (err: any) {
      console.error("Error setting up subscription:", err)
      setError(err.message || "An error occurred while setting up the subscription")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Set Up Automatic Payments</h2>

      {step === "initial" ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
              Payment Amount ($)
            </label>
            <input
              type="number"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              min="1"
              step="0.01"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label htmlFor="interval" className="block text-sm font-medium text-gray-700 mb-1">
              Billing Interval
            </label>
            <select
              id="interval"
              value={interval}
              onChange={(e) => setInterval(e.target.value as "month" | "year")}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="month">Monthly</option>
              <option value="year">Yearly</option>
            </select>
          </div>

          {error && <div className="text-red-600 text-sm">{error}</div>}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {loading ? "Setting up..." : "Set Up Subscription"}
          </button>
        </form>
      ) : (
        clientSecret && (
          <Elements stripe={stripePromise} options={{ clientSecret }}>
            <CheckoutForm clientId={clientId} />
          </Elements>
        )
      )}
    </div>
  )
}

// Update the CheckoutForm component to better handle Stripe Elements
function CheckoutForm({ clientId }: { clientId: number }) {
  const stripe = useStripe()
  const elements = useElements()
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!stripe || !elements) {
      // Stripe.js hasn't yet loaded.
      setMessage("Stripe is still loading. Please wait...")
      return
    }

    setLoading(true)
    setMessage("Processing payment...")

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/clients/${clientId}?payment_success=true`,
        },
        redirect: "if_required",
      })

      if (error) {
        console.error("Payment error:", error)
        setMessage(error.message || "An error occurred while processing your payment")
      } else if (paymentIntent && paymentIntent.status === "succeeded") {
        setMessage("Payment successful! Redirecting...")
        router.push(`/clients/${clientId}?payment_success=true`)
      } else {
        setMessage("Payment processing. Please wait...")
      }
    } catch (err: any) {
      console.error("Payment submission error:", err)
      setMessage(`Payment error: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {!stripe && <div className="text-sm text-gray-700">Loading Stripe...</div>}

      <PaymentElement />

      {message && (
        <div
          className={`text-sm p-2 rounded ${
            message.includes("successful") ? "bg-green-50 text-green-700" : "bg-yellow-50 text-yellow-700"
          }`}
        >
          {message}
        </div>
      )}

      <button
        type="submit"
        disabled={!stripe || loading}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
      >
        {loading ? "Processing..." : "Pay Now"}
      </button>
    </form>
  )
}
