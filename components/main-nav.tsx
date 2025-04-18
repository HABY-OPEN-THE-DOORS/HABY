"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Logo } from "@/components/logo"
import { Suspense } from "react"
import { useLanguage } from "@/providers/language-provider"

// Traducciones predeterminadas para cuando el proveedor de idioma no está disponible
const defaultTranslations: Record<string, string> = {
  "nav.features": "Características",
  "nav.donations": "Donaciones",
  "nav.about": "Acerca de",
  "nav.contact": "Contacto",
  "nav.login": "Iniciar sesión",
  "nav.signup": "Registrarse",
}

interface NavItem {
  href: string
  labelKey: string
}

function MainNavContent({ className, ...props }: React.HTMLAttributes<HTMLElement>) {
  const pathname = usePathname()
  const [translations, setTranslations] = useState<Record<string, string>>(defaultTranslations)
  const { t } = useLanguage()

  useEffect(() => {
    // Actualizar las traducciones con las del proveedor
    const updatedTranslations = { ...defaultTranslations }
    Object.keys(defaultTranslations).forEach((key) => {
      updatedTranslations[key] = t(key)
    })

    setTranslations(updatedTranslations)
  }, [t])

  const navItems: NavItem[] = [
    { href: "/features", labelKey: "nav.features" },
    { href: "/donations", labelKey: "nav.donations" },
    { href: "/about", labelKey: "nav.about" },
    { href: "/contact", labelKey: "nav.contact" },
  ]

  return (
    <div className="flex gap-6 md:gap-10">
      <Link href="/" className="flex items-center space-x-2">
        <Logo showText className="h-8 w-8" width={32} height={32} />
      </Link>
      <nav className={cn("flex items-center space-x-6 text-sm font-medium", className)} {...props}>
        {navItems.map((item, index) => (
          <Link
            key={index}
            href={item.href}
            className={cn(
              "transition-colors hover:text-foreground/80",
              pathname === item.href ? "text-foreground font-semibold" : "text-foreground/60",
            )}
          >
            {t(item.labelKey)}
          </Link>
        ))}
      </nav>
    </div>
  )
}

export function MainNav({ className, ...props }: React.HTMLAttributes<HTMLElement>) {
  return (
    <Suspense
      fallback={
        <div className="flex gap-6 md:gap-10">
          <Link href="/" className="flex items-center space-x-2">
            <Logo showText className="h-8 w-8" width={32} height={32} />
          </Link>
          <nav className={cn("flex items-center space-x-6 text-sm font-medium", className)}>
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-4 w-16 animate-pulse rounded bg-muted"></div>
            ))}
          </nav>
        </div>
      }
    >
      <MainNavContent className={className} {...props} />
    </Suspense>
  )
}
