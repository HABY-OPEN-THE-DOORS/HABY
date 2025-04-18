"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, FileText, PlusCircle, Upload } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface Assignment {
  id: string
  title: string
  description: string
  dueDate: Date
  points: number
  status: "assigned" | "submitted" | "graded" | "late"
  attachments?: {
    name: string
    type: string
    url: string
  }[]
  submissionType: "document" | "text" | "link" | "multiple"
}

export function ClassAssignments({ classId }: { classId: string }) {
  const [assignments, setAssignments] = useState<Assignment[]>([
    {
      id: "1",
      title: "Introducción al Álgebra",
      description: "Completa los ejercicios 1-10 del Capítulo 1.",
      dueDate: new Date(2023, 3, 15),
      points: 100,
      status: "assigned",
      submissionType: "document",
    },
    {
      id: "2",
      title: "Ecuaciones Lineales",
      description: "Resuelve los problemas de la hoja de trabajo adjunta.",
      dueDate: new Date(2023, 3, 22),
      points: 50,
      status: "submitted",
      attachments: [
        {
          name: "Hoja_de_trabajo.pdf",
          type: "application/pdf",
          url: "#",
        },
      ],
      submissionType: "document",
    },
    {
      id: "3",
      title: "Cuestionario de Ecuaciones Cuadráticas",
      description: "Cuestionario en línea que cubre el Cap��tulo 3.",
      dueDate: new Date(2023, 3, 29),
      points: 75,
      status: "graded",
      submissionType: "text",
    },
  ])

  const [newAssignment, setNewAssignment] = useState({
    title: "",
    description: "",
    dueDate: new Date(),
    points: 100,
    submissionType: "document",
  })

  const [open, setOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("all")

  const handleCreateAssignment = () => {
    const assignment: Assignment = {
      id: Date.now().toString(),
      ...newAssignment,
      status: "assigned",
      submissionType: newAssignment.submissionType as "document" | "text" | "link" | "multiple",
    }

    setAssignments([...assignments, assignment])
    setNewAssignment({
      title: "",
      description: "",
      dueDate: new Date(),
      points: 100,
      submissionType: "document",
    })
    setOpen(false)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "assigned":
        return <Badge variant="outline">Asignada</Badge>
      case "submitted":
        return <Badge variant="secondary">Entregada</Badge>
      case "graded":
        return <Badge variant="default">Calificada</Badge>
      case "late":
        return <Badge variant="destructive">Atrasada</Badge>
      default:
        return null
    }
  }

  const filteredAssignments = activeTab === "all" ? assignments : assignments.filter((a) => a.status === activeTab)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Trabajo de clase</h3>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="h-4 w-4 mr-2" />
              Crear Tarea
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Crear Tarea</DialogTitle>
              <DialogDescription>Añade una nueva tarea para tus estudiantes.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Título</Label>
                <Input
                  id="title"
                  value={newAssignment.title}
                  onChange={(e) => setNewAssignment({ ...newAssignment, title: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Descripción</Label>
                <Textarea
                  id="description"
                  value={newAssignment.description}
                  onChange={(e) =>
                    setNewAssignment({
                      ...newAssignment,
                      description: e.target.value,
                    })
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="dueDate">Fecha de entrega</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {newAssignment.dueDate
                          ? format(newAssignment.dueDate, "PPP", { locale: es })
                          : "Seleccionar fecha"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={newAssignment.dueDate}
                        onSelect={(date) =>
                          setNewAssignment({
                            ...newAssignment,
                            dueDate: date || new Date(),
                          })
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="points">Puntos</Label>
                  <Input
                    id="points"
                    type="number"
                    value={newAssignment.points}
                    onChange={(e) =>
                      setNewAssignment({
                        ...newAssignment,
                        points: Number.parseInt(e.target.value),
                      })
                    }
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="submissionType">Tipo de entrega</Label>
                <Select
                  value={newAssignment.submissionType}
                  onValueChange={(value) => setNewAssignment({ ...newAssignment, submissionType: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar tipo de entrega" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="document">Documento</SelectItem>
                    <SelectItem value="text">Texto</SelectItem>
                    <SelectItem value="link">Enlace</SelectItem>
                    <SelectItem value="multiple">Múltiples archivos</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleCreateAssignment}>Crear</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">Todas</TabsTrigger>
          <TabsTrigger value="assigned">Asignadas</TabsTrigger>
          <TabsTrigger value="submitted">Entregadas</TabsTrigger>
          <TabsTrigger value="graded">Calificadas</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="space-y-4">
        {filteredAssignments.map((assignment) => (
          <Card key={assignment.id}>
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <Link href={`/dashboard/classes/${classId}/assignments/${assignment.id}`}>
                    <h4 className="text-base font-medium hover:underline">{assignment.title}</h4>
                  </Link>
                  <div className="flex items-center space-x-2">
                    <p className="text-sm text-muted-foreground">
                      Fecha límite: {format(assignment.dueDate, "PPP", { locale: es })} • {assignment.points} puntos
                    </p>
                    {getStatusBadge(assignment.status)}
                  </div>
                </div>
                <div className="flex items-center">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm">{assignment.description}</p>

              {assignment.attachments && assignment.attachments.length > 0 && (
                <div className="mt-4 space-y-2">
                  <p className="text-sm font-medium">Archivos adjuntos:</p>
                  <div className="flex flex-wrap gap-2">
                    {assignment.attachments.map((attachment, index) => (
                      <a
                        key={index}
                        href={attachment.url}
                        className="flex items-center p-2 bg-muted rounded-md text-sm hover:bg-muted/80"
                      >
                        <FileText className="h-4 w-4 mr-2" />
                        {attachment.name}
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {assignment.status === "assigned" && (
                <div className="mt-4 p-4 border rounded-md">
                  <h5 className="text-sm font-medium mb-2">Tu entrega</h5>
                  {assignment.submissionType === "document" && (
                    <div className="flex items-center justify-center border-2 border-dashed rounded-md p-6">
                      <div className="flex flex-col items-center space-y-2 text-center">
                        <Upload className="h-8 w-8 text-muted-foreground" />
                        <div className="flex flex-col space-y-1">
                          <p className="text-sm font-medium">Arrastra archivos aquí o haz clic para seleccionar</p>
                          <p className="text-xs text-muted-foreground">Soporta PDF, DOCX, PPTX, hasta 10MB</p>
                        </div>
                        <Button size="sm">Seleccionar archivo</Button>
                      </div>
                    </div>
                  )}

                  {assignment.submissionType === "text" && (
                    <Textarea placeholder="Escribe tu respuesta aquí..." className="min-h-[100px]" />
                  )}

                  {assignment.submissionType === "link" && <Input placeholder="https://ejemplo.com" />}

                  <div className="flex justify-end mt-4">
                    <Button>Entregar</Button>
                  </div>
                </div>
              )}

              {assignment.status === "submitted" && (
                <div className="mt-4 p-4 border rounded-md bg-muted/50">
                  <div className="flex items-center justify-between">
                    <h5 className="text-sm font-medium">Entregado</h5>
                    <p className="text-xs text-muted-foreground">Entregado el 20 de marzo, 2023</p>
                  </div>
                  <div className="mt-2 flex items-center space-x-2">
                    <FileText className="h-4 w-4" />
                    <span className="text-sm">MiTarea.pdf</span>
                  </div>
                </div>
              )}

              {assignment.status === "graded" && (
                <div className="mt-4 p-4 border rounded-md bg-primary/5">
                  <div className="flex items-center justify-between">
                    <h5 className="text-sm font-medium">Calificado</h5>
                    <p className="text-sm font-medium">70/75 puntos</p>
                  </div>
                  <p className="mt-2 text-sm">Buen trabajo, pero hay algunos errores en los problemas 3 y 5.</p>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Link href={`/dashboard/classes/${classId}/assignments/${assignment.id}`}>
                <Button variant="outline" size="sm">
                  Ver Detalles
                </Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
