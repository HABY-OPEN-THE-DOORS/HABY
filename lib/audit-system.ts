/**
 * HABY-CLASS - Sistema de Auditoría y Logs
 * Registro completo de todas las acciones del sistema
 */

export interface AuditLog {
  id: string
  timestamp: Date
  userId: string
  userRole: string
  action: string
  resource: string
  resourceId: string
  details: any
  ipAddress?: string
  userAgent?: string
  success: boolean
  errorMessage?: string
  metadata?: any
}

export interface AuditQuery {
  userId?: string
  userRole?: string
  action?: string
  resource?: string
  dateFrom?: Date
  dateTo?: Date
  success?: boolean
  limit?: number
  offset?: number
}

export class AuditSystem {
  private static instance: AuditSystem
  private logs: AuditLog[] = []
  private maxLogs = 10000

  static getInstance(): AuditSystem {
    if (!AuditSystem.instance) {
      AuditSystem.instance = new AuditSystem()
    }
    return AuditSystem.instance
  }

  private constructor() {
    this.loadLogs()
    this.setupAutoCleanup()
  }

  // Registrar una acción
  async log(
    userId: string,
    userRole: string,
    action: string,
    resource: string,
    resourceId: string,
    details: any = {},
    success = true,
    errorMessage?: string,
  ): Promise<void> {
    try {
      const auditLog: AuditLog = {
        id: `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date(),
        userId,
        userRole,
        action,
        resource,
        resourceId,
        details,
        success,
        errorMessage,
        metadata: {
          sessionId: this.getSessionId(),
          platform: this.getPlatform(),
        },
      }

      // Agregar información del navegador si está disponible
      if (typeof window !== "undefined") {
        auditLog.userAgent = navigator.userAgent
      }

      this.logs.push(auditLog)

      // Mantener el límite de logs
      if (this.logs.length > this.maxLogs) {
        this.logs = this.logs.slice(-this.maxLogs)
      }

      // Persistir logs críticos
      this.saveLogs()

      console.log(`📋 Audit log: ${action} on ${resource}:${resourceId} by ${userId} (${userRole})`)
    } catch (error) {
      console.error("Error creating audit log:", error)
    }
  }

  // Métodos de conveniencia para acciones comunes
  async logUserAction(userId: string, userRole: string, action: string, details: any = {}): Promise<void> {
    await this.log(userId, userRole, action, "user", userId, details)
  }

  async logClassAction(
    userId: string,
    userRole: string,
    action: string,
    classId: string,
    details: any = {},
  ): Promise<void> {
    await this.log(userId, userRole, action, "class", classId, details)
  }

  async logAssignmentAction(
    userId: string,
    userRole: string,
    action: string,
    assignmentId: string,
    details: any = {},
  ): Promise<void> {
    await this.log(userId, userRole, action, "assignment", assignmentId, details)
  }

  async logSystemAction(userId: string, userRole: string, action: string, details: any = {}): Promise<void> {
    await this.log(userId, userRole, action, "system", "global", details)
  }

  async logError(
    userId: string,
    userRole: string,
    action: string,
    resource: string,
    resourceId: string,
    error: string,
    details: any = {},
  ): Promise<void> {
    await this.log(userId, userRole, action, resource, resourceId, details, false, error)
  }

  // Consultar logs
  queryLogs(query: AuditQuery = {}): AuditLog[] {
    let filteredLogs = [...this.logs]

    // Aplicar filtros
    if (query.userId) {
      filteredLogs = filteredLogs.filter((log) => log.userId === query.userId)
    }

    if (query.userRole) {
      filteredLogs = filteredLogs.filter((log) => log.userRole === query.userRole)
    }

    if (query.action) {
      filteredLogs = filteredLogs.filter((log) => log.action.includes(query.action))
    }

    if (query.resource) {
      filteredLogs = filteredLogs.filter((log) => log.resource === query.resource)
    }

    if (query.dateFrom) {
      filteredLogs = filteredLogs.filter((log) => log.timestamp >= query.dateFrom!)
    }

    if (query.dateTo) {
      filteredLogs = filteredLogs.filter((log) => log.timestamp <= query.dateTo!)
    }

    if (query.success !== undefined) {
      filteredLogs = filteredLogs.filter((log) => log.success === query.success)
    }

    // Ordenar por timestamp descendente
    filteredLogs.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())

    // Aplicar paginación
    const offset = query.offset || 0
    const limit = query.limit || 100

    return filteredLogs.slice(offset, offset + limit)
  }

  // Obtener estadísticas de auditoría
  getAuditStats(timeframe: "hour" | "day" | "week" | "month" = "day"): any {
    const now = new Date()
    let startTime: Date

    switch (timeframe) {
      case "hour":
        startTime = new Date(now.getTime() - 60 * 60 * 1000)
        break
      case "day":
        startTime = new Date(now.getTime() - 24 * 60 * 60 * 1000)
        break
      case "week":
        startTime = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        break
      case "month":
        startTime = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
        break
    }

    const recentLogs = this.logs.filter((log) => log.timestamp >= startTime)

    const stats = {
      totalActions: recentLogs.length,
      successfulActions: recentLogs.filter((log) => log.success).length,
      failedActions: recentLogs.filter((log) => !log.success).length,
      uniqueUsers: new Set(recentLogs.map((log) => log.userId)).size,
      actionsByType: {} as Record<string, number>,
      actionsByResource: {} as Record<string, number>,
      actionsByRole: {} as Record<string, number>,
      errorRate: 0,
      timeframe,
      startTime,
      endTime: now,
    }

    // Calcular distribuciones
    recentLogs.forEach((log) => {
      stats.actionsByType[log.action] = (stats.actionsByType[log.action] || 0) + 1
      stats.actionsByResource[log.resource] = (stats.actionsByResource[log.resource] || 0) + 1
      stats.actionsByRole[log.userRole] = (stats.actionsByRole[log.userRole] || 0) + 1
    })

    // Calcular tasa de error
    stats.errorRate = stats.totalActions > 0 ? (stats.failedActions / stats.totalActions) * 100 : 0

    return stats
  }

  // Exportar logs para análisis
  exportLogs(query: AuditQuery = {}): string {
    const logs = this.queryLogs(query)

    const csvHeader = "Timestamp,User ID,User Role,Action,Resource,Resource ID,Success,Error Message,Details\n"
    const csvRows = logs
      .map((log) => {
        const details = JSON.stringify(log.details).replace(/"/g, '""')
        return [
          log.timestamp.toISOString(),
          log.userId,
          log.userRole,
          log.action,
          log.resource,
          log.resourceId,
          log.success,
          log.errorMessage || "",
          `"${details}"`,
        ].join(",")
      })
      .join("\n")

    return csvHeader + csvRows
  }

  // Detectar patrones sospechosos
  detectAnomalies(): any[] {
    const anomalies: any[] = []
    const recentLogs = this.logs.filter(
      (log) => log.timestamp >= new Date(Date.now() - 60 * 60 * 1000), // Última hora
    )

    // Detectar múltiples fallos de un usuario
    const failuresByUser = new Map<string, number>()
    recentLogs
      .filter((log) => !log.success)
      .forEach((log) => {
        failuresByUser.set(log.userId, (failuresByUser.get(log.userId) || 0) + 1)
      })

    failuresByUser.forEach((failures, userId) => {
      if (failures >= 5) {
        anomalies.push({
          type: "multiple_failures",
          userId,
          count: failures,
          severity: "high",
          description: `Usuario ${userId} ha tenido ${failures} fallos en la última hora`,
        })
      }
    })

    // Detectar actividad inusual por volumen
    const actionsByUser = new Map<string, number>()
    recentLogs.forEach((log) => {
      actionsByUser.set(log.userId, (actionsByUser.get(log.userId) || 0) + 1)
    })

    actionsByUser.forEach((actions, userId) => {
      if (actions >= 100) {
        anomalies.push({
          type: "high_activity",
          userId,
          count: actions,
          severity: "medium",
          description: `Usuario ${userId} ha realizado ${actions} acciones en la última hora`,
        })
      }
    })

    // Detectar acciones de administrador inusuales
    const adminActions = recentLogs.filter(
      (log) => log.userRole === "admin" && ["delete_user", "change_role", "system_config"].includes(log.action),
    )

    if (adminActions.length >= 10) {
      anomalies.push({
        type: "admin_activity",
        count: adminActions.length,
        severity: "high",
        description: `${adminActions.length} acciones administrativas críticas en la última hora`,
      })
    }

    return anomalies
  }

  // Métodos privados
  private getSessionId(): string {
    if (typeof window !== "undefined") {
      let sessionId = sessionStorage.getItem("haby_session_id")
      if (!sessionId) {
        sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        sessionStorage.setItem("haby_session_id", sessionId)
      }
      return sessionId
    }
    return "server_session"
  }

  private getPlatform(): string {
    if (typeof window !== "undefined") {
      return navigator.platform || "unknown"
    }
    return "server"
  }

  private saveLogs(): void {
    try {
      // Guardar solo los últimos 1000 logs en localStorage
      const recentLogs = this.logs.slice(-1000)
      localStorage.setItem("haby_audit_logs", JSON.stringify(recentLogs))
    } catch (error) {
      console.error("Error saving audit logs:", error)
    }
  }

  private loadLogs(): void {
    try {
      const saved = localStorage.getItem("haby_audit_logs")
      if (saved) {
        const parsedLogs = JSON.parse(saved)
        this.logs = parsedLogs.map((log: any) => ({
          ...log,
          timestamp: new Date(log.timestamp),
        }))
      }
    } catch (error) {
      console.error("Error loading audit logs:", error)
      this.logs = []
    }
  }

  private setupAutoCleanup(): void {
    // Limpiar logs antiguos cada hora
    setInterval(
      () => {
        const cutoffDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // 30 días
        const initialCount = this.logs.length
        this.logs = this.logs.filter((log) => log.timestamp >= cutoffDate)

        if (this.logs.length < initialCount) {
          console.log(`🧹 Audit cleanup: Removed ${initialCount - this.logs.length} old logs`)
          this.saveLogs()
        }
      },
      60 * 60 * 1000,
    ) // Cada hora
  }

  // Métodos públicos adicionales
  clearLogs(): void {
    this.logs = []
    localStorage.removeItem("haby_audit_logs")
    console.log("🗑️ All audit logs cleared")
  }

  getLogCount(): number {
    return this.logs.length
  }

  getOldestLog(): AuditLog | null {
    return this.logs.length > 0 ? this.logs[0] : null
  }

  getNewestLog(): AuditLog | null {
    return this.logs.length > 0 ? this.logs[this.logs.length - 1] : null
  }
}

// Instancia global
export const auditSystem = AuditSystem.getInstance()

// Funciones de conveniencia para logging
export const logUserAction = (userId: string, userRole: string, action: string, details?: any) =>
  auditSystem.logUserAction(userId, userRole, action, details)

export const logClassAction = (userId: string, userRole: string, action: string, classId: string, details?: any) =>
  auditSystem.logClassAction(userId, userRole, action, classId, details)

export const logAssignmentAction = (
  userId: string,
  userRole: string,
  action: string,
  assignmentId: string,
  details?: any,
) => auditSystem.logAssignmentAction(userId, userRole, action, assignmentId, details)

export const logSystemAction = (userId: string, userRole: string, action: string, details?: any) =>
  auditSystem.logSystemAction(userId, userRole, action, details)

export const logError = (
  userId: string,
  userRole: string,
  action: string,
  resource: string,
  resourceId: string,
  error: string,
  details?: any,
) => auditSystem.logError(userId, userRole, action, resource, resourceId, error, details)
