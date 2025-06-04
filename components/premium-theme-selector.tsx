"use client"

import { usePremiumTheme } from "@/hooks/use-premium-theme"
import { premiumThemes } from "@/lib/premium-themes"
import { Check, Palette, Sparkles } from "lucide-react"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

interface PremiumThemeSelectorProps {
  className?: string
  showLabel?: boolean
}

export function PremiumThemeSelector({ className, showLabel = false }: PremiumThemeSelectorProps) {
  const { premiumTheme, setPremiumTheme, mounted } = usePremiumTheme()
  const [selectedTheme, setSelectedTheme] = useState(premiumTheme.id)

  useEffect(() => {
    setSelectedTheme(premiumTheme.id)
  }, [premiumTheme])

  if (!mounted) {
    return (
      <Button variant="outline" size="icon" className={cn("w-10 h-10", className)}>
        <Palette className="h-4 w-4" />
        <span className="sr-only">Seleccionar tema premium</span>
      </Button>
    )
  }

  const currentTheme = premiumThemes.find((t) => t.id === selectedTheme) || premiumThemes[0]

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size={showLabel ? "default" : "icon"}
          className={cn(
            "relative overflow-hidden border-2 transition-all duration-300 hover:scale-105",
            showLabel ? "px-4 py-2" : "w-10 h-10",
            className,
          )}
          style={{
            background: currentTheme.gradients.primary,
            borderColor: currentTheme.colors.primary,
            color: "white",
          }}
        >
          <Sparkles className="h-4 w-4" />
          {showLabel && <span className="ml-2 font-medium">{currentTheme.name}</span>}
          <span className="sr-only">Seleccionar tema premium</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="flex items-center gap-2">
          <Sparkles className="h-4 w-4" />
          Temas Premium
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        {premiumThemes.map((theme) => (
          <DropdownMenuItem
            key={theme.id}
            className="flex flex-col items-start gap-2 p-4 cursor-pointer hover:bg-accent/50 transition-all duration-200"
            onClick={() => setPremiumTheme(theme.id)}
          >
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-3">
                <div
                  className="h-8 w-8 rounded-lg shadow-md border-2 border-white/20"
                  style={{ background: theme.gradients.primary }}
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{theme.name}</span>
                    {selectedTheme === theme.id && <Check className="h-4 w-4 text-green-500" />}
                  </div>
                  <p className="text-xs text-muted-foreground">{theme.description}</p>
                </div>
              </div>
            </div>

            <div className="flex gap-1 mt-1">
              <div
                className="h-3 w-3 rounded-full border border-white/30"
                style={{ backgroundColor: theme.colors.primary }}
              />
              <div
                className="h-3 w-3 rounded-full border border-white/30"
                style={{ backgroundColor: theme.colors.secondary }}
              />
              <div
                className="h-3 w-3 rounded-full border border-white/30"
                style={{ backgroundColor: theme.colors.accent }}
              />
              <div
                className="h-3 w-3 rounded-full border border-white/30"
                style={{ backgroundColor: theme.colors.success }}
              />
              <div
                className="h-3 w-3 rounded-full border border-white/30"
                style={{ backgroundColor: theme.colors.warning }}
              />
            </div>

            <p className="text-xs text-muted-foreground italic">{theme.inspiration}</p>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
