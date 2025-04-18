"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { BookOpen, Calendar, FileText, Home, Settings, Users } from "lucide-react"
import { Suspense } from "react"

interface NavItem {
  title: string
  href: string
  icon: React.ReactNode
}

function DashboardNavContent() {
  const pathname = usePathname()

  const navItems: NavItem[] = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: <Home className="mr-2 h-4 w-4" />,
    },
    {
      title: "Classes",
      href: "/dashboard/classes",
      icon: <BookOpen className="mr-2 h-4 w-4" />,
    },
    {
      title: "Assignments",
      href: "/dashboard/assignments",
      icon: <FileText className="mr-2 h-4 w-4" />,
    },
    {
      title: "Calendar",
      href: "/dashboard/calendar",
      icon: <Calendar className="mr-2 h-4 w-4" />,
    },
    {
      title: "Students",
      href: "/dashboard/students",
      icon: <Users className="mr-2 h-4 w-4" />,
    },
    {
      title: "Settings",
      href: "/dashboard/settings",
      icon: <Settings className="mr-2 h-4 w-4" />,
    },
  ]

  return (
    <nav className="grid items-start gap-2 py-4">
      {navItems.map((item, index) => (
        <Link key={index} href={item.href}>
          <Button
            variant={pathname === item.href ? "secondary" : "ghost"}
            className={cn("w-full justify-start", pathname === item.href && "bg-muted font-medium")}
          >
            {item.icon}
            {item.title}
          </Button>
        </Link>
      ))}
    </nav>
  )
}

export function DashboardNav() {
  return (
    <Suspense
      fallback={
        <div className="grid items-start gap-2 py-4">
          {Array(6)
            .fill(0)
            .map((_, index) => (
              <div key={index} className="h-9 w-full animate-pulse rounded-md bg-muted"></div>
            ))}
        </div>
      }
    >
      <DashboardNavContent />
    </Suspense>
  )
}
