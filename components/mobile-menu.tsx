"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { X, Menu } from "lucide-react"

export function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false)

  const toggleMenu = () => setIsOpen(!isOpen)
  const closeMenu = () => setIsOpen(false)

  return (
    <div className="md:hidden">
      <Button variant="ghost" size="icon" onClick={toggleMenu} aria-label="Toggle menu">
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </Button>

      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black flex flex-col">
          <div className="flex items-center justify-between p-4 border-b border-purple-900/50">
            <Link href="/" className="flex items-center" onClick={closeMenu}>
              <div className="relative h-5 w-5 flex items-center justify-center">
                <Image
                  src="https://jicxcoafjyfabdtpxqjl.supabase.co/storage/v1/object/public/images//HARDLOGOCROPPED%20-%20Copy.PNG"
                  alt="HARD Fitness Logo"
                  width={20}
                  height={20}
                  className="object-contain"
                />
              </div>
              <span className="sr-only">HARD Fitness</span>
            </Link>
            <Button variant="ghost" size="icon" onClick={toggleMenu} aria-label="Close menu">
              <X size={24} />
            </Button>
          </div>

          <nav className="flex flex-col items-center justify-center flex-1 space-y-8 p-8">
            <Link href="/" className="text-xl font-medium hover:text-purple-400 transition-colors" onClick={closeMenu}>
              Home
            </Link>
            <Link
              href="/services"
              className="text-xl font-medium hover:text-purple-400 transition-colors"
              onClick={closeMenu}
            >
              Services
            </Link>
            <Link
              href="/examples"
              className="text-xl font-medium hover:text-purple-400 transition-colors"
              onClick={closeMenu}
            >
              Sample Plans
            </Link>
            <Link
              href="/contact"
              className="text-xl font-medium hover:text-purple-400 transition-colors"
              onClick={closeMenu}
            >
              Contact
            </Link>

            <Button
              asChild
              variant="outline"
              className="mt-8 border-purple-900 text-purple-400 hover:bg-purple-950/20 w-full"
              onClick={closeMenu}
            >
              <Link href="/contact">Claim Your Plan</Link>
            </Button>
          </nav>
        </div>
      )}
    </div>
  )
}
