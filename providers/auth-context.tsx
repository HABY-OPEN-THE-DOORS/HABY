/**
 * @deprecated Este archivo está obsoleto. Usar auth-provider.tsx en su lugar.
 * Se mantiene por compatibilidad con código existente.
 */
"use client"

import { useAuth as useFirebaseAuth } from "@/providers/auth-provider"

// Re-export the hook from the new file
export const useAuth = useFirebaseAuth

// For backward compatibility
export { useAuth as useFirebaseAuth }

import { createContext, useState, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

// Tipos para el contexto de autenticación
interface AuthContextType {
  user: User | null
  userData: UserData | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string, rememberMe?: boolean) => Promise<void>
  register: (userData: RegisterData) => Promise<void>
  logout: () => void
}

// Usuario simulado
interface User {
  uid: string
  email: string
  displayName: string
  emailVerified: boolean
}

// Tipo para los datos de usuario extendidos
interface UserData {
  uid: string
  firstName: string
  lastName: string
  email: string
  role: "student" | "teacher" | "admin"
  folio: string
  curp: string
  department?: string
  photoURL?: string
}

// Tipo para los datos de registro
interface RegisterData {
  firstName: string
  lastName: string
  email: string
  password: string
  role: "student" | "teacher" | "admin"
  folio: string
  curp: string
  department?: string
}

// Crear el contexto
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Usuarios de demostración
const demoUsers = [
  {
    email: "profesor@ejemplo.com",
    password: "password",
    userData: {
      uid: "teacher-1",
      firstName: "Juan",
      lastName: "Pérez",
      email: "profesor@ejemplo.com",
      role: "teacher",
      folio: "T12345",
      curp: "PERJ800101HDFRZN09",
      department: "Matemáticas",
    },
  },
  {
    email: "alumno@ejemplo.com",
    password: "password",
    userData: {
      uid: "student-1",
      firstName: "Ana",
      lastName: "Martínez",
      email: "alumno@ejemplo.com",
      role: "student",
      folio: "A54321",
      curp: "MARA950215MDFRRN01",
    },
  },
]

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [userData, setUserData] = useState<UserData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  // Verificar si hay un usuario en localStorage al cargar
  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    const storedUserData = localStorage.getItem("userData")

    if (storedUser && storedUserData) {
      setUser(JSON.parse(storedUser))
      setUserData(JSON.parse(storedUserData))
    }
  }, [])

  // Iniciar sesión
  const login = async (email: string, password: string, rememberMe = false) => {
    setIsLoading(true)
    try {
      // Buscar usuario de demostración
      const demoUser = demoUsers.find((u) => u.email === email && u.password === password)

      if (!demoUser) {
        throw new Error("Credenciales incorrectas")
      }

      // Crear usuario simulado
      const mockUser: User = {
        uid: demoUser.userData.uid,
        email: demoUser.email,
        displayName: `${demoUser.userData.firstName} ${demoUser.userData.lastName}`,
        emailVerified: true,
      }

      // Guardar en localStorage
      localStorage.setItem("user", JSON.stringify(mockUser))
      localStorage.setItem("userData", JSON.stringify(demoUser.userData))

      // Actualizar estado
      setUser(mockUser)
      setUserData(demoUser.userData)

      toast({
        title: "Inicio de sesión exitoso",
        description: "Bienvenido de nuevo a HABY-CLASS",
      })

      router.push("/dashboard")
    } catch (error: any) {
      console.error("Error al iniciar sesión:", error)

      toast({
        title: "Error de inicio de sesión",
        description: "Email o contraseña incorrectos.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Registrar nuevo usuario (simulado)
  const register = async (userData: RegisterData) => {
    setIsLoading(true)
    try {
      // Simular registro exitoso
      const mockUser: User = {
        uid: `user-${Date.now()}`,
        email: userData.email,
        displayName: `${userData.firstName} ${userData.lastName}`,
        emailVerified: true,
      }

      const mockUserData: UserData = {
        uid: mockUser.uid,
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        role: userData.role,
        folio: userData.folio,
        curp: userData.curp,
        department: userData.department,
      }

      // Guardar en localStorage
      localStorage.setItem("user", JSON.stringify(mockUser))
      localStorage.setItem("userData", JSON.stringify(mockUserData))

      // Actualizar estado
      setUser(mockUser)
      setUserData(mockUserData)

      toast({
        title: "¡Cuenta creada exitosamente!",
        description: "Ahora puedes acceder a HABY-CLASS.",
      })

      router.push("/dashboard")
    } catch (error: any) {
      console.error("Error al registrar usuario:", error)

      toast({
        title: "Error en el registro",
        description: "Hubo un error al crear tu cuenta. Por favor, intenta de nuevo.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Cerrar sesión
  const logout = () => {
    // Limpiar localStorage
    localStorage.removeItem("user")
    localStorage.removeItem("userData")

    // Limpiar estado
    setUser(null)
    setUserData(null)

    toast({
      title: "Sesión cerrada",
      description: "Has cerrado sesión correctamente.",
    })

    router.push("/login")
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        userData,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

// Alias para mantener compatibilidad con el código existente
