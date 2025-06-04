"use client"

import useSWR, { type SWRConfiguration } from "swr"
import { useState, useEffect } from "react"

// Función para generar una clave de caché única
const generateCacheKey = (key: string, params?: Record<string, any>) => {
  if (!params) return key
  return `${key}:${JSON.stringify(params)}`
}

// Función para almacenar datos en localStorage con expiración
const storeInCache = (key: string, data: any, ttl = 5 * 60 * 1000) => {
  try {
    const item = {
      data,
      expiry: Date.now() + ttl,
    }
    localStorage.setItem(`haby-cache:${key}`, JSON.stringify(item))
  } catch (error) {
    console.warn("Error storing data in cache:", error)
  }
}

// Función para recuperar datos de localStorage
const getFromCache = (key: string) => {
  try {
    const item = localStorage.getItem(`haby-cache:${key}`)
    if (!item) return null

    const parsedItem = JSON.parse(item)
    if (Date.now() > parsedItem.expiry) {
      localStorage.removeItem(`haby-cache:${key}`)
      return null
    }
    return parsedItem.data
  } catch (error) {
    console.warn("Error retrieving data from cache:", error)
    return null
  }
}

interface UseOptimizedDataOptions<T> extends SWRConfiguration {
  ttl?: number // Tiempo de vida en milisegundos
  initialData?: T // Datos iniciales
  skipCache?: boolean // Omitir caché
}

export function useOptimizedData<T>(
  key: string | null,
  fetcher: (key: string) => Promise<T>,
  params?: Record<string, any>,
  options: UseOptimizedDataOptions<T> = {},
) {
  const { ttl = 5 * 60 * 1000, initialData, skipCache = false, ...swrOptions } = options
  const cacheKey = key ? generateCacheKey(key, params) : null
  const [localData, setLocalData] = useState<T | undefined>(initialData)

  // Intentar cargar datos desde caché al inicio
  useEffect(() => {
    if (cacheKey && !skipCache && typeof window !== "undefined") {
      const cachedData = getFromCache(cacheKey)
      if (cachedData) {
        setLocalData(cachedData)
      }
    }
  }, [cacheKey, skipCache])

  // Configurar SWR con optimizaciones
  const { data, error, isLoading, isValidating, mutate } = useSWR<T>(
    cacheKey,
    async (key) => {
      const result = await fetcher(key)
      if (!skipCache) {
        storeInCache(key, result, ttl)
      }
      return result
    },
    {
      ...swrOptions,
      fallbackData: localData,
      revalidateOnFocus: !skipCache ? false : undefined,
      revalidateIfStale: !skipCache ? false : undefined,
      dedupingInterval: 5000, // Evitar múltiples solicitudes en 5 segundos
    },
  )

  return {
    data: data || localData,
    error,
    isLoading: isLoading && !localData,
    isValidating,
    mutate,
  }
}
