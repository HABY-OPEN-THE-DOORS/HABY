"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Logo } from "@/components/logo"
import { useToast } from "@/hooks/use-toast"
import { ClientSearchParams, SearchParamsProvider } from "@/components/client-search-params"
import { Eye, EyeOff, Loader2 } from "lucide-react"
import { CustomCaptcha } from "@/components/auth/custom-captcha"
import { useAuth } from "@/providers/auth-provider"

export default function ResetPasswordPage() {
  return (
    <SearchParamsProvider fallback={<ResetPasswordLoading />}>
      <ResetPasswordContent />
    </SearchParamsProvider>
  )
}

function ResetPasswordLoading() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center space-y-2 text-center">
          <Logo className="h-12 w-12" />
          <h1 className="text-2xl font-bold">Restableciendo contraseña</h1>
          <p className="text-sm text-muted-foreground">Cargando...</p>
        </div>
        <div className="flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    </div>
  )
}

function ResetPasswordContent() {
  return (
    <ClientSearchParams>
      {(searchParams) => {
        const oobCode = searchParams.get("oobCode")
        return <ResetPasswordForm oobCode={oobCode} />
      }}
    </ClientSearchParams>
  )
}

function ResetPasswordForm({ oobCode }: { oobCode: string | null }) {
  const router = useRouter()
  const { toast } = useToast()
  const [email, setEmail] = useState<string | null>(null)
  const [isVerifying, setIsVerifying] = useState(true)
  const [isTokenValid, setIsTokenValid] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [captchaValid, setCaptchaValid] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { resetPassword } = useAuth()

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  // Simulamos la verificación del token
  useState(() => {
    const verifyToken = async () => {
      if (!oobCode) {
        setIsVerifying(false)
        return
      }

      try {
        // Simulamos una verificación exitosa después de un breve retraso
        await new Promise((resolve) => setTimeout(resolve, 1500))

        // Simulamos un email recuperado del token
        setEmail("usuario@ejemplo.com")
        setIsTokenValid(true)
      } catch (error) {
        console.error("Error al verificar token:", error)
        setIsTokenValid(false)
      } finally {
        setIsVerifying(false)
      }
    }

    verifyToken()
  })

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.password) {
      newErrors.password = "La contraseña es obligatoria"
    } else if (formData.password.length < 8) {
      newErrors.password = "La contraseña debe tener al menos 8 caracteres"
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Las contraseñas no coinciden"
    }

    if (!captchaValid) {
      newErrors.captcha = "Debes resolver correctamente el captcha"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm() || !oobCode) {
      return
    }

    setIsLoading(true)

    try {
      if (!oobCode) {
        throw new Error("OobCode is missing")
      }
      await resetPassword(oobCode, formData.password)

      toast({
        title: "Contraseña restablecida",
        description:
          "Tu contraseña ha sido restablecida correctamente. Ahora puedes iniciar sesión con tu nueva contraseña.",
      })

      router.push("/login")
    } catch (error: any) {
      console.error("Error al restablecer contraseña:", error)
      toast({
        title: "Error al restablecer contraseña",
        description: error?.message || "Hubo un error al restablecer tu contraseña. Por favor, intenta de nuevo.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isVerifying) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8 text-center">
          <div className="flex flex-col items-center space-y-2">
            <Logo className="h-12 w-12" />
            <h1 className="text-2xl font-bold">Verificando enlace</h1>
            <p className="text-sm text-muted-foreground">Por favor, espera mientras verificamos tu enlace...</p>
          </div>
          <div className="flex justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </div>
      </div>
    )
  }

  if (!oobCode || !isTokenValid) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8 text-center">
          <div className="flex flex-col items-center space-y-2">
            <Logo className="h-12 w-12" />
            <h1 className="text-2xl font-bold">Enlace inválido</h1>
            <p className="text-sm text-muted-foreground">
              El enlace para restablecer tu contraseña es inválido o ha expirado. Por favor, solicita un nuevo enlace.
            </p>
          </div>
          <Link href="/forgot-password">
            <Button>Solicitar nuevo enlace</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center space-y-2 text-center">
          <Logo className="h-12 w-12" />
          <h1 className="text-2xl font-bold">Restablecer contraseña</h1>
          <p className="text-sm text-muted-foreground">Ingresa tu nueva contraseña para la cuenta {email}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="password">Nueva contraseña</Label>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                className={errors.password ? "border-red-500" : ""}
                required
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirmar nueva contraseña</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={handleChange}
                className={errors.confirmPassword ? "border-red-500" : ""}
                required
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                tabIndex={-1}
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.confirmPassword && <p className="text-sm text-red-500">{errors.confirmPassword}</p>}
          </div>

          <CustomCaptcha onValidate={setCaptchaValid} />
          {errors.captcha && <p className="text-sm text-red-500">{errors.captcha}</p>}

          <Button type="submit" className="w-full" isLoading={isLoading} loadingText="Restableciendo...">
            Restablecer contraseña
          </Button>
        </form>

        <div className="mt-4 text-center text-sm">
          <Link href="/login" className="text-primary underline-offset-4 hover:underline">
            Volver a inicio de sesión
          </Link>
        </div>
      </div>
    </div>
  )
}
