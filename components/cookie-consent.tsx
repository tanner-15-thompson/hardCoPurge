"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

export function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Check if user has already consented
    const hasConsented = localStorage.getItem("cookieConsent")
    if (!hasConsented) {
      // Show banner after a short delay
      const timer = setTimeout(() => {
        setIsVisible(true)
      }, 1500)

      return () => clearTimeout(timer)
    }
  }, [])

  const acceptAll = () => {
    localStorage.setItem("cookieConsent", "all")
    setIsVisible(false)
  }

  const acceptEssential = () => {
    localStorage.setItem("cookieConsent", "essential")
    setIsVisible(false)
  }

  const dismiss = () => {
    setIsVisible(false)
  }

  if (!isVisible) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-black/95 border-t border-purple-900/50 shadow-lg">
      <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-start md:items-center gap-4">
        <div className="flex-1">
          <h3 className="font-bold text-lg mb-1">Cookie Consent</h3>
          <p className="text-gray-300 text-sm">
            We use cookies to enhance your browsing experience, analyze site traffic, and personalize content. By
            clicking "Accept All", you consent to our use of cookies.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button onClick={acceptAll} className="bg-purple-950 hover:bg-purple-900 text-white">
            Accept All
          </Button>
          <Button onClick={acceptEssential} variant="outline" className="border-purple-900 text-purple-400">
            Essential Only
          </Button>
          <button onClick={dismiss} className="text-gray-400 hover:text-white p-2" aria-label="Dismiss">
            <X size={20} />
          </button>
        </div>
      </div>
    </div>
  )
}
