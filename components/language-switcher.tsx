"use client"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Globe } from "lucide-react"
import { useLanguage } from "@/providers/language-provider"
import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"

export function LanguageSwitcher() {
  const { language, setLanguage, t } = useLanguage()
  const [mounted, setMounted] = useState(false)
  const [isChanging, setIsChanging] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleLanguageChange = (newLang: "es" | "en") => {
    if (newLang === language) return

    setIsChanging(true)
    setLanguage(newLang)

    // Simular un pequeño retraso para mostrar el efecto de cambio
    setTimeout(() => {
      setIsChanging(false)
    }, 500)
  }

  if (!mounted) return null

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="relative px-2 sm:px-4">
          <Globe className="h-5 w-5 mr-0 sm:mr-2" />
          <span className="hidden sm:inline-block">{language === "es" ? "Español" : "English"}</span>
          {isChanging && (
            <Badge variant="outline" className="absolute -top-2 -right-2 animate-pulse">
              {language === "es" ? "ES" : "EN"}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuItem
          onClick={() => handleLanguageChange("es")}
          className={language === "es" ? "bg-primary/10 text-primary font-medium" : ""}
        >
          <span className="mr-2">🇪🇸</span>
          Español
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleLanguageChange("en")}
          className={language === "en" ? "bg-primary/10 text-primary font-medium" : ""}
        >
          <span className="mr-2">🇺🇸</span>
          English
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
