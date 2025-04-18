"use client"

import { useState } from "react"
import { DashboardShell } from "@/components/dashboard/shell"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/providers/auth-provider"
import { LoadingScreen } from "@/components/loading-screen"
import { motion } from "framer-motion"
import { Mail, MessageSquare, Search, UserPlus, Users } from "lucide-react"
import { Badge } from "@/components/ui/badge"

// Datos de ejemplo para estudiantes
const studentData = [
  {
    id: "1",
    name: "Ana Martínez",
    email: "ana.martinez@ejemplo.com",
    avatar: "/placeholder.svg?height=40&width=40",
    initials: "AM",
    status: "online",
    classes: ["Matemáticas 101", "Física para Principiantes"],
    isFriend: true,
  },
  {
    id: "2",
    name: "Roberto López",
    email: "roberto.lopez@ejemplo.com",
    avatar: "/placeholder.svg?height=40&width=40",
    initials: "RL",
    status: "offline",
    classes: ["Matemáticas 101", "Introducción a la Programación"],
    isFriend: true,
  },
  {
    id: "3",
    name: "Carlos Sánchez",
    email: "carlos.sanchez@ejemplo.com",
    avatar: "/placeholder.svg?height=40&width=40",
    initials: "CS",
    status: "online",
    classes: ["Física para Principiantes"],
    isFriend: false,
  },
  {
    id: "4",
    name: "María Rodríguez",
    email: "maria.rodriguez@ejemplo.com",
    avatar: "/placeholder.svg?height=40&width=40",
    initials: "MR",
    status: "offline",
    classes: ["Introducción a la Programación"],
    isFriend: false,
  },
  {
    id: "5",
    name: "Laura González",
    email: "laura.gonzalez@ejemplo.com",
    avatar: "/placeholder.svg?height=40&width=40",
    initials: "LG",
    status: "online",
    classes: ["Matemáticas 101", "Física para Principiantes"],
    isFriend: true,
  },
]

export default function StudentsPage() {
  const { userData, isLoading } = useAuth()
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("all")

  if (isLoading) {
    return <LoadingScreen />
  }

  // Filtrar estudiantes según la búsqueda y la pestaña activa
  const filteredStudents = studentData.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase())

    if (activeTab === "all") return matchesSearch
    if (activeTab === "friends") return matchesSearch && student.isFriend
    if (activeTab === "classmates") {
      // Filtrar por compañeros de clase (estudiantes que comparten al menos una clase)
      return (
        matchesSearch &&
        student.classes.some((className) =>
          ["Matemáticas 101", "Física para Principiantes", "Introducción a la Programación"].includes(className),
        )
      )
    }
    return matchesSearch
  })

  return (
    <DashboardShell>
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Estudiantes</h1>
            <p className="text-muted-foreground">Conecta con otros estudiantes y compañeros de clase</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar estudiantes..."
                className="pl-8 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="all">Todos</TabsTrigger>
            <TabsTrigger value="friends">Amigos</TabsTrigger>
            <TabsTrigger value="classmates">Compañeros de clase</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="space-y-4">
            {filteredStudents.length > 0 ? (
              <motion.div
                className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                {filteredStudents.map((student, index) => (
                  <motion.div
                    key={student.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <Card className="shadow-soft hover-lift">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <div className="flex items-center space-x-3">
                            <Avatar className="h-10 w-10 border border-primary/10">
                              <AvatarImage src={student.avatar} alt={student.name} />
                              <AvatarFallback>{student.initials}</AvatarFallback>
                            </Avatar>
                            <div>
                              <CardTitle className="text-base">{student.name}</CardTitle>
                              <CardDescription className="text-xs">{student.email}</CardDescription>
                            </div>
                          </div>
                          <Badge
                            variant="outline"
                            className={`${student.status === "online" ? "bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-gray-50 text-gray-500 dark:bg-gray-800/30 dark:text-gray-400"}`}
                          >
                            {student.status === "online" ? "En línea" : "Desconectado"}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <div className="space-y-2">
                          <p className="text-xs text-muted-foreground">Clases compartidas:</p>
                          <div className="flex flex-wrap gap-1">
                            {student.classes.map((className, idx) => (
                              <Badge key={idx} variant="secondary" className="text-xs">
                                {className}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-between pt-2">
                        <Button variant="ghost" size="sm">
                          <Mail className="h-4 w-4 mr-2" />
                          Mensaje
                        </Button>
                        {student.isFriend ? (
                          <Button variant="outline" size="sm">
                            <Users className="h-4 w-4 mr-2" />
                            Amigos
                          </Button>
                        ) : (
                          <Button variant="outline" size="sm">
                            <UserPlus className="h-4 w-4 mr-2" />
                            Añadir
                          </Button>
                        )}
                      </CardFooter>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="rounded-full bg-primary/10 p-3 mb-4">
                  <Search className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-medium">No se encontraron estudiantes</h3>
                <p className="text-muted-foreground mt-1 mb-4 max-w-md">
                  {searchTerm
                    ? "No se encontraron estudiantes que coincidan con tu búsqueda. Intenta con otros términos."
                    : activeTab === "friends"
                      ? "No tienes amigos agregados. Añade amigos para verlos aquí."
                      : activeTab === "classmates"
                        ? "No se encontraron compañeros de clase. Únete a más clases para conocer a más estudiantes."
                        : "No hay estudiantes disponibles en este momento."}
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>

        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center">
              <MessageSquare className="mr-2 h-5 w-5" />
              Mensajes recientes
            </CardTitle>
            <CardDescription>Conversaciones recientes con otros estudiantes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {studentData
                .filter((s) => s.isFriend)
                .slice(0, 3)
                .map((student, index) => (
                  <div key={index} className="flex items-start space-x-4 pb-4 border-b last:border-0">
                    <Avatar className="h-10 w-10 border border-primary/10">
                      <AvatarImage src={student.avatar} alt={student.name} />
                      <AvatarFallback>{student.initials}</AvatarFallback>
                    </Avatar>
                    <div className="space-y-1 flex-1">
                      <div className="flex justify-between">
                        <p className="text-sm font-medium">{student.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {index === 0 ? "Hace 5 min" : index === 1 ? "Hace 2 horas" : "Ayer"}
                        </p>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-1">
                        {index === 0
                          ? "¿Puedes ayudarme con el ejercicio 3 de la tarea de matemáticas?"
                          : index === 1
                            ? "Gracias por compartir tus apuntes de la clase de ayer."
                            : "¿A qué hora es la reunión de estudio para el examen?"}
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              Ver todos los mensajes
            </Button>
          </CardFooter>
        </Card>
      </div>
    </DashboardShell>
  )
}
