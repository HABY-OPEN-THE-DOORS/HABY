"use client"

/**
 * HABY-CLASS - Hook para Gestión de Datos Temporales
 * Permite a los usuarios controlar la persistencia de sus datos
 */

import { useState, useEffect, useCallback } from "react"
import { globalStateManager } from "@/lib/global-state-manager"
import { useAuth } from "@/providers/auth-provider"
import { useToast } from "@/hooks/use-toast"

export interface TemporalOptions {
  persistent?: boolean
  expiresIn?: number // minutos
  autoSave?: boolean
  validateOnSave?: boolean
  backupEnabled?: boolean
}

export interface TemporalDataState<T> {
  data: T | null
  isLoading: boolean
  isSaving: boolean
  lastSaved: Date | null
  isPersistent: boolean
  expiresAt: Date | null
  hasUnsavedChanges: boolean
}

export function useTemporalData<T>(key: string, initialData: T | null = null, options: TemporalOptions = {}) {
  const { userData } = useAuth()
  const { toast } = useToast()

  const [state, setState] = useState<TemporalDataState<T>>({
    data: initialData,
    isLoading: true,
    isSaving: false,
    lastSaved: null,
    isPersistent: options.persistent ?? true,
    expiresAt: null,
    hasUnsavedChanges: false,
  })

  // Cargar datos iniciales
  useEffect(() => {
    loadData()
  }, [key])

  // Auto-guardado
  useEffect(() => {
    if (options.autoSave && state.hasUnsavedChanges && !state.isSaving) {
      const timer = setTimeout(() => {
        saveData()
      }, 2000) // Auto-guardar después de 2 segundos de inactividad

      return () => clearTimeout(timer)
    }
  }, [state.hasUnsavedChanges, state.data, options.autoSave])

  const loadData = useCallback(async () => {
    try {
      setState((prev) => ({ ...prev, isLoading: true }))

      const loadedData = await globalStateManager.getState<T>(key)

      setState((prev) => ({
        ...prev,
        data: loadedData || initialData,
        isLoading: false,
        hasUnsavedChanges: false,
      }))
    } catch (error) {
      console.error(`Error loading data for ${key}:`, error)
      setState((prev) => ({
        ...prev,
        data: initialData,
        isLoading: false,
      }))
    }
  }, [key, initialData])

  const saveData = useCallback(
    async (customOptions?: Partial<TemporalOptions>) => {
      if (!userData) {
        toast({
          title: "Error",
          description: "Debes estar autenticado para guardar datos",
          variant: "destructive",
        })
        return false
      }

      try {
        setState((prev) => ({ ...prev, isSaving: true }))

        const saveOptions = { ...options, ...customOptions }
        const expiresAt = saveOptions.expiresIn ? new Date(Date.now() + saveOptions.expiresIn * 60000) : undefined

        await globalStateManager.setState(key, state.data, {
          persistent: saveOptions.persistent ?? state.isPersistent,
          expiresAt,
          validate: saveOptions.validateOnSave,
          userId: userData.uid,
          role: userData.role,
          metadata: {
            autoSave: options.autoSave,
            backupEnabled: saveOptions.backupEnabled,
          },
        })

        setState((prev) => ({
          ...prev,
          isSaving: false,
          lastSaved: new Date(),
          hasUnsavedChanges: false,
          isPersistent: saveOptions.persistent ?? prev.isPersistent,
          expiresAt,
        }))

        if (!options.autoSave) {
          toast({
            title: "Guardado exitoso",
            description: `Datos ${state.isPersistent ? "guardados permanentemente" : "guardados temporalmente"}`,
          })
        }

        return true
      } catch (error) {
        console.error(`Error saving data for ${key}:`, error)
        setState((prev) => ({ ...prev, isSaving: false }))

        toast({
          title: "Error al guardar",
          description: "No se pudieron guardar los datos. Intenta de nuevo.",
          variant: "destructive",
        })

        return false
      }
    },
    [key, state.data, state.isPersistent, userData, options, toast],
  )

  const updateData = useCallback((updater: (current: T | null) => T) => {
    setState((prev) => {
      const newData = updater(prev.data)
      return {
        ...prev,
        data: newData,
        hasUnsavedChanges: true,
      }
    })
  }, [])

  const setData = useCallback((newData: T) => {
    setState((prev) => ({
      ...prev,
      data: newData,
      hasUnsavedChanges: true,
    }))
  }, [])

  const setPersistence = useCallback((persistent: boolean) => {
    setState((prev) => ({
      ...prev,
      isPersistent: persistent,
      hasUnsavedChanges: true,
    }))
  }, [])

  const setExpiration = useCallback((minutes: number | null) => {
    const expiresAt = minutes ? new Date(Date.now() + minutes * 60000) : null
    setState((prev) => ({
      ...prev,
      expiresAt,
      hasUnsavedChanges: true,
    }))
  }, [])

  const deleteData = useCallback(async () => {
    try {
      await globalStateManager.removeState(key, userData?.uid)
      setState((prev) => ({
        ...prev,
        data: null,
        hasUnsavedChanges: false,
        lastSaved: null,
      }))

      toast({
        title: "Datos eliminados",
        description: "Los datos han sido eliminados correctamente",
      })

      return true
    } catch (error) {
      console.error(`Error deleting data for ${key}:`, error)
      toast({
        title: "Error al eliminar",
        description: "No se pudieron eliminar los datos",
        variant: "destructive",
      })
      return false
    }
  }, [key, userData, toast])

  const forceReload = useCallback(() => {
    loadData()
  }, [loadData])

  const exportData = useCallback(() => {
    if (!state.data) return null

    return {
      data: state.data,
      metadata: {
        key,
        lastSaved: state.lastSaved,
        isPersistent: state.isPersistent,
        expiresAt: state.expiresAt,
        exportedAt: new Date(),
        userId: userData?.uid,
      },
    }
  }, [state, key, userData])

  const importData = useCallback(
    (importedData: any) => {
      if (importedData && importedData.data) {
        setData(importedData.data)

        toast({
          title: "Datos importados",
          description: "Los datos han sido importados correctamente",
        })
      }
    },
    [setData, toast],
  )

  // Suscribirse a cambios externos
  useEffect(() => {
    const subscriptionId = globalStateManager.subscribe(
      key,
      (change) => {
        if (change.userId !== userData?.uid) {
          // Datos cambiados por otro usuario/sesión
          setState((prev) => ({
            ...prev,
            data: change.newValue,
            hasUnsavedChanges: false,
            lastSaved: change.timestamp,
          }))

          toast({
            title: "Datos actualizados",
            description: "Los datos han sido actualizados desde otra sesión",
          })
        }
      },
      { immediate: false },
    )

    return () => {
      globalStateManager.unsubscribe(subscriptionId)
    }
  }, [key, userData, toast])

  return {
    // Estado
    ...state,

    // Acciones principales
    setData,
    updateData,
    saveData,
    deleteData,

    // Control de persistencia
    setPersistence,
    setExpiration,

    // Utilidades
    forceReload,
    exportData,
    importData,

    // Información útil
    canSave: !state.isSaving && state.hasUnsavedChanges,
    timeUntilExpiration: state.expiresAt ? Math.max(0, state.expiresAt.getTime() - Date.now()) : null,
    isExpired: state.expiresAt ? new Date() > state.expiresAt : false,
  }
}

// Hook especializado para diferentes tipos de datos
export function useTemporalClass(classId: string, options?: TemporalOptions) {
  return useTemporalData(`class:${classId}`, null, {
    persistent: true,
    validateOnSave: true,
    backupEnabled: true,
    ...options,
  })
}

export function useTemporalAssignment(assignmentId: string, options?: TemporalOptions) {
  return useTemporalData(`assignment:${assignmentId}`, null, {
    persistent: true,
    validateOnSave: true,
    autoSave: true,
    ...options,
  })
}

export function useTemporalUserPreferences(userId: string, options?: TemporalOptions) {
  return useTemporalData(
    `preferences:${userId}`,
    {},
    {
      persistent: true,
      autoSave: true,
      ...options,
    },
  )
}

export function useTemporalDraft(draftId: string, options?: TemporalOptions) {
  return useTemporalData(`draft:${draftId}`, null, {
    persistent: false,
    autoSave: true,
    expiresIn: 60, // 1 hora por defecto
    ...options,
  })
}
