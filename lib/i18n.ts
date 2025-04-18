import { es } from "@/locales/es"
import { en } from "@/locales/en"

export type Locale = "es" | "en"

/**
 * Obtiene las traducciones para un idioma específico
 * @param locale - Código de idioma
 * @returns Función de traducción
 */
export async function getTranslations(locale: Locale = "es") {
  // Seleccionar el diccionario de traducciones según el idioma
  const translations = locale === "es" ? es : en

  // Devolver una función de traducción
  return function t(key: string): string {
    return translations[key] || key
  }
}

/**
 * Obtiene el idioma del navegador o el predeterminado
 * @returns Código de idioma
 */
export function getDefaultLocale(): Locale {
  if (typeof window === "undefined") {
    return "es" // Valor predeterminado en el servidor
  }

  // Intentar obtener el idioma guardado
  const savedLocale = localStorage.getItem("language") as Locale | null
  if (savedLocale && (savedLocale === "es" || savedLocale === "en")) {
    return savedLocale
  }

  // Intentar obtener el idioma del navegador
  const browserLocale = navigator.language.split("-")[0]
  return browserLocale === "en" ? "en" : "es"
}
