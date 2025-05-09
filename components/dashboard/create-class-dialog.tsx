"use client"

import React from "react"

import { z } from "zod"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { useLanguage } from "@/providers/language-provider"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { generateClassCode } from "@/lib/utils"
import { BookOpen, Palette, Settings, FileText } from "lucide-react"
import { Slider } from "@/components/ui/slider"
import { cn } from "@/lib/utils"

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
  { value: "bg-class-blue", label: "Azul" },
  { value: "bg-class-indigo", label: "Índigo" },
  { value: "bg-class-orange", label: "Naranja" },
  { value: "bg-class-emerald", label: "Esmeralda" },
]

const classTemplates = [
  { id: "standard", name: "Estándar", description: "Plantilla básica para cualquier tipo de clase" },
  { id: "project", name: "Basada en proyectos", description: "Ideal para clases centradas en proyectos colaborativos" },
  { id: "flipped", name: "Aula invertida", description: "Para metodología de aula invertida con contenido previo" },
  { id: "seminar", name: "Seminario", description: "Para clases tipo seminario con discusiones y debates" },
]

const bannerImages = [
  { id: "default", url: "/images/class-banners/default.jpg", name: "Predeterminado" },
  { id: "math", url: "/images/class-banners/math.jpg", name: "Matemáticas" },
  { id: "science", url: "/images/class-banners/science.jpg", name: "Ciencias" },
  { id: "arts", url: "/images/class-banners/arts.jpg", name: "Artes" },
  { id: "language", url: "/images/class-banners/language.jpg", name: "Idiomas" },
  { id: "history", url: "/images/class-banners/history.jpg", name: "Historia" },
  { id: "custom", url: "", name: "Personalizado" },
]

