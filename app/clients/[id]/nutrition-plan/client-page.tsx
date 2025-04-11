"use client"

import { useRef } from "react"
import DOMPurify from "dompurify"

export default function ClientNutritionPlan({ nutritionHtml }: { nutritionHtml: string }) {
  const contentRef = useRef<HTMLDivElement>(null)

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
      <div
        ref={contentRef}
        className="nutrition-content prose dark:prose-invert max-w-none"
        dangerouslySetInnerHTML={{
          __html: DOMPurify.sanitize(nutritionHtml, {
            USE_PROFILES: { html: true },
            ADD_ATTR: ["target"],
          }),
        }}
      />
    </div>
  )
}
