"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

export function StripeDebugInfo() {
  const [showDebug, setShowDebug] = useState(false)
  const [stripeInfo, setStripeInfo] = useState<any>(null)

  const checkStripeConfig = async () => {
    try {
      // Check if the Stripe publishable key is set
      const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY

      setStripeInfo({
        publishableKeyExists: !!publishableKey,
        publishableKeyPrefix: publishableKey ? publishableKey.substring(0, 8) + "..." : "Not set",
        environment: process.env.NODE_ENV,
        timestamp: new Date().toISOString(),
      })
    } catch (error) {
      setStripeInfo({ error: "Failed to check Stripe configuration" })
    }
  }

  return (
    <div className="mt-4 border-t pt-4">
      <Button
        variant="outline"
        size="sm"
        onClick={() => {
          setShowDebug(!showDebug)
          if (!showDebug) checkStripeConfig()
        }}
      >
        {showDebug ? "Hide Debug Info" : "Show Debug Info"}
      </Button>

      {showDebug && stripeInfo && (
        <div className="mt-2 p-3 bg-gray-50 rounded text-xs font-mono">
          <pre>{JSON.stringify(stripeInfo, null, 2)}</pre>
        </div>
      )}
    </div>
  )
}
