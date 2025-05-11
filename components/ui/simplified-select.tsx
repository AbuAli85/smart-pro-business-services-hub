"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Check, ChevronDown } from "lucide-react"

interface SelectProps {
  children: React.ReactNode
  value?: string
  onValueChange?: (value: string) => void
  defaultValue?: string
  disabled?: boolean
  className?: string
}

interface SelectTriggerProps {
  children: React.ReactNode
  className?: string
  disabled?: boolean
}

interface SelectValueProps {
  placeholder?: string
  className?: string
}

interface SelectContentProps {
  children: React.ReactNode
  className?: string
  position?: "popper" | "item-aligned"
}

interface SelectItemProps {
  children: React.ReactNode
  value: string
  disabled?: boolean
  className?: string
}

const SelectContext = React.createContext<{
  value: string
  onValueChange: (value: string) => void
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  disabled: boolean
}>({
  value: "",
  onValueChange: () => {},
  open: false,
  setOpen: () => {},
  disabled: false,
})

export function Select({
  children,
  value,
  onValueChange,
  defaultValue = "",
  disabled = false,
  className,
}: SelectProps) {
  const [internalValue, setInternalValue] = React.useState(value || defaultValue)
  const [open, setOpen] = React.useState(false)

  React.useEffect(() => {
    if (value !== undefined) {
      setInternalValue(value)
    }
  }, [value])

  const handleValueChange = React.useCallback(
    (newValue: string) => {
      if (value === undefined) {
        setInternalValue(newValue)
      }
      if (onValueChange) {
        onValueChange(newValue)
      }
      setOpen(false)
    },
    [onValueChange, value],
  )

  return (
    <SelectContext.Provider
      value={{
        value: internalValue,
        onValueChange: handleValueChange,
        open,
        setOpen,
        disabled,
      }}
    >
      <div className={cn("relative inline-block w-full", className)}>{children}</div>
    </SelectContext.Provider>
  )
}

export function SelectTrigger({ children, className, disabled }: SelectTriggerProps) {
  const { open, setOpen, value, disabled: contextDisabled } = React.useContext(SelectContext)
  const isDisabled = disabled || contextDisabled

  return (
    <button
      type="button"
      className={cn(
        "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      onClick={() => !isDisabled && setOpen(!open)}
      disabled={isDisabled}
      aria-expanded={open}
    >
      {children}
      <ChevronDown className="h-4 w-4 opacity-50" />
    </button>
  )
}

export function SelectValue({ placeholder, className }: SelectValueProps) {
  const { value } = React.useContext(SelectContext)

  return <span className={cn("text-sm", className)}>{value || placeholder}</span>
}

export function SelectContent({ children, className, position = "popper" }: SelectContentProps) {
  const { open, setOpen } = React.useContext(SelectContext)
  const ref = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    if (open) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [open, setOpen])

  if (!open) return null

  return (
    <div
      ref={ref}
      className={cn(
        "absolute z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md",
        position === "popper" ? "w-full mt-1" : "top-full left-0 w-full mt-1",
        className,
      )}
    >
      <div className="p-1">{children}</div>
    </div>
  )
}

export function SelectItem({ children, value, disabled, className }: SelectItemProps) {
  const { value: selectedValue, onValueChange } = React.useContext(SelectContext)
  const isSelected = selectedValue === value

  return (
    <div
      className={cn(
        "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        isSelected ? "bg-accent text-accent-foreground" : "hover:bg-accent hover:text-accent-foreground",
        disabled && "pointer-events-none opacity-50",
        className,
      )}
      onClick={() => !disabled && onValueChange(value)}
      data-disabled={disabled ? "" : undefined}
      data-selected={isSelected ? "" : undefined}
    >
      <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
        {isSelected && <Check className="h-4 w-4" />}
      </span>
      {children}
    </div>
  )
}
