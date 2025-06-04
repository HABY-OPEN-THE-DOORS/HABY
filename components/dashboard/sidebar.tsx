"use client"

import type React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  BookOpen,
  Calendar,
  Home,
  LogOut,
  MessageSquare,
  Settings,
  Users,
  FileText,
  Bell,
  ChevronLeft,
  ChevronRight,
  Layers,
  BarChart,
  HelpCircle,
  Shield,
  GraduationCap,
  User,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { usePermissions } from "@/hooks/use-permissions"
import { useAuth } from "@/providers/auth-provider"
import { useLanguage } from "@/providers/language-provider"

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  isCollapsed?: boolean
  onToggleCollapse?: () => void
}

export function Sidebar({ className, isCollapsed = false, onToggleCollapse, ...props }: SidebarProps) {
  const pathname = usePathname()
  const { isAdmin, isTeacher, isStudent } = usePermissions()
  const { user } = useAuth()
  const { language } = useLanguage()

  // Configuración de rutas basada en el idioma
  const getRouteLabel = (key: string) => {
    const labels = {
      es: {
        dashboard: "Inicio",
        classes: "Clases",
        calendar: "Calendario",
        assignments: "Tareas",
        messages: "Mensajes",
        notifications: "Notificaciones",
        students: "Estudiantes",
        profile: "Perfil",
        resources: "Recursos",
        analytics: "Análisis",
        settings: "Configuración",
        help: "Ayuda",
        roles: "Roles y Permisos",
        rolesGuide: "Guía de Roles",
        logout: "Cerrar sesión",
      },
      en: {
        dashboard: "Dashboard",
        classes: "Classes",
        calendar: "Calendar",
        assignments: "Assignments",
        messages: "Messages",
        notifications: "Notifications",
        students: "Students",
        profile: "Profile",
        resources: "Resources",
        analytics: "Analytics",
        settings: "Settings",
        help: "Help",
        roles: "Roles & Permissions",
        rolesGuide: "Roles Guide",
        logout: "Sign out",
      },
    }
    return labels[language as keyof typeof labels]?.[key as keyof typeof labels.es] || key
  }

  // Rutas principales disponibles para todos los usuarios autenticados
  const mainRoutes = [
    {
      label: getRouteLabel("dashboard"),
      icon: Home,
      href: "/dashboard",
      active: pathname === "/dashboard",
      description: "Panel principal con resumen de actividades",
    },
    {
      label: getRouteLabel("classes"),
      icon: BookOpen,
      href: "/dashboard/classes",
      active: pathname === "/dashboard/classes" || pathname.startsWith("/dashboard/classes/"),
      description: "Gestión de clases y cursos",
    },
    {
      label: getRouteLabel("calendar"),
      icon: Calendar,
      href: "/dashboard/calendar",
      active: pathname === "/dashboard/calendar",
      description: "Calendario de eventos y fechas importantes",
    },
    {
      label: getRouteLabel("assignments"),
      icon: FileText,
      href: "/dashboard/assignments",
      active: pathname === "/dashboard/assignments" || pathname.startsWith("/dashboard/assignments/"),
      description: "Tareas y trabajos asignados",
    },
  ]

  // Rutas de comunicación
  const communicationRoutes = [
    {
      label: getRouteLabel("messages"),
      icon: MessageSquare,
      href: "/dashboard/messages",
      active: pathname === "/dashboard/messages",
      description: "Mensajes y comunicación",
    },
    {
      label: getRouteLabel("notifications"),
      icon: Bell,
      href: "/dashboard/notifications",
      active: pathname === "/dashboard/notifications",
      description: "Notificaciones del sistema",
    },
  ]

  // Rutas específicas para profesores
  const teacherRoutes = [
    {
      label: getRouteLabel("students"),
      icon: Users,
      href: "/dashboard/students",
      active: pathname === "/dashboard/students",
      description: "Gestión de estudiantes",
      requiresTeacher: true,
    },
    {
      label: getRouteLabel("analytics"),
      icon: BarChart,
      href: "/dashboard/analytics",
      active: pathname === "/dashboard/analytics",
      description: "Análisis y estadísticas",
      requiresTeacher: true,
    },
  ]

  // Rutas de gestión personal
  const personalRoutes = [
    {
      label: getRouteLabel("profile"),
      icon: User,
      href: "/dashboard/profile",
      active: pathname === "/dashboard/profile",
      description: "Perfil personal y configuración",
    },
    {
      label: getRouteLabel("resources"),
      icon: Layers,
      href: "/dashboard/resources",
      active: pathname === "/dashboard/resources",
      description: "Recursos y materiales",
    },
  ]

  // Rutas de configuración
  const configRoutes = [
    {
      label: getRouteLabel("settings"),
      icon: Settings,
      href: "/dashboard/settings",
      active: pathname === "/dashboard/settings",
      description: "Configuración de la aplicación",
    },
    {
      label: getRouteLabel("help"),
      icon: HelpCircle,
      href: "/dashboard/help",
      active: pathname === "/dashboard/help",
      description: "Ayuda y soporte",
    },
  ]

  // Rutas de administración (solo para administradores)
  const adminRoutes = [
    {
      label: getRouteLabel("roles"),
      icon: Shield,
      href: "/dashboard/admin/roles",
      active: pathname === "/dashboard/admin/roles",
      description: "Gestión de roles y permisos",
      requiresAdmin: true,
    },
    {
      label: getRouteLabel("rolesGuide"),
      icon: GraduationCap,
      href: "/dashboard/help/roles",
      active: pathname === "/dashboard/help/roles",
      description: "Guía sobre roles del sistema",
    },
  ]

  // Filtrar rutas según permisos
  const getFilteredRoutes = (routes: any[]) => {
    return routes.filter((route) => {
      if (route.requiresAdmin && !isAdmin) return false
      if (route.requiresTeacher && !isTeacher && !isAdmin) return false
      return true
    })
  }

  const sidebarVariants = {
    expanded: { width: 280 },
    collapsed: { width: 80 },
  }

  const contentVariants = {
    expanded: { opacity: 1, x: 0 },
    collapsed: { opacity: 0, x: -10 },
  }

  const RouteSection = ({
    title,
    routes,
    showTitle = true,
  }: {
    title?: string
    routes: any[]
    showTitle?: boolean
  }) => (
    <div className="space-y-1">
      {showTitle && !isCollapsed && title && (
        <motion.div variants={contentVariants} className="px-3 py-2">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{title}</h3>
        </motion.div>
      )}
      {getFilteredRoutes(routes).map((route) => (
        <Tooltip key={route.href} delayDuration={300}>
          <TooltipTrigger asChild>
            <Link
              href={route.href}
              className={cn(
                "nav-item-haby group relative",
                route.active
                  ? "bg-primary text-primary-foreground shadow-soft"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent",
                isCollapsed && "justify-center px-0 w-12 h-12 mx-auto",
              )}
            >
              <route.icon
                className={cn(
                  "h-5 w-5 flex-shrink-0 transition-colors",
                  route.active ? "text-primary-foreground" : "text-current",
                )}
              />
              <AnimatePresence>
                {!isCollapsed && (
                  <motion.span
                    variants={contentVariants}
                    initial="collapsed"
                    animate="expanded"
                    exit="collapsed"
                    className="ml-3 font-medium"
                  >
                    {route.label}
                  </motion.span>
                )}
              </AnimatePresence>
              {route.active && (
                <motion.div
                  className="absolute left-0 top-0 h-full w-1 bg-primary-foreground rounded-r-full"
                  layoutId="activeIndicator"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </Link>
          </TooltipTrigger>
          {isCollapsed && (
            <TooltipContent side="right" className="font-medium">
              <div>
                <div className="font-semibold">{route.label}</div>
                <div className="text-xs text-muted-foreground">{route.description}</div>
              </div>
            </TooltipContent>
          )}
        </Tooltip>
      ))}
    </div>
  )

  return (
    <TooltipProvider>
      <motion.div
        className={cn(
          "fixed left-0 top-16 z-30 flex h-[calc(100vh-4rem)] flex-col bg-card border-r border-border transition-smooth",
          className,
        )}
        initial={isCollapsed ? "collapsed" : "expanded"}
        animate={isCollapsed ? "collapsed" : "expanded"}
        variants={sidebarVariants}
        {...props}
      >
        {/* Header de la barra lateral */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          {!isCollapsed && (
            <motion.div variants={contentVariants} className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <div className="font-semibold text-sm">HABY-CLASS</div>
                <div className="text-xs text-muted-foreground">{user?.email || "Usuario"}</div>
              </div>
            </motion.div>
          )}
          <button
            onClick={onToggleCollapse}
            className="p-2 rounded-lg hover:bg-accent transition-colors"
            aria-label={isCollapsed ? "Expandir barra lateral" : "Colapsar barra lateral"}
          >
            {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>

        {/* Contenido de navegación */}
        <div className="flex-1 overflow-y-auto scrollbar-haby py-4 space-y-6">
          <RouteSection routes={mainRoutes} showTitle={false} />

          <RouteSection title={language === "es" ? "Comunicación" : "Communication"} routes={communicationRoutes} />

          {(isTeacher || isAdmin) && (
            <RouteSection title={language === "es" ? "Enseñanza" : "Teaching"} routes={teacherRoutes} />
          )}

          <RouteSection title={language === "es" ? "Personal" : "Personal"} routes={personalRoutes} />

          <RouteSection title={language === "es" ? "Sistema" : "System"} routes={configRoutes} />

          {isAdmin && (
            <RouteSection title={language === "es" ? "Administración" : "Administration"} routes={adminRoutes} />
          )}
        </div>

        {/* Footer con logout */}
        <div className="p-4 border-t border-border">
          <Tooltip delayDuration={300}>
            <TooltipTrigger asChild>
              <Link
                href="/logout"
                className={cn(
                  "nav-item-haby w-full text-destructive hover:bg-destructive hover:text-destructive-foreground",
                  isCollapsed && "justify-center px-0 w-12 h-12 mx-auto",
                )}
              >
                <LogOut className="h-5 w-5" />
                <AnimatePresence>
                  {!isCollapsed && (
                    <motion.span
                      variants={contentVariants}
                      initial="collapsed"
                      animate="expanded"
                      exit="collapsed"
                      className="ml-3 font-medium"
                    >
                      {getRouteLabel("logout")}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>
            </TooltipTrigger>
            {isCollapsed && (
              <TooltipContent side="right" className="font-medium">
                {getRouteLabel("logout")}
              </TooltipContent>
            )}
          </Tooltip>
        </div>
      </motion.div>
    </TooltipProvider>
  )
}

export default Sidebar
