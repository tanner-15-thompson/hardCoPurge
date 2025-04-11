"use client"

import type React from "react"

import Image from "next/image"
import { useState } from "react"
import { getSupabaseImageTransformUrl } from "@/lib/image-utils"

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  className = "",
  priority = false,
  style,
  fill = false,
  bucket = "fitness-images", // Default bucket name
}: {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  priority?: boolean
  style?: React.CSSProperties
  fill?: boolean
  bucket?: string
}) {
  const [isLoading, setIsLoading] = useState(true)

  // Check if the src is already a full URL or a Supabase path
  const imageUrl = src.startsWith("http") ? src : getSupabaseImageTransformUrl(bucket, src, width, height)

  return (
    <div className={`${className} ${isLoading ? "bg-gray-900 animate-pulse" : ""} relative overflow-hidden`}>
      <Image
        src={imageUrl || "/placeholder.svg"}
        alt={alt}
        fill={fill || (width === undefined && height === undefined)}
        width={!fill ? width : undefined}
        height={!fill ? height : undefined}
        className={`transition-opacity duration-500 ${isLoading ? "opacity-0" : "opacity-100"} object-cover`}
        style={style}
        priority={priority}
        onLoadingComplete={() => setIsLoading(false)}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />
    </div>
  )
}
