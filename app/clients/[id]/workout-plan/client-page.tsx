"use client"

import { useEffect, useRef, useState } from "react"
import DOMPurify from "dompurify"

export default function ClientWorkoutPlan({ workoutHtml }: { workoutHtml: string }) {
  const contentRef = useRef<HTMLDivElement>(null)
  const [isHighlighted, setIsHighlighted] = useState(false)

  useEffect(() => {
    if (!contentRef.current || !workoutHtml) return

    // Get today's day name and date
    const today = new Date()
    const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    const shortDayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
    const todayName = dayNames[today.getDay()]
    const todayShortName = shortDayNames[today.getDay()]
    const todayDayNum = today.getDate()
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ]
    const shortMonthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    const todayMonth = monthNames[today.getMonth()]
    const todayShortMonth = shortMonthNames[today.getMonth()]

    // Function to find and highlight today's workout
    const findAndHighlightToday = (attempt = 1) => {
      if (attempt > 5) return // Give up after 5 attempts

      console.log(`Attempt ${attempt} to find today's workout`)

      const container = contentRef.current
      if (!container) return

      // Different patterns to look for
      const patterns = [
        // Day name patterns
        { regex: new RegExp(`\\b${todayName}\\b`, "i"), score: 10 },
        { regex: new RegExp(`\\b${todayShortName}\\b`, "i"), score: 8 },

        // Date patterns
        { regex: new RegExp(`\\b${todayMonth}\\s+${todayDayNum}\\b`, "i"), score: 9 },
        { regex: new RegExp(`\\b${todayShortMonth}\\s+${todayDayNum}\\b`, "i"), score: 7 },
        { regex: new RegExp(`\\b${todayDayNum}\\s+${todayMonth}\\b`, "i"), score: 9 },
        { regex: new RegExp(`\\b${todayDayNum}\\s+${todayShortMonth}\\b`, "i"), score: 7 },

        // Day X pattern (where X is the day of week, 1-7)
        { regex: new RegExp(`\\bDay\\s+${today.getDay() + 1}\\b`, "i"), score: 6 },
        { regex: new RegExp(`\\bDay\\s+${todayName}\\b`, "i"), score: 6 },
      ]

      // Elements to check, in order of preference
      const elementTypes = [
        { selector: "h1, h2, h3, h4, h5, h6", bonus: 5 },
        { selector: "strong, b, th", bonus: 3 },
        { selector: "div, p, td, li", bonus: 0 },
      ]

      let bestMatch = null
      let highestScore = -1

      // Check each element type
      elementTypes.forEach(({ selector, bonus }) => {
        const elements = container.querySelectorAll(selector)

        elements.forEach((element) => {
          const text = element.textContent || ""

          // Check each pattern
          patterns.forEach(({ regex, score }) => {
            if (regex.test(text)) {
              const totalScore = score + bonus

              if (totalScore > highestScore) {
                highestScore = totalScore
                bestMatch = element
                console.log(`Found match: "${text}" with score ${totalScore}`)
              }
            }
          })
        })
      })

      // If we found a match, highlight it
      if (bestMatch) {
        // Find the best container to highlight
        let highlightElement = bestMatch

        // If it's a heading, try to highlight its parent or next sibling
        if (bestMatch.tagName.match(/^H[1-6]$/)) {
          // Try to find a container that follows this heading
          const nextElement = bestMatch.nextElementSibling

          // If there's a suitable container after the heading, use that
          if (
            nextElement &&
            (nextElement.tagName === "DIV" ||
              nextElement.tagName === "TABLE" ||
              nextElement.tagName === "UL" ||
              nextElement.tagName === "OL")
          ) {
            highlightElement = nextElement
          } else {
            // Otherwise, try to find a parent container
            const parent = bestMatch.parentElement
            if (parent && parent !== container) {
              highlightElement = parent
            }
          }
        }

        // Create a wrapper for the highlighted content
        const wrapper = document.createElement("div")
        wrapper.className = "today-workout-wrapper"
        highlightElement.parentNode?.insertBefore(wrapper, highlightElement)
        wrapper.appendChild(highlightElement)

        // Add the today banner
        const todayBanner = document.createElement("div")
        todayBanner.className = "today-banner"
        todayBanner.innerHTML = `
          <div class="today-banner-content">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="today-icon">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
            <span>TODAY'S WORKOUT</span>
          </div>
        `
        wrapper.insertBefore(todayBanner, highlightElement)

        // Create a marker element to scroll to (for better positioning)
        const scrollMarker = document.createElement("div")
        scrollMarker.className = "scroll-marker"
        wrapper.parentElement?.insertBefore(scrollMarker, wrapper)

        // Scroll to the element with a delay to ensure rendering is complete
        setTimeout(() => {
          scrollMarker.scrollIntoView({ behavior: "smooth", block: "start" })
          setIsHighlighted(true)
        }, 300)

        return true
      }

      // If no match found, try again after a delay
      setTimeout(() => {
        findAndHighlightToday(attempt + 1)
      }, attempt * 200) // Increase delay with each attempt

      return false
    }

    // Add styles for the highlighted section
    const style = document.createElement("style")
    style.textContent = `
      .today-workout-wrapper {
        margin: 24px 0;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      }
      
      .today-banner {
        background: linear-gradient(90deg, #9333ea, #6366f1);
        color: white;
        padding: 8px 16px;
        font-weight: bold;
      }
      
      .today-banner-content {
        display: flex;
        align-items: center;
      }
      
      .today-icon {
        margin-right: 8px;
        width: 18px;
        height: 18px;
      }
      
      .today-workout-wrapper > *:not(.today-banner) {
        border: 1px solid #e5e7eb;
        border-top: none;
        background-color: rgba(147, 51, 234, 0.05);
        padding: 16px;
      }
      
      .scroll-marker {
        position: relative;
        top: -100px;
        visibility: hidden;
        height: 0;
      }
      
      h1, h2, h3, h4, h5, h6, .today-workout-wrapper {
        scroll-margin-top: 100px;
      }
      
      /* Dark mode support */
      @media (prefers-color-scheme: dark) {
        .today-workout-wrapper > *:not(.today-banner) {
          border-color: #374151;
          background-color: rgba(147, 51, 234, 0.1);
        }
      }
    `
    document.head.appendChild(style)

    // Start looking for today's workout after a short delay
    setTimeout(() => {
      findAndHighlightToday()
    }, 300)

    return () => {
      // Clean up
      document.head.removeChild(style)
    }
  }, [workoutHtml])

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
      <div
        ref={contentRef}
        className="workout-content prose dark:prose-invert max-w-none"
        dangerouslySetInnerHTML={{
          __html: DOMPurify.sanitize(workoutHtml, {
            USE_PROFILES: { html: true },
            ADD_ATTR: ["target"],
          }),
        }}
      />
    </div>
  )
}
