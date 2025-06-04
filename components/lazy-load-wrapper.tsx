"use client"

import { useState, useEffect, type ReactNode } from "react"
import { useInView } from "react-intersection-observer"

interface LazyLoadWrapperProps {
  children: ReactNode
  height?: string | number
  width?: string | number
  threshold?: number
  placeholder?: ReactNode
  className?: string
  rootMargin?: string
  triggerOnce?: boolean
}

export function LazyLoadWrapper({
  children,
  height = "auto",
  width = "auto",
  threshold = 0.1,
  placeholder,
  className = "",
  rootMargin = "200px 0px",
  triggerOnce = true,
}: LazyLoadWrapperProps) {
  const [loaded, setLoaded] = useState(false)
  const { ref, inView } = useInView({
    threshold,
    rootMargin,
    triggerOnce,
  })

  useEffect(() => {
    if (inView && !loaded) {
      setLoaded(true)
    }
  }, [inView, loaded])

  return (
    <div
      ref={ref}
      className={className}
      style={{
        height: loaded ? "auto" : height,
        width: loaded ? "auto" : width,
        minHeight: typeof height === "number" ? `${height}px` : height,
        minWidth: typeof width === "number" ? `${width}px` : width,
      }}
    >
      {loaded ? children : placeholder || <div className="w-full h-full animate-pulse bg-muted rounded-md" />}
    </div>
  )
}
