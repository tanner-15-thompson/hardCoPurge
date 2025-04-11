import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { MobileMenu } from "@/components/mobile-menu"

export function Header() {
  return (
    <header className="w-full bg-gradient-dynamic border-b border-purple-900/30">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center">
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

        <nav className="hidden md:flex items-center space-x-8">
          <Link href="/" className="text-sm font-medium hover:text-purple-400 transition-colors">
            Home
          </Link>
          <Link href="/services" className="text-sm font-medium hover:text-purple-400 transition-colors">
            Services
          </Link>
          <Link href="/examples" className="text-sm font-medium hover:text-purple-400 transition-colors">
            Sample Plans
          </Link>
          <Link href="/contact" className="text-sm font-medium hover:text-purple-400 transition-colors">
            Contact
          </Link>
        </nav>

        <Button
          asChild
          variant="outline"
          className="hidden md:inline-flex border-purple-900 text-purple-400 hover:bg-purple-950/20 glow"
        >
          <Link href="/contact">Claim Your Plan</Link>
        </Button>

        <MobileMenu />
      </div>
    </header>
  )
}
