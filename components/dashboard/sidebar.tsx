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
} from "lucide-react"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { usePermissions } from "@/hooks/use-permissions"

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  isCollapsed?: boolean
  onToggleCollapse?: () => void
}

export function Sidebar({ className, isCollapsed = false, onToggleCollapse, ...props }: SidebarProps) {
  const pathname = usePathname()
  const { isAdmin } = usePermissions()

  const routes = [
    {
      label: "Dashboard",
      icon: Home,
      href: "/dashboard",
      active: pathname === "/dashboard",
    },
    {
      label: "Clases",
      icon: BookOpen,
      href: "/dashboard/classes",
      active: pathname === "/dashboard/classes" || pathname.startsWith("/dashboard/classes/"),
    },
    {
      label: "Calendario",
      icon: Calendar,
      href: "/dashboard/calendar",
      active: pathname === "/dashboard/calendar",
    },
    {
      label: "Tareas",
      icon: FileText,
      href: "/dashboard/assignments",
      active: pathname === "/dashboard/assignments" || pathname.startsWith("/dashboard/assignments/"),
    },
    {
      label: "Mensajes",
      icon: MessageSquare,
      href: "/dashboard/messages",
      active: pathname === "/dashboard/messages",
    },
    {
      label: "Notificaciones",
      icon: Bell,
      href: "/dashboard/notifications",
      active: pathname === "/dashboard/notifications",
    },
    {
      label: "Usuarios",
      icon: Users,
      href: "/dashboard/users",
      active: pathname === "/dashboard/users",
    },
    {
      label: "Recursos",
      icon: Layers,
      href: "/dashboard/resources",
      active: pathname === "/dashboard/resources",
    },
    {
      label: "Análisis",
      icon: BarChart,
      href: "/dashboard/analytics",
      active: pathname === "/dashboard/analytics",
    },
    {
      label: "Configuración",
      icon: Settings,
      href: "/dashboard/settings",
      active: pathname === "/dashboard/settings",
    },
    {
      label: "Ayuda",
      icon: HelpCircle,
      href: "/dashboard/help",
      active: pathname === "/dashboard/help",
    },
  ]

  const sidebarVariants = {
    expanded: { width: 240 },
    collapsed: { width: 70 },
  }

  const itemVariants = {
    expanded: { opacity: 1, x: 0 },
    collapsed: { opacity: 0, x: -10 },
  }

  return (
    <TooltipProvider>
      <motion.div
        className={cn(
          "fixed left-0 top-16 z-30 flex h-[calc(100vh-4rem)] flex-col border-r bg-white transition-all duration-300",
          className,
        )}
        initial={isCollapsed ? "collapsed" : "expanded"}
        animate={isCollapsed ? "collapsed" : "expanded"}
        variants={sidebarVariants}
        {...props}
      >
        <div className="flex flex-col space-y-6 py-4 h-full">
          <div className="px-3 py-2 flex-1">
            <div className="flex justify-end mb-4 px-2">
              <button
                onClick={onToggleCollapse}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                aria-label={isCollapsed ? "Expandir sidebar" : "Colapsar sidebar"}
              >
                {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
              </button>
            </div>
            <div className="space-y-1">
              {routes.map((route) => {
                return (
                  <Tooltip key={route.href} delayDuration={300}>
                    <TooltipTrigger asChild>
                      <Link
                        href={route.href}
                        className={cn(
                          "flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-all hover:bg-gray-100",
                          route.active ? "bg-purple-50 text-purple-700" : "text-gray-500 hover:text-gray-900",
                          isCollapsed && "justify-center px-0",
                        )}
                      >
                        <route.icon
                          className={cn("h-5 w-5 flex-shrink-0", route.active ? "text-purple-600" : "text-gray-400")}
                        />
                        <motion.span
                          variants={itemVariants}
                          initial={isCollapsed ? "collapsed" : "expanded"}
                          animate={isCollapsed ? "collapsed" : "expanded"}
                          className={cn("ml-3", isCollapsed && "hidden")}
                        >
                          {route.label}
                        </motion.span>
                        {route.active && (
                          <motion.div
                            className="absolute left-0 top-0 h-full w-1 bg-purple-600 rounded-r-full"
                            layoutId="activeIndicator"
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                          />
                        )}
                      </Link>
                    </TooltipTrigger>
                    {isCollapsed && <TooltipContent side="right">{route.label}</TooltipContent>}
                  </Tooltip>
                )
              })}
              {isAdmin && (
                <Tooltip key="/dashboard/admin/roles" delayDuration={300}>
                  <TooltipTrigger asChild>
                    <Link
                      href="/dashboard/admin/roles"
                      className={cn(
                        "flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-all hover:bg-gray-100",
                        pathname === "/dashboard/admin/roles"
                          ? "bg-purple-50 text-purple-700"
                          : "text-gray-500 hover:text-gray-900",
                        isCollapsed && "justify-center px-0",
                      )}
                    >
                      <Shield
                        className={cn(
                          "h-5 w-5 flex-shrink-0",
                          pathname === "/dashboard/admin/roles" ? "text-purple-600" : "text-gray-400",
                        )}
                      />
                      <motion.span
                        variants={itemVariants}
                        initial={isCollapsed ? "collapsed" : "expanded"}
                        animate={isCollapsed ? "collapsed" : "expanded"}
                        className={cn("ml-3", isCollapsed && "hidden")}
                      >
                        Roles y Permisos
                      </motion.span>
                      {pathname === "/dashboard/admin/roles" && (
                        <motion.div
                          className="absolute left-0 top-0 h-full w-1 bg-purple-600 rounded-r-full"
                          layoutId="activeIndicator"
                          transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        />
                      )}
                    </Link>
                  </TooltipTrigger>
                  {isCollapsed && <TooltipContent side="right">Roles y Permisos</TooltipContent>}
                </Tooltip>
              )}

              <Tooltip key="/dashboard/help/roles" delayDuration={300}>
                <TooltipTrigger asChild>
                  <Link
                    href="/dashboard/help/roles"
                    className={cn(
                      "flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-all hover:bg-gray-100",
                      pathname === "/dashboard/help/roles"
                        ? "bg-purple-50 text-purple-700"
                        : "text-gray-500 hover:text-gray-900",
                      isCollapsed && "justify-center px-0",
                    )}
                  >
                    <HelpCircle
                      className={cn(
                        "h-5 w-5 flex-shrink-0",
                        pathname === "/dashboard/help/roles" ? "text-purple-600" : "text-gray-400",
                      )}
                    />
                    <motion.span
                      variants={itemVariants}
                      initial={isCollapsed ? "collapsed" : "expanded"}
                      animate={isCollapsed ? "collapsed" : "expanded"}
                      className={cn("ml-3", isCollapsed && "hidden")}
                    >
                      Guía de Roles
                    </motion.span>
                    {pathname === "/dashboard/help/roles" && (
                      <motion.div
                        className="absolute left-0 top-0 h-full w-1 bg-purple-600 rounded-r-full"
                        layoutId="activeIndicator"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                  </Link>
                </TooltipTrigger>
                {isCollapsed && <TooltipContent side="right">Guía de Roles</TooltipContent>}
              </Tooltip>
            </div>
          </div>
          <div className="mt-auto px-3 py-2">
            <Tooltip delayDuration={300}>
              <TooltipTrigger asChild>
                <Link
                  href="/logout"
                  className={cn(
                    "flex w-full items-center rounded-lg px-3 py-2 text-sm font-medium text-gray-500 transition-all hover:bg-gray-100 hover:text-gray-900",
                    isCollapsed && "justify-center px-0",
                  )}
                >
                  <LogOut className="h-5 w-5 text-gray-400" />
                  <motion.span
                    variants={itemVariants}
                    initial={isCollapsed ? "collapsed" : "expanded"}
                    animate={isCollapsed ? "collapsed" : "expanded"}
                    className={cn("ml-3", isCollapsed && "hidden")}
                  >
                    Cerrar sesión
                  </motion.span>
                </Link>
              </TooltipTrigger>
              {isCollapsed && <TooltipContent side="right">Cerrar sesión</TooltipContent>}
            </Tooltip>
          </div>
        </div>
      </motion.div>
    </TooltipProvider>
  )
}

export default Sidebar
