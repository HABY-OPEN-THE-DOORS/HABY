"use client"

import { useLanguage } from "@/providers/language-provider"
import { LanguageSwitcher } from "@/components/language-switcher"
import { ThemeSwitcher } from "@/components/theme-switcher"
import { ThemeColorSelector } from "@/components/theme-color-selector"

export function LanguageThemeSelector() {
  const { t } = useLanguage()

  return (
    <div className="flex items-center space-x-2">
      <LanguageSwitcher />
      <ThemeSwitcher />
      <ThemeColorSelector />
    </div>
  )
}
