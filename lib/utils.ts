import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Combina clases de Tailwind de manera eficiente, evitando conflictos
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formatea una fecha en formato legible
 */
export function formatDate(date: Date, locale = "es"): string {
  return new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date)
}

/**
 * Trunca un texto a una longitud máxima
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + "..."
}

/**
 * Genera un ID único
 */
export function generateId(): string {
  return Math.random().toString(36).substring(2, 9)
}

/**
 * Obtiene las iniciales de un nombre
 */
export function getInitials(name: string, maxLength = 2): string {
  if (!name) return ""
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .substring(0, maxLength)
}

/**
 * Genera un código de clase aleatorio
 */
export function generateClassCode(): string {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
  let code = ""

  // Generar un código de 6 caracteres
  for (let i = 0; i < 6; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length)
    code += characters.charAt(randomIndex)
  }

  return code
}

/**
 * Retrasa la ejecución de una función
 */
export function debounce<T extends (...args: any[]) => any>(
  callback: T,
  delay: number,
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout

  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => callback(...args), delay)
  }
}

/**
 * Limita la frecuencia de ejecución de una función
 */
export function throttle<T extends (...args: any[]) => any>(
  callback: T,
  limit: number,
): (...args: Parameters<T>) => void {
  let waiting = false

  return (...args: Parameters<T>) => {
    if (!waiting) {
      callback(...args)
      waiting = true
      setTimeout(() => {
        waiting = false
      }, limit)
    }
  }
}

/**
 * Genera un color aleatorio para una clase
 */
export function getRandomClassColor(): string {
  const colors = [
    "bg-class-purple",
    "bg-class-pink",
    "bg-class-green",
    "bg-class-red",
    "bg-class-amber",
    "bg-class-teal",
  ]
  return colors[Math.floor(Math.random() * colors.length)]
}

/**
 * Formatea una fecha relativa (hace X tiempo)
 */
export function formatRelativeTime(date: Date): string {
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (diffInSeconds < 60) {
    return "hace unos segundos"
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60)
  if (diffInMinutes < 60) {
    return `hace ${diffInMinutes} ${diffInMinutes === 1 ? "minuto" : "minutos"}`
  }

  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) {
    return `hace ${diffInHours} ${diffInHours === 1 ? "hora" : "horas"}`
  }

  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays < 7) {
    return `hace ${diffInDays} ${diffInDays === 1 ? "día" : "días"}`
  }

  const diffInWeeks = Math.floor(diffInDays / 7)
  if (diffInWeeks < 4) {
    return `hace ${diffInWeeks} ${diffInWeeks === 1 ? "semana" : "semanas"}`
  }

  const diffInMonths = Math.floor(diffInDays / 30)
  if (diffInMonths < 12) {
    return `hace ${diffInMonths} ${diffInMonths === 1 ? "mes" : "meses"}`
  }

  const diffInYears = Math.floor(diffInDays / 365)
  return `hace ${diffInYears} ${diffInYears === 1 ? "año" : "años"}`
}
