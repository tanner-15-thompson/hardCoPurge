"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

export function FloatingCTA() {
  const [isVisible, setIsVisible] = useState(false)
  const [isDismissed, setIsDismissed] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      // Show the CTA when user has scrolled 60% down the page
      const scrollPosition = window.scrollY
      const pageHeight = document.body.scrollHeight - window.innerHeight
      const scrollPercentage = (scrollPosition / pageHeight) * 100

      if (scrollPercentage > 60 && !isDismissed) {
        setIsVisible(true)
      }
    }

    window.addEventListener("scroll", handleScroll)

    // Set a timeout to show the CTA after 30 seconds regardless of scroll
    const timer = setTimeout(() => {
      if (!isDismissed) {
        setIsVisible(true)
      }
    }, 30000)

    return () => {
      window.removeEventListener("scroll", handleScroll)
      clearTimeout(timer)
    }
  }, [isDismissed])

  const handleDismiss = () => {
    setIsVisible(false)
    setIsDismissed(true)

    // Store in session storage so it doesn't appear again during this session
    sessionStorage.setItem("ctaDismissed", "true")
  }

  if (!isVisible) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-black/80 backdrop-blur-sm border-t border-purple-900/30 transform transition-transform duration-300 ease-in-out">
      <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex-1">
          <p className="font-bold text-lg mb-1">Limited Time Offer: 75% OFF Your First Month</p>
          <p className="text-gray-300 text-sm">Get your personalized fitness plan today!</p>
        </div>
        <div className="flex items-center gap-4">
          <Button
            asChild
            className="bg-purple-950 hover:bg-purple-900 text-white whitespace-nowrap pulse-animation glow"
          >
            <Link href="/contact">Claim Your Plan</Link>
          </Button>
          <button onClick={handleDismiss} className="text-gray-400 hover:text-white" aria-label="Dismiss notification">
            <X size={20} />
          </button>
        </div>
      </div>
    </div>
  )
}
