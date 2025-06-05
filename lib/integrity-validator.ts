/**
 * HABY-CLASS - Sistema de Validación e Integridad CORREGIDO
 * Garantiza la coherencia y validez de todos los datos
 */

import { z } from "zod"

// Esquemas de validación corregidos
export const UserSchema = z.object({
  uid: z.string().min(1, "UID es requerido"),
  firstName: z.string().min(1, "Nombre es requerido").max(50, "Nombre muy largo"),
  lastName: z.string().min(1, "Apellido es requerido").max(50, "Apellido muy largo"),
  email: z.string().email("Email inválido"),
  role: z.enum(["student", "teacher", "admin"], {
    errorMap: () => ({ message: "Rol debe ser student, teacher o admin" }),
  }),
  folio: z.string().min(1, "Folio es requerido"),
  curp: z.string().length(18, "CURP debe tener exactamente 18 caracteres"),
  department: z.string().optional(),
  preferredLanguage: z.enum(["es", "en"]).optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
})

export const ClassSchema = z.object({
  id: z.string().min(1, "ID de clase es requerido"),
  name: z.string().min(1, "Nombre de clase es requerido").max(100, "Nombre muy largo"),
  description: z.string().max(500, "Descripción muy larga"),
  section: z.string().min(1, "Sección es requerida").max(20, "Sección muy larga"),
  room: z.string().max(50, "Nombre de aula muy largo").optional(),
  subject: z.string().max(50, "Materia muy larga").optional(),
  teacherId: z.string().min(1, "ID de profesor es requerido"),
  color: z.string().min(1, "Color es requerido"),
  code: z.string().length(6, "Código debe tener exactamente 6 caracteres"),
  bannerUrl: z.string().url("URL de banner inválida").optional(),
  template: z.string().optional(),
  settings: z
    .object({
      gradeScale: z.enum(["100", "10", "5", "letter"]).optional(),
      allowStudentPosts: z.boolean().optional(),
      allowStudentComments: z.boolean().optional(),
      emailNotifications: z.boolean().optional(),
      gradingScheme: z.enum(["points", "percentage", "custom"]).optional(),
      lateSubmissionPolicy: z.enum(["accept", "reject", "penalty"]).optional(),
      penaltyPercentage: z.number().min(0).max(100).optional(),
    })
    .optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
})

export const AssignmentSchema = z.object({
  id: z.string().min(1, "ID de tarea es requerido"),
  classId: z.string().min(1, "ID de clase es requerido"),
  title: z.string().min(1, "Título es requerido").max(200, "Título muy largo"),
  description: z.string().max(2000, "Descripción muy larga"),
  dueDate: z.date("Fecha de entrega inválida"),
  points: z.number().min(0, "Puntos no pueden ser negativos").max(1000, "Puntos muy altos"),
  submissionType: z.enum(["document", "text", "link", "multiple"], {
    errorMap: () => ({ message: "Tipo de entrega inválido" }),
  }),
  status: z.enum(["assigned", "submitted", "graded", "late"], {
    errorMap: () => ({ message: "Estado inválido" }),
  }),
  attachments: z
    .array(
      z.object({
        name: z.string().min(1, "Nombre de archivo requerido"),
        type: z.string().min(1, "Tipo de archivo requerido"),
        url: z.string().url("URL de archivo inválida"),
      }),
    )
    .optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
})

export interface ValidationResult {
  isValid: boolean
  errors: string[]
  warnings: string[]
  data?: any
}

export interface IntegrityCheck {
  component: string
  status: "healthy" | "warning" | "error"
  message: string
  timestamp: Date
  details?: any
}

export class IntegrityValidator {
  private static instance: IntegrityValidator
  private validationCache = new Map<string, { result: ValidationResult; timestamp: number }>()
  private integrityChecks: IntegrityCheck[] = []
  private readonly CACHE_DURATION = 60000 // 1 minuto

  static getInstance(): IntegrityValidator {
    if (!IntegrityValidator.instance) {
      IntegrityValidator.instance = new IntegrityValidator()
    }
    return IntegrityValidator.instance
  }

  private constructor() {
    this.setupCacheCleanup()
  }

