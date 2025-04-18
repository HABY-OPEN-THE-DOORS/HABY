"use client"

import { usePathname } from "next/navigation"
import { Suspense, useEffect } from "react"

function AnalyticsContent() {
  const pathname = usePathname()

  useEffect(() => {
    // Aquí se implementaría la lógica de análisis
    // Por ejemplo, enviar datos a Google Analytics, Vercel Analytics, etc.
    const url = pathname

    // Ejemplo de registro de página vista
    console.log(`Página vista: ${url}`)

    // En una implementación real, aquí se llamaría a la API de análisis
    // analytics.pageView(url)
  }, [pathname])

  return null
}

export function Analytics() {
  return (
    <Suspense fallback={null}>
      <AnalyticsContent />
    </Suspense>
  )
}
