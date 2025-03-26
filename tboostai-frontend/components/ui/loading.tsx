import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface LoadingProps {
  className?: string
  size?: number
}

export function Loading({ className, size = 24 }: LoadingProps) {
  return (
    <div className="flex items-center justify-center w-full h-full">
      <Loader2 
        className={cn("animate-spin text-muted-foreground", className)} 
        size={size}
      />
    </div>
  )
} 