  // Validar datos según esquema con cache mejorado
  validateData<T>(data: any, schema: z.ZodSchema<T>, cacheKey?: string): ValidationResult {
    try {
      // Verificar cache si se proporciona clave
      if (cacheKey && this.validationCache.has(cacheKey)) {
        const cached = this.validationCache.get(cacheKey)!
        if (Date.now() - cached.timestamp < this.CACHE_DURATION) {
          return cached.result
        }
      }

      const result = schema.safeParse(data)

      const validationResult: ValidationResult = {
        isValid: result.success,
        errors: result.success ? [] : result.error.errors.map((e) => `${e.path.join(".")}: ${e.message}`),
        warnings: [],
        data: result.success ? result.data : undefined,
      }

      // Agregar advertencias personalizadas
      if (result.success) {
        validationResult.warnings = this.generateWarnings(result.data, schema)
      }

      // Guardar en cache
      if (cacheKey) {
        this.validationCache.set(cacheKey, {
          result: validationResult,
          timestamp: Date.now(),
        })
      }

      return validationResult
    } catch (error) {
      console.error("Error en validación:", error)
      return {
        isValid: false,
        errors: [`Error de validación: ${error instanceof Error ? error.message : String(error)}`],
        warnings: [],
      }
    }
  }

  // Validar usuario con manejo de errores mejorado
  validateUser(userData: any): ValidationResult {
    if (!userData) {
      return {
        isValid: false,
        errors: ["Datos de usuario no proporcionados"],
        warnings: [],
      }
    }
    return this.validateData(userData, UserSchema, `user_${userData?.uid}`)
  }

  // Validar clase con validaciones adicionales
  validateClass(classData: any): ValidationResult {
    if (!classData) {
      return {
        isValid: false,
        errors: ["Datos de clase no proporcionados"],
        warnings: [],
      }
    }

    const result = this.validateData(classData, ClassSchema, `class_${classData?.id}`)

    // Validaciones adicionales específicas para clases
    if (result.isValid && classData) {
      // Verificar que el código de clase sea único (simulado)
      if (classData.code && classData.code.length !== 6) {
        result.warnings.push("El código de clase debe tener exactamente 6 caracteres")
      }

      // Verificar configuraciones coherentes
      if (classData.settings?.penaltyPercentage && classData.settings.lateSubmissionPolicy !== "penalty") {
        result.warnings.push("Porcentaje de penalización configurado pero política no es 'penalty'")
      }
    }

    return result
  }

  // Validar tarea con validaciones de fechas
  validateAssignment(assignmentData: any): ValidationResult {
    if (!assignmentData) {
      return {
        isValid: false,
        errors: ["Datos de tarea no proporcionados"],
        warnings: [],
      }
    }

    const result = this.validateData(assignmentData, AssignmentSchema, `assignment_${assignmentData?.id}`)

    // Validaciones adicionales para tareas
    if (result.isValid && assignmentData) {
      const dueDate = new Date(assignmentData.dueDate)
      const now = new Date()

      // Verificar que la fecha de entrega no sea en el pasado
      if (dueDate < now) {
        result.warnings.push("La fecha de entrega está en el pasado")
      }

      // Verificar que la fecha no sea muy lejana
      const oneYearFromNow = new Date()
      oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1)
      if (dueDate > oneYearFromNow) {
        result.warnings.push("La fecha de entrega es muy lejana (más de un año)")
      }
    }

