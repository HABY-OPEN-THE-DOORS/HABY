"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  updateProfile,
  sendEmailVerification,
  type User,
} from "firebase/auth"
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore"
import { auth, db } from "@/lib/firebase"
import { useToast } from "@/hooks/use-toast"

// Tipos para el contexto de autenticación
interface AuthContextType {
  user: User | null
  userData: UserData | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string, rememberMe?: boolean) => Promise<void>
  register: (userData: RegisterData) => Promise<void>
  logout: () => Promise<void>
  resetPassword: (email: string) => Promise<void>
  updateUserProfile: (data: Partial<UserData>) => Promise<void>
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

export function FirebaseAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [userData, setUserData] = useState<UserData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const { toast } = useToast()

  // Escuchar cambios en el estado de autenticación
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser)

      if (currentUser) {
        // Obtener datos adicionales del usuario desde Firestore
        try {
          const userDocRef = doc(db, "users", currentUser.uid)
          const userDoc = await getDoc(userDocRef)

          if (userDoc.exists()) {
            setUserData(userDoc.data() as UserData)
          } else {
            console.log("Documento de usuario no existe, creando uno básico...")
            // Si el documento no existe, crear uno básico
            const basicUserData: Partial<UserData> = {
              uid: currentUser.uid,
              email: currentUser.email || "",
              firstName: currentUser.displayName?.split(" ")[0] || "",
              lastName: currentUser.displayName?.split(" ").slice(1).join(" ") || "",
              role: "student", // Rol por defecto
              folio: "",
              curp: "",
              createdAt: serverTimestamp(),
              updatedAt: serverTimestamp(),
            }

            try {
              await setDoc(userDocRef, basicUserData)
              setUserData(basicUserData as UserData)
              console.log("Documento de usuario creado exitosamente")
            } catch (error) {
              console.error("Error al crear documento de usuario:", error)
              toast({
                title: "Error",
                description: "No se pudieron guardar los datos del usuario. Algunas funciones pueden estar limitadas.",
                variant: "destructive",
              })
            }
          }
        } catch (error) {
          console.error("Error al obtener datos del usuario:", error)

          // Usar datos básicos del Auth para no bloquear la experiencia
          const basicUserData: UserData = {
            uid: currentUser.uid,
            email: currentUser.email || "",
            firstName: currentUser.displayName?.split(" ")[0] || "",
            lastName: currentUser.displayName?.split(" ").slice(1).join(" ") || "",
            role: "student",
            folio: "",
            curp: "",
            createdAt: null,
            updatedAt: null,
          }
          setUserData(basicUserData)
        }
      } else {
        setUserData(null)
      }

      setIsLoading(false)
    })

    return () => unsubscribe()
  }, [toast])

  // Iniciar sesión
  const login = async (email: string, password: string, rememberMe = false) => {
    setIsLoading(true)
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)

      // Verificar si el email está verificado
      if (!userCredential.user.emailVerified) {
        toast({
          title: "Email no verificado",
          description: "Por favor, verifica tu email antes de iniciar sesión.",
          variant: "destructive",
        })
        await logout()
        router.push("/verify-email?email=" + encodeURIComponent(email))
        return
      }

      toast({
        title: "Inicio de sesión exitoso",
        description: "Bienvenido de nuevo a HABY-CLASS",
      })

      router.push("/dashboard")
    } catch (error: any) {
      console.error("Error al iniciar sesión:", error)

      // Manejar errores específicos de Firebase Auth
      let errorMessage = "Credenciales incorrectas. Por favor, verifica tus datos."

      if (
        error.code === "auth/invalid-credential" ||
        error.code === "auth/user-not-found" ||
        error.code === "auth/wrong-password"
      ) {
        errorMessage = "Email o contraseña incorrectos."
      } else if (error.code === "auth/too-many-requests") {
        errorMessage = "Demasiados intentos fallidos. Intenta más tarde."
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "El formato del email no es válido."
      } else if (error.code === "auth/user-disabled") {
        errorMessage = "Esta cuenta ha sido deshabilitada. Contacta al administrador."
      } else if (error.code === "auth/network-request-failed") {
        errorMessage = "Error de conexión. Verifica tu conexión a internet."
      }

      toast({
        title: "Error de inicio de sesión",
        description: errorMessage,
        variant: "destructive",
      })

      throw error
    } finally {
      setIsLoading(false)
    }
  }

  // Registrar nuevo usuario
  const register = async (userData: RegisterData) => {
    setIsLoading(true)
    try {
      // Crear usuario en Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, userData.email, userData.password)
      const user = userCredential.user

      // Actualizar perfil con nombre completo
      await updateProfile(user, {
        displayName: `${userData.firstName} ${userData.lastName}`,
      })

      // Enviar email de verificación
      await sendEmailVerification(user)

      // Guardar datos adicionales en Firestore
      const userDocRef = doc(db, "users", user.uid)
      try {
        await setDoc(userDocRef, {
          uid: user.uid,
          firstName: userData.firstName,
          lastName: userData.lastName,
          email: userData.email,
          role: userData.role,
          folio: userData.folio,
          curp: userData.curp,
          department: userData.department || null,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          emailVerified: false,
        })

        console.log("Datos de usuario guardados exitosamente en Firestore")
      } catch (firestoreError) {
        console.error("Error al guardar datos en Firestore:", firestoreError)
        toast({
          title: "Advertencia",
          description:
            "Cuenta creada, pero hubo un problema al guardar datos adicionales. Algunas funciones pueden estar limitadas.",
          variant: "warning",
        })
      }

      toast({
        title: "¡Cuenta creada exitosamente!",
        description: "Se ha enviado un correo de verificación a tu dirección de email.",
      })

      // Cerrar sesión para que el usuario verifique su email
      await logout()
      router.push(`/verify-email?email=${encodeURIComponent(userData.email)}`)
    } catch (error: any) {
      console.error("Error al registrar usuario:", error)

      let errorMessage = "Hubo un error al crear tu cuenta. Por favor, intenta de nuevo."

      if (error.code === "auth/email-already-in-use") {
        errorMessage = "Este email ya está registrado. Intenta iniciar sesión."
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "El formato del email no es válido."
      } else if (error.code === "auth/weak-password") {
        errorMessage = "La contraseña es demasiado débil. Debe tener al menos 6 caracteres."
      }

      toast({
        title: "Error en el registro",
        description: errorMessage,
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
      await signOut(auth)
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

  // Restablecer contraseña
  const resetPassword = async (email: string) => {
    setIsLoading(true)
    try {
      await sendPasswordResetEmail(auth, email)
      toast({
        title: "Solicitud enviada",
        description: "Se ha enviado un enlace para restablecer tu contraseña a tu dirección de email.",
      })
    } catch (error: any) {
      console.error("Error al solicitar restablecimiento de contraseña:", error)

      let errorMessage = "No se pudo procesar tu solicitud. Por favor, intenta de nuevo."
      if (error.code === "auth/user-not-found") {
        errorMessage = "No existe una cuenta con este email."
      }

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })

      throw error
    } finally {
      setIsLoading(false)
    }
  }

  // Actualizar perfil de usuario
  const updateUserProfile = async (data: Partial<UserData>) => {
    if (!user) return

    setIsLoading(true)
    try {
      // Actualizar en Firestore
      const userDocRef = doc(db, "users", user.uid)
      await setDoc(
        userDocRef,
        {
          ...data,
          updatedAt: serverTimestamp(),
        },
        { merge: true },
      )

      // Actualizar displayName y photoURL en Auth si se proporcionan
      if (data.firstName || data.lastName || data.photoURL) {
        const updateData: { displayName?: string; photoURL?: string } = {}

        if (data.firstName || data.lastName) {
          const firstName = data.firstName || userData?.firstName || ""
          const lastName = data.lastName || userData?.lastName || ""
          updateData.displayName = `${firstName} ${lastName}`
        }

        if (data.photoURL) {
          updateData.photoURL = data.photoURL
        }

        await updateProfile(user, updateData)
      }

      // Actualizar el estado local
      if (userData) {
        setUserData({
          ...userData,
          ...data,
        })
      }

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
        isAuthenticated: !!user && user.emailVerified,
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
    throw new Error("useFirebaseAuth must be used within a FirebaseAuthProvider")
  }
  return context
}
