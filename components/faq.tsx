"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"

// Structured FAQ data organized by categories
const faqCategories = [
  {
    category: "Plans & Services",
    questions: [
      {
        question: "How personalized are these plans really?",
        answer:
          "Extremely. We don't just ask about your goals—we dig into your schedule, equipment access, injury history, and preferences. Your plan is built from scratch for you, not adapted from a template. As you progress, the plan evolves with you.",
      },
      {
        question: "I've tried other fitness programs before. How is this different?",
        answer:
          "Most programs are designed for the masses. They assume everyone responds the same way to training and nutrition. HARD plans are built specifically for your body, your goals, and your life. We combine AI analysis with expert coaching to create truly personalized plans that adapt as you progress.",
      },
      {
        question: "Do I need a gym membership?",
        answer:
          "Not necessarily. We design your plan around the equipment you have access to—whether that's a fully equipped gym, basic home setup, or just your bodyweight. Your plan will maximize results with whatever you have available.",
      },
    ],
  },
  {
    category: "Results & Expectations",
    questions: [
      {
        question: "How long until I see results?",
        answer:
          "Most clients notice changes within the first 2-3 weeks, with significant progress by 4-6 weeks. The exact timeline depends on your starting point, goals, and consistency. We build your plan with realistic milestones to keep you motivated throughout your journey.",
      },
      {
        question: "What if I have an injury or medical condition?",
        answer:
          "We take your health history seriously. During the assessment process, we collect detailed information about any injuries or medical conditions. Your plan is designed to work around these limitations and, when appropriate, help rehabilitate injuries. However, we always recommend consulting with your healthcare provider before starting any fitness program.",
      },
      {
        question: "How much time do I need to commit each week?",
        answer:
          "Your time commitment depends on your goals and availability. During the assessment, you'll tell us how much time you can realistically commit, and we'll design your plan accordingly. Most clients spend between 3-6 hours per week on their fitness, but we can create effective plans for almost any schedule.",
      },
    ],
  },
  {
    category: "Pricing & Billing",
    questions: [
      {
        question: "How does the 75% off first month promotion work?",
        answer:
          "New clients receive 75% off their first month of any plan. This means you'll pay just $49 for the Workout Plan (normally $197), $62 for the Nutrition Plan (normally $247), or $99 for the Hybrid Plan (normally $397). After the first month, you'll be billed at the regular rate unless you cancel.",
      },
      {
        question: "Can I cancel my subscription?",
        answer:
          "Absolutely. There are no long-term contracts—you can cancel anytime. We're confident in our results, which is why we offer a satisfaction guarantee.",
      },
      {
        question: "Do you offer refunds if I'm not satisfied?",
        answer:
          "Yes, we offer a 14-day satisfaction guarantee. If you're not completely satisfied with your plan within the first 14 days, contact us for a full refund. We stand behind the quality of our services and want you to be confident in your investment.",
      },
    ],
  },
  {
    category: "Support & Communication",
    questions: [
      {
        question: "How do I get help if I have questions about my plan?",
        answer:
          "All plans include access to our client support system. You can email our team directly with any questions, and we typically respond within 24 hours. For urgent matters, we also offer priority support via phone.",
      },
      {
        question: "Can my plan be adjusted if it's not working for me?",
        answer:
          "Absolutely. We encourage feedback and make adjustments as needed. If certain exercises don't feel right or if you're struggling with any aspect of your plan, let us know and we'll modify it. Your success is our priority, and we're committed to finding what works best for you.",
      },
      {
        question: "Do you provide form checks or technique guidance?",
        answer:
          "Yes. You can email us videos of your exercises for form feedback. Additionally, all plans include access to our exercise library with detailed technique videos and cues for proper execution.",
      },
    ],
  },
]

export function FAQ() {
  const [openCategory, setOpenCategory] = useState<string | null>("Plans & Services")
  const [openQuestions, setOpenQuestions] = useState<{ [key: string]: number | null }>({
    "Plans & Services": 0,
    "Results & Expectations": null,
    "Pricing & Billing": null,
    "Support & Communication": null,
  })

  const toggleCategory = (category: string) => {
    setOpenCategory(openCategory === category ? null : category)
  }

  const toggleQuestion = (category: string, index: number) => {
    setOpenQuestions((prev) => ({
      ...prev,
      [category]: prev[category] === index ? null : index,
    }))
  }

  return (
    <div className="space-y-6">
      {faqCategories.map((categoryData) => (
        <div key={categoryData.category} className="card-style overflow-hidden">
          <button
            className="flex justify-between items-center w-full p-6 text-left bg-black/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-purple-900"
            onClick={() => toggleCategory(categoryData.category)}
            aria-expanded={openCategory === categoryData.category}
          >
            <h3 className="text-xl font-bold">{categoryData.category}</h3>
            {openCategory === categoryData.category ? (
              <ChevronUp className="h-5 w-5 text-purple-400 flex-shrink-0" />
            ) : (
              <ChevronDown className="h-5 w-5 text-purple-400 flex-shrink-0" />
            )}
          </button>

          {openCategory === categoryData.category && (
            <div className="p-6 space-y-4">
              {categoryData.questions.map((faq, index) => (
                <div
                  key={index}
                  className="border border-purple-900/30 rounded-lg overflow-hidden bg-black/30 backdrop-blur-sm"
                >
                  <button
                    className="flex justify-between items-center w-full p-4 text-left focus:outline-none focus:ring-2 focus:ring-purple-900"
                    onClick={() => toggleQuestion(categoryData.category, index)}
                    aria-expanded={openQuestions[categoryData.category] === index}
                  >
                    <h4 className="text-lg font-medium">{faq.question}</h4>
                    {openQuestions[categoryData.category] === index ? (
                      <ChevronUp className="h-4 w-4 text-purple-400 flex-shrink-0" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-purple-400 flex-shrink-0" />
                    )}
                  </button>

                  {openQuestions[categoryData.category] === index && (
                    <div className="p-4 pt-0 border-t border-purple-900/30 bg-black/30 backdrop-blur-sm">
                      <p className="text-gray-300">{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
