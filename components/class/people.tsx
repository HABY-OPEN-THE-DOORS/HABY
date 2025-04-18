"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Copy, Mail, UserPlus, Search, MoreHorizontal } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface Person {
  id: string
  name: string
  email: string
  avatar: string
  initials: string
}

export function ClassPeople({ classId }: { classId: string }) {
  const [teachers, setTeachers] = useState<Person[]>([
    {
      id: "1",
      name: "Dr. Juan Pérez",
      email: "juan.perez@ejemplo.com",
      avatar: "/placeholder.svg",
      initials: "JP",
    },
  ])

  const [students, setStudents] = useState<Person[]>([
    {
      id: "1",
      name: "Ana Martínez",
      email: "ana.martinez@ejemplo.com",
      avatar: "/placeholder.svg",
      initials: "AM",
    },
    {
      id: "2",
      name: "Roberto López",
      email: "roberto.lopez@ejemplo.com",
      avatar: "/placeholder.svg",
      initials: "RL",
    },
    {
      id: "3",
      name: "Carlos Sánchez",
      email: "carlos.sanchez@ejemplo.com",
      avatar: "/placeholder.svg",
      initials: "CS",
    },
    {
      id: "4",
      name: "María Rodríguez",
      email: "maria.rodriguez@ejemplo.com",
      avatar: "/placeholder.svg",
      initials: "MR",
    },
    {
      id: "5",
      name: "Laura González",
      email: "laura.gonzalez@ejemplo.com",
      avatar: "/placeholder.svg",
      initials: "LG",
    },
  ])

  const [inviteEmail, setInviteEmail] = useState("")
  const [open, setOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  const handleInvite = () => {
    // En una aplicación real, aquí enviarías un correo de invitación
    setInviteEmail("")
    setOpen(false)
  }

  const classCode = "ABC123" // En una aplicación real, esto se generaría y almacenaría

  const filteredTeachers = teachers.filter(
    (teacher) =>
      teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const filteredStudents = students.filter(
    (student) =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Personas</h3>
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar personas..."
              className="pl-8 w-[200px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>
                <UserPlus className="h-4 w-4 mr-2" />
                Invitar Personas
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Invitar Personas</DialogTitle>
                <DialogDescription>Invita a profesores o estudiantes a unirse a tu clase.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="email">Correo electrónico</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Ingresa dirección de correo"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Código de clase</Label>
                  <div className="flex items-center space-x-2">
                    <Input value={classCode} readOnly />
                    <Button variant="outline" size="icon" onClick={() => navigator.clipboard.writeText(classCode)}>
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Comparte este código con los estudiantes para que se unan a la clase.
                  </p>
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleInvite}>Enviar Invitación</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs defaultValue="students">
        <TabsList>
          <TabsTrigger value="teachers">Profesores ({filteredTeachers.length})</TabsTrigger>
          <TabsTrigger value="students">Estudiantes ({filteredStudents.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="teachers" className="mt-6">
          <div className="space-y-4">
            {filteredTeachers.map((teacher) => (
              <div key={teacher.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage src={teacher.avatar} alt={teacher.name} />
                    <AvatarFallback>{teacher.initials}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{teacher.name}</p>
                    <p className="text-sm text-muted-foreground">{teacher.email}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="icon" title="Enviar correo">
                    <Mail className="h-4 w-4" />
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Ver perfil</DropdownMenuItem>
                      <DropdownMenuItem>Eliminar de la clase</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="students" className="mt-6">
          <div className="space-y-4">
            {filteredStudents.map((student) => (
              <div key={student.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage src={student.avatar} alt={student.name} />
                    <AvatarFallback>{student.initials}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{student.name}</p>
                    <p className="text-sm text-muted-foreground">{student.email}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="icon" title="Enviar correo">
                    <Mail className="h-4 w-4" />
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Ver perfil</DropdownMenuItem>
                      <DropdownMenuItem>Ver calificaciones</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">Eliminar de la clase</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
