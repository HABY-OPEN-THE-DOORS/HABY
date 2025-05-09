/**
 * Utilidades para optimización y manejo de imágenes
 * @module image-utils
 */

/**
 * Genera una URL para un placeholder de imagen con dimensiones específicas
 * @param {number} width - Ancho de la imagen en píxeles
 * @param {number} height - Alto de la imagen en píxeles
 * @param {string} text - Texto opcional a mostrar en el placeholder
 * @returns {string} URL del placeholder
 */
export function getPlaceholderImage(width: number, height: number, text?: string): string {
  const textParam = text ? `&text=${encodeURIComponent(text)}` : ""
  return `/placeholder.svg?width=${width}&height=${height}${textParam}`
}

/**
 * Determina si una imagen debe cargarse con prioridad basado en su posición
 * @param {number} index - Índice de la imagen en una lista
 * @param {boolean} isAboveFold - Si la imagen está en la parte superior de la página
 * @returns {boolean} Verdadero si la imagen debe cargarse con prioridad
 */
export function shouldPrioritizeImage(index: number, isAboveFold = false): boolean {
  return isAboveFold || index < 3 // Priorizar imágenes por encima del pliegue o las primeras 3
}

/**
 * Genera un conjunto de tamaños responsivos para imágenes
 * @param {Object} options - Opciones de configuración
 * @param {number} options.defaultWidth - Ancho predeterminado de la imagen
 * @param {boolean} options.isFullWidth - Si la imagen ocupa el ancho completo
 * @param {string} options.breakpoints - Breakpoints personalizados
 * @returns {string} String de tamaños para el atributo sizes
 */
export function getResponsiveSizes({
  defaultWidth = 700,
  isFullWidth = false,
  breakpoints = "",
}: {
  defaultWidth?: number
  isFullWidth?: boolean
  breakpoints?: string
} = {}): string {
  if (breakpoints) return breakpoints

  if (isFullWidth) {
    return "(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 100vw"
  }

  return `(max-width: 640px) 100vw, (max-width: 1024px) 50vw, ${defaultWidth}px`
}

/**
 * Genera un conjunto de srcSet para imágenes responsivas
 * @param {string} src - URL base de la imagen
 * @param {number[]} widths - Array de anchos para generar
 * @returns {string} String de srcSet para el atributo srcSet
 */
export function generateSrcSet(src: string, widths: number[] = [640, 750, 828, 1080, 1200, 1920]): string {
  // Esta función es un ejemplo y asume que tienes un servicio de redimensionamiento de imágenes
  // Deberías adaptarla según tu implementación específica
  return widths.map((width) => `${src}?w=${width} ${width}w`).join(", ")
}

/**
 * Verifica si una URL de imagen es válida
 * @param {string} url - URL de la imagen a verificar
 * @returns {Promise<boolean>} Promesa que resuelve a verdadero si la imagen es válida
 */
export async function isImageValid(url: string): Promise<boolean> {
  if (!url) return false

  try {
    const response = await fetch(url, { method: "HEAD" })
    const contentType = response.headers.get("content-type")
    return response.ok && contentType?.startsWith("image/")
  } catch (error) {
    console.error("Error validating image:", error)
    return false
  }
}

/**
 * Calcula el aspect ratio de una imagen
 * @param {number} width - Ancho de la imagen
 * @param {number} height - Alto de la imagen
 * @returns {number} Aspect ratio (ancho/alto)
 */
export function calculateAspectRatio(width: number, height: number): number {
  return width / height
}

/**
 * Determina el formato óptimo de imagen basado en el soporte del navegador
 * @returns {string[]} Array de formatos en orden de preferencia
 */
export function getOptimalImageFormats(): string[] {
  if (typeof window === "undefined") {
    return ["webp", "jpg"] // Fallback para SSR
  }

  const formats = ["jpg"] // Formato base soportado por todos los navegadores

  // Detectar soporte para WebP
  const webpSupported = document.createElement("canvas").toDataURL("image/webp").indexOf("data:image/webp") === 0

  if (webpSupported) {
    formats.unshift("webp")
  }

  // Detectar soporte para AVIF (más moderno y eficiente)
  // Nota: Esta detección es simplificada, en producción podrías usar una biblioteca más robusta
  const avifImage = new Image()
  avifImage.src =
    "data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAIAAAACAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQ0MAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKCBgANogQEAwgMg8f8D///8WfhwB8+ErK42A="
  avifImage.onload = () => {
    if (avifImage.width > 0 && avifImage.height > 0) {
      formats.unshift("avif")
    }
  }

  return formats
}

/**
 * Genera un color de fondo dominante para un placeholder basado en una imagen
 * @param {string} imageUrl - URL de la imagen
 * @returns {Promise<string>} Promesa que resuelve al color dominante en formato hex
 *
 * Nota: Esta es una implementación simplificada. En producción, podrías usar
 * una biblioteca como color-thief o implementar un servicio en el backend.
 */
export async function getDominantColor(imageUrl: string): Promise<string> {
  // Esta es una implementación de ejemplo que devuelve un color predeterminado
  // En una implementación real, analizarías los píxeles de la imagen
  return "#f0f0f0"
}
