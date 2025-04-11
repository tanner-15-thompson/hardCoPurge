"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowRight } from "lucide-react"

export function CTASection() {
  const [email, setEmail] = useState("")
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send the email to your marketing system
    setSubmitted(true)
  }

  return (
    <section className="section-style">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Transform Your Fitness?</h2>

        <div className="mb-6 inline-block bg-green-900/20 px-6 py-3 rounded-lg border border-green-600/30 glow backdrop-blur-sm">
          <p className="text-xl text-green-400 font-bold">Limited Time: 75% OFF Your First Month</p>
        </div>

        {submitted ? (
          <div className="mt-8 card-style">
            <h3 className="text-xl font-bold text-purple-400 mb-2">Thank You!</h3>
            <p className="text-lg mb-4">We'll be in touch shortly with your personalized plan details.</p>
            <Button asChild className="bg-purple-950 hover:bg-purple-900 text-white glow">
              <Link href="/services">Explore Our Plans</Link>
            </Button>
          </div>
        ) : (
          <>
            <p className="text-xl text-gray-300 mb-8">
              Get started today with our expert-crafted, personalized plans at a special introductory price.
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-black/50 border-purple-900/30 focus:border-purple-400 backdrop-blur-sm"
                aria-label="Email address"
              />
              <Button type="submit" className="bg-purple-950 hover:bg-purple-900 text-white pulse-animation">
                Get Started <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </form>

            <p className="text-sm text-gray-500 mt-4">No spam, ever. Unsubscribe anytime.</p>
          </>
        )}
      </div>
    </section>
  )
}
