"use client"

import { Logo } from "@/components/logo"
import { useEffect, useState } from "react"

export function LoadingScreen() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center space-y-6">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-lg font-medium">Cargando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="flex flex-col items-center space-y-6">
        <div className="animate-pulse">
          <Logo size="lg" />
        </div>
        <div className="flex flex-col items-center space-y-2">
          <div className="h-1 w-48 bg-muted overflow-hidden rounded-full">
            <div className="h-full bg-primary animate-progress" />
          </div>
          <p className="text-sm text-muted-foreground">Cargando...</p>
        </div>
      </div>
    </div>
  )
}
