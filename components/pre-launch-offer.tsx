import Link from "next/link"
import { CalendarClock, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"

export function PreLaunchOffer() {
  return (
    <div className="bg-gradient-to-r from-purple-950/50 to-black border border-purple-900/50 rounded-lg p-6 my-8">
      <div className="flex flex-col md:flex-row items-center gap-4">
        <div className="bg-purple-950 p-3 rounded-full">
          <Zap className="h-6 w-6 text-purple-400" />
        </div>

        <div className="flex-1">
          <h3 className="text-xl font-bold mb-1">Pre-Launch Special Offer</h3>
          <p className="text-gray-300">
            Be one of our first 20 clients and receive an{" "}
            <span className="text-green-400 font-bold">additional 10% off</span> your first 3 months + a free 30-minute
            consultation call.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <CalendarClock className="h-5 w-5 text-yellow-400" />
          <span className="text-yellow-400 font-medium">Limited Time Offer</span>
        </div>

        <Button asChild className="bg-purple-950 hover:bg-purple-900 text-white whitespace-nowrap">
          <Link href="/contact">Claim Now</Link>
        </Button>
      </div>
    </div>
  )
}
