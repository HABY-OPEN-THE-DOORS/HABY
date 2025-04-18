"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { BookOpen, Calendar, FileText, Home, Menu, Settings, Users } from "lucide-react"
import { Suspense } from "react"

interface NavItem {
  title: string
  href: string
  icon: React.ReactNode
}

function MobileNavContent() {
  const [open, setOpen] = useState(false)
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
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
        >
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="pr-0">
        <div className="grid gap-2 py-6">
          {navItems.map((item, index) => (
            <Link key={index} href={item.href} onClick={() => setOpen(false)}>
              <Button
                variant={pathname === item.href ? "secondary" : "ghost"}
                className={cn("w-full justify-start", pathname === item.href && "bg-muted font-medium")}
              >
                {item.icon}
                {item.title}
              </Button>
            </Link>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  )
}

export function MobileNav() {
  return (
    <Suspense
      fallback={
        <Button
          variant="ghost"
          className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
        >
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      }
    >
      <MobileNavContent />
    </Suspense>
  )
}
