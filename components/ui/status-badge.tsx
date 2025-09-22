import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { CheckCircle, Clock, XCircle, AlertCircle } from "lucide-react"

interface StatusBadgeProps {
  status: "success" | "pending" | "error" | "warning"
  label: string
  className?: string
}

const statusConfig = {
  success: {
    icon: CheckCircle,
    className: "bg-green-100 text-green-800 border-green-200",
  },
  pending: {
    icon: Clock,
    className: "bg-yellow-100 text-yellow-800 border-yellow-200",
  },
  error: {
    icon: XCircle,
    className: "bg-red-100 text-red-800 border-red-200",
  },
  warning: {
    icon: AlertCircle,
    className: "bg-orange-100 text-orange-800 border-orange-200",
  },
}

export function StatusBadge({ status, label, className }: StatusBadgeProps) {
  const config = statusConfig[status]
  const Icon = config.icon

  return (
    <Badge className={cn(config.className, className)}>
      <Icon className="h-3 w-3 mr-1" />
      {label}
    </Badge>
  )
}
