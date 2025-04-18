"use client"

import { useState } from "react"
import { DashboardShell } from "@/components/dashboard/shell"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { useAuth } from "@/providers/auth-provider"
import { LoadingScreen } from "@/components/loading-screen"
import { motion } from "framer-motion"
import { Calendar, CheckCircle, Clock, FileText, Plus, Search } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { es } from "date-fns/locale"

// Datos de ejemplo para tareas pendientes
const todoData = [
  {
    id: "1",
    title: "Ecuaciones Lineales",
    description: "Completar ejercicios 1-10 del Capítulo 1",
    className: "Matemáticas 101",
    dueDate: new Date(2023, 3, 15),
    completed: false,
    priority: "high",
  },
  {
    id: "2",
    title: "Leyes de Newton",
    description: "Resolver problemas de la hoja de trabajo",
    className: "Física para Principiantes",
    dueDate: new Date(2023, 3, 22),
    completed: false,
    priority: "medium",
  },
  {
    id: "3",
    title: "Cuestionario de Ecuaciones Cuadráticas",
    description: "Cuestionario en línea que cubre el Capítulo 3",
    className: "Matemáticas 101",
    dueDate: new Date(2023, 3, 29),
    completed: false,
    priority: "low",
  },
  {
    id: "4",
    title: "Proyecto de Programación",
    description: "Crear una aplicación simple en Python",
    className: "Introducción a la Programación",
    dueDate: new Date(2023, 4, 5),
    completed: false,
    priority: "high",
  },
  {
    id: "5",
    title: "Resumen de Capítulo",
    description: "Escribir un resumen del Capítulo 2",
    className: "Física para Principiantes",
    dueDate: new Date(2023, 4, 10),
    completed: true,
    priority: "medium",
  },
]

export default function ToDoPage() {
  const { userData, isLoading } = useAuth()
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("pending")
  const [todos, setTodos] = useState(todoData)

  if (isLoading) {
    return <LoadingScreen />
  }

  // Filtrar tareas según la búsqueda y la pestaña activa
  const filteredTodos = todos.filter((todo) => {
    const matchesSearch =
      todo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      todo.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      todo.className.toLowerCase().includes(searchTerm.toLowerCase())

    if (activeTab === "all") return matchesSearch
    if (activeTab === "pending") return matchesSearch && !todo.completed
    if (activeTab === "completed") return matchesSearch && todo.completed
    return matchesSearch
  })

  // Ordenar tareas por fecha de vencimiento
  filteredTodos.sort((a, b) => {
    if (a.completed && !b.completed) return 1
    if (!a.completed && b.completed) return -1
    return a.dueDate.getTime() - b.dueDate.getTime()
  })

  const handleToggleTodo = (id: string) => {
    setTodos(todos.map((todo) => (todo.id === id ? { ...todo, completed: !todo.completed } : todo)))
  }

  // Obtener estadísticas
  const totalTasks = todos.length
  const completedTasks = todos.filter((todo) => todo.completed).length
  const pendingTasks = totalTasks - completedTasks
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

  return (
    <DashboardShell>
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Tareas Pendientes</h1>
            <p className="text-muted-foreground">Administra tus tareas y actividades pendientes</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar tareas..."
                className="pl-8 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nueva tarea
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="shadow-soft md:col-span-4">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="flex items-center p-4 rounded-lg bg-primary/5 border border-primary/10">
                  <div className="rounded-full bg-primary/10 p-3 mr-4">
                    <FileText className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total de tareas</p>
                    <p className="text-2xl font-bold">{totalTasks}</p>
                  </div>
                </div>

                <div className="flex items-center p-4 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
                  <div className="rounded-full bg-amber-100 dark:bg-amber-900/50 p-3 mr-4">
                    <Clock className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Pendientes</p>
                    <p className="text-2xl font-bold">{pendingTasks}</p>
                  </div>
                </div>

                <div className="flex items-center p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                  <div className="rounded-full bg-green-100 dark:bg-green-900/50 p-3 mr-4">
                    <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Completadas</p>
                    <p className="text-2xl font-bold">{completedTasks}</p>
                  </div>
                </div>

                <div className="flex items-center p-4 rounded-lg bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800">
                  <div className="rounded-full bg-purple-100 dark:bg-purple-900/50 p-3 mr-4">
                    <Calendar className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Tasa de completado</p>
                    <p className="text-2xl font-bold">{completionRate}%</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="pending" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="all">Todas</TabsTrigger>
            <TabsTrigger value="pending">Pendientes</TabsTrigger>
            <TabsTrigger value="completed">Completadas</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="space-y-4">
            {filteredTodos.length > 0 ? (
              <motion.div
                className="space-y-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                {filteredTodos.map((todo, index) => (
                  <motion.div
                    key={todo.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <Card className={`shadow-soft hover-lift ${todo.completed ? "bg-muted/30" : ""}`}>
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <Checkbox
                            id={`todo-${todo.id}`}
                            checked={todo.completed}
                            onCheckedChange={() => handleToggleTodo(todo.id)}
                            className="mt-1"
                          />
                          <div className="flex-1">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                              <h3
                                className={`text-lg font-medium ${todo.completed ? "line-through text-muted-foreground" : ""}`}
                              >
                                {todo.title}
                              </h3>
                              <div className="flex items-center gap-2">
                                <Badge
                                  variant="outline"
                                  className={`
                                    ${
                                      todo.priority === "high"
                                        ? "bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                                        : todo.priority === "medium"
                                          ? "bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                                          : "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                                    }
                                  `}
                                >
                                  {todo.priority === "high"
                                    ? "Alta prioridad"
                                    : todo.priority === "medium"
                                      ? "Media prioridad"
                                      : "Baja prioridad"}
                                </Badge>
                                <Badge variant="secondary">{todo.className}</Badge>
                              </div>
                            </div>
                            <p
                              className={`text-sm ${todo.completed ? "text-muted-foreground/70 line-through" : "text-muted-foreground"}`}
                            >
                              {todo.description}
                            </p>
                            <div className="flex items-center mt-2">
                              <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
                              <p className="text-xs text-muted-foreground">
                                Fecha límite: {format(todo.dueDate, "PPP", { locale: es })}
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              Ver
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="rounded-full bg-primary/10 p-3 mb-4">
                  <Search className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-medium">No se encontraron tareas</h3>
                <p className="text-muted-foreground mt-1 mb-4 max-w-md">
                  {searchTerm
                    ? "No se encontraron tareas que coincidan con tu búsqueda. Intenta con otros términos."
                    : activeTab === "pending"
                      ? "No tienes tareas pendientes. ¡Buen trabajo!"
                      : activeTab === "completed"
                        ? "No has completado ninguna tarea aún."
                        : "No hay tareas disponibles en este momento."}
                </p>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Crear nueva tarea
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardShell>
  )
}
