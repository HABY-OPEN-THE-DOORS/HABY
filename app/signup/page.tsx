"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/providers/auth-provider"
import { Eye, EyeOff, ArrowLeft } from "lucide-react"
import { CustomCaptcha } from "@/components/auth/custom-captcha"
import { TermsDialog } from "@/components/auth/terms-dialog"
import { motion } from "framer-motion"

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [role, setRole] = useState<"student" | "teacher">("student")
  const [isCaptchaValid, setIsCaptchaValid] = useState(false)
  const [termsAccepted, setTermsAccepted] = useState(false)

  const router = useRouter()
  const { toast } = useToast()
  const { register: registerUser } = useAuth()

  // Definir el esquema de validación
  const formSchema = z
    .object({
      username: z.string().min(1, "El nombre de usuario es obligatorio"),
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
      username: "",
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
    if (!isCaptchaValid) {
      toast({
        title: "Error de validación",
        description: "Por favor, completa el captcha correctamente",
        variant: "destructive",
      })
      return
    }

    if (!termsAccepted) {
      toast({
        title: "Error de validación",
        description: "Debes aceptar los términos y condiciones para continuar",
        variant: "destructive",
      })
      return
    }

    try {
      // Separar el nombre de usuario en nombre y apellido (simplificado)
      const nameParts = values.username.split(" ")
      const firstName = nameParts[0] || ""
      const lastName = nameParts.slice(1).join(" ") || ""

      await registerUser({
        firstName,
        lastName,
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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-purple-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="w-full max-w-md space-y-8 form-card"
      >
        <div className="flex justify-between items-center">
          <Link href="/" className="flex items-center text-gray-600 hover:text-gray-900 transition-colors">
            <ArrowLeft className="h-4 w-4 mr-1" />
            <span className="text-sm">Volver</span>
          </Link>
        </div>

        <motion.div variants={itemVariants} className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Crear Cuenta</h1>
        </motion.div>

        {/* Role selector tabs */}
        <motion.div variants={itemVariants} className="flex rounded-md overflow-hidden border border-gray-200">
          <button
            type="button"
            onClick={() => setRole("student")}
            className={`flex-1 py-2 px-4 text-center transition-all duration-300 ${
              role === "student"
                ? "bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-md"
                : "bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            Estudiante
          </button>
          <button
            type="button"
            onClick={() => setRole("teacher")}
            className={`flex-1 py-2 px-4 text-center transition-all duration-300 ${
              role === "teacher"
                ? "bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-md"
                : "bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            Profesor
          </button>
        </motion.div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <motion.div variants={itemVariants} className="space-y-2">
            <label htmlFor="username" className="form-label">
              Nombre de Usuario
            </label>
            <Input
              id="username"
              placeholder="Ingrese su nombre de usuario"
              {...form.register("username")}
              error={!!errors.username}
              className="form-input"
            />
            {errors.username && <p className="text-sm text-red-600">{errors.username.message}</p>}
          </motion.div>

          <motion.div variants={itemVariants} className="space-y-2">
            <label htmlFor="email" className="form-label">
              Correo Electrónico
            </label>
            <Input
              id="email"
              type="email"
              placeholder="correo@ejemplo.com"
              {...form.register("email")}
              error={!!errors.email}
              className="form-input"
            />
            {errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}
          </motion.div>

          <motion.div variants={itemVariants} className="space-y-2">
            <label htmlFor="folio" className="form-label">
              Folio
            </label>
            <Input
              id="folio"
              placeholder="Ingrese su folio"
              {...form.register("folio")}
              error={!!errors.folio}
              className="form-input"
            />
            {errors.folio && <p className="text-sm text-red-600">{errors.folio.message}</p>}
          </motion.div>

          <motion.div variants={itemVariants} className="space-y-2">
            <label htmlFor="curp" className="form-label">
              CURP
            </label>
            <Input
              id="curp"
              placeholder="Ingrese su CURP"
              {...form.register("curp")}
              error={!!errors.curp}
              className="form-input"
            />
            {errors.curp && <p className="text-sm text-red-600">{errors.curp.message}</p>}
          </motion.div>

          {role === "teacher" && (
            <motion.div variants={itemVariants} className="space-y-2">
              <label htmlFor="department" className="form-label">
                Departamento
              </label>
              <Input
                id="department"
                placeholder="Ingrese su departamento"
                {...form.register("department")}
                error={!!errors.department}
                className="form-input"
              />
              {errors.department && <p className="text-sm text-red-600">{errors.department.message}</p>}
            </motion.div>
          )}

          <motion.div variants={itemVariants} className="space-y-2">
            <label htmlFor="password" className="form-label">
              Contraseña
            </label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Contraseña"
                {...form.register("password")}
                error={!!errors.password}
                className="form-input pr-10"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && <p className="text-sm text-red-600">{errors.password.message}</p>}
          </motion.div>

          <motion.div variants={itemVariants} className="space-y-2">
            <label htmlFor="confirmPassword" className="form-label">
              Confirmar Contraseña
            </label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirmar contraseña"
                {...form.register("confirmPassword")}
                error={!!errors.confirmPassword}
                className="form-input pr-10"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                tabIndex={-1}
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.confirmPassword && <p className="text-sm text-red-600">{errors.confirmPassword.message}</p>}
          </motion.div>

          <motion.div variants={itemVariants}>
            <CustomCaptcha onValidate={setIsCaptchaValid} />
          </motion.div>

          <motion.div variants={itemVariants}>
            <TermsDialog onAccept={setTermsAccepted} accepted={termsAccepted} />
          </motion.div>

          <motion.div variants={itemVariants}>
            <Button
              type="submit"
              className="form-button"
              isLoading={isSubmitting}
              loadingText="Registrando..."
              disabled={!isCaptchaValid || !termsAccepted}
            >
              Registrarse
            </Button>
          </motion.div>
        </form>

        <motion.div variants={itemVariants} className="text-center text-sm text-gray-600">
          ¿Ya tienes una cuenta?{" "}
          <Link href="/login" className="text-purple-600 hover:text-purple-500 font-medium transition-colors">
            Inicia Sesión
          </Link>
        </motion.div>
      </motion.div>
    </div>
  )
}
