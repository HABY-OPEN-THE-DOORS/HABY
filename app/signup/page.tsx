"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Logo } from "@/components/logo"
import { useToast } from "@/hooks/use-toast"
import { CustomCaptcha } from "@/components/auth/custom-captcha"
import { TermsDialog } from "@/components/auth/terms-dialog"
import { LanguageThemeSelector } from "@/components/language-theme-selector"
import { SiteFooter } from "@/components/site-footer"
import { useAuth } from "@/providers/auth-provider"
import { Eye, EyeOff } from "lucide-react"

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [captchaValid, setCaptchaValid] = useState(false)
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [role, setRole] = useState<"student" | "teacher">("student")

  const router = useRouter()
  const { toast } = useToast()
  const { register } = useAuth()

  // Definir el esquema de validación
  const formSchema = z
    .object({
      firstName: z.string().min(1, "El nombre es obligatorio"),
      lastName: z.string().min(1, "El apellido es obligatorio"),
      email: z.string().email("El correo electrónico no es válido"),
      folio: z.string().min(1, "El folio es obligatorio"),
      curp: z
        .string()
        .min(1, "La CURP es obligatoria")
        .regex(/^[A-Z]{4}[0-9]{6}[HM][A-Z]{5}[0-9]{2}$/, "La CURP no tiene un formato válido"),
      department: z.string().optional(),
      password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
      confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Las contraseñas no coinciden",
      path: ["confirmPassword"],
    })
    .refine(
      (data) => {
        if (role === "teacher" && !data.department) {
          return false
        }
        return true
      },
      {
        message: "El departamento es obligatorio para profesores",
        path: ["department"],
      },
    )

  // Inicializar el formulario
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      folio: "",
      curp: "",
      department: "",
      password: "",
      confirmPassword: "",
    },
  })

  const { formState } = form
  const { isSubmitting, errors } = formState

  // Manejar el envío del formulario
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!captchaValid) {
      toast({
        title: "Error",
        description: "Debes resolver correctamente el captcha",
        variant: "destructive",
      })
      return
    }

    if (!termsAccepted) {
      toast({
        title: "Error",
        description: "Debes aceptar los términos y condiciones",
        variant: "destructive",
      })
      return
    }

    try {
      await register({
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        password: values.password,
        role: role,
        folio: values.folio,
        curp: values.curp,
        department: values.department,
      })

      // El redireccionamiento se maneja en el provider
    } catch (error) {
      console.error("Error en el registro:", error)
      // El manejo de errores se hace en el provider
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
          <h1 className="text-2xl font-bold">
            {role === "student" ? "Registro de Alumnos" : "Registro de Profesores"}
          </h1>
          <p className="text-sm text-muted-foreground">
            {role === "student"
              ? "Ingresa tus datos para registrarte como alumno"
              : "Ingresa tus datos para registrarte como profesor"}
          </p>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <RadioGroup
              defaultValue={role}
              onValueChange={(value) => setRole(value as "student" | "teacher")}
              className="flex justify-center space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="student" id="student" />
                <Label htmlFor="student">Estudiante</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="teacher" id="teacher" />
                <Label htmlFor="teacher">Profesor</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">Nombre</Label>
              <Input
                id="firstName"
                {...form.register("firstName")}
                error={!!errors.firstName}
                aria-invalid={!!errors.firstName}
              />
              {errors.firstName && <p className="text-sm text-destructive">{errors.firstName.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName">Apellido</Label>
              <Input
                id="lastName"
                {...form.register("lastName")}
                error={!!errors.lastName}
                aria-invalid={!!errors.lastName}
              />
              {errors.lastName && <p className="text-sm text-destructive">{errors.lastName.message}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Correo electrónico</Label>
            <Input
              id="email"
              type="email"
              {...form.register("email")}
              error={!!errors.email}
              aria-invalid={!!errors.email}
            />
            {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="folio">Folio</Label>
              <Input id="folio" {...form.register("folio")} error={!!errors.folio} aria-invalid={!!errors.folio} />
              {errors.folio && <p className="text-sm text-destructive">{errors.folio.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="curp">CURP</Label>
              <Input id="curp" {...form.register("curp")} error={!!errors.curp} aria-invalid={!!errors.curp} />
              {errors.curp && <p className="text-sm text-destructive">{errors.curp.message}</p>}
            </div>
          </div>

          {role === "teacher" && (
            <div className="space-y-2">
              <Label htmlFor="department">Departamento</Label>
              <Input
                id="department"
                {...form.register("department")}
                error={!!errors.department}
                aria-invalid={!!errors.department}
              />
              {errors.department && <p className="text-sm text-destructive">{errors.department.message}</p>}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="password">Contraseña</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                {...form.register("password")}
                error={!!errors.password}
                aria-invalid={!!errors.password}
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

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                {...form.register("confirmPassword")}
                error={!!errors.confirmPassword}
                aria-invalid={!!errors.confirmPassword}
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
            {errors.confirmPassword && <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>}
          </div>

          <CustomCaptcha onValidate={setCaptchaValid} />

          <TermsDialog onAccept={setTermsAccepted} accepted={termsAccepted} />

          <Button type="submit" className="w-full" isLoading={isSubmitting} loadingText="Creando cuenta...">
            Crear cuenta
          </Button>
        </form>

        <div className="mt-6 text-center text-sm">
          ¿Ya tienes una cuenta?{" "}
          <Link href="/login" className="text-primary underline-offset-4 hover:underline">
            Iniciar sesión
          </Link>
        </div>
      </div>

      <SiteFooter />
    </div>
  )
}
