"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { ChevronLeft, ChevronRight } from 'lucide-react'

export type CalendarProps = {
  className?: string
  selected?: Date
  onSelect?: (date: Date | undefined) => void
  disabled?: boolean
  mode?: "single" | "range" | "multiple"
  showOutsideDays?: boolean
}

function Calendar({
  className,
  selected,
  onSelect,
  disabled = false,
  mode = "single",
  showOutsideDays = true,
}: CalendarProps) {
  const [currentMonth, setCurrentMonth] = React.useState(new Date())
  
  const handlePreviousMonth = () => {
    setCurrentMonth(prev => {
      const newDate = new Date(prev)
      newDate.setMonth(newDate.getMonth() - 1)
      return newDate
    })
  }
  
  const handleNextMonth = () => {
    setCurrentMonth(prev => {
      const newDate = new Date(prev)
      newDate.setMonth(newDate.getMonth() + 1)
      return newDate
    })
  }
  
  const handleDateSelect = (date: Date) => {
    if (onSelect) {
      onSelect(date)
    }
  }
  
  // Generate days for the current month
  const daysInMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth() + 1,
    0
  ).getDate()
  
  const firstDayOfMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth(),
    1
  ).getDay()
  
  const monthName = currentMonth.toLocaleString('default', { month: 'long' })
  const year = currentMonth.getFullYear()
  
  const days = []
  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  
  // Add empty cells for days before the first day of the month
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(<div key={`empty-${i}`} className="h-9 w-9"></div>)
  }
  
  // Add cells for each day of the month
  for (let i = 1; i <= daysInMonth; i++) {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i)
    const isSelected = selected && date.toDateString() === selected.toDateString()
    
    days.push(
      <Button
        key={`day-${i}`}
        variant={isSelected ? "default" : "ghost"}
        className={cn(
          "h-9 w-9 p-0 font-normal",
          isSelected && "bg-primary text-primary-foreground"
        )}
        disabled={disabled}
        onClick={() => handleDateSelect(date)}
      >
        {i}
      </Button>
    )
  }
  
  return (
    <div className={cn("p-3 border rounded-md", className)}>
      <div className="flex justify-between items-center mb-4">
        <Button
          variant="outline"
          className="h-7 w-7 p-0"
          onClick={handlePreviousMonth}
          disabled={disabled}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div className="font-medium">
          {monthName} {year}
        </div>
        <Button
          variant="outline"
          className="h-7 w-7 p-0"
          onClick={handleNextMonth}
          disabled={disabled}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekdays.map(day => (
          <div key={day} className="text-center text-sm text-muted-foreground">
            {day.charAt(0)}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {days}
      </div>
    </div>
  )
}

Calendar.displayName = "Calendar"

export { Calendar }
