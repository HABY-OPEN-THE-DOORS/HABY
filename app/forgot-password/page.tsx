"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Logo } from "@/components/logo"
import { useToast } from "@/hooks/use-toast"
import { CustomCaptcha } from "@/components/auth/custom-captcha"
import { LanguageThemeSelector } from "@/components/language-theme-selector"
import { SiteFooter } from "@/components/site-footer"
import { useAuth } from "@/providers/auth-provider"
import { Mail } from "lucide-react"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [captchaValid, setCaptchaValid] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const { toast } = useToast()

  // Usamos el hook de autenticación local en lugar de Firebase
  const auth = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email) {
      toast({
        title: "Error",
        description: "Por favor, ingresa tu dirección de correo electrónico.",
        variant: "destructive",
      })
      return
    }

    if (!captchaValid) {
      toast({
        title: "Error",
        description: "Por favor, completa el captcha de seguridad.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      // Simulamos el envío de un correo de recuperación
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Mostramos un mensaje de éxito
      toast({
        title: "Solicitud enviada",
        description: "Se ha enviado un enlace para restablecer tu contraseña a tu dirección de email.",
      })

      setIsSubmitted(true)
    } catch (error) {
      console.error("Error al solicitar restablecimiento de contraseña:", error)
      toast({
        title: "Error",
        description: "No se pudo procesar tu solicitud. Por favor, intenta de nuevo.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
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
          <h1 className="text-2xl font-bold">Recuperar contraseña</h1>
          <p className="text-sm text-muted-foreground">
            Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña
          </p>
        </div>

        {!isSubmitted ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Correo electrónico</Label>
              <Input
                id="email"
                type="email"
                placeholder="nombre@ejemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                icon={<Mail className="h-4 w-4" />}
                required
              />
            </div>

            <CustomCaptcha onValidate={setCaptchaValid} />

            <Button type="submit" className="w-full" isLoading={isLoading} loadingText="Enviando...">
              Enviar enlace de recuperación
            </Button>
          </form>
        ) : (
          <div className="rounded-md bg-primary/10 p-6 text-center space-y-4">
            <p className="text-primary font-medium">¡Enlace de recuperación enviado!</p>
            <p className="text-sm text-muted-foreground">
              Hemos enviado un enlace para restablecer tu contraseña a {email}. Por favor, revisa tu bandeja de entrada
              y sigue las instrucciones.
            </p>
            <Button variant="outline" className="mt-4" asChild>
              <Link href="/login">Volver a inicio de sesión</Link>
            </Button>
          </div>
        )}

        <div className="mt-6 text-center text-sm">
          <Link href="/login" className="text-primary underline-offset-4 hover:underline">
            Volver a inicio de sesión
          </Link>
        </div>
      </div>

      <SiteFooter />
    </div>
  )
}
