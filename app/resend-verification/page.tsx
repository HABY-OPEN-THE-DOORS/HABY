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
import { Mail } from "lucide-react"

export default function ResendVerificationPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [captchaValid, setCaptchaValid] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email || !password) {
      toast({
        title: "Error",
        description: "Por favor, completa todos los campos.",
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
      // Simulamos el envío del correo de verificación
      await new Promise((resolve) => setTimeout(resolve, 1500))

      setIsSubmitted(true)
      toast({
        title: "Correo de verificación enviado",
        description: "Por favor, revisa tu bandeja de entrada para el enlace de verificación.",
      })
    } catch (error: any) {
      console.error("Error al reenviar correo de verificación:", error)

      const errorMessage = "No se pudo enviar el correo de verificación. Por favor, intenta de nuevo."

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center space-y-2 text-center">
          <Logo className="h-12 w-12" />
          <h1 className="text-2xl font-bold">Reenviar Correo de Verificación</h1>
          <p className="text-sm text-muted-foreground">
            Ingresa tus credenciales y te enviaremos un nuevo enlace de verificación
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

            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <CustomCaptcha onValidate={setCaptchaValid} />

            <Button type="submit" className="w-full" isLoading={isLoading} loadingText="Enviando...">
              Enviar Correo de Verificación
            </Button>
          </form>
        ) : (
          <div className="rounded-md bg-primary/10 p-4 text-center">
            <p className="text-sm text-primary">
              ¡Correo de verificación enviado! Por favor, revisa tu bandeja de entrada.
            </p>
          </div>
        )}

        <div className="mt-4 text-center text-sm">
          <Link href="/login" className="text-primary underline-offset-4 hover:underline">
            Volver a Inicio de Sesión
          </Link>
        </div>
      </div>
    </div>
  )
}
