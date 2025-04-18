"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Logo } from "@/components/logo"
import { CheckCircle, XCircle, Loader2 } from "lucide-react"
import { ClientSearchParams, SearchParamsProvider } from "@/components/client-search-params"

export default function VerifyEmailPage() {
  return (
    <SearchParamsProvider fallback={<VerifyEmailLoading />}>
      <VerifyEmailContent />
    </SearchParamsProvider>
  )
}

function VerifyEmailContent() {
  return (
    <ClientSearchParams>
      {(searchParams) => {
        const token = searchParams.get("oobCode")
        const email = searchParams.get("email")
        return <VerifyEmailForm token={token} email={email} />
      }}
    </ClientSearchParams>
  )
}

function VerifyEmailLoading() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 text-center">
        <div className="flex flex-col items-center space-y-2">
          <Logo className="h-12 w-12" />
          <h1 className="text-2xl font-bold">Verificación de Email</h1>
        </div>
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p>Verificando tu dirección de email...</p>
        </div>
      </div>
    </div>
  )
}

function VerifyEmailForm({ token, email }: { token: string | null; email: string | null }) {
  const [verificationState, setVerificationState] = useState<"loading" | "success" | "error">("loading")

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        if (token) {
          // Simulamos la verificación del email
          await new Promise((resolve) => setTimeout(resolve, 1500))
          setVerificationState("success")
        } else if (email) {
          // Si no hay token pero hay email, mostrar la página de información
          setVerificationState("loading")
        } else {
          setVerificationState("error")
        }
      } catch (error) {
        console.error("Error al verificar email:", error)
        setVerificationState("error")
      }
    }

    verifyEmail()
  }, [token, email])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 text-center">
        <div className="flex flex-col items-center space-y-2">
          <Logo className="h-12 w-12" />
          <h1 className="text-2xl font-bold">Verificación de Email</h1>
        </div>

        {verificationState === "loading" && !token && email && (
          <div className="flex flex-col items-center space-y-4">
            <div className="rounded-md bg-primary/10 p-6 text-center">
              <p className="text-primary font-medium">Verifica tu correo electrónico</p>
              <p className="text-sm text-muted-foreground mt-2">
                Hemos enviado un correo de verificación a <strong>{email}</strong>. Por favor, revisa tu bandeja de
                entrada y haz clic en el enlace de verificación.
              </p>
            </div>
            <Link href="/resend-verification">
              <Button variant="outline">Reenviar correo de verificación</Button>
            </Link>
            <Link href="/login">
              <Button variant="link">Volver a inicio de sesión</Button>
            </Link>
          </div>
        )}

        {verificationState === "loading" && token && (
          <div className="flex flex-col items-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p>Verificando tu dirección de email...</p>
          </div>
        )}

        {verificationState === "success" && (
          <div className="flex flex-col items-center space-y-4">
            <CheckCircle className="h-16 w-16 text-green-500" />
            <div className="space-y-2">
              <h2 className="text-xl font-semibold">Email Verificado Correctamente</h2>
              <p className="text-muted-foreground">
                Tu email ha sido verificado. Ahora puedes iniciar sesión en tu cuenta.
              </p>
            </div>
            <Link href="/login">
              <Button>Ir a Inicio de Sesión</Button>
            </Link>
          </div>
        )}

        {verificationState === "error" && (
          <div className="flex flex-col items-center space-y-4">
            <XCircle className="h-16 w-16 text-destructive" />
            <div className="space-y-2">
              <h2 className="text-xl font-semibold">Verificación Fallida</h2>
              <p className="text-muted-foreground">
                No pudimos verificar tu email. El enlace de verificación puede haber expirado o no ser válido.
              </p>
            </div>
            <div className="flex flex-col space-y-2">
              <Link href="/resend-verification">
                <Button variant="outline" className="w-full">
                  Reenviar Correo de Verificación
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="link">Volver a Inicio de Sesión</Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
