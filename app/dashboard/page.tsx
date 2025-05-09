"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/providers/auth-provider"
import { useClasses } from "@/hooks/use-classes"
import { ClassGrid } from "@/components/dashboard/class-grid"
import { CreateClassDialog } from "@/components/dashboard/create-class-dialog"
import { JoinClassDialog } from "@/components/dashboard/join-class-dialog"
import { Calendar, Clock, BookOpen, FileText, Bell, BarChart } from "lucide-react"
import { motion } from "framer-motion"

export default function DashboardPage() {
  const { user } = useAuth()
  const { classes, isLoading, error } = useClasses()
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isJoinDialogOpen, setIsJoinDialogOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")

  // Datos de ejemplo para el dashboard
  const upcomingEvents = [
    { id: 1, title: "Entrega de proyecto final", course: "Matemáticas 101", date: "Hoy, 23:59" },
    { id: 2, title: "Examen parcial", course: "Física Avanzada", date: "Mañana, 10:00" },
    { id: 3, title: "Sesión de tutoría", course: "Programación", date: "26 Mayo, 15:30" },
  ]

  const recentAnnouncements = [
    {
      id: 1,
      title: "Material de estudio actualizado",
      course: "Matemáticas 101",
      date: "Hace 2 horas",
      preview: "Se han añadido nuevos ejercicios para el examen final...",
    },
    {
      id: 2,
      title: "Cambio de horario",
      course: "Física Avanzada",
      date: "Hace 1 día",
      preview: "La clase del próximo lunes se moverá a las 14:00...",
    },
  ]

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
    <motion.div className="container py-6 space-y-8" initial="hidden" animate="visible" variants={containerVariants}>
      <motion.div
        variants={itemVariants}
        className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Bienvenido, {user?.displayName || "Usuario"}. Aquí tienes un resumen de tu actividad.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setIsJoinDialogOpen(true)}
            className="transition-all duration-300 hover:border-purple-500 hover:text-purple-700"
          >
            Unirse a clase
          </Button>
          <Button
            onClick={() => setIsCreateDialogOpen(true)}
            className="bg-purple-600 hover:bg-purple-700 text-white shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
          >
            Crear clase
          </Button>
        </div>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-muted/50">
            <TabsTrigger value="overview" className="data-[state=active]:bg-white data-[state=active]:text-purple-700">
              Resumen
            </TabsTrigger>
            <TabsTrigger value="classes" className="data-[state=active]:bg-white data-[state=active]:text-purple-700">
              Mis clases
            </TabsTrigger>
            <TabsTrigger value="calendar" className="data-[state=active]:bg-white data-[state=active]:text-purple-700">
              Calendario
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-white data-[state=active]:text-purple-700">
              Análisis
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <motion.div
                variants={itemVariants}
                className="bg-white rounded-xl border shadow-sm p-6 hover:shadow-md transition-shadow duration-300"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Clases activas</p>
                    <p className="text-3xl font-bold">{classes?.length || 0}</p>
                  </div>
                  <div className="p-2 bg-purple-100 rounded-full">
                    <BookOpen className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
              </motion.div>

              <motion.div
                variants={itemVariants}
                className="bg-white rounded-xl border shadow-sm p-6 hover:shadow-md transition-shadow duration-300"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Tareas pendientes</p>
                    <p className="text-3xl font-bold">5</p>
                  </div>
                  <div className="p-2 bg-amber-100 rounded-full">
                    <FileText className="h-6 w-6 text-amber-600" />
                  </div>
                </div>
              </motion.div>

              <motion.div
                variants={itemVariants}
                className="bg-white rounded-xl border shadow-sm p-6 hover:shadow-md transition-shadow duration-300"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Eventos próximos</p>
                    <p className="text-3xl font-bold">3</p>
                  </div>
                  <div className="p-2 bg-blue-100 rounded-full">
                    <Calendar className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </motion.div>

              <motion.div
                variants={itemVariants}
                className="bg-white rounded-xl border shadow-sm p-6 hover:shadow-md transition-shadow duration-300"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Notificaciones</p>
                    <p className="text-3xl font-bold">7</p>
                  </div>
                  <div className="p-2 bg-red-100 rounded-full">
                    <Bell className="h-6 w-6 text-red-600" />
                  </div>
                </div>
              </motion.div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <motion.div variants={itemVariants}>
                <Card className="border-t-4 border-t-purple-500 shadow-sm hover:shadow-md transition-shadow duration-300">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle>Próximos eventos</CardTitle>
                      <Button variant="ghost" size="sm" className="text-purple-600 hover:text-purple-700">
                        Ver todos
                      </Button>
                    </div>
                    <CardDescription>No te pierdas estas fechas importantes</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {upcomingEvents.map((event) => (
                        <div
                          key={event.id}
                          className="flex items-start space-x-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors duration-200"
                        >
                          <div className="p-2 bg-purple-100 rounded-full">
                            <Clock className="h-4 w-4 text-purple-600" />
                          </div>
                          <div className="flex-1 space-y-1">
                            <p className="font-medium">{event.title}</p>
                            <p className="text-sm text-muted-foreground">{event.course}</p>
                            <p className="text-xs font-medium text-purple-600">{event.date}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={itemVariants}>
                <Card className="border-t-4 border-t-amber-500 shadow-sm hover:shadow-md transition-shadow duration-300">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle>Anuncios recientes</CardTitle>
                      <Button variant="ghost" size="sm" className="text-amber-600 hover:text-amber-700">
                        Ver todos
                      </Button>
                    </div>
                    <CardDescription>Mantente al día con las novedades de tus clases</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentAnnouncements.map((announcement) => (
                        <div
                          key={announcement.id}
                          className="p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors duration-200"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <p className="font-medium">{announcement.title}</p>
                            <p className="text-xs text-muted-foreground">{announcement.date}</p>
                          </div>
                          <p className="text-sm text-muted-foreground mb-1">{announcement.course}</p>
                          <p className="text-sm">{announcement.preview}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </TabsContent>

          <TabsContent value="classes">
            <ClassGrid
              classes={classes || []}
              isLoading={isLoading}
              error={error}
              onCreateClass={() => setIsCreateDialogOpen(true)}
              onJoinClass={() => setIsJoinDialogOpen(true)}
            />
          </TabsContent>

          <TabsContent value="calendar">
            <Card>
              <CardHeader>
                <CardTitle>Calendario</CardTitle>
                <CardDescription>Visualiza tus eventos y fechas importantes</CardDescription>
              </CardHeader>
              <CardContent className="h-[500px] flex items-center justify-center">
                <div className="text-center">
                  <Calendar className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium">Calendario en desarrollo</h3>
                  <p className="text-muted-foreground">
                    Estamos trabajando para ofrecerte un calendario completo próximamente.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle>Análisis de rendimiento</CardTitle>
                <CardDescription>Visualiza tu progreso académico</CardDescription>
              </CardHeader>
              <CardContent className="h-[500px] flex items-center justify-center">
                <div className="text-center">
                  <BarChart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium">Análisis en desarrollo</h3>
                  <p className="text-muted-foreground">
                    Estamos trabajando para ofrecerte análisis detallados próximamente.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>

      <CreateClassDialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen} />
      <JoinClassDialog open={isJoinDialogOpen} onOpenChange={setIsJoinDialogOpen} />
    </motion.div>
  )
}
