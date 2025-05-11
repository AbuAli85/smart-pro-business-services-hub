"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface PopoverProps {
  children: React.ReactNode
  className?: string
}

interface PopoverTriggerProps {
  children: React.ReactNode
  asChild?: boolean
  className?: string
  onClick?: () => void
}

interface PopoverContentProps {
  children: React.ReactNode
  className?: string
  align?: "center" | "start" | "end"
  sideOffset?: number
}

const PopoverContext = React.createContext<{
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  triggerRef: React.RefObject<HTMLElement>
}>({
  open: false,
  setOpen: () => {},
  triggerRef: { current: null },
})

export function Popover({ children, className }: PopoverProps) {
  const [open, setOpen] = React.useState(false)
  const triggerRef = React.useRef<HTMLElement>(null)

  return (
    <PopoverContext.Provider value={{ open, setOpen, triggerRef }}>
      <div className={cn("relative inline-block", className)}>{children}</div>
    </PopoverContext.Provider>
  )
}

export function PopoverTrigger({ children, asChild = false, className, onClick }: PopoverTriggerProps) {
  const { open, setOpen, triggerRef } = React.useContext(PopoverContext)

  const handleClick = () => {
    setOpen(!open)
    if (onClick) onClick()
  }

  if (asChild) {
    return React.cloneElement(children as React.ReactElement, {
      ref: triggerRef,
      onClick: handleClick,
      "aria-expanded": open,
      "aria-haspopup": true,
      className: cn((children as React.ReactElement).props.className, className),
    })
  }

  return (
    <button
      type="button"
      className={className}
      onClick={handleClick}
      aria-expanded={open}
      aria-haspopup={true}
      ref={triggerRef as React.RefObject<HTMLButtonElement>}
    >
      {children}
    </button>
  )
}

export function PopoverContent({ children, className, align = "center", sideOffset = 4 }: PopoverContentProps) {
  const { open, triggerRef } = React.useContext(PopoverContext)
  const contentRef = React.useRef<HTMLDivElement>(null)
  const [position, setPosition] = React.useState({ top: 0, left: 0 })

  React.useEffect(() => {
    if (open && triggerRef.current && contentRef.current) {
      const triggerRect = triggerRef.current.getBoundingClientRect()
      const contentRect = contentRef.current.getBoundingClientRect()

      let left = 0
      if (align === "center") {
        left = triggerRect.left + triggerRect.width / 2 - contentRect.width / 2
      } else if (align === "start") {
        left = triggerRect.left
      } else if (align === "end") {
        left = triggerRect.right - contentRect.width
      }

      const top = triggerRect.bottom + sideOffset + window.scrollY

      setPosition({ top, left })
    }
  }, [open, align, sideOffset])

  if (!open) return null

  return (
    <div
      ref={contentRef}
      className={cn(
        "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none",
        className,
      )}
      style={{
        position: "absolute",
        top: `${position.top}px`,
        left: `${position.left}px`,
      }}
    >
      {children}
    </div>
  )
}
