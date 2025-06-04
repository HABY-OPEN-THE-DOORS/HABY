"use client"

import { useState, useEffect } from "react"
import Image, { type ImageProps } from "next/image"
import { cn } from "@/lib/utils"

interface OptimizedImageProps extends Omit<ImageProps, "onLoadingComplete"> {
  lowQualitySrc?: string
  aspectRatio?: number
  fadeIn?: boolean
}

export function OptimizedImage({
  src,
  alt,
  lowQualitySrc,
  aspectRatio,
  fadeIn = true,
  className,
  fill,
  ...props
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [error, setError] = useState(false)

  // Calcular altura basada en aspect ratio si no es fill y se proporciona width y aspectRatio
  const calculatedHeight =
    !fill && props.width && aspectRatio ? Math.round(Number(props.width) / aspectRatio) : props.height

  // Placeholder SVG para usar cuando hay error
  const placeholderSrc = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='${
    props.width || 100
  }' height='${
    calculatedHeight || 100
  }' viewBox='0 0 24 24' fill='none' stroke='%23888' strokeWidth='1' strokeLinecap='round' strokeLinejoin='round'%3E%3Crect x='3' y='3' width='18' height='18' rx='2' ry='2'%3E%3C/rect%3E%3Ccircle cx='9' cy='9' r='2'%3E%3C/circle%3E%3Cpath d='M21 15l-3.086-3.086a2 2 0 0 0-2.828 0L6 21'%3E%3C/path%3E%3C/svg%3E`

  // Reintentar carga si hay error
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(false)
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [error])

  return (
    <div
      className={cn("relative overflow-hidden", fill ? "w-full h-full" : "", fadeIn && "bg-muted/30", className)}
      style={
        aspectRatio && !fill
          ? {
              aspectRatio: String(aspectRatio),
              height: calculatedHeight ? `${calculatedHeight}px` : "auto",
            }
          : {}
      }
    >
      {/* Imagen de baja calidad como placeholder */}
      {lowQualitySrc && !isLoaded && !error && (
        <Image
          src={lowQualitySrc || "/placeholder.svg"}
          alt=""
          className="absolute inset-0 w-full h-full object-cover blur-sm scale-105"
          fill={fill}
          width={!fill ? props.width : undefined}
          height={!fill ? calculatedHeight : undefined}
          priority={false}
          loading="eager"
        />
      )}

      {/* Imagen principal */}
      <Image
        src={error ? placeholderSrc : src}
        alt={alt}
        className={cn(
          "object-cover",
          fadeIn && "transition-opacity duration-500",
          isLoaded ? "opacity-100" : "opacity-0",
          error && "opacity-70",
        )}
        fill={fill}
        width={!fill ? props.width : undefined}
        height={!fill ? calculatedHeight : undefined}
        onLoad={() => setIsLoaded(true)}
        onError={() => setError(true)}
        {...props}
      />
    </div>
  )
}
