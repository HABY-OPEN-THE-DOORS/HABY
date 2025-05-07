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
import { Eye, EyeOff } from "lucide-react"

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [role, setRole] = useState<"student" | "teacher">("student")

  const router = useRouter()
  const { toast } = useToast()
  const { register } = useAuth()

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
    try {
      // Separar el nombre de usuario en nombre y apellido (simplificado)
      const nameParts = values.username.split(" ")
      const firstName = nameParts[0] || ""
      const lastName = nameParts.slice(1).join(" ") || ""

      await register({
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

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-lg shadow-sm">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Crear Cuenta</h1>
        </div>

        {/* Role selector tabs */}
        <div className="flex rounded-md overflow-hidden border border-gray-200">
          <button
            type="button"
            onClick={() => setRole("student")}
            className={`flex-1 py-2 px-4 text-center ${
              role === "student" ? "bg-purple-600 text-white" : "bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            Estudiante
          </button>
          <button
            type="button"
            onClick={() => setRole("teacher")}
            className={`flex-1 py-2 px-4 text-center ${
              role === "teacher" ? "bg-purple-600 text-white" : "bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            Profesor
          </button>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
              Nombre de Usuario
            </label>
            <Input
              id="username"
              placeholder="Ingrese su nombre de usuario"
              {...form.register("username")}
              error={!!errors.username}
              className="w-full"
            />
            {errors.username && <p className="text-sm text-red-600">{errors.username.message}</p>}
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Correo Electrónico
            </label>
            <Input
              id="email"
              type="email"
              placeholder="correo@ejemplo.com"
              {...form.register("email")}
              error={!!errors.email}
              className="w-full"
            />
            {errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}
          </div>

          <div className="space-y-2">
            <label htmlFor="folio" className="block text-sm font-medium text-gray-700">
              Folio
            </label>
            <Input
              id="folio"
              placeholder="Ingrese su folio"
              {...form.register("folio")}
              error={!!errors.folio}
              className="w-full"
            />
            {errors.folio && <p className="text-sm text-red-600">{errors.folio.message}</p>}
          </div>

          <div className="space-y-2">
            <label htmlFor="curp" className="block text-sm font-medium text-gray-700">
              CURP
            </label>
            <Input
              id="curp"
              placeholder="Ingrese su CURP"
              {...form.register("curp")}
              error={!!errors.curp}
              className="w-full"
            />
            {errors.curp && <p className="text-sm text-red-600">{errors.curp.message}</p>}
          </div>

          {role === "teacher" && (
            <div className="space-y-2">
              <label htmlFor="department" className="block text-sm font-medium text-gray-700">
                Departamento
              </label>
              <Input
                id="department"
                placeholder="Ingrese su departamento"
                {...form.register("department")}
                error={!!errors.department}
                className="w-full"
              />
              {errors.department && <p className="text-sm text-red-600">{errors.department.message}</p>}
            </div>
          )}

          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Contraseña
            </label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Contraseña"
                {...form.register("password")}
                error={!!errors.password}
                className="w-full pr-10"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && <p className="text-sm text-red-600">{errors.password.message}</p>}
          </div>

          <div className="space-y-2">
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
              Confirmar Contraseña
            </label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirmar contraseña"
                {...form.register("confirmPassword")}
                error={!!errors.confirmPassword}
                className="w-full pr-10"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                tabIndex={-1}
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.confirmPassword && <p className="text-sm text-red-600">{errors.confirmPassword.message}</p>}
          </div>

          <Button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-md"
            isLoading={isSubmitting}
            loadingText="Registrando..."
          >
            Registrarse
          </Button>
        </form>

        <div className="text-center text-sm text-gray-600">
          ¿Ya tienes una cuenta?{" "}
          <Link href="/login" className="text-purple-600 hover:text-purple-500 font-medium">
            Inicia Sesión
          </Link>
        </div>
      </div>
    </div>
  )
}
