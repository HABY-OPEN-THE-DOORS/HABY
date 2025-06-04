/**
 * HABY-CLASS - Sistema de Validación e Integridad
 * Garantiza la coherencia y validez de todos los datos
 */

import { z } from "zod"

// Esquemas de validación
export const UserSchema = z.object({
  uid: z.string().min(1),
  firstName: z.string().min(1).max(50),
  lastName: z.string().min(1).max(50),
  email: z.string().email(),
  role: z.enum(["student", "teacher", "admin"]),
  folio: z.string().min(1),
  curp: z.string().length(18),
  department: z.string().optional(),
  preferredLanguage: z.enum(["es", "en"]).optional(),
})

export const ClassSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1).max(100),
  description: z.string().max(500),
  section: z.string().min(1).max(20),
  room: z.string().max(50).optional(),
  subject: z.string().max(50).optional(),
  teacherId: z.string().min(1),
  color: z.string().min(1),
  code: z.string().length(6),
  bannerUrl: z.string().url().optional(),
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
})

export const AssignmentSchema = z.object({
  id: z.string().min(1),
  classId: z.string().min(1),
  title: z.string().min(1).max(200),
  description: z.string().max(2000),
  dueDate: z.date(),
  points: z.number().min(0).max(1000),
  submissionType: z.enum(["document", "text", "link", "multiple"]),
  status: z.enum(["assigned", "submitted", "graded", "late"]),
  attachments: z
    .array(
      z.object({
        name: z.string(),
        type: z.string(),
        url: z.string().url(),
      }),
    )
    .optional(),
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
  private validationCache = new Map<string, ValidationResult>()
  private integrityChecks: IntegrityCheck[] = []

  static getInstance(): IntegrityValidator {
    if (!IntegrityValidator.instance) {
      IntegrityValidator.instance = new IntegrityValidator()
    }
    return IntegrityValidator.instance
  }

  // Validar datos según esquema
  validateData<T>(data: any, schema: z.ZodSchema<T>, cacheKey?: string): ValidationResult {
    try {
      // Verificar cache si se proporciona clave
      if (cacheKey && this.validationCache.has(cacheKey)) {
        const cached = this.validationCache.get(cacheKey)!
        if (Date.now() - cached.data?.timestamp < 60000) {
          // Cache válido por 1 minuto
          return cached
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
        validationResult.data = { ...validationResult.data, timestamp: Date.now() }
        this.validationCache.set(cacheKey, validationResult)
      }

      return validationResult
    } catch (error) {
      return {
        isValid: false,
        errors: [`Validation error: ${error}`],
        warnings: [],
      }
    }
  }

  // Validar usuario
  validateUser(userData: any): ValidationResult {
    return this.validateData(userData, UserSchema, `user_${userData?.uid}`)
  }

  // Validar clase
  validateClass(classData: any): ValidationResult {
    return this.validateData(classData, ClassSchema, `class_${classData?.id}`)
  }

  // Validar tarea
  validateAssignment(assignmentData: any): ValidationResult {
    return this.validateData(assignmentData, AssignmentSchema, `assignment_${assignmentData?.id}`)
  }

  // Verificar integridad del sistema
  async performSystemIntegrityCheck(): Promise<IntegrityCheck[]> {
    const checks: IntegrityCheck[] = []

    // Verificar almacenamiento
    checks.push(await this.checkStorageIntegrity())

    // Verificar autenticación
    checks.push(await this.checkAuthIntegrity())

    // Verificar permisos
    checks.push(await this.checkPermissionsIntegrity())

    // Verificar datos de clases
    checks.push(await this.checkClassDataIntegrity())

    // Verificar consistencia de roles
    checks.push(await this.checkRoleConsistency())

    this.integrityChecks = checks
    return checks
  }

  private async checkStorageIntegrity(): Promise<IntegrityCheck> {
    try {
      const { advancedStorage } = await import("./advanced-storage")
      const stats = advancedStorage.getStorageStats()

      return {
        component: "Storage",
        status: stats.totalEntries > 0 ? "healthy" : "warning",
        message: `${stats.totalEntries} entries stored, ${stats.persistentEntries} persistent`,
        timestamp: new Date(),
        details: stats,
      }
    } catch (error) {
      return {
        component: "Storage",
        status: "error",
        message: `Storage check failed: ${error}`,
        timestamp: new Date(),
      }
    }
  }

  private async checkAuthIntegrity(): Promise<IntegrityCheck> {
    try {
      // Verificar que el contexto de autenticación esté funcionando
      const authData = localStorage.getItem("mockUser")

      if (authData) {
        const user = JSON.parse(authData)
        const validation = this.validateUser(user)

        return {
          component: "Authentication",
          status: validation.isValid ? "healthy" : "warning",
          message: validation.isValid ? "User authentication valid" : "User data validation issues",
          timestamp: new Date(),
          details: validation,
        }
      }

      return {
        component: "Authentication",
        status: "warning",
        message: "No authenticated user found",
        timestamp: new Date(),
      }
    } catch (error) {
      return {
        component: "Authentication",
        status: "error",
        message: `Auth check failed: ${error}`,
        timestamp: new Date(),
      }
    }
  }

  private async checkPermissionsIntegrity(): Promise<IntegrityCheck> {
    try {
      const { hasPermission } = await import("./roles-permissions")

      // Verificar permisos básicos para diferentes roles
      const studentCanView = hasPermission("student", "view_class")
      const teacherCanCreate = hasPermission("teacher", "create_class")
      const adminCanManage = hasPermission("admin", "manage_users")

      const allPermissionsWork = studentCanView && teacherCanCreate && adminCanManage

      return {
        component: "Permissions",
        status: allPermissionsWork ? "healthy" : "error",
        message: allPermissionsWork ? "Permission system working correctly" : "Permission system has issues",
        timestamp: new Date(),
        details: { studentCanView, teacherCanCreate, adminCanManage },
      }
    } catch (error) {
      return {
        component: "Permissions",
        status: "error",
        message: `Permissions check failed: ${error}`,
        timestamp: new Date(),
      }
    }
  }

  private async checkClassDataIntegrity(): Promise<IntegrityCheck> {
    try {
      const classesData = localStorage.getItem("classes")

      if (!classesData) {
        return {
          component: "Class Data",
          status: "warning",
          message: "No class data found",
          timestamp: new Date(),
        }
      }

      const classes = JSON.parse(classesData)
      const validationResults = classes.map((cls: any) => this.validateClass(cls))
      const invalidClasses = validationResults.filter((r) => !r.isValid)

      return {
        component: "Class Data",
        status: invalidClasses.length === 0 ? "healthy" : "warning",
        message: `${classes.length} classes found, ${invalidClasses.length} with validation issues`,
        timestamp: new Date(),
        details: { total: classes.length, invalid: invalidClasses.length },
      }
    } catch (error) {
      return {
        component: "Class Data",
        status: "error",
        message: `Class data check failed: ${error}`,
        timestamp: new Date(),
      }
    }
  }

  private async checkRoleConsistency(): Promise<IntegrityCheck> {
    try {
      const userData = localStorage.getItem("mockUserData")
      const classesData = localStorage.getItem("classes")

      if (!userData || !classesData) {
        return {
          component: "Role Consistency",
          status: "warning",
          message: "Insufficient data for role consistency check",
          timestamp: new Date(),
        }
      }

      const user = JSON.parse(userData)
      const classes = JSON.parse(classesData)

      // Verificar que las clases del usuario coincidan con su rol
      let inconsistencies = 0

      if (user.role === "teacher") {
        const teacherClasses = classes.filter((cls: any) => cls.teacherId === user.uid)
        if (teacherClasses.length === 0) {
          inconsistencies++
        }
      }

      return {
        component: "Role Consistency",
        status: inconsistencies === 0 ? "healthy" : "warning",
        message: `${inconsistencies} role inconsistencies found`,
        timestamp: new Date(),
        details: { inconsistencies, userRole: user.role },
      }
    } catch (error) {
      return {
        component: "Role Consistency",
        status: "error",
        message: `Role consistency check failed: ${error}`,
        timestamp: new Date(),
      }
    }
  }

  private generateWarnings<T>(data: T, schema: z.ZodSchema<T>): string[] {
    const warnings: string[] = []

    // Agregar lógica personalizada para generar advertencias
    if (typeof data === "object" && data !== null) {
      const obj = data as any

      // Advertencia para campos opcionales vacíos importantes
      if ("description" in obj && (!obj.description || obj.description.length < 10)) {
        warnings.push("Description is very short or empty")
      }

      // Advertencia para fechas muy próximas
      if ("dueDate" in obj && obj.dueDate) {
        const dueDate = new Date(obj.dueDate)
        const now = new Date()
        const timeDiff = dueDate.getTime() - now.getTime()
        const daysDiff = timeDiff / (1000 * 3600 * 24)

        if (daysDiff < 1 && daysDiff > 0) {
          warnings.push("Due date is less than 24 hours away")
        }
      }
    }

    return warnings
  }

  // Obtener estadísticas de validación
  getValidationStats(): any {
    const stats = {
      totalValidations: this.validationCache.size,
      cacheHitRate: 0,
      recentChecks: this.integrityChecks.slice(-10),
      systemHealth: this.calculateSystemHealth(),
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

  // Limpiar cache de validación
  clearValidationCache(): void {
    this.validationCache.clear()
  }

  // Obtener reporte de integridad
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
      recommendations.push("Address critical system errors immediately")
    }

    if (warningChecks.length > 0) {
      recommendations.push("Review and resolve system warnings")
    }

    if (this.validationCache.size > 1000) {
      recommendations.push("Consider clearing validation cache to free memory")
    }

    return recommendations
  }
}

// Instancia global
export const integrityValidator = IntegrityValidator.getInstance()
