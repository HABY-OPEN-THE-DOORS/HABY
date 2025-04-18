"use client"

import { useState } from "react"
import { Calendar } from "@/components/ui/calendar"
import { es } from "date-fns/locale"

export function ClientCalendar() {
  const [date, setDate] = useState<Date | undefined>(new Date())

  return <Calendar mode="single" selected={date} onSelect={setDate} locale={es} />
}
