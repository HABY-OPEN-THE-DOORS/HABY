"use client"

import type { ReactNode } from "react"
import { useAuth } from "@/providers/auth-provider"
import { hasPermission, getPermissionDeniedMessage } from "@/lib/roles-permissions"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { ShieldAlert } from "lucide-react"

interface PermissionGuardProps {
  children: ReactNode
  requiredPermission: string
  fallback?: ReactNode
}

export function PermissionGuard({ children, requiredPermission, fallback }: PermissionGuardProps) {
  const { userData } = useAuth()
  const userRole = userData?.role || "student"

  if (hasPermission(userRole, requiredPermission)) {
    return <>{children}</>
  }

  // Si no tiene permiso, mostrar el fallback o un mensaje de error predeterminado
  if (fallback) {
    return <>{fallback}</>
  }

  return (
    <Alert variant="destructive">
      <ShieldAlert className="h-4 w-4" />
      <AlertTitle>Acceso denegado</AlertTitle>
      <AlertDescription>{getPermissionDeniedMessage(requiredPermission)}</AlertDescription>
    </Alert>
  )
}
