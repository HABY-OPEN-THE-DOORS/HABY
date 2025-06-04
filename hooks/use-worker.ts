"use client"

import { useState, useEffect, useRef, useCallback } from "react"

type WorkerStatus = "idle" | "processing" | "success" | "error"

interface UseWorkerOptions {
  timeout?: number
  onError?: (error: string) => void
}

export function useWorker<T, R>(workerPath: string, options: UseWorkerOptions = {}) {
  const [result, setResult] = useState<R | null>(null)
  const [status, setStatus] = useState<WorkerStatus>("idle")
  const [error, setError] = useState<string | null>(null)

  const workerRef = useRef<Worker | null>(null)
  const callbacksRef = useRef<Map<string, { resolve: (value: R) => void; reject: (reason: any) => void }>>(new Map())

  // Inicializar worker
  useEffect(() => {
    // Solo crear el worker en el cliente
    if (typeof window === "undefined") return

    try {
      workerRef.current = new Worker(workerPath)

      // Configurar manejador de mensajes
      workerRef.current.onmessage = (event) => {
        const { requestId, payload, error } = event.data

        // Buscar callback para este requestId
        const callback = callbacksRef.current.get(requestId)
        if (callback) {
          if (error) {
            callback.reject(error)
          } else {
            callback.resolve(payload)
          }
          callbacksRef.current.delete(requestId)
        }
      }

      // Configurar manejador de errores
      workerRef.current.onerror = (event) => {
        const errorMsg = `Error in worker: ${event.message}`
        setError(errorMsg)
        setStatus("error")
        options.onError?.(errorMsg)
      }
    } catch (err) {
      console.error("Failed to initialize worker:", err)
      setError("Failed to initialize worker")
      setStatus("error")
    }

    // Limpiar worker al desmontar
    return () => {
      workerRef.current?.terminate()
      workerRef.current = null
    }
  }, [workerPath, options.onError])

  // Función para enviar mensajes al worker
  const sendToWorker = useCallback(
    async (type: string, data: T): Promise<R> => {
      if (!workerRef.current) {
        throw new Error("Worker not initialized")
      }

      setStatus("processing")
      setError(null)

      // Generar ID único para esta solicitud
      const requestId = `${type}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

      // Crear promesa para esta solicitud
      const promise = new Promise<R>((resolve, reject) => {
        callbacksRef.current.set(requestId, { resolve, reject })

        // Configurar timeout si es necesario
        if (options.timeout) {
          setTimeout(() => {
            if (callbacksRef.current.has(requestId)) {
              callbacksRef.current.delete(requestId)
              const timeoutError = `Worker operation timed out after ${options.timeout}ms`
              setError(timeoutError)
              setStatus("error")
              reject(new Error(timeoutError))
            }
          }, options.timeout)
        }
      })

      // Enviar mensaje al worker
      workerRef.current.postMessage({
        type,
        payload: data,
        requestId,
      })

      try {
        const result = await promise
        setResult(result)
        setStatus("success")
        return result
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : "Unknown error in worker"
        setError(errorMsg)
        setStatus("error")
        throw err
      }
    },
    [options.timeout],
  )

  return {
    sendToWorker,
    result,
    status,
    error,
    isProcessing: status === "processing",
    isSuccess: status === "success",
    isError: status === "error",
    reset: useCallback(() => {
      setResult(null)
      setStatus("idle")
      setError(null)
    }, []),
  }
}
