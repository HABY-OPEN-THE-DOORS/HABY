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
import { doc, setDoc, getDoc, serverTimestamp, updateDoc } from "firebase/firestore"
import { auth, db } from "@/lib/firebase"
import { useToast } from "@/hooks/use-toast"
import { useLanguage } from "@/providers/language-provider"

// Force demo mode for preview environment
const FORCE_DEMO_MODE = true

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
  verifyEmail: (oobCode: string) => Promise<boolean>
  sendVerificationEmail: (email: string) => Promise<void>
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
  preferredLanguage?: string
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

// Usuarios de demostración para login sin Firebase
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
      preferredLanguage: "es",
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
      preferredLanguage: "es",
    },
  },
]

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [userData, setUserData] = useState<UserData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const { toast } = useToast()
  const { language, setLanguage } = useLanguage()

  // Verificar si estamos en modo de demostración
  // Always use demo mode in preview
  const isDemoMode =
    FORCE_DEMO_MODE || process.env.NEXT_PUBLIC_DEMO_MODE === "true" || !process.env.NEXT_PUBLIC_FIREBASE_API_KEY

  console.log("Auth Provider - Demo Mode:", isDemoMode)

  // Escuchar cambios en el estado de autenticación
  useEffect(() => {
    // Si estamos en modo demo, no intentamos conectar con Firebase
    if (isDemoMode) {
      console.log("Using demo mode for authentication")
      // Verificar si hay un usuario en localStorage
      const storedUser = localStorage.getItem("mockUser")
      const storedUserData = localStorage.getItem("mockUserData")

      if (storedUser && storedUserData) {
        const parsedUserData = JSON.parse(storedUserData)
        setUser(JSON.parse(storedUser))
        setUserData(parsedUserData)

        // Set language based on user preference
        if (parsedUserData.preferredLanguage) {
          setLanguage(parsedUserData.preferredLanguage as any)
        }
      }

      setIsLoading(false)
      return () => {} // Empty cleanup function
    }

    try {
      const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
        setUser(currentUser)

        if (currentUser) {
          // Obtener datos adicionales del usuario desde Firestore
          try {
            const userDocRef = doc(db, "users", currentUser.uid)
            const userDoc = await getDoc(userDocRef)

            if (userDoc.exists()) {
              const userData = userDoc.data() as UserData
              setUserData(userData)

              // Set language based on user preference
              if (userData.preferredLanguage) {
                setLanguage(userData.preferredLanguage as any)
              }
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
                preferredLanguage: language,
              }

              try {
                await setDoc(userDocRef, basicUserData)
                setUserData(basicUserData as UserData)
                console.log("Documento de usuario creado exitosamente")
              } catch (error) {
                console.error("Error al crear documento de usuario:", error)
                toast({
                  title: "Error",
                  description:
                    "No se pudieron guardar los datos del usuario. Algunas funciones pueden estar limitadas.",
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
              preferredLanguage: language,
            }
            setUserData(basicUserData)
          }
        } else {
          setUserData(null)
        }

        setIsLoading(false)
      })

      return () => unsubscribe()
    } catch (error) {
      console.error("Error setting up auth state listener:", error)
      setIsLoading(false)
      return () => {} // Empty cleanup function
    }
  }, [toast, isDemoMode, language, setLanguage])

  // Iniciar sesión
  const login = async (email: string, password: string, rememberMe = false) => {
    setIsLoading(true)
    try {
      // Si estamos en modo demo, usar los usuarios de demostración
      if (isDemoMode) {
        console.log("Using demo mode for login")
        // Buscar usuario de demostración
        const demoUser = demoUsers.find((u) => u.email === email && u.password === password)

        if (!demoUser) {
          throw new Error("Credenciales incorrectas")
        }

        // Crear usuario simulado
        const mockUser: any = {
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

        // Set language based on user preference
        if (demoUser.userData.preferredLanguage) {
          setLanguage(demoUser.userData.preferredLanguage as any)
        }

        toast({
          title: "Inicio de sesión exitoso",
          description: "Bienvenido de nuevo a HABY-CLASS",
        })

        router.push("/dashboard")
        return
      }

      // Modo normal con Firebase
      console.log("Attempting to login with Firebase:", email)
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
      // Si estamos en modo demo, simular registro
      if (isDemoMode) {
        console.log("Using demo mode for registration")
        // Simular registro exitoso
        const mockUser: any = {
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
          preferredLanguage: language,
        }

        // Guardar en localStorage
        localStorage.setItem("mockUser", JSON.stringify(mockUser))
        localStorage.setItem("mockUserData", JSON.stringify(mockUserData))

        // Actualizar estado
        setUser(mockUser)
        setUserData(mockUserData)

        toast({
          title: "¡Cuenta creada exitosamente!",
          description: "Se ha enviado un correo de verificación a tu dirección de email.",
        })

        // Redirect to verification confirmation page
        router.push(`/verification-confirmation?email=${encodeURIComponent(userData.email)}`)
        return
      }

      // Modo normal con Firebase
      // Crear usuario en Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, userData.email, userData.password)
      const user = userCredential.user

      // Actualizar perfil con nombre completo
      await updateProfile(user, {
        displayName: `${userData.firstName} ${userData.lastName}`,
      })

      // Enviar email de verificación con plantilla según el idioma
      await sendEmailVerification(user, {
        // Firebase no permite personalizar completamente el email, pero podemos usar
        // diferentes plantillas según el idioma configurado en Firebase
        customParameters: {
          // Esto requiere configurar plantillas en Firebase Console
          langCode: language === "es" ? "es" : "en",
        },
      })

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
          preferredLanguage: language, // Guardar preferencia de idioma
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

      // Mensaje según el idioma
      const successTitle = language === "es" ? "¡Cuenta creada exitosamente!" : "Account created successfully!"
      const successDesc =
        language === "es"
          ? "Se ha enviado un correo de verificación a tu dirección de email."
          : "A verification email has been sent to your email address."

      toast({
        title: successTitle,
        description: successDesc,
      })

      // Redirect to verification confirmation page instead of logout
      router.push(`/verification-confirmation?email=${encodeURIComponent(userData.email)}`)
    } catch (error: any) {
      console.error("Error al registrar usuario:", error)

      let errorMessage =
        language === "es"
          ? "Hubo un error al crear tu cuenta. Por favor, intenta de nuevo."
          : "There was an error creating your account. Please try again."

      if (error.code === "auth/email-already-in-use") {
        errorMessage =
          language === "es"
            ? "Este email ya está registrado. Intenta iniciar sesión."
            : "This email is already registered. Try logging in."
      } else if (error.code === "auth/invalid-email") {
        errorMessage = language === "es" ? "El formato del email no es válido." : "The email format is not valid."
      } else if (error.code === "auth/weak-password") {
        errorMessage =
          language === "es"
            ? "La contraseña es demasiado débil. Debe tener al menos 6 caracteres."
            : "The password is too weak. It must be at least 6 characters."
      }

      toast({
        title: language === "es" ? "Error en el registro" : "Registration Error",
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
      if (isDemoMode) {
        console.log("Using demo mode for logout")
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
        return
      }

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
      if (isDemoMode) {
        console.log("Using demo mode for password reset")
        // Simular envío de correo
        await new Promise((resolve) => setTimeout(resolve, 1000))

        toast({
          title: "Solicitud enviada",
          description: "Se ha enviado un enlace para restablecer tu contraseña a tu dirección de email.",
        })
        return
      }

      await sendPasswordResetEmail(auth, email, {
        // Usar el idioma actual para la plantilla de correo
        customParameters: {
          langCode: language === "es" ? "es" : "en",
        },
      })

      toast({
        title: language === "es" ? "Solicitud enviada" : "Request Sent",
        description:
          language === "es"
            ? "Se ha enviado un enlace para restablecer tu contraseña a tu dirección de email."
            : "A password reset link has been sent to your email address.",
      })
    } catch (error: any) {
      console.error("Error al solicitar restablecimiento de contraseña:", error)

      let errorMessage =
        language === "es"
          ? "No se pudo procesar tu solicitud. Por favor, intenta de nuevo."
          : "Your request could not be processed. Please try again."

      if (error.code === "auth/user-not-found") {
        errorMessage =
          language === "es" ? "No existe una cuenta con este email." : "There is no account with this email."
      }

      toast({
        title: language === "es" ? "Error" : "Error",
        description: errorMessage,
        variant: "destructive",
      })

      throw error
    } finally {
      setIsLoading(false)
    }
  }

  // Verificar email con código
  const verifyEmail = async (oobCode: string): Promise<boolean> => {
    setIsLoading(true)
    try {
      if (isDemoMode) {
        console.log("Using demo mode for email verification")
        // Simular verificación exitosa
        await new Promise((resolve) => setTimeout(resolve, 1500))

        toast({
          title: "Email verificado",
          description: "Tu dirección de email ha sido verificada correctamente.",
        })

        return true
      }

      // En una implementación real, aquí se verificaría el código OOB
      // con la API de Firebase Auth

      // Simulamos una verificación exitosa
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Actualizar el estado de verificación en Firestore
      if (user) {
        const userDocRef = doc(db, "users", user.uid)
        await updateDoc(userDocRef, {
          emailVerified: true,
          updatedAt: serverTimestamp(),
        })
      }

      toast({
        title: "Email verificado",
        description: "Tu dirección de email ha sido verificada correctamente.",
      })

      return true
    } catch (error) {
      console.error("Error al verificar email:", error)
      toast({
        title: "Error de verificación",
        description: "No se pudo verificar tu dirección de email. El enlace puede haber expirado.",
        variant: "destructive",
      })
      return false
    } finally {
      setIsLoading(false)
    }
  }

  // Enviar email de verificación
  const sendVerificationEmail = async (email: string): Promise<void> => {
    setIsLoading(true)
    try {
      if (isDemoMode) {
        console.log("Using demo mode for sending verification email")
        // Simular envío
        await new Promise((resolve) => setTimeout(resolve, 1500))

        toast({
          title: "Email enviado",
          description: "Se ha enviado un nuevo correo de verificación a tu dirección de email.",
        })
        return
      }

      // En una implementación real, aquí se enviaría un nuevo email de verificación
      // Simulamos el envío
      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast({
        title: "Email enviado",
        description: "Se ha enviado un nuevo correo de verificación a tu dirección de email.",
      })
    } catch (error) {
      console.error("Error al enviar email de verificación:", error)
      toast({
        title: "Error",
        description: "No se pudo enviar el correo de verificación. Por favor, intenta de nuevo.",
        variant: "destructive",
      })
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  // Actualizar perfil de usuario
  const updateUserProfile = async (data: Partial<UserData>) => {
    if (!user && !isDemoMode) return

    setIsLoading(true)
    try {
      if (isDemoMode) {
        console.log("Using demo mode for profile update")
        // Actualizar datos
        const updatedUserData = {
          ...userData,
          ...data,
          updatedAt: new Date(),
        }

        // Actualizar en localStorage
        localStorage.setItem("mockUserData", JSON.stringify(updatedUserData))

        // Actualizar estado
        setUserData(updatedUserData as UserData)

        // Update language if preference changed
        if (data.preferredLanguage && data.preferredLanguage !== userData?.preferredLanguage) {
          setLanguage(data.preferredLanguage as any)
        }

        toast({
          title: "Perfil actualizado",
          description: "Tu perfil ha sido actualizado correctamente.",
        })
        return
      }

      // Actualizar en Firestore
      const userDocRef = doc(db, "users", user!.uid)
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

        await updateProfile(user!, updateData)
      }

      // Actualizar el estado local
      if (userData) {
        const updatedUserData = {
          ...userData,
          ...data,
        }
        setUserData(updatedUserData)

        // Update language if preference changed
        if (data.preferredLanguage && data.preferredLanguage !== userData.preferredLanguage) {
          setLanguage(data.preferredLanguage as any)
        }
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
        isAuthenticated: isDemoMode ? !!user : !!user && user.emailVerified,
        login,
        register,
        logout,
        resetPassword,
        updateUserProfile,
        verifyEmail,
        sendVerificationEmail,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
