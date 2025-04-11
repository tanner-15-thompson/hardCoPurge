import Link from "next/link"
import Image from "next/image"

export function Footer() {
  return (
    <footer className="w-full bg-gradient-dynamic border-t border-purple-900/20 py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="mb-4 flex items-center justify-center">
            <div className="relative h-6 w-6 flex items-center justify-center">
              <Image
                src="https://jicxcoafjyfabdtpxqjl.supabase.co/storage/v1/object/public/images//HARDLOGOCROPPED%20-%20Copy.PNG"
                alt="HARD Fitness Logo"
                width={24}
                height={24}
                className="object-contain"
              />
            </div>
          </div>

          <div className="flex items-center justify-center mb-4">
            <Link
              href="https://instagram.com/thehardco"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-purple-400 transition-colors"
            >
              @thehardco
            </Link>
          </div>

          <p className="text-sm text-gray-400 max-w-md">In memory of my mom, who taught me to do hard things.</p>

          <div className="mt-6 text-xs text-gray-600">
            &copy; {new Date().getFullYear()} HARD Fitness. All rights reserved.
          </div>

          <div className="mt-4 flex gap-4">
            <Link href="/privacy-policy" className="text-xs text-gray-500 hover:text-purple-400 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms-of-service" className="text-xs text-gray-500 hover:text-purple-400 transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
