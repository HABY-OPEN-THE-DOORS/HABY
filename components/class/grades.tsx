"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ChevronDown, Download, Search } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface Student {
  id: string
  name: string
  email: string
}

interface Assignment {
  id: string
  title: string
  points: number
  dueDate: string
}

interface Grade {
  studentId: string
  assignmentId: string
  score: number | null
  status: "submitted" | "missing" | "late" | "graded"
}

export function ClassGrades({ classId }: { classId: string }) {
  const [students] = useState<Student[]>([
    {
      id: "1",
      name: "Ana Martínez",
      email: "ana.martinez@ejemplo.com",
    },
    {
      id: "2",
      name: "Roberto López",
      email: "roberto.lopez@ejemplo.com",
    },
    {
      id: "3",
      name: "Carlos Sánchez",
      email: "carlos.sanchez@ejemplo.com",
    },
    {
      id: "4",
      name: "María Rodríguez",
      email: "maria.rodriguez@ejemplo.com",
    },
    {
      id: "5",
      name: "Laura González",
      email: "laura.gonzalez@ejemplo.com",
    },
  ])

  const [assignments] = useState<Assignment[]>([
    {
      id: "1",
      title: "Introducción al Álgebra",
      points: 100,
      dueDate: "15/03/2023",
    },
    {
      id: "2",
      title: "Ecuaciones Lineales",
      points: 50,
      dueDate: "22/03/2023",
    },
    {
      id: "3",
      title: "Cuestionario de Ecuaciones Cuadráticas",
      points: 75,
      dueDate: "29/03/2023",
    },
  ])

  const [grades, setGrades] = useState<Grade[]>([
    { studentId: "1", assignmentId: "1", score: 95, status: "graded" },
    { studentId: "1", assignmentId: "2", score: 48, status: "graded" },
    { studentId: "1", assignmentId: "3", score: null, status: "submitted" },
    { studentId: "2", assignmentId: "1", score: 87, status: "graded" },
    { studentId: "2", assignmentId: "2", score: 45, status: "graded" },
    { studentId: "2", assignmentId: "3", score: null, status: "missing" },
    { studentId: "3", assignmentId: "1", score: 92, status: "graded" },
    { studentId: "3", assignmentId: "2", score: 47, status: "graded" },
    { studentId: "3", assignmentId: "3", score: null, status: "late" },
    { studentId: "4", assignmentId: "1", score: 88, status: "graded" },
    { studentId: "4", assignmentId: "2", score: 42, status: "graded" },
    { studentId: "4", assignmentId: "3", score: null, status: "submitted" },
    { studentId: "5", assignmentId: "1", score: 90, status: "graded" },
    { studentId: "5", assignmentId: "2", score: 46, status: "graded" },
    { studentId: "5", assignmentId: "3", score: null, status: "missing" },
  ])

  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("all")

  const getGrade = (studentId: string, assignmentId: string) => {
    const grade = grades.find((g) => g.studentId === studentId && g.assignmentId === assignmentId)
    return grade
  }

  const handleGradeChange = (studentId: string, assignmentId: string, score: number) => {
    const newGrades = [...grades]
    const index = newGrades.findIndex((g) => g.studentId === studentId && g.assignmentId === assignmentId)

    if (index !== -1) {
      newGrades[index].score = score
      newGrades[index].status = "graded"
    } else {
      newGrades.push({ studentId, assignmentId, score, status: "graded" })
    }

    setGrades(newGrades)
  }

  const calculateAverage = (studentId: string) => {
    const studentGrades = grades.filter((g) => g.studentId === studentId && g.score !== null)
    if (studentGrades.length === 0) return "-"

    const total = studentGrades.reduce((sum, grade) => {
      const assignment = assignments.find((a) => a.id === grade.assignmentId)
      const maxPoints = assignment ? assignment.points : 0
      const percentage = grade.score !== null ? (grade.score / maxPoints) * 100 : 0
      return sum + percentage
    }, 0)

    return `${(total / studentGrades.length).toFixed(1)}%`
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "submitted":
        return (
          <Badge variant="outline" className="bg-blue-50">
            Entregado
          </Badge>
        )
      case "missing":
        return (
          <Badge variant="outline" className="bg-red-50">
            Faltante
          </Badge>
        )
      case "late":
        return (
          <Badge variant="outline" className="bg-amber-50">
            Atrasado
          </Badge>
        )
      case "graded":
        return (
          <Badge variant="outline" className="bg-green-50">
            Calificado
          </Badge>
        )
      default:
        return null
    }
  }

  const filteredStudents = students.filter((student) => student.name.toLowerCase().includes(searchTerm.toLowerCase()))

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Calificaciones</h3>
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar estudiantes..."
              className="pl-8 w-[200px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                Exportar
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>
                <Download className="mr-2 h-4 w-4" />
                Exportar como CSV
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Download className="mr-2 h-4 w-4" />
                Exportar como PDF
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">Todas</TabsTrigger>
          <TabsTrigger value="submitted">Entregadas</TabsTrigger>
          <TabsTrigger value="missing">Faltantes</TabsTrigger>
          <TabsTrigger value="late">Atrasadas</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px]">Estudiante</TableHead>
              {assignments.map((assignment) => (
                <TableHead key={assignment.id}>
                  {assignment.title}
                  <div className="text-xs text-muted-foreground">
                    {assignment.points} pts • {assignment.dueDate}
                  </div>
                </TableHead>
              ))}
              <TableHead>Promedio</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredStudents.map((student) => (
              <TableRow key={student.id}>
                <TableCell className="font-medium">{student.name}</TableCell>
                {assignments.map((assignment) => {
                  const grade = getGrade(student.id, assignment.id)
                  return (
                    <TableCell key={assignment.id} className="relative">
                      <div className="flex items-center space-x-2">
                        <Input
                          type="number"
                          min="0"
                          max={assignment.points}
                          value={grade?.score || ""}
                          onChange={(e) =>
                            handleGradeChange(student.id, assignment.id, Number.parseInt(e.target.value) || 0)
                          }
                          className="w-16 h-8"
                        />
                        <span className="text-xs text-muted-foreground">/{assignment.points}</span>
                      </div>
                      {grade && <div className="absolute right-2 top-2">{getStatusIcon(grade.status)}</div>}
                    </TableCell>
                  )
                })}
                <TableCell>{calculateAverage(student.id)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
