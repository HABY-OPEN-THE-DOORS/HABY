"use client"

import type React from "react"

import { Suspense, useEffect, useState } from "react"

interface ClientOnlyProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

function ClientOnlyContent({ children }: { children: React.ReactNode }) {
  const [hasMounted, setHasMounted] = useState(false)

  useEffect(() => {
    setHasMounted(true)
  }, [])

  if (!hasMounted) {
    return null
  }

  return <>{children}</>
}

export function ClientOnly({ children, fallback = null }: ClientOnlyProps) {
  return (
    <Suspense fallback={fallback}>
      <ClientOnlyContent>{children}</ClientOnlyContent>
    </Suspense>
  )
}
