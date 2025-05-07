"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Book, Calendar, MessageSquare, Bell, Settings, Users, FileText, LogOut } from "lucide-react"
import { cn } from "@/lib/utils"

const navigationItems = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Clases", href: "/dashboard/classes", icon: Book },
  { name: "Calendario", href: "/dashboard/calendar", icon: Calendar },
  { name: "Mensajes", href: "/dashboard/messages", icon: MessageSquare },
  { name: "Notificaciones", href: "/dashboard/notifications", icon: Bell },
  { name: "Usuarios", href: "/dashboard/users", icon: Users },
  { name: "Tareas", href: "/dashboard/assignments", icon: FileText },
  { name: "Configuración", href: "/dashboard/settings", icon: Settings },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="flex h-full w-64 flex-col bg-white border-r">
      <div className="flex h-16 items-center border-b px-6">
        <Link href="/dashboard" className="flex items-center font-semibold text-xl">
          HABY-CLASS
        </Link>
      </div>
      <nav className="flex-1 overflow-y-auto p-4">
        <ul className="space-y-1">
          {navigationItems.map((item) => {
            const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`)

            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center rounded-md px-3 py-2 text-sm font-medium",
                    isActive ? "bg-primary text-primary-foreground" : "text-gray-700 hover:bg-gray-100",
                  )}
                >
                  <item.icon className={cn("mr-3 h-5 w-5", isActive ? "text-primary-foreground" : "text-gray-400")} />
                  {item.name}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
      <div className="border-t p-4">
        <button className="flex w-full items-center rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100">
          <LogOut className="mr-3 h-5 w-5 text-gray-400" />
          Cerrar sesión
        </button>
      </div>
    </div>
  )
}

export { Sidebar }
