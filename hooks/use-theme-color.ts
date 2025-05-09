"use client"

import { useEffect, useState } from "react"
import { useTheme } from "next-themes"
import { getDefaultTheme, getThemeById, type ThemeColor } from "@/lib/themes"

export function useThemeColor() {
  const { theme: themeMode, setTheme: setThemeMode } = useTheme()
  const [themeColor, setThemeColor] = useState<ThemeColor>(getDefaultTheme())
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const savedThemeColor = localStorage.getItem("themeColor") || "default"
    const theme = getThemeById(savedThemeColor) || getDefaultTheme()
    setThemeColor(theme)
    applyThemeColor(theme, themeMode as "light" | "dark" | "system")
  }, [themeMode])

  const setThemeColorById = (id: string) => {
    const theme = getThemeById(id) || getDefaultTheme()
    setThemeColor(theme)
    localStorage.setItem("themeColor", id)
    applyThemeColor(theme, themeMode as "light" | "dark" | "system")
  }

  const applyThemeColor = (theme: ThemeColor, mode: "light" | "dark" | "system") => {
    const root = document.documentElement
    const cssVars = mode === "dark" ? theme.cssVars.dark : theme.cssVars.light

    Object.entries(cssVars).forEach(([key, value]) => {
      root.style.setProperty(key, value)
    })

    // Actualizar variables CSS personalizadas
    root.style.setProperty("--color-primary", theme.primary)
    root.style.setProperty("--color-secondary", theme.secondary)
    root.style.setProperty("--color-accent", theme.accent)
    root.style.setProperty("--color-success", theme.success)
    root.style.setProperty("--color-warning", theme.warning)
    root.style.setProperty("--color-error", theme.error)
    root.style.setProperty("--color-info", theme.info)
  }

  return {
    themeColor,
    setThemeColor: setThemeColorById,
    themeMode,
    setThemeMode,
    mounted,
  }
}
