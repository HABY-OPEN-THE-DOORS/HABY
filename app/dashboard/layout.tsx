"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard/header"
import { Sidebar } from "@/components/dashboard/sidebar"
import { useAuth } from "@/providers/auth-provider"
import { LoadingScreen } from "@/components/loading-screen"
import { useLanguage } from "@/providers/language-provider"
import { motion, AnimatePresence } from "framer-motion"
import { NotificationProvider } from "@/providers/notification-provider"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const { isAuthenticated, isLoading: authLoading } = useAuth()
  const { language } = useLanguage()
  const router = useRouter()

  // Manejar el estado de carga y autenticación
  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated) {
        router.push("/login")
      } else {
        setIsLoading(false)
      }
    }
  }, [isAuthenticated, authLoading, router])

  // Recordar preferencia de sidebar
  useEffect(() => {
    const savedCollapsed = localStorage.getItem("sidebar-collapsed")
    if (savedCollapsed !== null) {
      setSidebarCollapsed(JSON.parse(savedCollapsed))
    }
  }, [])

  // Guardar preferencia de sidebar
  const handleToggleCollapse = () => {
    const newCollapsed = !sidebarCollapsed
    setSidebarCollapsed(newCollapsed)
    localStorage.setItem("sidebar-collapsed", JSON.stringify(newCollapsed))
  }

  // Mostrar pantalla de carga
  if (authLoading || isLoading) {
    return <LoadingScreen />
  }

  // No renderizar si no está autenticado
  if (!isAuthenticated) {
    return null
  }

  // Obtener título basado en idioma
  const title = language === "es" ? "Panel de Control" : "Dashboard"

  const mainContentVariants = {
    expanded: { marginLeft: 280, width: "calc(100% - 280px)" },
    collapsed: { marginLeft: 80, width: "calc(100% - 80px)" },
  }

  return (
    <NotificationProvider>
      <div className="flex min-h-screen flex-col bg-background">
        {/* Header */}
        <DashboardHeader title={title} />

        <div className="flex flex-1 relative">
          {/* Sidebar */}
          <Sidebar isCollapsed={sidebarCollapsed} onToggleCollapse={handleToggleCollapse} />

          {/* Contenido principal */}
          <motion.main
            className="flex-1 pt-16 min-h-[calc(100vh-4rem)]"
            initial={sidebarCollapsed ? "collapsed" : "expanded"}
            animate={sidebarCollapsed ? "collapsed" : "expanded"}
            variants={mainContentVariants}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div className="container-haby py-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={router.asPath}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="w-full"
                >
                  {children}
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.main>
        </div>
      </div>
    </NotificationProvider>
  )
}
