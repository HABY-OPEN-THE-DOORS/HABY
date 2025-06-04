/**
 * HABY-CLASS - Gestor de Estado Global
 * Sincronización perfecta entre todos los componentes
 */

import { advancedStorage } from "./advanced-storage"
import { integrityValidator } from "./integrity-validator"

export interface StateChange<T = any> {
  key: string
  oldValue: T | null
  newValue: T | null
  timestamp: Date
  userId: string
  action: "create" | "update" | "delete"
  metadata?: any
}

export interface StateSubscription {
  id: string
  pattern: string | RegExp
  callback: (change: StateChange) => void
  options: {
    immediate?: boolean
    persistent?: boolean
    role?: string
  }
}

export class GlobalStateManager {
  private static instance: GlobalStateManager
  private subscriptions = new Map<string, StateSubscription>()
  private stateHistory: StateChange[] = []
  private maxHistorySize = 1000

  static getInstance(): GlobalStateManager {
    if (!GlobalStateManager.instance) {
      GlobalStateManager.instance = new GlobalStateManager()
    }
    return GlobalStateManager.instance
  }

  private constructor() {
    this.loadStateHistory()
  }

  // Establecer estado con validación y persistencia
  async setState<T>(
    key: string,
    value: T,
    options: {
      persistent?: boolean
      expiresAt?: Date
      validate?: boolean
      userId?: string
      role?: string
      metadata?: any
    } = {},
  ): Promise<void> {
    try {
      const oldValue = await this.getState<T>(key)

      // Validar datos si se solicita
      if (options.validate) {
        const validation = this.validateStateData(key, value)
        if (!validation.isValid) {
          throw new Error(`Validation failed: ${validation.errors.join(", ")}`)
        }
      }

      // Almacenar en el sistema avanzado
      await advancedStorage.store(key, value, {
        persistent: options.persistent ?? true,
        expiresAt: options.expiresAt,
        userId: options.userId || this.getCurrentUserId(),
        role: options.role || this.getCurrentUserRole(),
        backup: true,
      })

      // Registrar cambio
      const change: StateChange<T> = {
        key,
        oldValue,
        newValue: value,
        timestamp: new Date(),
        userId: options.userId || this.getCurrentUserId(),
        action: oldValue === null ? "create" : "update",
        metadata: options.metadata,
      }

      this.recordStateChange(change)
      this.notifySubscribers(change)

      console.log(`🔄 Estado actualizado: ${key}`, {
        action: change.action,
        persistent: options.persistent,
        hasValidation: options.validate,
      })
    } catch (error) {
      console.error(`❌ Error al establecer estado ${key}:`, error)
      throw error
    }
  }

  // Obtener estado
  async getState<T>(key: string): Promise<T | null> {
    try {
      return await advancedStorage.retrieve<T>(key)
    } catch (error) {
      console.error(`❌ Error al obtener estado ${key}:`, error)
      return null
    }
  }

  // Actualizar estado existente
  async updateState<T>(
    key: string,
    updater: (current: T | null) => T,
    options: {
      persistent?: boolean
      validate?: boolean
      userId?: string
      role?: string
      metadata?: any
    } = {},
  ): Promise<void> {
    await advancedStorage.update(key, updater, {
      persistent: options.persistent,
      userId: options.userId || this.getCurrentUserId(),
      role: options.role || this.getCurrentUserRole(),
    })

    // Registrar el cambio
    const newValue = await this.getState<T>(key)
    const change: StateChange<T> = {
      key,
      oldValue: null, // Se podría mejorar para obtener el valor anterior
      newValue,
      timestamp: new Date(),
      userId: options.userId || this.getCurrentUserId(),
      action: "update",
      metadata: options.metadata,
    }

    this.recordStateChange(change)
    this.notifySubscribers(change)
  }

  // Eliminar estado
  async removeState(key: string, userId?: string): Promise<void> {
    const oldValue = await this.getState(key)
    await advancedStorage.remove(key)

    const change: StateChange = {
      key,
      oldValue,
      newValue: null,
      timestamp: new Date(),
      userId: userId || this.getCurrentUserId(),
      action: "delete",
    }

    this.recordStateChange(change)
    this.notifySubscribers(change)
  }

