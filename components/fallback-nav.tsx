"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Logo } from "@/components/logo"

interface NavItem {
  href: string
  label: string
}

export function FallbackNav({ className, ...props }: React.HTMLAttributes<HTMLElement>) {
  const pathname = usePathname()

  const navItems: NavItem[] = [
    { href: "/features", label: "Características" },
    { href: "/donations", label: "Donaciones" },
    { href: "/about", label: "Acerca de" },
    { href: "/contact", label: "Contacto" },
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
            {item.label}
          </Link>
        ))}
      </nav>
    </div>
  )
}
