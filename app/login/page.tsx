"use client"

import { useState } from "react"
import Link from "next/link"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Logo } from "@/components/logo"
import { useToast } from "@/hooks/use-toast"
import { LanguageThemeSelector } from "@/components/language-theme-selector"
import { SiteFooter } from "@/components/site-footer"
import { useAuth } from "@/providers/auth-provider"
import { Eye, EyeOff, Mail, Lock, Info } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

// Force demo mode for preview environment
const FORCE_DEMO_MODE = true

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [isDemoMode, setIsDemoMode] = useState(true) // Default to true for safety

  const { toast } = useToast()
  const { login } = useAuth()

  // Definir el esquema de validación
  const formSchema = z.object({
    email: z.string().email("El correo electrónico no es válido"),
    password: z.string().min(1, "La contraseña es obligatoria"),
  })

  // Inicializar el formulario
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const { formState } = form
  const { isSubmitting, errors } = formState

  // Manejar el envío del formulario
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      console.log("Login attempt with:", values.email, "Demo mode:", isDemoMode)

      // Always use demo credentials in preview
      if (FORCE_DEMO_MODE) {
        // Find if this is a demo user
        const isDemoUser = values.email === "profesor@ejemplo.com" || values.email === "alumno@ejemplo.com"

        if (!isDemoUser) {
          toast({
            title: "Modo demostración activo",
            description: "Por favor usa las credenciales de demostración proporcionadas.",
            variant: "warning",
          })
          return
        }
      }

      await login(values.email, values.password, rememberMe)
      // El redireccionamiento se maneja en el provider
    } catch (error) {
      console.error("Error en el inicio de sesión:", error)
      // El manejo de errores se hace en el provider
    }
  }

  // Función para llenar el formulario con credenciales de demostración
  const fillDemoCredentials = (role: "teacher" | "student") => {
    if (role === "teacher") {
      form.setValue("email", "profesor@ejemplo.com")
      form.setValue("password", "password")
    } else {
      form.setValue("email", "alumno@ejemplo.com")
      form.setValue("password", "password")
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <Logo className="h-8 w-8" width={32} height={32} showText />
          </Link>
          <LanguageThemeSelector />
        </div>
      </header>

      <div className="flex-1 container max-w-md py-12">
        <div className="flex flex-col items-center space-y-2 text-center mb-8">
          <h1 className="text-2xl font-bold">Iniciar sesión</h1>
          <p className="text-sm text-muted-foreground">Ingresa tus credenciales para acceder a tu cuenta</p>
        </div>

        <Card className="mb-6 border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/30">
          <CardContent className="pt-6">
            <div className="flex items-start space-x-2">
              <Info className="h-5 w-5 text-blue-500 mt-0.5" />
              <div>
                <h3 className="font-medium text-sm">Credenciales de demostración</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Puedes usar estas cuentas para probar la aplicación:
                </p>
                <div className="mt-2 space-y-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start text-xs"
                    onClick={() => fillDemoCredentials("teacher")}
                  >
                    <span className="font-medium">Profesor:</span>
                    <span className="ml-2">profesor@ejemplo.com / password</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start text-xs"
                    onClick={() => fillDemoCredentials("student")}
                  >
                    <span className="font-medium">Alumno:</span>
                    <span className="ml-2">alumno@ejemplo.com / password</span>
                  </Button>
                </div>
                {FORCE_DEMO_MODE && (
                  <p className="text-xs text-amber-600 dark:text-amber-400 mt-2">
                    <strong>Modo demostración activo:</strong> Solo puedes usar las credenciales de demostración
                    proporcionadas.
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email">Correo electrónico</Label>
            <Input
              id="email"
              type="email"
              {...form.register("email")}
              error={!!errors.email}
              aria-invalid={!!errors.email}
              icon={<Mail className="h-4 w-4" />}
            />
            {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Contraseña</Label>
              <Link href="/forgot-password" className="text-xs text-primary hover:underline">
                ¿Olvidaste tu contraseña?
              </Link>
            </div>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                {...form.register("password")}
                error={!!errors.password}
                aria-invalid={!!errors.password}
                icon={<Lock className="h-4 w-4" />}
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
            {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox id="remember" checked={rememberMe} onCheckedChange={(checked) => setRememberMe(!!checked)} />
            <Label
              htmlFor="remember"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Recordarme
            </Label>
          </div>

          <Button type="submit" className="w-full" isLoading={isSubmitting} loadingText="Iniciando sesión...">
            Iniciar sesión
          </Button>
        </form>

        <div className="mt-6 text-center text-sm">
          ¿No tienes una cuenta?{" "}
          <Link href="/signup" className="text-primary underline-offset-4 hover:underline">
            Registrarse
          </Link>
        </div>
      </div>

      <SiteFooter />
    </div>
  )
}
