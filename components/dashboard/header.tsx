"use client"

import Link from "next/link"
import { UserNav } from "@/components/dashboard/user-nav"
import { MobileNav } from "@/components/dashboard/mobile-nav"
import { Logo } from "@/components/logo"
import { LanguageThemeSelector } from "@/components/language-theme-selector"

export function DashboardHeader({ title = "Inicio" }: { title?: string }) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Link href="/dashboard" className="flex items-center mr-6">
          <Logo size="sm" showText={true} />
        </Link>
        <h1 className="text-xl font-semibold hidden md:block">{title}</h1>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <LanguageThemeSelector />
          <nav className="flex items-center space-x-2">
            <MobileNav />
            <UserNav />
          </nav>
        </div>
      </div>
    </header>
  )
}
