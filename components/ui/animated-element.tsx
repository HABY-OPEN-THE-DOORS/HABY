"use client"

import type React from "react"
import { useEffect, useRef, useState } from "react"
import { motion, useAnimation, type Variant } from "framer-motion"
import { cn } from "@/lib/utils"

/**
 * Tipos de animación disponibles
 */
type AnimationType = "fadeIn" | "slideUp" | "slideDown" | "slideLeft" | "slideRight" | "scale" | "rotate" | "bounce"

/**
 * Propiedades del componente AnimatedElement
 * @property {React.ReactNode} children - Contenido a animar
 * @property {AnimationType} type - Tipo de animación a aplicar
 * @property {number} delay - Retraso antes de iniciar la animación (en segundos)
 * @property {number} duration - Duración de la animación (en segundos)
 * @property {boolean} once - Si la animación debe ejecutarse solo una vez al entrar en viewport
 * @property {string} className - Clases CSS adicionales
 * @property {number} threshold - Umbral de visibilidad para activar la animación (0-1)
 * @property {string} as - Elemento HTML a renderizar
 * @property {Record<string, any>} custom - Propiedades personalizadas para la animación
 */
interface AnimatedElementProps {
  children: React.ReactNode
  type?: AnimationType
  delay?: number
  duration?: number
  once?: boolean
  className?: string
  threshold?: number
  as?: keyof JSX.IntrinsicElements
  custom?: Record<string, any>
}

/**
 * Componente AnimatedElement
 * Envuelve contenido con animaciones de entrada basadas en la visibilidad en viewport
 */
export function AnimatedElement({
  children,
  type = "fadeIn",
  delay = 0,
  duration = 0.5,
  once = true,
  className = "",
  threshold = 0.1,
  as = "div",
  custom = {},
}: AnimatedElementProps) {
  const controls = useAnimation()
  const ref = useRef<HTMLDivElement>(null)
  const [hasAnimated, setHasAnimated] = useState(false)

  // Definir las variantes de animación según el tipo seleccionado
  const getVariants = () => {
    const variants: Record<string, Variant> = {
      hidden: {},
      visible: {
        transition: {
          duration,
          delay,
          ease: "easeOut",
          ...custom.transition,
        },
      },
    }

    // Configurar las variantes según el tipo de animación
    switch (type) {
      case "fadeIn":
        variants.hidden = { opacity: 0, ...custom.hidden }
        variants.visible = { opacity: 1, ...custom.visible }
        break
      case "slideUp":
        variants.hidden = { opacity: 0, y: 50, ...custom.hidden }
        variants.visible = { opacity: 1, y: 0, ...custom.visible }
        break
      case "slideDown":
        variants.hidden = { opacity: 0, y: -50, ...custom.hidden }
        variants.visible = { opacity: 1, y: 0, ...custom.visible }
        break
      case "slideLeft":
        variants.hidden = { opacity: 0, x: 50, ...custom.hidden }
        variants.visible = { opacity: 1, x: 0, ...custom.visible }
        break
      case "slideRight":
        variants.hidden = { opacity: 0, x: -50, ...custom.hidden }
        variants.visible = { opacity: 1, x: 0, ...custom.visible }
        break
      case "scale":
        variants.hidden = { opacity: 0, scale: 0.8, ...custom.hidden }
        variants.visible = { opacity: 1, scale: 1, ...custom.visible }
        break
      case "rotate":
        variants.hidden = { opacity: 0, rotate: -10, ...custom.hidden }
        variants.visible = { opacity: 1, rotate: 0, ...custom.visible }
        break
      case "bounce":
        variants.hidden = { opacity: 0, y: 50, ...custom.hidden }
        variants.visible = {
          opacity: 1,
          y: 0,
          transition: {
            type: "spring",
            stiffness: 300,
            damping: 15,
            ...custom.transition,
          },
          ...custom.visible,
        }
        break
      default:
        variants.hidden = { opacity: 0, ...custom.hidden }
        variants.visible = { opacity: 1, ...custom.visible }
    }

    return variants
  }

  // Configurar el observador de intersección para detectar cuando el elemento está en viewport
  useEffect(() => {
    if (typeof window === "undefined" || !ref.current) return

    // No animar si ya se ha animado y once es true
    if (once && hasAnimated) return

    // Verificar soporte para IntersectionObserver
    if (!("IntersectionObserver" in window)) {
      // Fallback para navegadores que no soportan IntersectionObserver
      controls.start("visible")
      if (once) setHasAnimated(true)
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            controls.start("visible")
            if (once) {
              setHasAnimated(true)
              observer.disconnect()
            }
          } else if (!once) {
            controls.start("hidden")
          }
        })
      },
      { threshold },
    )

    observer.observe(ref.current)

    return () => {
      if (ref.current) observer.unobserve(ref.current)
    }
  }, [controls, once, threshold, hasAnimated])

  // Verificar si debemos deshabilitar las animaciones según las preferencias del usuario
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    if (typeof window === "undefined") return

    // Detectar preferencia de reducción de movimiento
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)")
    setPrefersReducedMotion(mediaQuery.matches)

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches)
    }

    mediaQuery.addEventListener("change", handleChange)
    return () => mediaQuery.removeEventListener("change", handleChange)
  }, [])

  // Si el usuario prefiere reducir el movimiento, no aplicar animaciones
  if (prefersReducedMotion) {
    const Component = as as any
    return <Component className={className}>{children}</Component>
  }

  return (
    <motion.div
      ref={ref}
      className={cn(className)}
      initial="hidden"
      animate={controls}
      variants={getVariants()}
      aria-hidden="true" // La animación es puramente decorativa
    >
      {children}
    </motion.div>
  )
}
