"use client"

import { useState, useEffect } from "react"
import Image from "next/image"

/**
 * Propiedades del componente Logo
 * @property {string} className - Clases CSS adicionales para el contenedor del logo
 * @property {number} width - Ancho del logo en píxeles
 * @property {number} height - Alto del logo en píxeles
 * @property {boolean} showText - Indica si se debe mostrar el texto junto al logo
 * @property {"sm" | "md" | "lg" | "xl"} size - Tamaño predefinido del logo
 * @property {boolean} showFullName - Indica si se debe mostrar el nombre completo (HABY-CLASS) o solo HABY
 */
interface LogoProps {
  className?: string
  width?: number
  height?: number
  showText?: boolean
  size?: "sm" | "md" | "lg" | "xl"
  showFullName?: boolean
}

/**
 * Componente Logo
 * Renderiza el logo de HABY-CLASS con opciones de personalización
 */
export function Logo({ className = "", width, height, showText = false, size = "md", showFullName = true }: LogoProps) {
  // Estado para controlar la hidratación del cliente
  const [mounted, setMounted] = useState(false)
  // Estado para manejar errores de carga de imagen
  const [imgError, setImgError] = useState(false)

  // Efecto para marcar cuando el componente está montado en el cliente
  useEffect(() => {
    setMounted(true)
  }, [])

  /**
   * Calcula las dimensiones del logo basado en el tamaño predefinido o valores explícitos
   * @returns {Object} Objeto con width y height calculados
   */
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

  // Evitar problemas de hidratación renderizando un placeholder hasta que el componente esté montado
  if (!mounted) {
    return <div style={{ width: calculatedWidth, height: calculatedHeight }} className={className} aria-hidden="true" />
  }

  // Ruta del logo oficial
  const logoSrc = "/images/logo-haby-oficial.png"
  // Texto a mostrar junto al logo
  const logoText = showFullName ? "HABY-CLASS" : "HABY"

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div
        className="relative"
        style={{ width: calculatedWidth, height: calculatedHeight }}
        role="img"
        aria-label="Logo de HABY-CLASS"
      >
        {/* Usar Next/Image para optimización automática */}
        {!imgError ? (
          <Image
            src={logoSrc || "/placeholder.svg"}
            alt="HABY-CLASS Logo Oficial"
            width={calculatedWidth}
            height={calculatedHeight}
            className="w-full h-full object-contain"
            onError={() => setImgError(true)}
            priority={true} // Cargar con prioridad para mejorar LCP
            sizes={`(max-width: 768px) ${calculatedWidth}px, ${calculatedWidth}px`}
            style={{
              maxWidth: "100%",
              height: "auto",
            }}
          />
        ) : (
          // Fallback en caso de error de carga
          <div
            className="w-full h-full flex items-center justify-center bg-gray-200 dark:bg-gray-800 rounded-md"
            aria-hidden="true"
          >
            <span className="text-lg font-bold">H</span>
          </div>
        )}
      </div>

      {/* Texto del logo, solo se muestra si showText es true */}
      {showText && (
        <span
          className={`font-bold tracking-tight ${size === "xl" ? "text-3xl" : size === "lg" ? "text-2xl" : "text-xl"}`}
        >
          {logoText}
        </span>
      )}
    </div>
  )
}
