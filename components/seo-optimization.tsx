"use client"

import Head from "next/head"
import { useRouter } from "next/router"

interface SEOProps {
  title?: string
  description?: string
  canonicalUrl?: string
  ogImage?: string
}

export function SEO({
  title = "HARD Fitness | Hyperpersonalized Plans for Every Level",
  description = "AI-powered, expert-refined fitness and nutrition plans built for YOU, not the masses.",
  canonicalUrl,
  ogImage = "/og-image.jpg",
}: SEOProps) {
  const router = useRouter()
  const fullUrl = canonicalUrl || `https://thehard.co${router.asPath}`

  return (
    <Head>
      {/* Primary Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={fullUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={`https://thehard.co${ogImage}`} />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={fullUrl} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={`https://thehard.co${ogImage}`} />
    </Head>
  )
}
