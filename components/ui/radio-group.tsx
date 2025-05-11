"use client"

import * as React from "react"
import { Circle } from "lucide-react"
import { cn } from "@/lib/utils"

const RadioGroup = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { value?: string; onValueChange?: (value: string) => void }
>(({ className, value, onValueChange, ...props }, ref) => {
  return <div ref={ref} className={cn("grid gap-2", className)} {...props} />
})
RadioGroup.displayName = "RadioGroup"

interface RadioGroupItemProps extends React.InputHTMLAttributes<HTMLInputElement> {
  value: string
}

const RadioGroupItem = React.forwardRef<HTMLInputElement, RadioGroupItemProps>(
  ({ className, value, ...props }, ref) => {
    // Get the RadioGroup's value from context or props
    const groupContext = React.useContext(
      React.createContext<{ value?: string; onValueChange?: (value: string) => void }>({}),
    )
    const isSelected = groupContext.value === value

    const handleClick = () => {
      groupContext.onValueChange?.(value)
    }

    return (
      <div className="flex items-center space-x-2">
        <input
          ref={ref}
          type="radio"
          value={value}
          checked={isSelected}
          className="sr-only"
          onChange={() => {}}
          {...props}
        />
        <div
          onClick={handleClick}
          className={cn(
            "aspect-square h-4 w-4 rounded-full border border-primary text-primary ring-offset-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            isSelected && "border-2",
            className,
          )}
        >
          {isSelected && (
            <div className="flex items-center justify-center">
              <Circle className="h-2.5 w-2.5 fill-current text-current" />
            </div>
          )}
        </div>
      </div>
    )
  },
)
RadioGroupItem.displayName = "RadioGroupItem"

export { RadioGroup, RadioGroupItem }
