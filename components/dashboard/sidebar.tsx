"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { BookOpen, Calendar, Home, LogOut, MessageSquare, Settings, Users, FileText, Bell } from "lucide-react"
import { cn } from "@/lib/utils"

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Sidebar({ className, ...props }: SidebarProps) {
  const pathname = usePathname()

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
      label: "Configuración",
      icon: Settings,
      href: "/dashboard/settings",
      active: pathname === "/dashboard/settings",
    },
  ]

  return (
    <div className={cn("flex h-full w-64 flex-col border-r bg-white", className)} {...props}>
      <div className="flex flex-col space-y-6 py-4">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold">HABY-CLASS</h2>
          <div className="space-y-1">
            {routes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                className={cn(
                  "flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-all hover:bg-gray-100",
                  route.active ? "bg-gray-100 text-black" : "text-gray-500",
                )}
              >
                <route.icon className={cn("mr-3 h-5 w-5", route.active ? "text-blue-600" : "text-gray-400")} />
                {route.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-auto px-3 py-2">
        <Link
          href="/logout"
          className="flex w-full items-center rounded-lg px-3 py-2 text-sm font-medium text-gray-500 transition-all hover:bg-gray-100"
        >
          <LogOut className="mr-3 h-5 w-5 text-gray-400" />
          Cerrar sesión
        </Link>
      </div>
    </div>
  )
}

export default Sidebar
