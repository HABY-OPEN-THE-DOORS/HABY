"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

// Tipos para el contexto de autenticación
interface AuthContextType {
  user: MockUser | null
  userData: UserData | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string, rememberMe?: boolean) => Promise<void>
  register: (userData: RegisterData) => Promise<void>
  logout: () => Promise<void>
  resetPassword: (email: string) => Promise<void>
  updateUserProfile: (data: Partial<UserData>) => Promise<void>
}

// Usuario simulado
interface MockUser {
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
  createdAt: any
  updatedAt: any
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
      createdAt: new Date(),
      updatedAt: new Date(),
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
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  },
]

export function MockAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<MockUser | null>(null)
  const [userData, setUserData] = useState<UserData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const { toast } = useToast()

  // Verificar si hay un usuario en localStorage al cargar
  useEffect(() => {
    const storedUser = localStorage.getItem("mockUser")
    const storedUserData = localStorage.getItem("mockUserData")

    if (storedUser && storedUserData) {
      setUser(JSON.parse(storedUser))
      setUserData(JSON.parse(storedUserData))
    }

    setIsLoading(false)
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
      const mockUser: MockUser = {
        uid: demoUser.userData.uid,
        email: demoUser.email,
        displayName: `${demoUser.userData.firstName} ${demoUser.userData.lastName}`,
        emailVerified: true,
      }

      // Guardar en localStorage si rememberMe está activado
      if (rememberMe) {
        localStorage.setItem("mockUser", JSON.stringify(mockUser))
        localStorage.setItem("mockUserData", JSON.stringify(demoUser.userData))
      }

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

      throw error
    } finally {
      setIsLoading(false)
    }
  }

  // Registrar nuevo usuario (simulado)
  const register = async (userData: RegisterData) => {
    setIsLoading(true)
    try {
      // Simular registro exitoso
      const mockUser: MockUser = {
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
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      // Guardar en localStorage
      localStorage.setItem("mockUser", JSON.stringify(mockUser))
      localStorage.setItem("mockUserData", JSON.stringify(mockUserData))

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

      throw error
    } finally {
      setIsLoading(false)
    }
  }

  // Cerrar sesión
  const logout = async () => {
    try {
      // Limpiar localStorage
      localStorage.removeItem("mockUser")
      localStorage.removeItem("mockUserData")
      localStorage.removeItem("mockClasses")

      // Limpiar estado
      setUser(null)
      setUserData(null)

      toast({
        title: "Sesión cerrada",
        description: "Has cerrado sesión correctamente.",
      })

      router.push("/login")
    } catch (error) {
      console.error("Error al cerrar sesión:", error)
      toast({
        title: "Error",
        description: "No se pudo cerrar sesión. Por favor, intenta de nuevo.",
        variant: "destructive",
      })
    }
  }

  // Restablecer contraseña (simulado)
  const resetPassword = async (email: string) => {
    setIsLoading(true)
    try {
      // Simular envío de correo
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Solicitud enviada",
        description: "Se ha enviado un enlace para restablecer tu contraseña a tu dirección de email.",
      })
    } catch (error: any) {
      console.error("Error al solicitar restablecimiento de contraseña:", error)

      toast({
        title: "Error",
        description: "No se pudo procesar tu solicitud. Por favor, intenta de nuevo.",
        variant: "destructive",
      })

      throw error
    } finally {
      setIsLoading(false)
    }
  }

  // Actualizar perfil de usuario (simulado)
  const updateUserProfile = async (data: Partial<UserData>) => {
    if (!user || !userData) return

    setIsLoading(true)
    try {
      // Actualizar datos
      const updatedUserData = {
        ...userData,
        ...data,
        updatedAt: new Date(),
      }

      // Actualizar en localStorage
      localStorage.setItem("mockUserData", JSON.stringify(updatedUserData))

      // Actualizar estado
      setUserData(updatedUserData)

      toast({
        title: "Perfil actualizado",
        description: "Tu perfil ha sido actualizado correctamente.",
      })
    } catch (error) {
      console.error("Error al actualizar perfil:", error)
      toast({
        title: "Error",
        description: "No se pudo actualizar tu perfil. Por favor, intenta de nuevo.",
        variant: "destructive",
      })
      throw error
    } finally {
      setIsLoading(false)
    }
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
        resetPassword,
        updateUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useFirebaseAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useFirebaseAuth must be used within a MockAuthProvider")
  }
  return context
}
