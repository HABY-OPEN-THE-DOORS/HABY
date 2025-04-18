import type { Class } from "@/lib/firestore-service"

// Clases de ejemplo
const demoClasses: Class[] = [
  {
    id: "1",
    name: "Matemáticas 101",
    description: "Introducción a conceptos matemáticos básicos y técnicas de resolución de problemas.",
    section: "Sección A",
    teacherId: "teacher-1",
    color: "bg-class-blue",
    code: "ABC123",
    createdAt: { toDate: () => new Date() } as any,
    updatedAt: { toDate: () => new Date() } as any,
  },
  {
    id: "2",
    name: "Física para Principiantes",
    description: "Fundamentos de física y sus aplicaciones en la vida cotidiana.",
    section: "Sección B",
    teacherId: "teacher-1",
    color: "bg-class-purple",
    code: "DEF456",
    createdAt: { toDate: () => new Date() } as any,
    updatedAt: { toDate: () => new Date() } as any,
  },
  {
    id: "3",
    name: "Introducción a la Programación",
    description: "Aprende los fundamentos de programación usando Python y resuelve problemas del mundo real.",
    section: "Sección C",
    teacherId: "teacher-1",
    color: "bg-class-green",
    code: "GHI789",
    createdAt: { toDate: () => new Date() } as any,
    updatedAt: { toDate: () => new Date() } as any,
  },
]

// Inscripciones de ejemplo
const demoEnrollments = [
  { userId: "student-1", classId: "1", role: "student" },
  { userId: "student-1", classId: "2", role: "student" },
]

// Servicio simulado para clases
export class MockClassesService {
  // Obtener clases por profesor
  static async getClassesByTeacher(teacherId: string): Promise<Class[]> {
    // Obtener clases del localStorage o usar las de demostración
    const storedClasses = localStorage.getItem("mockClasses")
    const classes = storedClasses ? JSON.parse(storedClasses) : demoClasses

    // Filtrar por teacherId
    return classes.filter((c: Class) => c.teacherId === teacherId)
  }

  // Obtener clases por estudiante
  static async getClassesByStudent(studentId: string): Promise<Class[]> {
    // Obtener clases del localStorage o usar las de demostración
    const storedClasses = localStorage.getItem("mockClasses")
    const classes = storedClasses ? JSON.parse(storedClasses) : demoClasses

    // Obtener inscripciones del localStorage o usar las de demostración
    const storedEnrollments = localStorage.getItem("mockEnrollments")
    const enrollments = storedEnrollments ? JSON.parse(storedEnrollments) : demoEnrollments

    // Filtrar por studentId en las inscripciones
    const studentClassIds = enrollments
      .filter((e: any) => e.userId === studentId && e.role === "student")
      .map((e: any) => e.classId)

    return classes.filter((c: Class) => studentClassIds.includes(c.id))
  }

  // Obtener clase por ID
  static async getClass(classId: string): Promise<Class | null> {
    // Obtener clases del localStorage o usar las de demostración
    const storedClasses = localStorage.getItem("mockClasses")
    const classes = storedClasses ? JSON.parse(storedClasses) : demoClasses

    // Buscar por ID
    const foundClass = classes.find((c: Class) => c.id === classId)
    return foundClass || null
  }

  // Crear una nueva clase
  static async createClass(classData: Omit<Class, "id" | "createdAt" | "updatedAt">): Promise<string> {
    // Obtener clases del localStorage o usar las de demostración
    const storedClasses = localStorage.getItem("mockClasses")
    const classes = storedClasses ? JSON.parse(storedClasses) : demoClasses

    // Crear nueva clase
    const newClass: Class = {
      id: `class-${Date.now()}`,
      ...classData,
      createdAt: { toDate: () => new Date() } as any,
      updatedAt: { toDate: () => new Date() } as any,
    }

    // Añadir a la lista
    classes.push(newClass)

    // Guardar en localStorage
    localStorage.setItem("mockClasses", JSON.stringify(classes))

    return newClass.id
  }

  // Obtener clases por código
  static async getClassesByCode(code: string): Promise<Class[]> {
    // Obtener clases del localStorage o usar las de demostración
    const storedClasses = localStorage.getItem("mockClasses")
    const classes = storedClasses ? JSON.parse(storedClasses) : demoClasses

    // Filtrar por código
    return classes.filter((c: Class) => c.code === code)
  }

  // Inscribir estudiante
  static async enrollStudent(enrollment: { userId: string; classId: string; role: string }): Promise<string> {
    // Obtener inscripciones del localStorage o usar las de demostración
    const storedEnrollments = localStorage.getItem("mockEnrollments")
    const enrollments = storedEnrollments ? JSON.parse(storedEnrollments) : demoEnrollments

    // Añadir nueva inscripción
    const newEnrollment = {
      id: `enrollment-${Date.now()}`,
      ...enrollment,
      joinedAt: new Date(),
    }

    enrollments.push(newEnrollment)

    // Guardar en localStorage
    localStorage.setItem("mockEnrollments", JSON.stringify(enrollments))

    return newEnrollment.id
  }

  // Obtener inscripciones de una clase
  static async getClassEnrollments(classId: string): Promise<any[]> {
    // Obtener inscripciones del localStorage o usar las de demostración
    const storedEnrollments = localStorage.getItem("mockEnrollments")
    const enrollments = storedEnrollments ? JSON.parse(storedEnrollments) : demoEnrollments

    // Filtrar por classId
    return enrollments.filter((e: any) => e.classId === classId)
  }
}
