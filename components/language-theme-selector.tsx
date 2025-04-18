"use client"

import { useState, useEffect } from "react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Moon, Sun } from "lucide-react"
import { LanguageSwitcher } from "@/components/language-switcher"

export function LanguageThemeSelector() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Efecto para manejar la hidratación del cliente
  useEffect(() => {
    setMounted(true)
  }, [])

  // Evitar problemas de hidratación
  if (!mounted) {
    return null
  }

  return (
    <div className="flex items-center gap-2">
      <LanguageSwitcher />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" aria-label="Cambiar tema">
            {theme === "light" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            <span className="sr-only">Cambiar tema</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onClick={() => setTheme("light")}
            className={theme === "light" ? "bg-primary/10 text-primary font-medium" : ""}
          >
            <Sun className="h-4 w-4 mr-2" />
            Claro
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setTheme("dark")}
            className={theme === "dark" ? "bg-primary/10 text-primary font-medium" : ""}
          >
            <Moon className="h-4 w-4 mr-2" />
            Oscuro
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
