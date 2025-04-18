// Marcar este archivo como obsoleto ya que estamos usando FirebaseAuthProvider
// Añadir un comentario al principio del archivo
/**
 * @deprecated Este archivo está obsoleto. Usar firebase-auth-provider.tsx en su lugar.
 * Se mantiene por compatibilidad con código existente.
 */
"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { useRouter, usePathname } from "next/navigation"

interface User {
  id: string
  name: string
  email: string
  role: "student" | "teacher" | "admin"
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (user: User) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Verificar si hay un usuario en sessionStorage o localStorage
    const checkAuth = () => {
      const sessionUser = sessionStorage.getItem("user")
      const localUser = localStorage.getItem("user")

      if (sessionUser) {
        setUser(JSON.parse(sessionUser))
      } else if (localUser) {
        setUser(JSON.parse(localUser))
        sessionStorage.setItem("user", localUser)
      }

      setIsLoading(false)
    }

    checkAuth()
  }, [])

  // Redirigir según el estado de autenticación
  useEffect(() => {
    if (!isLoading) {
      const publicPaths = [
        "/login",
        "/signup",
        "/forgot-password",
        "/reset-password",
        "/verify-email",
        "/resend-verification",
      ]
      const isPublicPath = publicPaths.some((path) => pathname?.startsWith(path))
      const isHomePage = pathname === "/"

      if (!user && !isPublicPath && !isHomePage) {
        router.push("/login")
      } else if (user && (isPublicPath || isHomePage)) {
        router.push("/dashboard")
      }
    }
  }, [user, isLoading, pathname, router])

  const login = (userData: User) => {
    setUser(userData)
    sessionStorage.setItem("user", JSON.stringify(userData))
  }

  const logout = () => {
    setUser(null)
    sessionStorage.removeItem("user")
    localStorage.removeItem("user")
    router.push("/login")
  }

  return <AuthContext.Provider value={{ user, isLoading, login, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
