"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { es } from "@/locales/es"
import { en } from "@/locales/en"
import type { Locale } from "@/types"

interface LanguageContextProps {
  language: Locale
  languageReady: boolean
  setLanguage: (lang: Locale) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextProps | undefined>(undefined)

interface LanguageProviderProps {
  children: React.ReactNode
  defaultLanguage?: Locale
}

export function LanguageProvider({ children, defaultLanguage = "es" }: LanguageProviderProps) {
  const [language, setLanguageState] = useState<Locale>(defaultLanguage)
  const [translations, setTranslations] = useState<Record<string, string>>(language === "es" ? es : en)
  const [languageReady, setLanguageReady] = useState(false)

  // Cargar el idioma guardado al iniciar
  useEffect(() => {
    const savedLanguage = localStorage.getItem("language") as Locale | null
    if (savedLanguage && (savedLanguage === "es" || savedLanguage === "en")) {
      setLanguageState(savedLanguage)
      setTranslations(savedLanguage === "es" ? es : en)
    }
    setLanguageReady(true)
  }, [])

  // Actualizar traducciones cuando cambia el idioma
  useEffect(() => {
    setTranslations(language === "es" ? es : en)
    // Actualizar el atributo lang del HTML
    document.documentElement.lang = language === "es" ? "es-MX" : "en-US"
  }, [language])

  // Función para cambiar el idioma
  const setLanguage = (lang: Locale) => {
    setLanguageState(lang)
    localStorage.setItem("language", lang)
  }

  // Función para obtener traducciones
  const t = (key: string): string => {
    return translations[key] || key
  }

  return (
    <LanguageContext.Provider value={{ language, languageReady, setLanguage, t }}>{children}</LanguageContext.Provider>
  )
}

// Hook personalizado para usar el contexto de idioma
export const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
