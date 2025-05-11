"use client"

import * as React from "react"

// Simple utility function instead of importing cn from utils
const cn = (...classes: (string | undefined)[]) => classes.filter(Boolean).join(" ")

// Define types directly instead of importing
type InputOTPProps = React.InputHTMLAttributes<HTMLInputElement> & {
  length?: number
  onComplete?: (value: string) => void
  containerClassName?: string
}

type InputOTPSlotProps = React.HTMLAttributes<HTMLDivElement> & {
  char?: string
  hasFakeCaret?: boolean
  isActive?: boolean
}

export const InputOTP = React.forwardRef<HTMLDivElement, InputOTPProps>(
  ({ className, length = 6, onComplete, containerClassName, onChange, ...props }, ref) => {
    const [value, setValue] = React.useState<string[]>(Array(length).fill(""))
    const inputRefs = React.useRef<(HTMLInputElement | null)[]>([])

    const handleChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
      const newChar = e.target.value.slice(-1)
      if (newChar && /^[0-9a-zA-Z]$/.test(newChar)) {
        const newValue = [...value]
        newValue[index] = newChar
        setValue(newValue)

        // Move to next input
        if (index < length - 1 && newChar) {
          inputRefs.current[index + 1]?.focus()
        }

        // Call onComplete when all slots are filled
        if (newValue.every((v) => v) && onComplete) {
          onComplete(newValue.join(""))
        }

        // Call onChange if provided
        if (onChange) {
          const syntheticEvent = {
            ...e,
            target: {
              ...e.target,
              value: newValue.join(""),
            },
          } as React.ChangeEvent<HTMLInputElement>
          onChange(syntheticEvent)
        }
      }
    }

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
      // Handle backspace
      if (e.key === "Backspace") {
        if (value[index]) {
          const newValue = [...value]
          newValue[index] = ""
          setValue(newValue)
        } else if (index > 0) {
          inputRefs.current[index - 1]?.focus()
        }
      }

      // Handle left arrow
      if (e.key === "ArrowLeft" && index > 0) {
        inputRefs.current[index - 1]?.focus()
      }

      // Handle right arrow
      if (e.key === "ArrowRight" && index < length - 1) {
        inputRefs.current[index + 1]?.focus()
      }
    }

    return (
      <div ref={ref} className={cn("flex items-center gap-2", containerClassName)}>
        {Array.from({ length }).map((_, index) => (
          <div
            key={index}
            className={cn(
              "relative flex h-10 w-10 items-center justify-center border rounded-md",
              "border-input bg-background text-sm transition-all",
              "focus-within:ring-1 focus-within:ring-ring focus-within:border-input",
              className,
            )}
          >
            <input
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={1}
              value={value[index]}
              onChange={(e) => handleChange(index, e)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="absolute inset-0 w-full h-full text-center opacity-0"
              {...props}
            />
            <div className="text-base tabular-nums">
              {value[index] || <div className="h-4 w-px animate-caret-blink bg-foreground duration-1000" />}
            </div>
          </div>
        ))}
      </div>
    )
  },
)
InputOTP.displayName = "InputOTP"

export const InputOTPGroup = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn("flex items-center", className)} {...props} />,
)
InputOTPGroup.displayName = "InputOTPGroup"

export const InputOTPSlot = React.forwardRef<HTMLDivElement, InputOTPSlotProps>(
  ({ className, char, hasFakeCaret, isActive, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "relative flex h-10 w-10 items-center justify-center border rounded-md",
        "border-input bg-background text-sm transition-all",
        isActive && "ring-2 ring-ring ring-offset-background",
        className,
      )}
      {...props}
    >
      {char}
      {hasFakeCaret && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-4 w-px animate-caret-blink bg-foreground duration-1000" />
        </div>
      )}
    </div>
  ),
)
InputOTPSlot.displayName = "InputOTPSlot"

export const InputOTPSeparator = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} role="separator" className={className} {...props} />,
)
InputOTPSeparator.displayName = "InputOTPSeparator"
