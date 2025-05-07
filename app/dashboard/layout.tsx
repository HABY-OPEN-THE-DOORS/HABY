"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard/header"
import { Sidebar } from "@/components/dashboard/sidebar"
import { cn } from "@/lib/utils"
import { useAuth } from "@/providers/auth-provider"
import { LoadingScreen } from "@/components/loading-screen"
import { useLanguage } from "@/providers/language-provider"
import React from "react"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false)
  const { isAuthenticated, isLoading } = useAuth()
  const { language } = useLanguage()
  const router = useRouter()

  // Redirigir al login si no está autenticado
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, isLoading, router])

  // Mostrar pantalla de carga mientras se verifica la autenticación
  if (isLoading) {
    return <LoadingScreen />
  }

  // No renderizar el contenido si no está autenticado
  if (!isAuthenticated) {
    return null
  }

  // Get the title based on language
  const title = language === "es" ? "Inicio" : "Home"

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader title={title} />
      <div className="flex flex-1">
        <Sidebar isCollapsed={sidebarCollapsed} onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)} />
        <main
          className={cn(
            "flex-1 transition-all duration-200 ease-in-out",
            sidebarCollapsed ? "ml-[60px]" : "ml-[240px]",
          )}
        >
          {children}
        </main>
      </div>
    </div>
  )
}
