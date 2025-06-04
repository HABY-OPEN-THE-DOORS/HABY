/**
 * HABY-CLASS - Hook Mejorado para Gestión de Clases
 * Incluye auditoría, validación y persistencia avanzada
 */

"use client"

import { useState, useEffect, useCallback } from "react"
import { useAuth } from "@/providers/auth-provider"
import { useToast } from "@/hooks/use-toast"
import { globalStateManager } from "@/lib/global-state-manager"
import { integrityValidator } from "@/lib/integrity-validator"
import { auditSystem } from "@/lib/audit-system"
import { usePermissions } from "@/hooks/use-permissions"
import type { Class } from "@/hooks/use-classes"

export interface EnhancedClass extends Class {
  metadata?: {
    createdAt: Date
    updatedAt: Date
    version: number
    lastModifiedBy: string
    checksum: string
  }
}

export interface ClassOperationResult {
  success: boolean
  data?: any
  error?: string
  validationErrors?: string[]
}

export function useClassesEnhanced() {
  const [classes, setClasses] = useState<EnhancedClass[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [operationInProgress, setOperationInProgress] = useState<string | null>(null)
  const { userData } = useAuth()
  const { toast } = useToast()
  const { can } = usePermissions()

  // Cargar clases al iniciar
  useEffect(() => {
    loadClasses()
  }, [userData])

  // Suscribirse a cambios en tiempo real
  useEffect(() => {
    if (!userData) return

    const subscriptionId = globalStateManager.subscribe(
      /^class:/,
      (change) => {
        console.log("Class change detected:", change)
        loadClasses() // Recargar clases cuando hay cambios
      },
      { immediate: false },
    )

    return () => {
      globalStateManager.unsubscribe(subscriptionId)
    }
  }, [userData])

  const loadClasses = useCallback(async () => {
    if (!userData) return

    setIsLoading(true)
    try {
      await auditSystem.logUserAction(userData.uid, userData.role, "load_classes", {
        timestamp: new Date(),
      })

      // Cargar clases desde el estado global
      const classesData = await globalStateManager.getState<EnhancedClass[]>("user_classes:" + userData.uid)

      if (classesData) {
        // Validar integridad de cada clase
        const validatedClasses = classesData.filter((cls) => {
          const validation = integrityValidator.validateClass(cls)
          if (!validation.isValid) {
            console.warn(`Invalid class data for ${cls.id}:`, validation.errors)
            return false
          }
          return true
        })

        setClasses(validatedClasses)
      } else {
        // Cargar datos de demostración si no hay datos guardados
        await loadDemoData()
      }
    } catch (error) {
      console.error("Error loading classes:", error)
      await auditSystem.logError(userData.uid, userData.role, "load_classes", "class", "all", String(error))

      toast({
        title: "Error al cargar clases",
        description: "No se pudieron cargar las clases. Intenta recargar la página.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }, [userData, toast])

  const createClass = useCallback(
    async (classData: Omit<Class, "id" | "teacherId">): Promise<ClassOperationResult> => {
      if (!userData || !can("create_class")) {
        return {
          success: false,
          error: "No tienes permisos para crear clases",
        }
      }

      setOperationInProgress("creating")

      try {
        // Crear clase con metadatos
        const newClass: EnhancedClass = {
          id: `class-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          teacherId: userData.uid,
          ...classData,
          metadata: {
            createdAt: new Date(),
            updatedAt: new Date(),
            version: 1,
            lastModifiedBy: userData.uid,
            checksum: await generateChecksum(classData),
          },
        }

        // Validar datos
        const validation = integrityValidator.validateClass(newClass)
        if (!validation.isValid) {
          await auditSystem.logError(
            userData.uid,
            userData.role,
            "create_class",
            "class",
            newClass.id,
            "Validation failed",
            {
              errors: validation.errors,
            },
          )

          return {
            success: false,
            error: "Datos de clase inválidos",
            validationErrors: validation.errors,
          }
        }

        // Guardar en estado global
        const updatedClasses = [...classes, newClass]
        await globalStateManager.setState(`user_classes:${userData.uid}`, updatedClasses, {
          persistent: true,
          validate: true,
          userId: userData.uid,
          role: userData.role,
          metadata: { action: "create_class", classId: newClass.id },
        })

        // Actualizar estado local
        setClasses(updatedClasses)

        // Registrar auditoría
        await auditSystem.logClassAction(userData.uid, userData.role, "create_class", newClass.id, {
          className: newClass.name,
          section: newClass.section,
          timestamp: new Date(),
        })

        toast({
          title: "Clase creada",
          description: `La clase "${newClass.name}" ha sido creada exitosamente.`,
        })

        return {
          success: true,
          data: newClass,
        }
      } catch (error) {
        console.error("Error creating class:", error)
        await auditSystem.logError(userData.uid, userData.role, "create_class", "class", "new", String(error))

        return {
          success: false,
          error: "Error interno al crear la clase",
        }
      } finally {
        setOperationInProgress(null)
      }
    },
    [userData, classes, can, toast],
  )

  const updateClass = useCallback(
    async (classId: string, updates: Partial<Class>): Promise<ClassOperationResult> => {
      if (!userData || !can("edit_class")) {
        return {
          success: false,
          error: "No tienes permisos para editar clases",
        }
      }

      const existingClass = classes.find((c) => c.id === classId)
      if (!existingClass) {
        return {
          success: false,
          error: "Clase no encontrada",
        }
      }

      // Verificar permisos específicos
      if (existingClass.teacherId !== userData.uid && userData.role !== "admin") {
        return {
          success: false,
          error: "No tienes permisos para editar esta clase",
        }
      }

      setOperationInProgress("updating")

      try {
        // Crear clase actualizada
        const updatedClass: EnhancedClass = {
          ...existingClass,
          ...updates,
          metadata: {
            ...existingClass.metadata!,
            updatedAt: new Date(),
            version: (existingClass.metadata?.version || 1) + 1,
            lastModifiedBy: userData.uid,
            checksum: await generateChecksum({ ...existingClass, ...updates }),
          },
        }

        // Validar datos actualizados
        const validation = integrityValidator.validateClass(updatedClass)
        if (!validation.isValid) {
          await auditSystem.logError(
            userData.uid,
            userData.role,
            "update_class",
            "class",
            classId,
            "Validation failed",
            {
              errors: validation.errors,
            },
          )

          return {
            success: false,
            error: "Datos de clase inválidos",
            validationErrors: validation.errors,
          }
        }

        // Actualizar en estado global
        const updatedClasses = classes.map((c) => (c.id === classId ? updatedClass : c))
        await globalStateManager.setState(`user_classes:${userData.uid}`, updatedClasses, {
          persistent: true,
          validate: true,
          userId: userData.uid,
          role: userData.role,
          metadata: { action: "update_class", classId, changes: Object.keys(updates) },
        })

        // Actualizar estado local
        setClasses(updatedClasses)

        // Registrar auditoría
        await auditSystem.logClassAction(userData.uid, userData.role, "update_class", classId, {
          changes: updates,
          previousVersion: existingClass.metadata?.version,
          newVersion: updatedClass.metadata?.version,
          timestamp: new Date(),
        })

        toast({
          title: "Clase actualizada",
          description: `La clase "${updatedClass.name}" ha sido actualizada exitosamente.`,
        })

        return {
          success: true,
          data: updatedClass,
        }
      } catch (error) {
        console.error("Error updating class:", error)
        await auditSystem.logError(userData.uid, userData.role, "update_class", "class", classId, String(error))

        return {
          success: false,
          error: "Error interno al actualizar la clase",
        }
      } finally {
        setOperationInProgress(null)
      }
    },
    [userData, classes, can, toast],
  )

  const deleteClass = useCallback(
    async (classId: string): Promise<ClassOperationResult> => {
      if (!userData || !can("delete_class")) {
        return {
          success: false,
          error: "No tienes permisos para eliminar clases",
        }
      }

      const existingClass = classes.find((c) => c.id === classId)
      if (!existingClass) {
        return {
          success: false,
          error: "Clase no encontrada",
        }
      }

      // Verificar permisos específicos
      if (existingClass.teacherId !== userData.uid && userData.role !== "admin") {
        return {
          success: false,
          error: "No tienes permisos para eliminar esta clase",
        }
      }

      setOperationInProgress("deleting")

      try {
        // Actualizar estado global
        const updatedClasses = classes.filter((c) => c.id !== classId)
        await globalStateManager.setState(`user_classes:${userData.uid}`, updatedClasses, {
          persistent: true,
          userId: userData.uid,
          role: userData.role,
          metadata: { action: "delete_class", classId },
        })

        // Actualizar estado local
        setClasses(updatedClasses)

        // Registrar auditoría
        await auditSystem.logClassAction(userData.uid, userData.role, "delete_class", classId, {
          className: existingClass.name,
          section: existingClass.section,
          timestamp: new Date(),
        })

        toast({
          title: "Clase eliminada",
          description: `La clase "${existingClass.name}" ha sido eliminada exitosamente.`,
        })

        return {
          success: true,
          data: existingClass,
        }
      } catch (error) {
        console.error("Error deleting class:", error)
        await auditSystem.logError(userData.uid, userData.role, "delete_class", "class", classId, String(error))

        return {
          success: false,
          error: "Error interno al eliminar la clase",
        }
      } finally {
        setOperationInProgress(null)
      }
    },
    [userData, classes, can, toast],
  )

  const joinClass = useCallback(
    async (classCode: string): Promise<ClassOperationResult> => {
      if (!userData || !can("join_class")) {
        return {
          success: false,
          error: "No tienes permisos para unirte a clases",
        }
      }

      setOperationInProgress("joining")

      try {
        // Buscar clase por código (simulado)
        const availableClasses = (await globalStateManager.getState<EnhancedClass[]>("available_classes")) || []
        const classToJoin = availableClasses.find((c) => c.code === classCode)

        if (!classToJoin) {
          await auditSystem.logError(userData.uid, userData.role, "join_class", "class", classCode, "Class not found")

          return {
            success: false,
            error: "Código de clase inválido",
          }
        }

        // Verificar si ya está inscrito
        const isAlreadyEnrolled = classes.some((c) => c.id === classToJoin.id)
        if (isAlreadyEnrolled) {
          return {
            success: false,
            error: "Ya estás inscrito en esta clase",
          }
        }

        // Agregar clase a la lista del usuario
        const updatedClasses = [...classes, classToJoin]
        await globalStateManager.setState(`user_classes:${userData.uid}`, updatedClasses, {
          persistent: true,
          userId: userData.uid,
          role: userData.role,
          metadata: { action: "join_class", classId: classToJoin.id },
        })

        // Actualizar estado local
        setClasses(updatedClasses)

        // Registrar auditoría
        await auditSystem.logClassAction(userData.uid, userData.role, "join_class", classToJoin.id, {
          classCode,
          className: classToJoin.name,
          timestamp: new Date(),
        })

        toast({
          title: "Inscripción exitosa",
          description: `Te has unido a la clase "${classToJoin.name}".`,
        })

        return {
          success: true,
          data: classToJoin,
        }
      } catch (error) {
        console.error("Error joining class:", error)
        await auditSystem.logError(userData.uid, userData.role, "join_class", "class", classCode, String(error))

        return {
          success: false,
          error: "Error interno al unirse a la clase",
        }
      } finally {
        setOperationInProgress(null)
      }
    },
    [userData, classes, can, toast],
  )

  const loadDemoData = useCallback(async () => {
    if (!userData) return

    const demoClasses: EnhancedClass[] = [
      {
        id: "demo-class-1",
        name: "Matemáticas 101",
        description: "Introducción a conceptos matemáticos básicos y técnicas de resolución de problemas.",
        section: "Sección A",
        room: "Aula 201",
        subject: "Matemáticas",
        teacherId: userData.uid,
        color: "bg-blue-500",
        code: "MATH101",
        bannerUrl: "/images/class-banners/math.jpg",
        template: "standard",
        settings: {
          gradeScale: "100",
          allowStudentPosts: true,
          allowStudentComments: true,
          emailNotifications: true,
          gradingScheme: "points",
          lateSubmissionPolicy: "accept",
        },
        metadata: {
          createdAt: new Date(),
          updatedAt: new Date(),
          version: 1,
          lastModifiedBy: userData.uid,
          checksum: "demo-checksum-1",
        },
      },
    ]

    await globalStateManager.setState(`user_classes:${userData.uid}`, demoClasses, {
      persistent: true,
      userId: userData.uid,
      role: userData.role,
      metadata: { action: "load_demo_data" },
    })

    setClasses(demoClasses)

    await auditSystem.logUserAction(userData.uid, userData.role, "load_demo_data", {
      classCount: demoClasses.length,
    })
  }, [userData])

  // Función auxiliar para generar checksum
  const generateChecksum = async (data: any): Promise<string> => {
    const str = JSON.stringify(data)
    const encoder = new TextEncoder()
    const dataBuffer = encoder.encode(str)
    const hashBuffer = await crypto.subtle.digest("SHA-256", dataBuffer)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("")
  }

  return {
    // Estado
    classes,
    isLoading,
    operationInProgress,

    // Acciones
    createClass,
    updateClass,
    deleteClass,
    joinClass,
    loadClasses,

    // Utilidades
    getClassById: (id: string) => classes.find((c) => c.id === id),
    getClassesByTeacher: (teacherId: string) => classes.filter((c) => c.teacherId === teacherId),
    hasUnsavedChanges: false, // Se podría implementar

    // Estadísticas
    totalClasses: classes.length,
    teachingClasses: classes.filter((c) => c.teacherId === userData?.uid).length,
    enrolledClasses: classes.filter((c) => c.teacherId !== userData?.uid).length,
  }
}
