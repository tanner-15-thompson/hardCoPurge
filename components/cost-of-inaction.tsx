"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import Link from "next/link"
import { DollarSign, Clock, User, Utensils, TrendingDown } from "lucide-react"

// Financial data for cost comparison
const financialData = {
  personalTrainer: {
    monthlyCost: 580, // 8 sessions × $72.50
  },
  nutritionist: {
    monthlyCost: 220, // 2 sessions × $110
  },
  hardFitness: {
    hybridPlan: 397,
    firstMonthDiscount: 0.75, // 75% off first month
  },
}

export function CostOfInaction() {
  const [months, setMonths] = useState(6)
  const [isMobile, setIsMobile] = useState(false)

  // Check if the device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  // Calculate financial costs and savings
  const traditionalMonthlyCost = financialData.personalTrainer.monthlyCost + financialData.nutritionist.monthlyCost
  const traditionalCost = traditionalMonthlyCost * months

  const regularMonthlyPrice = financialData.hardFitness.hybridPlan
  const discountedFirstMonth = Math.round(regularMonthlyPrice * 0.25) // 75% off first month

  const hardFitnessCost = months === 0 ? 0 : discountedFirstMonth + regularMonthlyPrice * (months - 1)
  const savings = traditionalCost - hardFitnessCost

  return (
    <div className="card-style glow">
      <h2 className="text-3xl font-bold mb-6 text-center">The Cost Comparison</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Time slider */}
        <div className="md:col-span-3 flex flex-col items-center">
          <div className="flex items-center mb-2">
            <Clock className="h-5 w-5 mr-2 text-purple-400" />
            <span className="text-xl font-bold">{months} Months</span>
          </div>
          <Slider
            value={[months]}
            min={1}
            max={24}
            step={1}
            onValueChange={(value) => setMonths(value[0])}
            className="w-full max-w-md py-4"
          />
        </div>

        {/* Traditional approach */}
        <div className="p-4 border border-red-900/30 rounded-lg bg-red-950/10 backdrop-blur-sm flex flex-col items-center">
          <div className="flex items-center mb-3">
            <User className="h-5 w-5 mr-2 text-red-400" />
            <Utensils className="h-5 w-5 text-red-400" />
          </div>
          <h3 className="font-bold mb-1">Traditional</h3>
          <div className="text-3xl font-bold mb-1">${traditionalMonthlyCost}</div>
          <div className="text-sm text-gray-400">per month</div>
          <div className="mt-3 text-lg font-bold">${traditionalCost}</div>
          <div className="text-sm text-gray-400">total cost</div>
        </div>

        {/* HARD Fitness */}
        <div className="p-4 border border-purple-900/30 rounded-lg bg-purple-950/10 backdrop-blur-sm flex flex-col items-center">
          <div className="h-5 mb-3">
            <DollarSign className="h-5 w-5 text-purple-400" />
          </div>
          <h3 className="font-bold mb-1">HARD Fitness</h3>
          <div className="text-3xl font-bold mb-1">${regularMonthlyPrice}</div>
          <div className="text-sm text-gray-400">per month</div>
          <div className="mt-3 text-lg font-bold">${hardFitnessCost}</div>
          <div className="text-sm text-gray-400">total cost</div>
        </div>

        {/* Savings */}
        <div className="p-4 border border-green-600/30 rounded-lg bg-green-950/10 backdrop-blur-sm flex flex-col items-center">
          <div className="h-5 mb-3">
            <TrendingDown className="h-5 w-5 text-green-400" />
          </div>
          <h3 className="font-bold mb-1">You Save</h3>
          <div className="text-3xl font-bold text-green-400 mb-1">${savings}</div>
          <div className="text-sm text-gray-400">total savings</div>
          <Button asChild className="mt-3 w-full bg-purple-950 hover:bg-purple-900 text-white">
            <Link href="/contact">Claim Now</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
