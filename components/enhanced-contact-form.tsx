"use client"

import type React from "react"

import { useState } from "react"
import { ButtonWithLoading } from "@/components/ui/button-with-loading"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { CheckCircle2, AlertCircle } from "lucide-react"
import { submitContactForm } from "@/app/actions/contact-form"

export function EnhancedContactForm() {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    phone: "",
    goal: "",
    experience: "",
    message: "",
    preferredContact: "email",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [error, setError] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormState((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (field: string, value: string) => {
    setFormState((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    // Create FormData object
    const formData = new FormData()
    Object.entries(formState).forEach(([key, value]) => {
      formData.append(key, value)
    })

    try {
      // Submit form using server action
      const result = await submitContactForm(formData)

      setIsSubmitting(false)

      if (result.success) {
        setIsSubmitted(true)
        setFormState({
          name: "",
          email: "",
          phone: "",
          goal: "",
          experience: "",
          message: "",
          preferredContact: "email",
        })
      } else {
        // Handle error
        setError(result.message || "Something went wrong. Please try again.")
      }
    } catch (error) {
      setIsSubmitting(false)
      setError("Failed to submit form. Please try again later.")
    }
  }

  const nextStep = () => {
    setCurrentStep(currentStep + 1)
  }

  const prevStep = () => {
    setCurrentStep(currentStep - 1)
  }

  return (
    <div className="card-style">
      {isSubmitted ? (
        <div className="text-center py-12">
          <div className="flex justify-center mb-4">
            <div className="bg-green-900/30 p-4 rounded-full">
              <CheckCircle2 className="h-12 w-12 text-green-400" />
            </div>
          </div>
          <h2 className="text-2xl font-bold mb-4 text-purple-400">Thank You!</h2>
          <p className="text-lg mb-6">
            We've received your information and will contact you shortly to get you started on your fitness journey.
          </p>
          <p className="text-sm text-gray-300 mb-6">We'll be in touch via your preferred contact method soon.</p>
          <ButtonWithLoading
            onClick={() => {
              setIsSubmitted(false)
              setCurrentStep(1)
            }}
            className="bg-purple-950 hover:bg-purple-900 text-white glow"
          >
            Submit Another Request
          </ButtonWithLoading>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-950/20 border border-red-900/30 text-red-400 p-4 rounded-lg flex items-start backdrop-blur-sm">
              <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Error</p>
                <p>{error}</p>
              </div>
            </div>
          )}

          {/* Progress indicator */}
          <div className="mb-8">
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium">Basic Info</span>
              <span className="text-sm font-medium">Fitness Goals</span>
              <span className="text-sm font-medium">Final Details</span>
            </div>
            <div className="w-full bg-gray-800/50 h-2 rounded-full backdrop-blur-sm">
              <div
                className="bg-purple-400 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / 3) * 100}%` }}
              ></div>
            </div>
          </div>

          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formState.name}
                  onChange={handleChange}
                  placeholder="Your name"
                  required
                  className="bg-black/50 border-purple-900/30 backdrop-blur-sm"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formState.email}
                  onChange={handleChange}
                  placeholder="your.email@example.com"
                  required
                  className="bg-black/50 border-purple-900/30 backdrop-blur-sm"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone (Optional)</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formState.phone}
                  onChange={handleChange}
                  placeholder="(123) 456-7890"
                  className="bg-black/50 border-purple-900/30 backdrop-blur-sm"
                />
              </div>

              <div className="space-y-2">
                <Label>Preferred Contact Method</Label>
                <RadioGroup
                  value={formState.preferredContact}
                  onValueChange={(value) => handleSelectChange("preferredContact", value)}
                  className="flex space-x-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="email" id="contact-email" />
                    <Label htmlFor="contact-email" className="cursor-pointer">
                      Email
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="phone" id="contact-phone" />
                    <Label htmlFor="contact-phone" className="cursor-pointer">
                      Phone
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="pt-4 flex justify-end">
                <ButtonWithLoading
                  type="button"
                  onClick={nextStep}
                  className="bg-purple-950 hover:bg-purple-900 text-white glow"
                >
                  Next Step
                </ButtonWithLoading>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="goal">Your Fitness Goals</Label>
                <Input
                  id="goal"
                  name="goal"
                  value={formState.goal}
                  onChange={handleChange}
                  placeholder="Describe your fitness goals in detail"
                  required
                  className="bg-black/50 border-purple-900/30 backdrop-blur-sm"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="experience">Fitness Experience Level</Label>
                <Select
                  value={formState.experience}
                  onValueChange={(value) => handleSelectChange("experience", value)}
                  required
                >
                  <SelectTrigger className="bg-black/50 border-purple-900/30 backdrop-blur-sm">
                    <SelectValue placeholder="Select your experience level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner (0-1 years)</SelectItem>
                    <SelectItem value="intermediate">Intermediate (1-3 years)</SelectItem>
                    <SelectItem value="advanced">Advanced (3+ years)</SelectItem>
                    <SelectItem value="athlete">Competitive Athlete</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="pt-4 flex justify-between">
                <ButtonWithLoading
                  type="button"
                  onClick={prevStep}
                  variant="outline"
                  className="border-purple-900/30 text-purple-400"
                >
                  Previous Step
                </ButtonWithLoading>
                <ButtonWithLoading
                  type="button"
                  onClick={nextStep}
                  className="bg-purple-950 hover:bg-purple-900 text-white glow"
                >
                  Next Step
                </ButtonWithLoading>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="message">Additional Information</Label>
                <Textarea
                  id="message"
                  name="message"
                  value={formState.message}
                  onChange={handleChange}
                  placeholder="Tell us about your preferred training style, any injuries or limitations, equipment access, and specific approaches you enjoy or dislike."
                  className="bg-black/50 border-purple-900/30 backdrop-blur-sm min-h-[120px]"
                />
              </div>

              <div className="bg-purple-950/20 p-4 rounded-lg border border-purple-900/30 backdrop-blur-sm">
                <h3 className="font-bold mb-2">What Happens Next?</h3>
                <p className="text-gray-300 text-sm">
                  After submitting this form, you'll receive a confirmation email. One of our fitness experts will
                  contact you within 24 hours to schedule your consultation call.
                </p>
              </div>

              <div className="pt-4 flex justify-between">
                <ButtonWithLoading
                  type="button"
                  onClick={prevStep}
                  variant="outline"
                  className="border-purple-900/30 text-purple-400"
                >
                  Previous Step
                </ButtonWithLoading>
                <ButtonWithLoading
                  type="submit"
                  disabled={isSubmitting}
                  loadingText="Submitting..."
                  className="bg-purple-950 hover:bg-purple-900 text-white pulse-animation glow"
                >
                  Submit
                </ButtonWithLoading>
              </div>
            </div>
          )}

          <p className="text-xs text-gray-400 text-center mt-4">
            By submitting this form, you agree to be contacted about HARD Fitness services.
          </p>
        </form>
      )}
    </div>
  )
}
