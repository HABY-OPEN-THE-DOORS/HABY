"use client"

import { useThemeColor } from "@/hooks/use-theme-color"
import { themes } from "@/lib/themes"
import { Check, Palette } from "lucide-react"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

interface ThemeColorSelectorProps {
  className?: string
}

export function ThemeColorSelector({ className }: ThemeColorSelectorProps) {
  const { themeColor, setThemeColor, mounted } = useThemeColor()
  const [selectedTheme, setSelectedTheme] = useState(themeColor.id)

  useEffect(() => {
    setSelectedTheme(themeColor.id)
  }, [themeColor])

  if (!mounted) {
    return (
      <Button variant="outline" size="icon" className={cn("w-9 h-9", className)}>
        <Palette className="h-4 w-4" />
        <span className="sr-only">Seleccionar tema de color</span>
      </Button>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className={cn("w-9 h-9", className)}
          style={{
            backgroundColor: themeColor.primary,
            color: "white",
            borderColor: themeColor.primary,
          }}
        >
          <Palette className="h-4 w-4" />
          <span className="sr-only">Seleccionar tema de color</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {themes.map((theme) => (
          <DropdownMenuItem
            key={theme.id}
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => setThemeColor(theme.id)}
          >
            <div className="h-4 w-4 rounded-full" style={{ backgroundColor: theme.primary }} />
            <span>{theme.name}</span>
            {selectedTheme === theme.id && <Check className="h-4 w-4 ml-auto" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