    return result
  }

  // Verificar integridad del sistema con manejo de errores robusto
  async performSystemIntegrityCheck(): Promise<IntegrityCheck[]> {
    const checks: IntegrityCheck[] = []

    try {
      // Verificar almacenamiento
      checks.push(await this.checkStorageIntegrity())
    } catch (error) {
      checks.push({
        component: "Storage",
        status: "error",
        message: `Error verificando almacenamiento: ${error}`,
        timestamp: new Date(),
      })
    }

    try {
      // Verificar autenticación
      checks.push(await this.checkAuthIntegrity())
    } catch (error) {
      checks.push({
        component: "Authentication",
        status: "error",
        message: `Error verificando autenticación: ${error}`,
        timestamp: new Date(),
      })
    }

    try {
      // Verificar permisos
      checks.push(await this.checkPermissionsIntegrity())
    } catch (error) {
      checks.push({
        component: "Permissions",
        status: "error",
        message: `Error verificando permisos: ${error}`,
        timestamp: new Date(),
      })
    }

    try {
      // Verificar datos de clases
      checks.push(await this.checkClassDataIntegrity())
    } catch (error) {
      checks.push({
        component: "Class Data",
        status: "error",
        message: `Error verificando datos de clases: ${error}`,
        timestamp: new Date(),
      })
    }

    try {
      // Verificar consistencia de roles
      checks.push(await this.checkRoleConsistency())
    } catch (error) {
      checks.push({
        component: "Role Consistency",
        status: "error",
        message: `Error verificando consistencia de roles: ${error}`,
        timestamp: new Date(),
      })
    }

    this.integrityChecks = checks
    return checks
  }

  private async checkStorageIntegrity(): Promise<IntegrityCheck> {
    try {
      // Verificar que localStorage esté disponible
      if (typeof Storage === "undefined") {
        return {
          component: "Storage",
          status: "error",
          message: "LocalStorage no está disponible",
          timestamp: new Date(),
        }
      }

      // Verificar espacio disponible
      const testKey = "haby_storage_test"
      const testData = "test"

      try {
        localStorage.setItem(testKey, testData)
        localStorage.removeItem(testKey)
      } catch (error) {
        return {
          component: "Storage",
          status: "error",
          message: "No se puede escribir en localStorage",
          timestamp: new Date(),
        }
      }

      // Contar elementos almacenados
      let habyItems = 0
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key?.startsWith("haby_")) {
          habyItems++
        }
      }

      return {
        component: "Storage",
        status: habyItems > 0 ? "healthy" : "warning",
        message: `${habyItems} elementos almacenados`,
        timestamp: new Date(),
        details: { itemCount: habyItems },
      }
    } catch (error) {
      return {
        component: "Storage",
        status: "error",
        message: `Error verificando almacenamiento: ${error}`,
        timestamp: new Date(),
      }
    }
  }

  private async checkAuthIntegrity(): Promise<IntegrityCheck> {
    try {
      const authData = localStorage.getItem("mockUser")
      const userData = localStorage.getItem("mockUserData")

      if (!authData || !userData) {
        return {
          component: "Authentication",
          status: "warning",
          message: "No hay usuario autenticado",
          timestamp: new Date(),
        }
      }

      const user = JSON.parse(authData)
      const userDetails = JSON.parse(userData)

      const validation = this.validateUser(userDetails)

      return {
        component: "Authentication",
        status: validation.isValid ? "healthy" : "warning",
        message: validation.isValid ? "Usuario autenticado válido" : "Datos de usuario inválidos",
        timestamp: new Date(),
        details: {
          userId: user.uid,
          role: userDetails.role,
          validationErrors: validation.errors,
          validationWarnings: validation.warnings,
        },
      }
    } catch (error) {
      return {
        component: "Authentication",
        status: "error",
        message: `Error verificando autenticación: ${error}`,
        timestamp: new Date(),
      }
    }
  }

  private async checkPermissionsIntegrity(): Promise<IntegrityCheck> {
    try {
      // Verificar que el sistema de permisos esté funcionando
      const testPermissions = [
        { role: "student", permission: "view_class", expected: true },
        { role: "teacher", permission: "create_class", expected: true },
        { role: "admin", permission: "manage_users", expected: true },
        { role: "student", permission: "delete_class", expected: false },
      ]

      let failedTests = 0
      const testResults: any[] = []

      for (const test of testPermissions) {
        try {
          // Simular verificación de permisos
          const hasPermission = this.simulatePermissionCheck(test.role, test.permission)
          const passed = hasPermission === test.expected

          if (!passed) failedTests++

          testResults.push({
            role: test.role,
            permission: test.permission,
            expected: test.expected,
            actual: hasPermission,
            passed,
          })
        } catch (error) {
          failedTests++
          testResults.push({
            role: test.role,
            permission: test.permission,
            error: String(error),
          })
        }
      }

      return {
        component: "Permissions",
        status: failedTests === 0 ? "healthy" : "error",
        message: `${testPermissions.length - failedTests}/${testPermissions.length} pruebas de permisos pasaron`,
        timestamp: new Date(),
        details: { testResults, failedTests },
      }
    } catch (error) {
      return {
        component: "Permissions",
        status: "error",
        message: `Error verificando permisos: ${error}`,
        timestamp: new Date(),
      }
    }
  }

  private async checkClassDataIntegrity(): Promise<IntegrityCheck> {
    try {
      const userData = localStorage.getItem("mockUserData")
      if (!userData) {
        return {
          component: "Class Data",
          status: "warning",
          message: "No hay usuario para verificar datos de clases",
          timestamp: new Date(),
        }
      }

      const user = JSON.parse(userData)
      const classesData = localStorage.getItem(`haby_user_classes:${user.uid}`)

      if (!classesData) {
        return {
          component: "Class Data",
          status: "warning",
          message: "No hay datos de clases",
          timestamp: new Date(),
        }
      }

      const classes = JSON.parse(classesData)
      if (!Array.isArray(classes)) {
        return {
          component: "Class Data",
          status: "error",
          message: "Datos de clases corruptos (no es un array)",
          timestamp: new Date(),
        }
      }

      const validationResults = classes.map((cls: any, index: number) => {
        const validation = this.validateClass(cls)
        return {
          index,
          classId: cls?.id,
          className: cls?.name,
          isValid: validation.isValid,
          errors: validation.errors,
          warnings: validation.warnings,
        }
      })

      const invalidClasses = validationResults.filter((r) => !r.isValid)

      return {
        component: "Class Data",
        status: invalidClasses.length === 0 ? "healthy" : "warning",
        message: `${classes.length} clases encontradas, ${invalidClasses.length} con errores de validación`,
        timestamp: new Date(),
        details: {
          total: classes.length,
          invalid: invalidClasses.length,
          validationResults: invalidClasses.length > 0 ? invalidClasses : undefined,
        },
      }
    } catch (error) {
      return {
        component: "Class Data",
        status: "error",
        message: `Error verificando datos de clases: ${error}`,
        timestamp: new Date(),
      }
    }
  }

  private async checkRoleConsistency(): Promise<IntegrityCheck> {
    try {
      const userData = localStorage.getItem("mockUserData")
      if (!userData) {
        return {
          component: "Role Consistency",
          status: "warning",
          message: "No hay datos de usuario para verificar consistencia",
          timestamp: new Date(),
        }
      }

      const user = JSON.parse(userData)
      const classesData = localStorage.getItem(`haby_user_classes:${user.uid}`)

      if (!classesData) {
        return {
          component: "Role Consistency",
          status: "warning",
          message: "No hay datos de clases para verificar consistencia",
          timestamp: new Date(),
        }
      }

      const classes = JSON.parse(classesData)
      let inconsistencies = 0
      const issues: string[] = []

      if (user.role === "teacher") {
        const teacherClasses = classes.filter((cls: any) => cls.teacherId === user.uid)
        if (teacherClasses.length === 0) {
          inconsistencies++
          issues.push("Profesor sin clases asignadas")
        }

        const nonTeacherClasses = classes.filter((cls: any) => cls.teacherId !== user.uid)
        if (nonTeacherClasses.length > 0) {
          inconsistencies++
          issues.push(`Profesor inscrito en ${nonTeacherClasses.length} clases que no enseña`)
        }
      } else if (user.role === "student") {
        const ownClasses = classes.filter((cls: any) => cls.teacherId === user.uid)
        if (ownClasses.length > 0) {
          inconsistencies++
          issues.push(`Estudiante aparece como profesor de ${ownClasses.length} clases`)
        }
      }

      return {
        component: "Role Consistency",
        status: inconsistencies === 0 ? "healthy" : "warning",
        message: `${inconsistencies} inconsistencias de rol encontradas`,
        timestamp: new Date(),
        details: {
          inconsistencies,
          userRole: user.role,
          issues: issues.length > 0 ? issues : undefined,
        },
      }
    } catch (error) {
      return {
        component: "Role Consistency",
        status: "error",
        message: `Error verificando consistencia de roles: ${error}`,
        timestamp: new Date(),
      }
    }
  }

  private generateWarnings<T>(data: T, schema: z.ZodSchema<T>): string[] {
    const warnings: string[] = []

    if (typeof data === "object" && data !== null) {
      const obj = data as any

      // Advertencia para campos opcionales vacíos importantes
      if ("description" in obj && (!obj.description || obj.description.length < 10)) {
        warnings.push("La descripción es muy corta o está vacía")
      }

      // Advertencia para fechas muy próximas
      if ("dueDate" in obj && obj.dueDate) {
        const dueDate = new Date(obj.dueDate)
        const now = new Date()
        const timeDiff = dueDate.getTime() - now.getTime()
        const daysDiff = timeDiff / (1000 * 3600 * 24)

        if (daysDiff < 1 && daysDiff > 0) {
          warnings.push("La fecha de entrega es en menos de 24 horas")
        }
      }

      // Advertencia para nombres muy cortos
      if ("name" in obj && obj.name && obj.name.length < 3) {
        warnings.push("El nombre es muy corto")
      }

      // Advertencia para códigos de clase débiles
      if ("code" in obj && obj.code) {
        if (!/^[A-Z0-9]{6}$/.test(obj.code)) {
          warnings.push("El código de clase debería contener solo letras mayúsculas y números")
        }
      }
    }

    return warnings
  }

  private simulatePermissionCheck(role: string, permission: string): boolean {
    // Simulación básica del sistema de permisos
    const permissions = {
      student: ["view_class", "submit_assignment", "view_grades", "comment_announcements"],
      teacher: [
        "view_class",
        "create_class",
        "edit_class",
        "create_assignment",
        "grade_assignment",
        "create_announcement",
      ],
      admin: ["view_class", "create_class", "edit_class", "delete_class", "manage_users", "view_audit_logs"],
    }

    return permissions[role as keyof typeof permissions]?.includes(permission) || false
  }

  private setupCacheCleanup(): void {
    // Limpiar cache cada 5 minutos
    setInterval(
      () => {
        const now = Date.now()
        for (const [key, value] of this.validationCache.entries()) {
          if (now - value.timestamp > this.CACHE_DURATION) {
            this.validationCache.delete(key)
          }
        }
      },
      5 * 60 * 1000,
    )
  }

  // Métodos públicos adicionales
  getValidationStats(): any {
    const stats = {
      totalValidations: this.validationCache.size,
      recentChecks: this.integrityChecks.slice(-10),
      systemHealth: this.calculateSystemHealth(),
      cacheSize: this.validationCache.size,
      lastIntegrityCheck:
        this.integrityChecks.length > 0 ? this.integrityChecks[this.integrityChecks.length - 1].timestamp : null,
    }

    return stats
  }

  private calculateSystemHealth(): "healthy" | "warning" | "error" {
    if (this.integrityChecks.length === 0) return "warning"

    const errorChecks = this.integrityChecks.filter((c) => c.status === "error")
    const warningChecks = this.integrityChecks.filter((c) => c.status === "warning")

    if (errorChecks.length > 0) return "error"
    if (warningChecks.length > 0) return "warning"
    return "healthy"
  }

  clearValidationCache(): void {
    this.validationCache.clear()
    console.log("🧹 Cache de validación limpiado")
  }

  generateIntegrityReport(): any {
    return {
      timestamp: new Date(),
      systemHealth: this.calculateSystemHealth(),
      checks: this.integrityChecks,
      validationStats: this.getValidationStats(),
      recommendations: this.generateRecommendations(),
    }
  }

  private generateRecommendations(): string[] {
    const recommendations: string[] = []

    const errorChecks = this.integrityChecks.filter((c) => c.status === "error")
    const warningChecks = this.integrityChecks.filter((c) => c.status === "warning")

    if (errorChecks.length > 0) {
      recommendations.push("Resolver errores críticos del sistema inmediatamente")
      errorChecks.forEach((check) => {
        recommendations.push(`- ${check.component}: ${check.message}`)
      })
    }

    if (warningChecks.length > 0) {
      recommendations.push("Revisar y resolver advertencias del sistema")
      warningChecks.forEach((check) => {
        recommendations.push(`- ${check.component}: ${check.message}`)
      })
    }

    if (this.validationCache.size > 1000) {
      recommendations.push("Considerar limpiar el cache de validación para liberar memoria")
    }

    if (this.integrityChecks.length === 0) {
      recommendations.push("Ejecutar verificación de integridad del sistema")
    }

    return recommendations
  }
}

// Instancia global
export const integrityValidator = IntegrityValidator.getInstance()
