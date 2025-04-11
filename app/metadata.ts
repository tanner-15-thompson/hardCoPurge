import type { Metadata } from "next"

// Base metadata for the site
export const baseMetadata: Metadata = {
  title: {
    default: "HARD Fitness | Hyperpersonalized Plans for Every Level",
    template: "%s | HARD Fitness",
  },
  description: "AI-powered, expert-refined fitness and nutrition plans built for YOU, not the masses.",
  keywords: ["fitness", "personalized workout", "nutrition plan", "custom fitness", "AI fitness"],
  authors: [{ name: "HARD Fitness" }],
  creator: "HARD Fitness",
  publisher: "HARD Fitness",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://hardfitness.com",
    siteName: "HARD Fitness",
    title: "HARD Fitness | Hyperpersonalized Plans for Every Level",
    description: "AI-powered, expert-refined fitness and nutrition plans built for YOU, not the masses.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "HARD Fitness - Hyperpersonalized Plans for Every Level",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "HARD Fitness | Hyperpersonalized Plans for Every Level",
    description: "AI-powered, expert-refined fitness and nutrition plans built for YOU, not the masses.",
    images: ["/og-image.jpg"],
    creator: "@thehardco",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
}

// Generate metadata for specific pages
export function generateMetadata(title: string, description?: string): Metadata {
  return {
    title,
    description: description || baseMetadata.description,
    openGraph: {
      ...baseMetadata.openGraph,
      title,
      description: description || (baseMetadata.description as string),
    },
    twitter: {
      ...baseMetadata.twitter,
      title,
      description: description || (baseMetadata.description as string),
    },
  }
}
