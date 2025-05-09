"use client"

import { useState, useCallback } from "react"
import { StorageService, type FileMetadata, type FileUploadProgress } from "@/lib/storage-service"

interface UseFileUploadReturn {
  uploadFile: (file: File, path: string, metadata: Partial<FileMetadata>) => Promise<FileMetadata>
  deleteFile: (path: string) => Promise<void>
  uploadProgress: Record<string, FileUploadProgress>
  isUploading: boolean
  resetProgress: (fileId?: string) => void
}

export function useFileUpload(): UseFileUploadReturn {
  const [uploadProgress, setUploadProgress] = useState<Record<string, FileUploadProgress>>({})
  const [isUploading, setIsUploading] = useState(false)

  const uploadFile = useCallback(
    async (file: File, path: string, metadata: Partial<FileMetadata>): Promise<FileMetadata> => {
      setIsUploading(true)
      const fileId = file.name + Date.now() // Identificador temporal

      try {
        const fileMetadata = await StorageService.uploadFile(file, path, metadata, (progress) => {
          setUploadProgress((prev) => ({
            ...prev,
            [fileId]: progress,
          }))
        })

        // Actualizar con el ID real
        setUploadProgress((prev) => {
          const { [fileId]: _, ...rest } = prev
          return {
            ...rest,
            [fileMetadata.id]: {
              progress: 100,
              status: "success",
              metadata: fileMetadata,
            },
          }
        })

        setIsUploading(false)
        return fileMetadata
      } catch (error) {
        setUploadProgress((prev) => ({
          ...prev,
          [fileId]: {
            progress: 0,
            status: "error",
            error: error instanceof Error ? error.message : "Error desconocido",
          },
        }))
        setIsUploading(false)
        throw error
      }
    },
    [],
  )

  const deleteFile = useCallback(async (path: string): Promise<void> => {
    await StorageService.deleteFile(path)
  }, [])

  const resetProgress = useCallback((fileId?: string) => {
    if (fileId) {
      setUploadProgress((prev) => {
        const { [fileId]: _, ...rest } = prev
        return rest
      })
    } else {
      setUploadProgress({})
    }
  }, [])

  return {
    uploadFile,
    deleteFile,
    uploadProgress,
    isUploading,
    resetProgress,
  }
}
