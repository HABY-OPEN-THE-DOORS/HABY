"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import type { ThemeProviderProps } from "next-themes"

type Theme = "dark" | "light" | "system"

interface ThemeContextProps {
  theme: Theme
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined)

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>("system")

  // Función para alternar entre temas
  const toggleTheme = () => {
    setThemeState((prevTheme) => {
      if (prevTheme === "light") return "dark"
      if (prevTheme === "dark") return "system"
      return "light"
    })
  }

  // Función para establecer el tema
  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme)
  }

  // Sincronizar el estado interno con next-themes
  useEffect(() => {
    const updateTheme = () => {
      const storedTheme = localStorage.getItem("theme") as Theme | null
      if (storedTheme) {
        setThemeState(storedTheme)
      }
    }

    updateTheme()
    window.addEventListener("storage", updateTheme)
    return () => window.removeEventListener("storage", updateTheme)
  }, [])

  // Actualizar localStorage cuando cambia el tema
  useEffect(() => {
    localStorage.setItem("theme", theme)
  }, [theme])

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      <NextThemesProvider {...props}>{children}</NextThemesProvider>
    </ThemeContext.Provider>
  )
}

// Hook personalizado para usar el contexto del tema
export const useThemeContext = () => {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error("useThemeContext must be used within a ThemeProvider")
  }
  return context
}
