"use client"

import { useState, useEffect } from "react"

interface LogoProps {
  className?: string
  width?: number
  height?: number
  showText?: boolean
  size?: "sm" | "md" | "lg" | "xl"
}

export function Logo({ className, width, height, showText = false, size = "md" }: LogoProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Calculate dimensions based on size prop if width/height not explicitly provided
  const getDimensions = () => {
    if (width && height) return { width, height }

    switch (size) {
      case "sm":
        return { width: 32, height: 32 }
      case "md":
        return { width: 48, height: 48 }
      case "lg":
        return { width: 64, height: 64 }
      case "xl":
        return { width: 120, height: 120 }
      default:
        return { width: 48, height: 48 }
    }
  }

  const { width: calculatedWidth, height: calculatedHeight } = getDimensions()

  // Evitar problemas de hidratación
  if (!mounted) {
    return <div style={{ width: calculatedWidth, height: calculatedHeight }} className={className} />
  }

  // Usar el nuevo logo único
  const logoSrc = "/images/Logo.png"

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="relative" style={{ width: calculatedWidth, height: calculatedHeight }}>
        <img
          src={logoSrc || "/placeholder.svg"}
          alt="HABY Logo"
          className="w-full h-full object-contain"
          width={calculatedWidth}
          height={calculatedHeight}
          onError={(e) => {
            // Si hay un error al cargar la imagen, usar un placeholder
            e.currentTarget.src = "/placeholder.svg"
          }}
        />
      </div>
      {showText && (
        <span
          className={`font-bold tracking-tight ${size === "xl" ? "text-3xl" : size === "lg" ? "text-2xl" : "text-xl"}`}
        >
          HABY
        </span>
      )}
    </div>
  )
}
