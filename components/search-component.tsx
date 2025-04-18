"use client"

import { useSearchParams } from "next/navigation"

export function SearchComponent() {
  const searchParams = useSearchParams()
  const query = searchParams.get("q") || ""

  return (
    <div>
      <p>Current search query: {query}</p>
      {/* Rest of the component */}
    </div>
  )
}
