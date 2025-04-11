import type React from "react"
import { Inter, Montserrat } from "next/font/google"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ThemeProvider } from "@/components/theme-provider"
import { FloatingCTA } from "@/components/floating-cta"
import { BackToTop } from "@/components/back-to-top"
import { CookieConsent } from "@/components/cookie-consent"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
})

export const metadata = {
  title: "HARD Fitness | Hyperpersonalized Plans for Every Level",
  description: "AI-powered, expert-refined fitness and nutrition plans built for YOU, not the masses.",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} ${montserrat.variable} min-h-screen flex flex-col bg-gradient-dynamic text-white texture-overlay grain-texture`}
      >
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange>
          <Header />
          {children}
          <Footer />
          <FloatingCTA />
          <BackToTop />
          <CookieConsent />
        </ThemeProvider>
      </body>
    </html>
  )
}


import './globals.css'