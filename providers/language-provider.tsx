"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

type Language = "en" | "es"

interface LanguageContextType {
  language: Language
  setLanguage: (language: Language) => void
  t: (key: string) => string
}

const translations = {
  en: {
    "app.title": "HABY Class",
    "theme.light": "Light",
    "theme.dark": "Dark",
    "theme.system": "System",
    "nav.home": "Home",
    "nav.dashboard": "Dashboard",
    "nav.classes": "Classes",
    "nav.calendar": "Calendar",
    "nav.messages": "Messages",
    "nav.settings": "Settings",
    "auth.signin": "Sign In",
    "auth.signup": "Sign Up",
    "auth.signout": "Sign Out",
    // Add more translations as needed
  },
  es: {
    "app.title": "HABY Clase",
    "theme.light": "Claro",
    "theme.dark": "Oscuro",
    "theme.system": "Sistema",
    "nav.home": "Inicio",
    "nav.dashboard": "Panel",
    "nav.classes": "Clases",
    "nav.calendar": "Calendario",
    "nav.messages": "Mensajes",
    "nav.settings": "Configuración",
    "auth.signin": "Iniciar Sesión",
    "auth.signup": "Registrarse",
    "auth.signout": "Cerrar Sesión",
    // Add more translations as needed
  },
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("en")

  // Try to load language preference from localStorage on client side
  useEffect(() => {
    const savedLanguage = localStorage.getItem("language") as Language
    if (savedLanguage && (savedLanguage === "en" || savedLanguage === "es")) {
      setLanguage(savedLanguage)
    }
  }, [])

  // Save language preference to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("language", language)
  }, [language])

  const t = (key: string): string => {
    return translations[language][key as keyof (typeof translations)[typeof language]] || key
  }

  return <LanguageContext.Provider value={{ language, setLanguage, t }}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
