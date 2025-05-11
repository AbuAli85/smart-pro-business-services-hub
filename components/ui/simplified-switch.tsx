"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface SwitchProps extends React.InputHTMLAttributes<HTMLInputElement> {
  checked?: boolean
  onCheckedChange?: (checked: boolean) => void
}

const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
  ({ className, checked, onCheckedChange, ...props }, ref) => {
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      if (onCheckedChange) {
        onCheckedChange(event.target.checked)
      }
    }

    return (
      <label className={cn("relative inline-flex h-6 w-11 items-center rounded-full", className)}>
        <input
          type="checkbox"
          ref={ref}
          checked={checked}
          onChange={handleChange}
          className="peer sr-only"
          {...props}
        />
        <span
          className={cn(
            "absolute inset-0 cursor-pointer rounded-full transition-colors",
            checked ? "bg-primary" : "bg-input",
          )}
        />
        <span
          className={cn(
            "absolute left-1 top-1 h-4 w-4 rounded-full bg-background transition-transform",
            checked ? "translate-x-5" : "translate-x-0",
          )}
        />
      </label>
    )
  },
)

Switch.displayName = "Switch"

export { Switch }
