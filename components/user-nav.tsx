"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/providers/auth-provider"
import { useLanguage } from "@/providers/language-provider"
import { User, Settings, LogOut } from "lucide-react"

export function UserNav() {
  const { userData, logout } = useAuth()
  const { t } = useLanguage()

  // Obtener iniciales del nombre del usuario
  const getInitials = () => {
    if (!userData?.firstName) return "U"
    return (userData.firstName[0] + (userData.lastName?.[0] || "")).toUpperCase()
  }

  // Determinar el rol en el idioma correcto
  const getUserRole = () => {
    if (!userData) return ""
    return userData.role === "teacher" ? t("auth.signup.role.teacher") : t("auth.signup.role.student")
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10 border-2 border-primary/10">
            {userData?.photoURL ? (
              <AvatarImage src={userData.photoURL} alt={userData.firstName || "User avatar"} />
            ) : null}
            <AvatarFallback className="bg-primary/5 text-primary">{getInitials()}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-60" align="end" forceMount>
        <DropdownMenuLabel className="font-normal p-4 pb-2">
          <div className="flex flex-col space-y-1">
            <p className="text-base font-medium leading-none break-words">
              {userData?.firstName ? `${userData.firstName} ${userData.lastName || ""}` : "Usuario"}
            </p>
            <p className="text-xs leading-none text-muted-foreground break-all mt-1">
              {userData?.email || "usuario@ejemplo.com"}
            </p>
            <div className="flex items-center mt-2">
              <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">{getUserRole()}</span>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => (window.location.href = "/dashboard/profile")}>
            <User className="mr-2 h-4 w-4" />
            <span>{t("profile.title")}</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => (window.location.href = "/dashboard/settings")}>
            <Settings className="mr-2 h-4 w-4" />
            <span>{t("profile.settings")}</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={logout} className="text-destructive focus:text-destructive">
          <LogOut className="mr-2 h-4 w-4" />
          <span>{t("profile.logout")}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
