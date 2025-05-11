"use client"

import type * as React from "react"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export function CalendarDateRangePicker({ className }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("grid gap-2", className)}>
      <Button id="date" variant={"outline"} size="sm" className={cn("w-[240px] justify-start text-left font-normal")}>
        <CalendarIcon className="mr-2 h-4 w-4" />
        <span>Date picker disabled</span>
      </Button>
    </div>
  )
}
