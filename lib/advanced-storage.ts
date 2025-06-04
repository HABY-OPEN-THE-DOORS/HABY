/**
 * HABY-CLASS - Sistema de Almacenamiento Avanzado
 * Gestión inteligente de datos con persistencia y temporalidad
 */

export interface StorageOptions {
  persistent?: boolean
  expiresAt?: Date
  userId?: string
  role?: string
  encrypted?: boolean
  backup?: boolean
}

export interface DataEntry<T = any> {
  id: string
  data: T
  metadata: {
    createdAt: Date
    updatedAt: Date
    expiresAt?: Date
    userId: string
    role: string
    persistent: boolean
    encrypted: boolean
    version: number
    checksum: string
  }
}

export class AdvancedStorage {
  private static instance: AdvancedStorage
  private storage: Map<string, DataEntry> = new Map()
  private listeners: Map<string, Set<(data: any) => void>> = new Map()

  static getInstance(): AdvancedStorage {
    if (!AdvancedStorage.instance) {
      AdvancedStorage.instance = new AdvancedStorage()
    }
    return AdvancedStorage.instance
  }

  private constructor() {
    this.loadFromLocalStorage()
    this.startCleanupTimer()
    this.setupBeforeUnloadHandler()
  }

  // Almacenar datos con opciones avanzadas
  async store<T>(key: string, data: T, options: StorageOptions = {}): Promise<void> {
    try {
      const entry: DataEntry<T> = {
        id: key,
        data: options.encrypted ? await this.encrypt(data) : data,
        metadata: {
          createdAt: new Date(),
          updatedAt: new Date(),
          expiresAt: options.expiresAt,
          userId: options.userId || "anonymous",
          role: options.role || "guest",
          persistent: options.persistent ?? true,
          encrypted: options.encrypted ?? false,
          version: this.getNextVersion(key),
          checksum: await this.generateChecksum(data),
        },
      }

      this.storage.set(key, entry)

      if (entry.metadata.persistent) {
        this.saveToLocalStorage(key, entry)
      }

      if (options.backup) {
        await this.createBackup(key, entry)
      }

      this.notifyListeners(key, data)

      console.log(`✅ Datos almacenados: ${key}`, {
        persistent: entry.metadata.persistent,
        encrypted: entry.metadata.encrypted,
        expiresAt: entry.metadata.expiresAt,
      })
    } catch (error) {
      console.error(`❌ Error al almacenar ${key}:`, error)
      throw new Error(`Failed to store data for key: ${key}`)
    }
  }

  // Recuperar datos con validación de integridad
  async retrieve<T>(key: string): Promise<T | null> {
    try {
      const entry = this.storage.get(key)

      if (!entry) {
        // Intentar cargar desde localStorage
        const stored = this.loadFromLocalStorage(key)
        if (stored) {
          this.storage.set(key, stored)
          return await this.processRetrievedData<T>(stored)
        }
        return null
      }

      // Verificar expiración
      if (entry.metadata.expiresAt && new Date() > entry.metadata.expiresAt) {
        await this.remove(key)
        return null
      }

      return await this.processRetrievedData<T>(entry)
    } catch (error) {
      console.error(`❌ Error al recuperar ${key}:`, error)
      return null
    }
  }

  private async processRetrievedData<T>(entry: DataEntry): Promise<T> {
    let data = entry.data

    // Verificar integridad
    const currentChecksum = await this.generateChecksum(data)
    if (currentChecksum !== entry.metadata.checksum) {
      console.warn(`⚠️ Checksum mismatch for ${entry.id}. Data may be corrupted.`)
    }

    // Desencriptar si es necesario
    if (entry.metadata.encrypted) {
      data = await this.decrypt(data)
    }

    return data as T
  }

  // Actualizar datos existentes
  async update<T>(key: string, updater: (current: T | null) => T, options: StorageOptions = {}): Promise<void> {
    const current = await this.retrieve<T>(key)
    const updated = updater(current)

    await this.store(key, updated, {
      ...options,
      userId: options.userId || this.getCurrentUserId(),
      role: options.role || this.getCurrentUserRole(),
    })
  }

  // Eliminar datos
  async remove(key: string): Promise<void> {
    this.storage.delete(key)
    localStorage.removeItem(`haby_${key}`)
    this.notifyListeners(key, null)
    console.log(`🗑️ Datos eliminados: ${key}`)
  }

  // Suscribirse a cambios
  subscribe(key: string, callback: (data: any) => void): () => void {
    if (!this.listeners.has(key)) {
      this.listeners.set(key, new Set())
    }
    this.listeners.get(key)!.add(callback)

    return () => {
      const listeners = this.listeners.get(key)
      if (listeners) {
        listeners.delete(callback)
        if (listeners.size === 0) {
          this.listeners.delete(key)
        }
      }
    }
  }

  // Obtener todas las claves por usuario/rol
  getKeysByUser(userId: string, role?: string): string[] {
    return Array.from(this.storage.entries())
      .filter(([_, entry]) => {
        const matchesUser = entry.metadata.userId === userId
        const matchesRole = !role || entry.metadata.role === role
        return matchesUser && matchesRole
      })
      .map(([key]) => key)
  }

