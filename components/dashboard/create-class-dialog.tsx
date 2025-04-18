"use client"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { useLanguage } from "@/providers/language-provider"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { generateClassCode } from "@/lib/utils"

interface CreateClassDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreateClass?: (classData: any) => void
}

const classColors = [
  { value: "bg-class-purple", label: "Púrpura" },
  { value: "bg-class-pink", label: "Rosa" },
  { value: "bg-class-green", label: "Verde" },
  { value: "bg-class-red", label: "Rojo" },
  { value: "bg-class-amber", label: "Ámbar" },
  { value: "bg-class-teal", label: "Verde azulado" },
]

export function CreateClassDialog({ open, onOpenChange, onCreateClass }: CreateClassDialogProps) {
  const { toast } = useToast()
  const { t } = useLanguage()

  // Definir el esquema de validación
  const formSchema = z.object({
    name: z.string().min(1, "El nombre es obligatorio"),
    description: z.string().min(1, "La descripción es obligatoria"),
    section: z.string().min(1, "La sección es obligatoria"),
    color: z.string().min(1, "El color es obligatorio"),
  })

  // Inicializar el formulario
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      section: "",
      color: "bg-class-purple",
    },
  })

  const { isSubmitting } = form.formState

  // Manejar el envío del formulario
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      // Generar un código único para la clase
      const classCode = generateClassCode()

      // Crear la clase
      if (onCreateClass) {
        onCreateClass({
          name: values.name,
          description: values.description,
          section: values.section,
          color: values.color,
          code: classCode,
        })
      }

      // Mostrar mensaje de éxito
      toast({
        title: "Clase creada",
        description: "La clase ha sido creada exitosamente.",
      })

      // Cerrar el diálogo y resetear el formulario
      onOpenChange(false)
      form.reset()
    } catch (error) {
      console.error("Error al crear clase:", error)
      toast({
        title: "Error",
        description: "No se pudo crear la clase. Por favor, intenta de nuevo.",
        variant: "destructive",
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Crear nueva clase</DialogTitle>
          <DialogDescription>
            Completa los detalles para crear una nueva clase. Los estudiantes podrán unirse usando el código que se
            generará automáticamente.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre de la clase</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej. Matemáticas 101" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripción</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe brevemente el contenido de la clase"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="section"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sección</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej. Sección A" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Color de la clase</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona un color" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {classColors.map((color) => (
                        <SelectItem key={color.value} value={color.value}>
                          <div className="flex items-center">
                            <div className={`h-4 w-4 rounded-full ${color.value} mr-2`}></div>
                            <span>{color.label}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
                Cancelar
              </Button>
              <Button type="submit" isLoading={isSubmitting} loadingText="Creando...">
                Crear clase
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
