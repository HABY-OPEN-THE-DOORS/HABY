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

  const mainContentVariants = {
    expanded: { marginLeft: 240 },
    collapsed: { marginLeft: 70 },
  }

  return (
    <NotificationProvider>
      <div className="flex min-h-screen flex-col bg-gray-50">
        <DashboardHeader title={title} />
        <div className="flex flex-1">
          <Sidebar isCollapsed={sidebarCollapsed} onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)} />
          <motion.main
            className="flex-1 pt-16"
            initial={sidebarCollapsed ? "collapsed" : "expanded"}
            animate={sidebarCollapsed ? "collapsed" : "expanded"}
            variants={mainContentVariants}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={router.asPath}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="min-h-[calc(100vh-4rem)]"
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </motion.main>
        </div>
      </div>
    </NotificationProvider>
  )
}
