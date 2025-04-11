"use client"

import type React from "react"

import { useEffect, useState, useRef } from "react"

export function LazySection({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1 },
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => {
      observer.disconnect()
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      className={`transition-opacity duration-700 ${isVisible ? "opacity-100" : "opacity-0"} ${className}`}
    >
      {isVisible ? children : <div className="min-h-[200px]" />}
    </section>
  )
}
