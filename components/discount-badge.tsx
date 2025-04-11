import { Badge } from "@/components/ui/badge"

interface DiscountBadgeProps {
  originalPrice: number
  discountPercentage: number
  className?: string
}

export function DiscountBadge({ originalPrice, discountPercentage, className = "" }: DiscountBadgeProps) {
  const discountedPrice = originalPrice * (1 - discountPercentage / 100)

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <p className="text-2xl font-bold text-purple-400">
        ${discountedPrice.toFixed(0)}/month
        <span className="text-sm text-gray-400 line-through ml-2">${originalPrice}/month</span>
      </p>
      <Badge className="bg-green-600 hover:bg-green-700 text-white">SAVE {discountPercentage}%</Badge>
    </div>
  )
}
