"use client"

import { useState, useEffect } from "react"
import { CheckCircle, XCircle } from "lucide-react"

// Results data comparing generic vs custom programs for beginners
const beginnerData = {
  generic: {
    successRate: 12,
    consistencyRate: 6,
  },
  custom: {
    successRate: 76,
    consistencyRate: 72,
  },
}

// Results data comparing generic vs custom programs for advanced athletes
const advancedData = {
  generic: {
    successRate: 8,
    consistencyRate: 5,
  },
  custom: {
    successRate: 82,
    consistencyRate: 78,
  },
}

export function SuccessRateChart() {
  const [athleteType, setAthleteType] = useState("beginner")
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

  // Get the current results data based on athlete type
  const currentResults = athleteType === "beginner" ? beginnerData : advancedData

  return (
    <div className="section-style">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Success Rate Comparison</h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            See the difference in results between generic programs and HARD Fitness plans after 6 months
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="flex justify-center mb-6">
            <div className="inline-flex rounded-lg border border-purple-900/50 p-1 bg-black/50 backdrop-blur-sm">
              <button
                onClick={() => setAthleteType("beginner")}
                className={`px-4 py-2 rounded-md text-sm transition-colors ${
                  athleteType === "beginner"
                    ? "bg-purple-950 text-white"
                    : "bg-black hover:bg-purple-950/20 text-gray-300"
                }`}
              >
                New Athletes
              </button>
              <button
                onClick={() => setAthleteType("advanced")}
                className={`px-4 py-2 rounded-md text-sm transition-colors ${
                  athleteType === "advanced"
                    ? "bg-purple-950 text-white"
                    : "bg-black hover:bg-purple-950/20 text-gray-300"
                }`}
              >
                Experienced Athletes
              </button>
            </div>
          </div>

          {/* Results Comparison */}
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div className="bg-gradient-to-r from-red-950/20 to-black border border-red-900/50 rounded-lg p-6 backdrop-blur-sm">
              <h3 className="text-xl font-bold mb-4 text-center">Generic Programs</h3>

              <div className="flex items-center justify-center mb-6">
                <div className="relative w-32 h-32 flex items-center justify-center">
                  <svg className="w-full h-full" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="#4B5563"
                      strokeWidth="10"
                      strokeLinecap="round"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="#F87171"
                      strokeWidth="10"
                      strokeLinecap="round"
                      strokeDasharray={`${currentResults.generic.successRate * 2.83} 283`}
                      strokeDashoffset="0"
                      transform="rotate(-90 50 50)"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-3xl font-bold">{currentResults.generic.successRate}%</span>
                  </div>
                </div>
              </div>

              <p className="text-center text-gray-300 mb-6">
                {athleteType === "beginner"
                  ? "Percentage of clients who achieve their fitness goals"
                  : "Percentage of clients who break through plateaus"}
              </p>

              <div className="space-y-3">
                <div className="flex items-start">
                  <XCircle className="h-5 w-5 text-red-400 mr-2 flex-shrink-0 mt-0.5" />
                  <span>
                    {athleteType === "beginner"
                      ? "88% quit within 30 days due to lack of personalization"
                      : "92% hit severe plateaus within 3 months"}
                  </span>
                </div>
                <div className="flex items-start">
                  <XCircle className="h-5 w-5 text-red-400 mr-2 flex-shrink-0 mt-0.5" />
                  <span>
                    {athleteType === "beginner"
                      ? "92% feel overwhelmed by inappropriate exercise selection"
                      : "3.7x worse performance gains than personalized plans"}
                  </span>
                </div>
                <div className="flex items-start">
                  <XCircle className="h-5 w-5 text-red-400 mr-2 flex-shrink-0 mt-0.5" />
                  <span>
                    {athleteType === "beginner"
                      ? "Only 12% see meaningful results at 6 months"
                      : "Only 8% overcome plateaus with generic programming"}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-950/20 to-black border border-green-600/50 rounded-lg p-6 backdrop-blur-sm">
              <h3 className="text-xl font-bold mb-4 text-center">HARD Fitness Plans</h3>

              <div className="flex items-center justify-center mb-6">
                <div className="relative w-32 h-32 flex items-center justify-center">
                  <svg className="w-full h-full" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="#4B5563"
                      strokeWidth="10"
                      strokeLinecap="round"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="#34D399"
                      strokeWidth="10"
                      strokeLinecap="round"
                      strokeDasharray={`${currentResults.custom.successRate * 2.83} 283`}
                      strokeDashoffset="0"
                      transform="rotate(-90 50 50)"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-3xl font-bold">{currentResults.custom.successRate}%</span>
                  </div>
                </div>
              </div>

              <p className="text-center text-gray-300 mb-6">
                {athleteType === "beginner"
                  ? "Percentage of clients who achieve their fitness goals"
                  : "Percentage of clients who break through plateaus"}
              </p>

              <div className="space-y-3">
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-400 mr-2 flex-shrink-0 mt-0.5" />
                  <span>
                    {athleteType === "beginner"
                      ? "Personalized to your exact fitness level and goals"
                      : "Advanced periodization breaks through performance plateaus"}
                  </span>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-400 mr-2 flex-shrink-0 mt-0.5" />
                  <span>
                    {athleteType === "beginner"
                      ? "Clear progression path with appropriate challenges"
                      : "Specialized techniques for elite-level progression"}
                  </span>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-400 mr-2 flex-shrink-0 mt-0.5" />
                  <span>
                    {athleteType === "beginner" ? "76% success rate at 6 months" : "82% breakthrough rate at 6 months"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center text-gray-400 text-sm">
            <p>Based on data from 1,500+ clients across various fitness levels and goals</p>
          </div>
        </div>
      </div>
    </div>
  )
}
