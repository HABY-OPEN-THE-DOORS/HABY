"use client"

import { useEffect, useState } from "react"
import { toast } from "@/hooks/use-toast"

interface PerformanceMetrics {
  fcp: number | null // First Contentful Paint
  lcp: number | null // Largest Contentful Paint
  fid: number | null // First Input Delay
  cls: number | null // Cumulative Layout Shift
  ttfb: number | null // Time to First Byte
}

export function PerformanceMonitor({ debug = false }: { debug?: boolean }) {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fcp: null,
    lcp: null,
    fid: null,
    cls: null,
    ttfb: null,
  })

  useEffect(() => {
    // Solo ejecutar en el cliente y en entornos que soporten la API de Performance
    if (typeof window === "undefined" || !("PerformanceObserver" in window)) return

    // Medir Time to First Byte (TTFB)
    const navigationEntries = performance.getEntriesByType("navigation") as PerformanceNavigationTiming[]
    if (navigationEntries.length > 0) {
      const ttfb = navigationEntries[0].responseStart
      setMetrics((prev) => ({ ...prev, ttfb }))
    }

    // Medir First Contentful Paint (FCP)
    const fcpObserver = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries()
      if (entries.length > 0) {
        const fcp = entries[0].startTime
        setMetrics((prev) => ({ ...prev, fcp }))
      }
    })
    fcpObserver.observe({ type: "paint", buffered: true })

    // Medir Largest Contentful Paint (LCP)
    const lcpObserver = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries()
      if (entries.length > 0) {
        const lastEntry = entries[entries.length - 1]
        const lcp = lastEntry.startTime
        setMetrics((prev) => ({ ...prev, lcp }))
      }
    })
    lcpObserver.observe({ type: "largest-contentful-paint", buffered: true })

    // Medir First Input Delay (FID)
    const fidObserver = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries()
      if (entries.length > 0) {
        const fid = entries[0].processingStart - entries[0].startTime
        setMetrics((prev) => ({ ...prev, fid }))
      }
    })
    fidObserver.observe({ type: "first-input", buffered: true })

    // Medir Cumulative Layout Shift (CLS)
    let clsValue = 0
    const clsObserver = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries()
      entries.forEach((entry) => {
        if (!entry.hadRecentInput) {
          // @ts-ignore - La propiedad value existe en LayoutShift pero TypeScript no la reconoce
          clsValue += entry.value
        }
      })
      setMetrics((prev) => ({ ...prev, cls: clsValue }))
    })
    clsObserver.observe({ type: "layout-shift", buffered: true })

    // Limpiar observadores
    return () => {
      fcpObserver.disconnect()
      lcpObserver.disconnect()
      fidObserver.disconnect()
      clsObserver.disconnect()
    }
  }, [])

  // Mostrar métricas en modo debug
  useEffect(() => {
    if (debug && metrics.lcp) {
      const allMetricsCollected = Object.values(metrics).every((metric) => metric !== null)
      if (allMetricsCollected) {
        console.table({
          "Time to First Byte (TTFB)": `${Math.round(metrics.ttfb || 0)}ms`,
          "First Contentful Paint (FCP)": `${Math.round(metrics.fcp || 0)}ms`,
          "Largest Contentful Paint (LCP)": `${Math.round(metrics.lcp || 0)}ms`,
          "First Input Delay (FID)": `${Math.round(metrics.fid || 0)}ms`,
          "Cumulative Layout Shift (CLS)": metrics.cls?.toFixed(3),
        })

        // Evaluar rendimiento
        const performanceIssues = []
        if ((metrics.lcp || 0) > 2500) performanceIssues.push("LCP alto (>2.5s)")
        if ((metrics.fid || 0) > 100) performanceIssues.push("FID alto (>100ms)")
        if ((metrics.cls || 0) > 0.1) performanceIssues.push("CLS alto (>0.1)")

        if (performanceIssues.length > 0) {
          toast({
            title: "Oportunidades de optimización",
            description: performanceIssues.join(", "),
            variant: "default",
          })
        }
      }
    }
  }, [metrics, debug])

  // Componente invisible - solo para monitoreo
  return null
}
