"use client"

import { useEffect, useState } from "react"
import { useTheme } from "next-themes"
import { getDefaultPremiumTheme, getPremiumThemeById, type PremiumTheme } from "@/lib/premium-themes"

export function usePremiumTheme() {
  const { theme: themeMode, setTheme: setThemeMode } = useTheme()
  const [premiumTheme, setPremiumTheme] = useState<PremiumTheme>(getDefaultPremiumTheme())
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const savedThemeId = localStorage.getItem("premiumTheme") || "aurora"
    const theme = getPremiumThemeById(savedThemeId) || getDefaultPremiumTheme()
    setPremiumTheme(theme)
    applyPremiumTheme(theme, themeMode as "light" | "dark" | "system")
  }, [themeMode])

  const setPremiumThemeById = (id: string) => {
    const theme = getPremiumThemeById(id) || getDefaultPremiumTheme()
    setPremiumTheme(theme)
    localStorage.setItem("premiumTheme", id)
    applyPremiumTheme(theme, themeMode as "light" | "dark" | "system")
  }

  const applyPremiumTheme = (theme: PremiumTheme, mode: "light" | "dark" | "system") => {
    const root = document.documentElement
    const actualMode =
      mode === "system" ? (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light") : mode

    const cssVars = actualMode === "dark" ? theme.cssVars.dark : theme.cssVars.light

    // Aplicar variables CSS del tema
    Object.entries(cssVars).forEach(([key, value]) => {
      root.style.setProperty(key, value)
    })

    // Aplicar colores personalizados
    root.style.setProperty("--theme-primary", theme.colors.primary)
    root.style.setProperty("--theme-secondary", theme.colors.secondary)
    root.style.setProperty("--theme-accent", theme.colors.accent)
    root.style.setProperty("--theme-success", theme.colors.success)
    root.style.setProperty("--theme-warning", theme.colors.warning)
    root.style.setProperty("--theme-error", theme.colors.error)
    root.style.setProperty("--theme-info", theme.colors.info)
    root.style.setProperty("--theme-neutral", theme.colors.neutral)
    root.style.setProperty("--theme-surface", theme.colors.surface)
    root.style.setProperty("--theme-background", theme.colors.background)

    // Aplicar gradientes
    root.style.setProperty("--gradient-primary", theme.gradients.primary)
    root.style.setProperty("--gradient-secondary", theme.gradients.secondary)
    root.style.setProperty("--gradient-accent", theme.gradients.accent)
    root.style.setProperty("--gradient-hero", theme.gradients.hero)
    root.style.setProperty("--gradient-card", theme.gradients.card)

    // Aplicar clase del tema al body
    document.body.className = document.body.className.replace(/theme-\w+/g, "")
    document.body.classList.add(`theme-${theme.id}`)
  }

  return {
    premiumTheme,
    setPremiumTheme: setPremiumThemeById,
    themeMode,
    setThemeMode,
    mounted,
  }
}