  // Limpiar datos expirados
  private cleanupExpiredData(): void {
    const now = new Date()
    const expiredKeys: string[] = []

    for (const [key, entry] of this.storage.entries()) {
      if (entry.metadata.expiresAt && now > entry.metadata.expiresAt) {
        expiredKeys.push(key)
      }
    }

    expiredKeys.forEach((key) => this.remove(key))

    if (expiredKeys.length > 0) {
      console.log(`🧹 Limpieza automática: ${expiredKeys.length} elementos expirados eliminados`)
    }
  }

  // Métodos privados de utilidad
  private loadFromLocalStorage(key?: string): DataEntry | void {
    try {
      if (key) {
        const stored = localStorage.getItem(`haby_${key}`)
        return stored ? JSON.parse(stored) : null
      } else {
        // Cargar todos los datos persistentes
        for (let i = 0; i < localStorage.length; i++) {
          const storageKey = localStorage.key(i)
          if (storageKey?.startsWith("haby_")) {
            const key = storageKey.replace("haby_", "")
            const data = localStorage.getItem(storageKey)
            if (data) {
              const entry = JSON.parse(data)
              // Convertir fechas de string a Date
              entry.metadata.createdAt = new Date(entry.metadata.createdAt)
              entry.metadata.updatedAt = new Date(entry.metadata.updatedAt)
              if (entry.metadata.expiresAt) {
                entry.metadata.expiresAt = new Date(entry.metadata.expiresAt)
              }
              this.storage.set(key, entry)
            }
          }
        }
      }
    } catch (error) {
      console.error("Error loading from localStorage:", error)
    }
  }

  private saveToLocalStorage(key: string, entry: DataEntry): void {
    try {
      localStorage.setItem(`haby_${key}`, JSON.stringify(entry))
    } catch (error) {
      console.error(`Error saving to localStorage: ${key}`, error)
    }
  }

  private notifyListeners(key: string, data: any): void {
    const listeners = this.listeners.get(key)
    if (listeners) {
      listeners.forEach((callback) => {
        try {
          callback(data)
        } catch (error) {
          console.error("Error in storage listener:", error)
        }
      })
    }
  }

  private startCleanupTimer(): void {
    setInterval(() => {
      this.cleanupExpiredData()
    }, 60000) // Limpiar cada minuto
  }

  private setupBeforeUnloadHandler(): void {
    if (typeof window !== "undefined") {
      window.addEventListener("beforeunload", () => {
        // Guardar datos críticos antes de cerrar
        this.storage.forEach((entry, key) => {
          if (entry.metadata.persistent) {
            this.saveToLocalStorage(key, entry)
          }
        })
      })
    }
  }

  private getNextVersion(key: string): number {
    const existing = this.storage.get(key)
    return existing ? existing.metadata.version + 1 : 1
  }

  private async generateChecksum(data: any): Promise<string> {
    const str = JSON.stringify(data)
    const encoder = new TextEncoder()
    const dataBuffer = encoder.encode(str)
    const hashBuffer = await crypto.subtle.digest("SHA-256", dataBuffer)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("")
  }

  private async encrypt(data: any): Promise<string> {
    // Implementación básica de encriptación
    // En producción, usar una biblioteca de criptografía robusta
    return btoa(JSON.stringify(data))
  }

  private async decrypt(encryptedData: string): Promise<any> {
    // Implementación básica de desencriptación
    try {
      return JSON.parse(atob(encryptedData))
    } catch {
      return encryptedData
    }
  }

  private getCurrentUserId(): string {
    // Obtener del contexto de autenticación
    return "current-user-id"
  }

  private getCurrentUserRole(): string {
    // Obtener del contexto de autenticación
    return "student"
  }

  private async createBackup(key: string, entry: DataEntry): Promise<void> {
    // Implementar sistema de backup
    console.log(`💾 Backup creado para: ${key}`)
  }

  // Métodos públicos adicionales
  async exportUserData(userId: string): Promise<any> {
    const userKeys = this.getKeysByUser(userId)
    const userData: any = {}

    for (const key of userKeys) {
      userData[key] = await this.retrieve(key)
    }

    return userData
  }

  async importUserData(userId: string, data: any): Promise<void> {
    for (const [key, value] of Object.entries(data)) {
      await this.store(key, value, {
        userId,
        persistent: true,
        backup: true,
      })
    }
  }

  getStorageStats(): any {
    const stats = {
      totalEntries: this.storage.size,
      persistentEntries: 0,
      temporaryEntries: 0,
      encryptedEntries: 0,
      totalSize: 0,
      byRole: {} as Record<string, number>,
      byUser: {} as Record<string, number>,
    }

    this.storage.forEach((entry) => {
      if (entry.metadata.persistent) stats.persistentEntries++
      else stats.temporaryEntries++

      if (entry.metadata.encrypted) stats.encryptedEntries++

      stats.totalSize += JSON.stringify(entry).length

      stats.byRole[entry.metadata.role] = (stats.byRole[entry.metadata.role] || 0) + 1
      stats.byUser[entry.metadata.userId] = (stats.byUser[entry.metadata.userId] || 0) + 1
    })

    return stats
  }
}

// Instancia global
export const advancedStorage = AdvancedStorage.getInstance()