export function CreateClassDialog({ open, onOpenChange, onCreateClass }: CreateClassDialogProps) {
  const { toast } = useToast()
  const { t } = useLanguage()
  const [activeTab, setActiveTab] = useState("basic")
  const [selectedTemplate, setSelectedTemplate] = useState("standard")
  const [selectedBanner, setSelectedBanner] = useState("default")
  const [customBannerUrl, setCustomBannerUrl] = useState("")
  const [previewClass, setPreviewClass] = useState<any>({
    name: "Nombre de la clase",
    description: "Descripción de la clase",
    color: "bg-class-purple",
    bannerUrl: "/images/class-banners/default.jpg",
  })

  // Definir el esquema de validación
  const formSchema = z.object({
    name: z.string().min(1, "El nombre es obligatorio"),
    description: z.string().min(1, "La descripción es obligatoria"),
    section: z.string().min(1, "La sección es obligatoria"),
    room: z.string().optional(),
    subject: z.string().optional(),
    color: z.string().min(1, "El color es obligatorio"),
    template: z.string().default("standard"),
    bannerType: z.enum(["default", "custom"]).default("default"),
    customBannerUrl: z.string().optional(),
    selectedBanner: z.string().default("default"),
    gradeScale: z.enum(["100", "10", "5", "letter"]).default("100"),
    allowStudentPosts: z.boolean().default(true),
    allowStudentComments: z.boolean().default(true),
    showDeletedItems: z.boolean().default(false),
    emailNotifications: z.boolean().default(true),
    gradingScheme: z.enum(["points", "percentage", "custom"]).default("points"),
    lateSubmissionPolicy: z.enum(["accept", "reject", "penalty"]).default("accept"),
    penaltyPercentage: z.number().min(0).max(100).default(10),
  })

  // Inicializar el formulario
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      section: "",
      room: "",
      subject: "",
      color: "bg-class-purple",
      template: "standard",
      bannerType: "default",
      customBannerUrl: "",
      selectedBanner: "default",
      gradeScale: "100",
      allowStudentPosts: true,
      allowStudentComments: true,
      showDeletedItems: false,
      emailNotifications: true,
      gradingScheme: "points",
      lateSubmissionPolicy: "accept",
      penaltyPercentage: 10,
    },
  })

  const { isSubmitting, watch } = form.formState
  const watchedValues = watch()

  // Actualizar la previsualización cuando cambian los valores
  React.useEffect(() => {
    setPreviewClass({
      name: watchedValues.name || "Nombre de la clase",
      description: watchedValues.description || "Descripción de la clase",
      color: watchedValues.color,
      bannerUrl:
        watchedValues.bannerType === "custom" && watchedValues.customBannerUrl
          ? watchedValues.customBannerUrl
          : bannerImages.find((b) => b.id === watchedValues.selectedBanner)?.url || "/images/class-banners/default.jpg",
    })
  }, [watchedValues])

  // Manejar el envío del formulario
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      // Generar un código único para la clase
      const classCode = generateClassCode()

      // Determinar la URL del banner
      const bannerUrl =
        values.bannerType === "custom" && values.customBannerUrl
          ? values.customBannerUrl
          : bannerImages.find((b) => b.id === values.selectedBanner)?.url || "/images/class-banners/default.jpg"

      // Crear la clase
      if (onCreateClass) {
        onCreateClass({
          name: values.name,
          description: values.description,
          section: values.section,
          room: values.room,
          subject: values.subject,
          color: values.color,
          code: classCode,
          template: values.template,
          bannerUrl: bannerUrl,
          settings: {
            gradeScale: values.gradeScale,
            allowStudentPosts: values.allowStudentPosts,
            allowStudentComments: values.allowStudentComments,
            showDeletedItems: values.showDeletedItems,
            emailNotifications: values.emailNotifications,
            gradingScheme: values.gradingScheme,
            lateSubmissionPolicy: values.lateSubmissionPolicy,
            penaltyPercentage: values.penaltyPercentage,
          },
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
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-purple-600" />
            Crear nueva clase
          </DialogTitle>
          <DialogDescription>
            Completa los detalles para crear una nueva clase. Los estudiantes podrán unirse usando el código que se
            generará automáticamente.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="basic" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="basic" className="flex items-center gap-1">
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">Información básica</span>
              <span className="sm:hidden">Básica</span>
            </TabsTrigger>
            <TabsTrigger value="appearance" className="flex items-center gap-1">
              <Palette className="h-4 w-4" />
              <span className="hidden sm:inline">Apariencia</span>
              <span className="sm:hidden">Diseño</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-1">
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">Configuración</span>
              <span className="sm:hidden">Config.</span>
            </TabsTrigger>
            <TabsTrigger value="preview" className="flex items-center gap-1">
              <BookOpen className="h-4 w-4" />
              <span>Vista previa</span>
            </TabsTrigger>
          </TabsList>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <TabsContent value="basic" className="space-y-4 py-2">
                <FormField
                  control={form.control}
                  name="template"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Plantilla de clase</FormLabel>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                        {classTemplates.map((template) => (
                          <div
                            key={template.id}
                            className={cn(
                              "flex flex-col p-3 rounded-md border-2 cursor-pointer hover:border-primary transition-all",
                              field.value === template.id ? "border-primary bg-primary/5" : "border-muted",
                            )}
                            onClick={() => field.onChange(template.id)}
                          >
                            <div className="font-medium">{template.name}</div>
                            <div className="text-sm text-muted-foreground">{template.description}</div>
                          </div>
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre de la clase*</FormLabel>
                      <FormControl>
                        <Input placeholder="Ej. Matemáticas 101" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="section"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Sección*</FormLabel>
                        <FormControl>
                          <Input placeholder="Ej. Sección A" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="subject"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Asignatura</FormLabel>
                        <FormControl>
                          <Input placeholder="Ej. Matemáticas" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="room"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Aula</FormLabel>
                      <FormControl>
                        <Input placeholder="Ej. Salón 101" {...field} />
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
                      <FormLabel>Descripción*</FormLabel>
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

                <div className="pt-2 text-xs text-muted-foreground">* Campos obligatorios</div>

                <div className="flex justify-between pt-2">
                  <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
                    Cancelar
                  </Button>
                  <Button type="button" onClick={() => setActiveTab("appearance")}>
                    Siguiente: Apariencia
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="appearance" className="space-y-4 py-2">
                <FormField
                  control={form.control}
                  name="color"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Color de la clase*</FormLabel>
                      <div className="grid grid-cols-5 gap-2 pt-1">
                        {classColors.map((color) => (
                          <div
                            key={color.value}
                            className={cn(
                              "h-10 rounded-md cursor-pointer flex items-center justify-center",
                              color.value,
                              field.value === color.value ? "ring-2 ring-primary ring-offset-2" : "",
                            )}
                            onClick={() => field.onChange(color.value)}
                            title={color.label}
                          >
                            {field.value === color.value && (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6 text-white"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </div>
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="selectedBanner"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Banner de la clase</FormLabel>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 pt-1">
                        {bannerImages
                          .filter((b) => b.id !== "custom")
                          .map((banner) => (
                            <div
                              key={banner.id}
                              className={cn(
                                "relative h-24 rounded-md overflow-hidden cursor-pointer border-2 transition-all",
                                field.value === banner.id ? "border-primary" : "border-muted",
                              )}
                              onClick={() => {
                                field.onChange(banner.id)
                                form.setValue("bannerType", "default")
                              }}
                            >
                              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                <span className="text-white font-medium text-sm">{banner.name}</span>
                              </div>
                              <img
                                src={banner.url || "/placeholder.svg?height=100&width=200"}
                                alt={banner.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="bannerType"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center gap-2">
                        <FormControl>
                          <Switch
                            checked={field.value === "custom"}
                            onCheckedChange={(checked) => {
                              field.onChange(checked ? "custom" : "default")
                            }}
                          />
                        </FormControl>
                        <FormLabel className="cursor-pointer">Usar banner personalizado</FormLabel>
                      </div>
                      <FormDescription>Puedes subir tu propia imagen o usar una URL externa</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {form.watch("bannerType") === "custom" && (
                  <FormField
                    control={form.control}
                    name="customBannerUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>URL del banner personalizado</FormLabel>
                        <FormControl>
                          <Input placeholder="https://ejemplo.com/mi-imagen.jpg" {...field} />
                        </FormControl>
                        <FormDescription>Ingresa la URL de una imagen para usar como banner</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <div className="flex justify-between pt-2">
                  <Button type="button" onClick={() => setActiveTab("basic")}>
                    Anterior: Información básica
                  </Button>
                  <Button type="button" onClick={() => setActiveTab("settings")}>
                    Siguiente: Configuración
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="settings" className="space-y-4 py-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Configuración de participación</h3>

                    <FormField
                      control={form.control}
                      name="allowStudentPosts"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                          <div className="space-y-0.5">
                            <FormLabel>Permitir publicaciones de estudiantes</FormLabel>
                            <FormDescription>Los estudiantes pueden crear publicaciones en el tablón</FormDescription>
                          </div>
                          <FormControl>
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="allowStudentComments"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                          <div className="space-y-0.5">
                            <FormLabel>Permitir comentarios de estudiantes</FormLabel>
                            <FormDescription>Los estudiantes pueden comentar en publicaciones</FormDescription>
                          </div>
                          <FormControl>
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="emailNotifications"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                          <div className="space-y-0.5">
                            <FormLabel>Notificaciones por email</FormLabel>
                            <FormDescription>Enviar notificaciones por email para nuevas actividades</FormDescription>
                          </div>
                          <FormControl>
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Configuración de calificaciones</h3>

                    <FormField
                      control={form.control}
                      name="gradeScale"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Escala de calificación</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecciona una escala" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="100">Escala 0-100</SelectItem>
                              <SelectItem value="10">Escala 0-10</SelectItem>
                              <SelectItem value="5">Escala 0-5</SelectItem>
                              <SelectItem value="letter">Escala de letras (A-F)</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormDescription>Define cómo se mostrarán las calificaciones</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="gradingScheme"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Esquema de calificación</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecciona un esquema" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="points">Puntos</SelectItem>
                              <SelectItem value="percentage">Porcentaje</SelectItem>
                              <SelectItem value="custom">Personalizado</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormDescription>Define cómo se calcularán las calificaciones</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="lateSubmissionPolicy"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Política de entregas tardías</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecciona una política" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="accept">Aceptar sin penalización</SelectItem>
                              <SelectItem value="reject">No aceptar</SelectItem>
                              <SelectItem value="penalty">Aceptar con penalización</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormDescription>Define cómo manejar las entregas fuera de plazo</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {form.watch("lateSubmissionPolicy") === "penalty" && (
                      <FormField
                        control={form.control}
                        name="penaltyPercentage"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Porcentaje de penalización: {field.value}%</FormLabel>
                            <FormControl>
                              <Slider
                                defaultValue={[field.value]}
                                max={100}
                                step={5}
                                onValueChange={(vals) => field.onChange(vals[0])}
                              />
                            </FormControl>
                            <FormDescription>
                              Porcentaje que se reducirá de la calificación por entrega tardía
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                  </div>
                </div>

                <div className="flex justify-between pt-4">
                  <Button type="button" onClick={() => setActiveTab("appearance")}>
                    Anterior: Apariencia
                  </Button>
                  <Button type="button" onClick={() => setActiveTab("preview")}>
                    Vista previa
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="preview" className="py-2">
                <div className="border rounded-lg overflow-hidden">
                  <div
                    className="h-40 bg-cover bg-center relative"
                    style={{
                      backgroundImage: `url(${previewClass.bannerUrl || "/placeholder.svg?height=200&width=800"})`,
                    }}
                  >
                    <div className="absolute inset-0 bg-black/30"></div>
                    <div className="absolute bottom-0 left-0 p-4 text-white">
                      <h2 className="text-2xl font-bold">{previewClass.name}</h2>
                      <p className="text-sm opacity-90">{form.watch("section") || "Sección"}</p>
                    </div>
                  </div>
                  <div className={`p-4 border-t-4 ${previewClass.color}`}>
                    <p className="text-sm text-muted-foreground">{previewClass.description}</p>
                    <div className="mt-4 flex items-center gap-2">
                      <div className="text-sm font-medium">Código de clase:</div>
                      <div className="bg-muted px-2 py-1 rounded text-sm font-mono">ABC123</div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between pt-6">
                  <Button type="button" onClick={() => setActiveTab("settings")}>
                    Anterior: Configuración
                  </Button>
                  <Button type="submit" isLoading={isSubmitting} loadingText="Creando...">
                    Crear clase
                  </Button>
                </div>
              </TabsContent>
            </form>
          </Form>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
