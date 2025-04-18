"use client"

import type React from "react"

import { useSearchParams } from "next/navigation"
import { Suspense } from "react"

interface ClientSearchParamsProps {
  children: (params: URLSearchParams) => React.ReactNode
}

export function ClientSearchParams({ children }: ClientSearchParamsProps) {
  const searchParams = useSearchParams()
  return <>{children(searchParams)}</>
}

export function SearchParamsProvider({
  children,
  fallback = null,
}: {
  children: React.ReactNode
  fallback?: React.ReactNode
}) {
  return <Suspense fallback={fallback}>{children}</Suspense>
}
