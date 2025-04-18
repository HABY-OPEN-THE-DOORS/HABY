"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Logo } from "@/components/logo"
import { useToast } from "@/hooks/use-toast"
import { CustomCaptcha } from "@/components/auth/custom-captcha"
import { LanguageThemeSelector } from "@/components/language-theme-selector"
import { SiteFooter } from "@/components/site-footer"
import { useAuth } from "@/providers/auth-provider"
import { useLanguage } from "@/providers/language-provider"
import { ClientSearchParams, SearchParamsProvider } from "@/components/client-search-params"
import { CheckCircle, Mail, RefreshCw } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export default function VerificationConfirmationPage() {
  return (
    <SearchParamsProvider>
      <VerificationConfirmationContent />
    </SearchParamsProvider>
  )
}

function VerificationConfirmationContent() {
  return (
    <ClientSearchParams>
      {(searchParams) => {
        const email = searchParams.get("email") || ""
        return <VerificationConfirmation email={email} />
      }}
    </ClientSearchParams>
  )
}

function VerificationConfirmation({ email }: { email: string }) {
  const [captchaValid, setCaptchaValid] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const { toast } = useToast()
  const { t, language } = useLanguage()
  const { sendVerificationEmail } = useAuth()

  const handleResendEmail = async () => {
    if (!captchaValid) {
      toast({
        title: language === "es" ? "Error" : "Error",
        description:
          language === "es" ? "Por favor, completa el captcha de seguridad." : "Please complete the security captcha.",
        variant: "destructive",
      })
      return
    }

    if (!email) {
      toast({
        title: language === "es" ? "Error" : "Error",
        description:
          language === "es"
            ? "No se pudo determinar tu dirección de correo electrónico."
            : "Could not determine your email address.",
        variant: "destructive",
      })
      return
    }

    setIsResending(true)
    try {
      await sendVerificationEmail(email)
      toast({
        title: language === "es" ? "Correo enviado" : "Email Sent",
        description:
          language === "es"
            ? "Se ha enviado un nuevo correo de verificación a tu dirección de email."
            : "A new verification email has been sent to your email address.",
      })
      setCaptchaValid(false) // Reset captcha after successful resend
    } catch (error) {
      console.error("Error al reenviar correo de verificación:", error)
      toast({
        title: language === "es" ? "Error" : "Error",
        description:
          language === "es"
            ? "No se pudo enviar el correo de verificación. Por favor, intenta de nuevo."
            : "Could not send verification email. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsResending(false)
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
          <div className="rounded-full bg-primary/10 p-4 mb-2">
            <Mail className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold">
            {language === "es" ? "Verifica tu correo electrónico" : "Verify your email"}
          </h1>
          <p className="text-sm text-muted-foreground">
            {language === "es" ? "Hemos enviado un correo de verificación a:" : "We've sent a verification email to:"}
          </p>
          <p className="font-medium">{email}</p>
        </div>

        <Card className="mb-6 border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/30">
          <CardContent className="pt-6 pb-6">
            <div className="flex items-start space-x-3">
              <CheckCircle className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-medium text-sm">{language === "es" ? "Instrucciones" : "Instructions"}</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  {language === "es"
                    ? "Por favor, revisa tu bandeja de entrada y haz clic en el enlace de verificación que te hemos enviado. Si no encuentras el correo, revisa tu carpeta de spam."
                    : "Please check your inbox and click on the verification link we've sent you. If you don't see the email, check your spam folder."}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-lg font-medium text-center">
              {language === "es" ? "¿No recibiste el correo?" : "Didn't receive the email?"}
            </h2>
            <p className="text-sm text-muted-foreground text-center">
              {language === "es"
                ? "Completa el captcha de seguridad para solicitar un nuevo correo de verificación."
                : "Complete the security captcha to request a new verification email."}
            </p>
          </div>

          <CustomCaptcha onValidate={setCaptchaValid} />

          <Button
            onClick={handleResendEmail}
            className="w-full"
            isLoading={isResending}
            loadingText={language === "es" ? "Enviando..." : "Sending..."}
            disabled={!captchaValid || isResending}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            {language === "es" ? "Reenviar correo de verificación" : "Resend verification email"}
          </Button>

          <div className="text-center text-sm">
            <Link href="/login" className="text-primary underline-offset-4 hover:underline">
              {language === "es" ? "Volver a inicio de sesión" : "Back to login"}
            </Link>
          </div>
        </div>
      </div>

      <SiteFooter />
    </div>
  )
}
