import * as React from "react"
import { cn } from "@/lib/utils"

const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, type = "text", ...props }, ref) => {
  return (
    <input
      ref={ref}
      type={type}
      className={cn(
        "flex h-11 w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-sm text-white shadow-sm transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20",
        className
      )}
      {...props}
    />
  )
})
Input.displayName = "Input"

export { Input }
