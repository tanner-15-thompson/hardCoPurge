"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import Link from "next/link"

const plans = {
  workout: { name: "HARD Workout Plan", price: 197, discountedPrice: 49 },
  nutrition: { name: "HARD Nutrition Plan", price: 247, discountedPrice: 62 },
  hybrid: { name: "HARD Hybrid Plan", price: 397, discountedPrice: 99 },
}

export function PricingCalculator() {
  const [selectedPlan, setSelectedPlan] = useState("hybrid")
  const [months, setMonths] = useState(3)

  const plan = plans[selectedPlan as keyof typeof plans]
  const firstMonthPrice = plan.discountedPrice
  const regularMonthlyPrice = plan.price
  const totalPrice = firstMonthPrice + regularMonthlyPrice * (months - 1)
  const savings = plan.price - plan.discountedPrice

  return (
    <div className="bg-black border border-purple-900/50 rounded-lg p-6 md:p-8">
      <h3 className="text-2xl font-bold mb-6">Calculate Your Investment</h3>

      <div className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium">Select Your Plan</label>
          <Select value={selectedPlan} onValueChange={setSelectedPlan}>
            <SelectTrigger className="bg-black border-purple-900/50">
              <SelectValue placeholder="Select a plan" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="workout">HARD Workout Plan</SelectItem>
              <SelectItem value="nutrition">HARD Nutrition Plan</SelectItem>
              <SelectItem value="hybrid">HARD Hybrid Plan (Best Value)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <label className="text-sm font-medium">Commitment Period</label>
            <span className="text-sm text-gray-400">{months} months</span>
          </div>
          <Slider
            value={[months]}
            min={1}
            max={12}
            step={1}
            onValueChange={(value) => setMonths(value[0])}
            className="py-4"
          />
          <div className="flex justify-between text-xs text-gray-400">
            <span>1 month</span>
            <span>6 months</span>
            <span>12 months</span>
          </div>
        </div>

        <div className="space-y-4 pt-4 border-t border-purple-900/30">
          <div className="flex justify-between">
            <span>First Month (75% off)</span>
            <span className="font-bold text-green-400">${firstMonthPrice.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Regular Monthly Price</span>
            <span>${regularMonthlyPrice.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Additional Months</span>
            <span>{months > 1 ? `${months - 1} × $${regularMonthlyPrice.toFixed(2)}` : "$0.00"}</span>
          </div>
          <div className="flex justify-between font-bold text-lg pt-2 border-t border-purple-900/30">
            <span>Total Investment</span>
            <span>${totalPrice.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-green-400">
            <span>You Save</span>
            <span>${savings.toFixed(2)}</span>
          </div>
        </div>

        <Button asChild className="w-full bg-purple-950 hover:bg-purple-900 text-white py-6 text-lg rounded-md mt-4">
          <Link href="/contact">Claim Your Plan</Link>
        </Button>
      </div>
    </div>
  )
}
