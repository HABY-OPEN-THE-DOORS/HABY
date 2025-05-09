"use client"

import { useAuth } from "@/providers/auth-provider"
import {
  hasPermission,
  getPermissionsByCategory,
  canPerformAction,
  hasRestriction,
  type UserRole,
} from "@/lib/roles-permissions"

export function usePermissions() {
  const { userData } = useAuth()
  const userRole = (userData?.role as UserRole) || "student"

  return {
    // Verificar si el usuario tiene un permiso específico
    can: (permissionId: string) => hasPermission(userRole, permissionId),

    // Verificar si el usuario puede realizar una acción
    canDo: (action: string) => canPerformAction(userRole, action),

    // Verificar si el usuario tiene una restricción
    cannot: (restriction: string) => hasRestriction(userRole, restriction),

    // Obtener todos los permisos del usuario
    getAllPermissions: () => getPermissionsByCategory(userRole),

    // Obtener permisos por categoría
    getPermissionsByCategory: (category: string) => getPermissionsByCategory(userRole, category),

    // Obtener el rol actual del usuario
    role: userRole,

    // Verificar si el usuario es un profesor
    isTeacher: userRole === "teacher" || userRole === "admin",

    // Verificar si el usuario es un estudiante
    isStudent: userRole === "student",

    // Verificar si el usuario es un administrador
    isAdmin: userRole === "admin",
  }
}
