"use client"

import type React from "react"

import { useState } from "react"
import { DashboardShell } from "@/components/dashboard/shell"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/providers/auth-provider"
import { useToast } from "@/hooks/use-toast"
import { LoadingScreen } from "@/components/loading-screen"
import { motion } from "framer-motion"
import { Camera, FileText, Pencil, User } from "lucide-react"

export default function ProfilePage() {
  const { userData, isLoading, updateUserProfile } = useAuth()
  const { toast } = useToast()

  const [isEditing, setIsEditing] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    bio: "",
    department: "",
  })

  // Inicializar formData cuando userData está disponible
  useState(() => {
    if (userData) {
      setFormData({
        firstName: userData.firstName || "",
        lastName: userData.lastName || "",
        bio: "",
        department: userData.department || "",
      })
    }
  })

  if (isLoading) {
    return <LoadingScreen />
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSaveProfile = async () => {
    setIsUpdating(true)
    try {
      await updateUserProfile({
        firstName: formData.firstName,
        lastName: formData.lastName,
        department: formData.department,
      })
      setIsEditing(false)
      toast({
        title: "Perfil actualizado",
        description: "Tu perfil ha sido actualizado correctamente.",
      })
    } catch (error) {
      console.error("Error al actualizar perfil:", error)
    } finally {
      setIsUpdating(false)
    }
  }

  // Obtener iniciales del nombre del usuario
  const getInitials = () => {
    if (!userData?.firstName) return "U"
    return (userData.firstName[0] + (userData.lastName?.[0] || "")).toUpperCase()
  }

  return (
    <DashboardShell>
      <div className="flex flex-col space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Mi Perfil</h1>
          <p className="text-muted-foreground">Administra tu información personal y configuración</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div
            className="md:col-span-1"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="shadow-soft">
              <CardHeader className="pb-4">
                <CardTitle>Información de Perfil</CardTitle>
                <CardDescription>Tu información personal y de contacto</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center space-y-4">
                <div className="relative">
                  <Avatar className="h-24 w-24 border-2 border-primary/10">
                    {userData?.photoURL ? (
                      <AvatarImage src={userData.photoURL} alt={userData.firstName || "User avatar"} />
                    ) : null}
                    <AvatarFallback className="bg-primary/5 text-primary text-2xl">{getInitials()}</AvatarFallback>
                  </Avatar>
                  <Button
                    size="icon"
                    variant="outline"
                    className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-background"
                  >
                    <Camera className="h-4 w-4" />
                    <span className="sr-only">Cambiar foto</span>
                  </Button>
                </div>

                <div className="text-center">
                  <h3 className="text-lg font-medium">
                    {userData?.firstName ? `${userData.firstName} ${userData.lastName || ""}` : "Usuario"}
                  </h3>
                  <p className="text-sm text-muted-foreground">{userData?.email || "usuario@ejemplo.com"}</p>
                  <div className="mt-2">
                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                      {userData?.role === "teacher" ? "Profesor" : "Estudiante"}
                    </span>
                  </div>
                </div>

                <div className="w-full pt-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Folio:</span>
                    <span className="font-medium">{userData?.folio || "N/A"}</span>
                  </div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">CURP:</span>
                    <span className="font-medium">{userData?.curp || "N/A"}</span>
                  </div>
                  {userData?.role === "teacher" && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Departamento:</span>
                      <span className="font-medium">{userData?.department || "N/A"}</span>
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" onClick={() => setIsEditing(true)}>
                  <Pencil className="mr-2 h-4 w-4" />
                  Editar perfil
                </Button>
              </CardFooter>
            </Card>
          </motion.div>

          <motion.div
            className="md:col-span-2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid grid-cols-3 w-full">
                <TabsTrigger value="overview">Resumen</TabsTrigger>
                <TabsTrigger value="activity">Actividad</TabsTrigger>
                <TabsTrigger value="classes">Clases</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4 mt-6">
                {isEditing ? (
                  <Card className="shadow-soft">
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <User className="mr-2 h-5 w-5" />
                        Editar Perfil
                      </CardTitle>
                      <CardDescription>Actualiza tu información personal</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="firstName">Nombre</Label>
                          <Input
                            id="firstName"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleInputChange}
                            placeholder="Tu nombre"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastName">Apellido</Label>
                          <Input
                            id="lastName"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleInputChange}
                            placeholder="Tu apellido"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="bio">Biografía</Label>
                        <Textarea
                          id="bio"
                          name="bio"
                          value={formData.bio}
                          onChange={handleInputChange}
                          placeholder="Cuéntanos sobre ti..."
                          rows={4}
                        />
                      </div>

                      {userData?.role === "teacher" && (
                        <div className="space-y-2">
                          <Label htmlFor="department">Departamento</Label>
                          <Input
                            id="department"
                            name="department"
                            value={formData.department}
                            onChange={handleInputChange}
                            placeholder="Tu departamento"
                          />
                        </div>
                      )}
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button variant="outline" onClick={() => setIsEditing(false)} disabled={isUpdating}>
                        Cancelar
                      </Button>
                      <Button onClick={handleSaveProfile} isLoading={isUpdating} loadingText="Guardando...">
                        Guardar cambios
                      </Button>
                    </CardFooter>
                  </Card>
                ) : (
                  <>
                    <Card className="shadow-soft">
                      <CardHeader>
                        <CardTitle>Sobre mí</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground">
                          {formData.bio || "No hay información disponible. Edita tu perfil para añadir una biografía."}
                        </p>
                      </CardContent>
                    </Card>

                    <Card className="shadow-soft">
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <FileText className="mr-2 h-5 w-5" />
                          Estadísticas
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">Clases activas</p>
                            <p className="text-2xl font-bold">3</p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">Tareas completadas</p>
                            <p className="text-2xl font-bold">12</p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">Promedio general</p>
                            <p className="text-2xl font-bold">9.2</p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">Días activos</p>
                            <p className="text-2xl font-bold">28</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </>
                )}
              </TabsContent>

              <TabsContent value="activity" className="space-y-4 mt-6">
                <Card className="shadow-soft">
                  <CardHeader>
                    <CardTitle>Actividad reciente</CardTitle>
                    <CardDescription>Tu actividad en la plataforma durante los últimos 30 días</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[1, 2, 3, 4, 5].map((_, index) => (
                        <div key={index} className="flex items-start space-x-4 pb-4 border-b last:border-0">
                          <div className="rounded-full bg-primary/10 p-2">
                            <FileText className="h-4 w-4 text-primary" />
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm font-medium">
                              {index === 0
                                ? "Entregaste una tarea"
                                : index === 1
                                  ? "Comentaste en un anuncio"
                                  : index === 2
                                    ? "Te uniste a una clase"
                                    : index === 3
                                      ? "Recibiste una calificación"
                                      : "Actualizaste tu perfil"}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {index === 0
                                ? "Matemáticas 101 - Ecuaciones Lineales"
                                : index === 1
                                  ? "Física para Principiantes - Anuncio: Cambio de horario"
                                  : index === 2
                                    ? "Te uniste a Introducción a la Programación"
                                    : index === 3
                                      ? "Matemáticas 101 - Ecuaciones Lineales: 95/100"
                                      : "Actualizaste tu información de perfil"}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {index === 0
                                ? "Hace 2 días"
                                : index === 1
                                  ? "Hace 5 días"
                                  : index === 2
                                    ? "Hace 1 semana"
                                    : index === 3
                                      ? "Hace 2 semanas"
                                      : "Hace 3 semanas"}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="classes" className="space-y-4 mt-6">
                <Card className="shadow-soft">
                  <CardHeader>
                    <CardTitle>Mis clases</CardTitle>
                    <CardDescription>Clases en las que estás inscrito actualmente</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {["Matemáticas 101", "Física para Principiantes", "Introducción a la Programación"].map(
                        (className, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                          >
                            <div className="flex items-center space-x-4">
                              <div
                                className={`h-10 w-10 rounded-full flex items-center justify-center ${
                                  index === 0
                                    ? "bg-class-purple text-white"
                                    : index === 1
                                      ? "bg-class-green text-white"
                                      : "bg-class-amber text-white"
                                }`}
                              >
                                {className.substring(0, 1)}
                              </div>
                              <div>
                                <p className="font-medium">{className}</p>
                                <p className="text-sm text-muted-foreground">
                                  {index === 0
                                    ? "Dr. Juan Pérez"
                                    : index === 1
                                      ? "Dra. Ana Martínez"
                                      : "Ing. Carlos Rodríguez"}
                                </p>
                              </div>
                            </div>
                            <Button variant="ghost" size="sm">
                              Ver clase
                            </Button>
                          </div>
                        ),
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </div>
    </DashboardShell>
  )
}