  // Suscribirse a cambios de estado
  subscribe(
    pattern: string | RegExp,
    callback: (change: StateChange) => void,
    options: {
      immediate?: boolean
      persistent?: boolean
      role?: string
    } = {},
  ): string {
    const id = `sub_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    const subscription: StateSubscription = {
      id,
      pattern,
      callback,
      options,
    }

    this.subscriptions.set(id, subscription)

    // Ejecutar inmediatamente si se solicita
    if (options.immediate) {
      this.executeImmediateSubscription(subscription)
    }

    console.log(`📡 Suscripción creada: ${id} para patrón: ${pattern}`)

    // Retornar función de desuscripción
    return id
  }

  // Desuscribirse
  unsubscribe(subscriptionId: string): void {
    if (this.subscriptions.delete(subscriptionId)) {
      console.log(`📡 Suscripción eliminada: ${subscriptionId}`)
    }
  }

  // Obtener historial de cambios
  getStateHistory(key?: string, limit?: number): StateChange[] {
    let history = this.stateHistory

    if (key) {
      history = history.filter((change) =>
        typeof key === "string" ? change.key === key : new RegExp(key).test(change.key),
      )
    }

    if (limit) {
      history = history.slice(-limit)
    }

    return history.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
  }

  // Sincronizar estado entre pestañas/ventanas
  enableCrossTabSync(): void {
    if (typeof window !== "undefined") {
      window.addEventListener("storage", (event) => {
        if (event.key?.startsWith("haby_")) {
          const key = event.key.replace("haby_", "")
          const newValue = event.newValue ? JSON.parse(event.newValue) : null
          const oldValue = event.oldValue ? JSON.parse(event.oldValue) : null

          const change: StateChange = {
            key,
            oldValue: oldValue?.data,
            newValue: newValue?.data,
            timestamp: new Date(),
            userId: newValue?.metadata?.userId || "unknown",
            action: newValue ? (oldValue ? "update" : "create") : "delete",
          }

          this.notifySubscribers(change)
        }
      })
    }
  }

  // Exportar estado completo
  async exportState(userId?: string): Promise<any> {
    if (userId) {
      return await advancedStorage.exportUserData(userId)
    }

    // Exportar todo el estado (solo para administradores)
    const stats = advancedStorage.getStorageStats()
    return {
      stats,
      history: this.stateHistory,
      timestamp: new Date(),
    }
  }

  // Importar estado
  async importState(data: any, userId?: string): Promise<void> {
    if (userId) {
      await advancedStorage.importUserData(userId, data)
    }

    // Notificar sobre la importación
    const change: StateChange = {
      key: "system:import",
      oldValue: null,
      newValue: data,
      timestamp: new Date(),
      userId: userId || this.getCurrentUserId(),
      action: "create",
      metadata: { type: "import" },
    }

    this.recordStateChange(change)
    this.notifySubscribers(change)
  }

  // Métodos privados
  private validateStateData(key: string, value: any): any {
    // Determinar el tipo de validación basado en la clave
    if (key.startsWith("user:")) {
      return integrityValidator.validateUser(value)
    } else if (key.startsWith("class:")) {
      return integrityValidator.validateClass(value)
    } else if (key.startsWith("assignment:")) {
      return integrityValidator.validateAssignment(value)
    }

    // Validación básica para otros tipos
    return { isValid: true, errors: [], warnings: [] }
  }

  private recordStateChange(change: StateChange): void {
    this.stateHistory.push(change)

    // Mantener el tamaño del historial
    if (this.stateHistory.length > this.maxHistorySize) {
      this.stateHistory = this.stateHistory.slice(-this.maxHistorySize)
    }

    // Persistir historial crítico
    this.saveStateHistory()
  }

  private notifySubscribers(change: StateChange): void {
    this.subscriptions.forEach((subscription) => {
      try {
        const matches = this.matchesPattern(change.key, subscription.pattern)

        if (matches) {
          // Verificar permisos de rol si es necesario
          if (subscription.options.role && subscription.options.role !== change.userId) {
            return
          }

          subscription.callback(change)
        }
      } catch (error) {
        console.error(`Error en suscripción ${subscription.id}:`, error)
      }
    })
  }

  private matchesPattern(key: string, pattern: string | RegExp): boolean {
    if (typeof pattern === "string") {
      return key === pattern || key.startsWith(pattern + ":")
    }
    return pattern.test(key)
  }

  private async executeImmediateSubscription(subscription: StateSubscription): Promise<void> {
    // Buscar estados existentes que coincidan con el patrón
    const stats = advancedStorage.getStorageStats()

    // Esta es una implementación simplificada
    // En una implementación completa, buscaríamos en el almacenamiento
    console.log(`Ejecutando suscripción inmediata para: ${subscription.pattern}`)
  }

  private getCurrentUserId(): string {
    try {
      const userData = localStorage.getItem("mockUserData")
      return userData ? JSON.parse(userData).uid : "anonymous"
    } catch {
      return "anonymous"
    }
  }

  private getCurrentUserRole(): string {
    try {
      const userData = localStorage.getItem("mockUserData")
      return userData ? JSON.parse(userData).role : "guest"
    } catch {
      return "guest"
    }
  }

  private saveStateHistory(): void {
    try {
      const recentHistory = this.stateHistory.slice(-100) // Solo los últimos 100
      localStorage.setItem("haby_state_history", JSON.stringify(recentHistory))
    } catch (error) {
      console.error("Error saving state history:", error)
    }
  }

  private loadStateHistory(): void {
    try {
      const saved = localStorage.getItem("haby_state_history")
      if (saved) {
        this.stateHistory = JSON.parse(saved).map((change: any) => ({
          ...change,
          timestamp: new Date(change.timestamp),
        }))
      }
    } catch (error) {
      console.error("Error loading state history:", error)
      this.stateHistory = []
    }
  }

  // Métodos de utilidad pública
  getSubscriptionCount(): number {
    return this.subscriptions.size
  }

  getSystemStats(): any {
    return {
      subscriptions: this.subscriptions.size,
      historySize: this.stateHistory.length,
      storageStats: advancedStorage.getStorageStats(),
      lastChange: this.stateHistory[this.stateHistory.length - 1],
    }
  }

  // Limpiar estado (para testing o reset)
  async clearState(pattern?: string | RegExp): Promise<void> {
    if (!pattern) {
      // Limpiar todo
      this.stateHistory = []
      this.subscriptions.clear()
      localStorage.clear()
    } else {
      // Limpiar elementos que coincidan con el patrón
      const stats = advancedStorage.getStorageStats()
      // Implementar lógica de limpieza selectiva
    }
  }
}

// Instancia global
export const globalStateManager = GlobalStateManager.getInstance()

// Habilitar sincronización entre pestañas
if (typeof window !== "undefined") {
  globalStateManager.enableCrossTabSync()
}
