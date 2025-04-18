"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/providers/auth-context"
import { useToast } from "@/hooks/use-toast"

// Tipo para las clases
export interface Class {
  id: string
  name: string
  description: string
  section: string
  teacherId: string
  color: string
  code: string
}

// Clases de demostración
const demoClasses: Class[] = [
  {
    id: "1",
    name: "Matemáticas 101",
    description: "Introducción a conceptos matemáticos básicos y técnicas de resolución de problemas.",
    section: "Sección A",
    teacherId: "teacher-1",
    color: "bg-blue-500",
    code: "ABC123",
  },
  {
    id: "2",
    name: "Física para Principiantes",
    description: "Fundamentos de física y sus aplicaciones en la vida cotidiana.",
    section: "Sección B",
    teacherId: "teacher-1",
    color: "bg-purple-500",
    code: "DEF456",
  },
  {
    id: "3",
    name: "Programación Básica",
    description: "Introducción a la programación con Python.",
    section: "Sección C",
    teacherId: "teacher-1",
    color: "bg-green-500",
    code: "GHI789",
  },
]

// Inscripciones de demostración
const demoEnrollments = [
  { userId: "student-1", classId: "1" },
  { userId: "student-1", classId: "2" },
]

export function useClasses() {
  const [classes, setClasses] = useState<Class[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { userData } = useAuth()
  const { toast } = useToast()

  // Cargar clases al iniciar
  useEffect(() => {
    const loadClasses = () => {
      if (!userData) return

      setIsLoading(true)

      try {
        // Recuperar clases guardadas en localStorage o usar las de demostración
        const storedClasses = localStorage.getItem("classes")
        let userClasses: Class[] = storedClasses ? JSON.parse(storedClasses) : [...demoClasses]

        if (userData.role === "teacher") {
          // Para profesores, mostrar las clases que han creado
          userClasses = userClasses.filter((c) => c.teacherId === userData.uid)
        } else if (userData.role === "student") {
          // Para estudiantes, mostrar las clases en las que están inscritos
          const storedEnrollments = localStorage.getItem("enrollments")
          const enrollments = storedEnrollments ? JSON.parse(storedEnrollments) : demoEnrollments

          const studentEnrollments = enrollments.filter((e: any) => e.userId === userData.uid)
          userClasses = userClasses.filter((c) => studentEnrollments.some((e: any) => e.classId === c.id))
        }

        setClasses(userClasses)
      } catch (err) {
        console.error("Error al cargar clases:", err)
      } finally {
        setIsLoading(false)
      }
    }

    loadClasses()
  }, [userData])

  // Crear una nueva clase
  const createClass = async (classData: Omit<Class, "id" | "teacherId">) => {
    if (!userData) return null

    try {
      // Recuperar clases existentes
      const storedClasses = localStorage.getItem("classes")
      const existingClasses: Class[] = storedClasses ? JSON.parse(storedClasses) : [...demoClasses]

      // Crear nueva clase
      const newClass: Class = {
        id: `class-${Date.now()}`,
        teacherId: userData.uid,
        ...classData,
      }

      // Añadir a las clases existentes
      const updatedClasses = [...existingClasses, newClass]

      // Guardar en localStorage
      localStorage.setItem("classes", JSON.stringify(updatedClasses))

      // Actualizar estado
      setClasses((prev) => [...prev, newClass])

      toast({
        title: "Clase creada",
        description: "La clase ha sido creada exitosamente.",
      })

      return newClass.id
    } catch (err) {
      console.error("Error al crear clase:", err)
      toast({
        title: "Error",
        description: "No se pudo crear la clase. Por favor, intenta de nuevo.",
        variant: "destructive",
      })
      return null
    }
  }

  // Unirse a una clase
  const joinClass = async (classCode: string) => {
    if (!userData) return false

    try {
      // Recuperar clases existentes
      const storedClasses = localStorage.getItem("classes")
      const existingClasses: Class[] = storedClasses ? JSON.parse(storedClasses) : [...demoClasses]

      // Buscar la clase por código
      const classToJoin = existingClasses.find((c) => c.code === classCode)

      if (!classToJoin) {
        toast({
          title: "Código inválido",
          description: "No se encontró ninguna clase con ese código.",
          variant: "destructive",
        })
        return false
      }

      // Recuperar inscripciones existentes
      const storedEnrollments = localStorage.getItem("enrollments")
      const existingEnrollments = storedEnrollments ? JSON.parse(storedEnrollments) : demoEnrollments

      // Verificar si ya está inscrito
      const isAlreadyEnrolled = existingEnrollments.some(
        (e: any) => e.userId === userData.uid && e.classId === classToJoin.id,
      )

      if (isAlreadyEnrolled) {
        toast({
          title: "Ya inscrito",
          description: "Ya estás inscrito en esta clase.",
          variant: "destructive",
        })
        return false
      }

      // Añadir nueva inscripción
      const updatedEnrollments = [...existingEnrollments, { userId: userData.uid, classId: classToJoin.id }]

      // Guardar en localStorage
      localStorage.setItem("enrollments", JSON.stringify(updatedEnrollments))

      // Actualizar estado
      setClasses((prev) => [...prev, classToJoin])

      toast({
        title: "Inscripción exitosa",
        description: `Te has unido a la clase "${classToJoin.name}".`,
      })

      return true
    } catch (err) {
      console.error("Error al unirse a la clase:", err)
      toast({
        title: "Error",
        description: "No se pudo unir a la clase. Por favor, intenta de nuevo.",
        variant: "destructive",
      })
      return false
    }
  }

  return {
    classes,
    isLoading,
    createClass,
    joinClass,
  }
}
