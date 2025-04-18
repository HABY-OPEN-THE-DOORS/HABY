import { Suspense } from "react"
import { SearchComponent } from "@/components/search-component"

export default function SearchPage() {
  return (
    <div>
      <h1>Search</h1>
      <Suspense fallback={<div>Loading search...</div>}>
        <SearchComponent />
      </Suspense>
    </div>
  )
}
