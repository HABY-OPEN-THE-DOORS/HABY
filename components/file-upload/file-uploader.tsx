"use client"

import type React from "react"

import { useState, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { useFileUpload } from "@/hooks/use-file-upload"
import type { FileMetadata } from "@/lib/storage-service"
import { useToast } from "@/hooks/use-toast"
import { Upload, X, AlertCircle, CheckCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface FileUploaderProps {
  path: string
  metadata: Partial<FileMetadata>
  onUploadComplete?: (files: FileMetadata[]) => void
  onUploadError?: (error: Error) => void
  maxFiles?: number
  maxSize?: number // en bytes
  acceptedTypes?: string[]
  className?: string
}

export function FileUploader({
  path,
  metadata,
  onUploadComplete,
  onUploadError,
  maxFiles = 10,
  maxSize = 50 * 1024 * 1024, // 50MB por defecto
  acceptedTypes,
  className,
}: FileUploaderProps) {
  const { uploadFile, uploadProgress, isUploading, resetProgress } = useFileUpload()
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [uploadedFiles, setUploadedFiles] = useState<FileMetadata[]>([])
  const [errors, setErrors] = useState<Record<string, string>>({})
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || [])
      const newErrors: Record<string, string> = {}
      const validFiles: File[] = []

      // Validar archivos
      files.forEach((file) => {
        // Validar tipo
        if (acceptedTypes && !acceptedTypes.some((type) => file.type.includes(type))) {
          newErrors[file.name] = `Tipo de archivo no permitido. Tipos aceptados: ${acceptedTypes.join(", ")}`
          return
        }

        // Validar tamaño
        if (file.size > maxSize) {
          newErrors[file.name] = `El archivo excede el tamaño máximo de ${maxSize / (1024 * 1024)}MB`
          return
        }

        validFiles.push(file)
      })

      // Validar número máximo de archivos
      if (selectedFiles.length + validFiles.length > maxFiles) {
        toast({
          title: "Error",
          description: `No puedes subir más de ${maxFiles} archivos a la vez`,
          variant: "destructive",
        })
        return
      }

      setErrors(newErrors)
      setSelectedFiles((prev) => [...prev, ...validFiles])

      // Limpiar input
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    },
    [selectedFiles, maxFiles, maxSize, acceptedTypes, toast],
  )

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      e.stopPropagation()

      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        const files = Array.from(e.dataTransfer.files)
        const changeEvent = {
          target: {
            files: e.dataTransfer.files,
          },
        } as unknown as React.ChangeEvent<HTMLInputElement>
        handleFileChange(changeEvent)
      }
    },
    [handleFileChange],
  )

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
  }, [])

  const removeFile = useCallback((index: number) => {
    setSelectedFiles((prev) => {
      const newFiles = [...prev]
      newFiles.splice(index, 1)
      return newFiles
    })
  }, [])

  const uploadFiles = useCallback(async () => {
    if (selectedFiles.length === 0) return

    const uploadedFilesArray: FileMetadata[] = []
    const newErrors: Record<string, string> = {}

    for (const file of selectedFiles) {
      try {
        const fileMetadata = await uploadFile(file, path, metadata)
        uploadedFilesArray.push(fileMetadata)
      } catch (error) {
        newErrors[file.name] = error instanceof Error ? error.message : "Error desconocido"
        if (onUploadError) {
          onUploadError(error instanceof Error ? error : new Error("Error desconocido"))
        }
      }
    }

    setErrors(newErrors)
    setUploadedFiles((prev) => [...prev, ...uploadedFilesArray])
    setSelectedFiles([])
    resetProgress()

    if (uploadedFilesArray.length > 0 && onUploadComplete) {
      onUploadComplete(uploadedFilesArray)
    }

    if (uploadedFilesArray.length > 0) {
      toast({
        title: "Archivos subidos",
        description: `Se han subido ${uploadedFilesArray.length} archivos correctamente`,
      })
    }
  }, [selectedFiles, path, metadata, uploadFile, onUploadComplete, onUploadError, resetProgress, toast])

  const getFileTypeLabel = useCallback(() => {
    if (!acceptedTypes || acceptedTypes.length === 0) return "todos los archivos"

    const typeGroups: Record<string, string[]> = {
      image: ["image/"],
      video: ["video/"],
      audio: ["audio/"],
      document: ["pdf", "doc", "docx", "txt", "rtf"],
      spreadsheet: ["xls", "xlsx", "csv"],
      presentation: ["ppt", "pptx"],
    }

    const groups: string[] = []
    for (const [group, types] of Object.entries(typeGroups)) {
      if (acceptedTypes.some((accepted) => types.some((type) => accepted.includes(type)))) {
        groups.push(group)
      }
    }

    if (groups.length > 0) {
      return groups.join(", ")
    } else {
      return acceptedTypes.join(", ")
    }
  }, [acceptedTypes])

  return (
    <div className={cn("space-y-4", className)}>
      <div
        className="border-2 border-dashed rounded-lg p-6 text-center hover:bg-muted/50 transition-colors cursor-pointer"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          multiple
          accept={acceptedTypes?.join(",")}
        />
        <Upload className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium mb-1">Arrastra y suelta archivos aquí</h3>
        <p className="text-sm text-muted-foreground mb-2">O haz clic para seleccionar archivos</p>
        <p className="text-xs text-muted-foreground">
          Máximo {maxFiles} archivos • Hasta {maxSize / (1024 * 1024)}MB por archivo
          {acceptedTypes && acceptedTypes.length > 0 && ` • Tipos aceptados: ${getFileTypeLabel()}`}
        </p>
      </div>

      {/* Lista de archivos seleccionados */}
      {selectedFiles.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Archivos seleccionados ({selectedFiles.length})</h4>
          <div className="space-y-2">
            {selectedFiles.map((file, index) => (
              <div
                key={`${file.name}-${index}`}
                className="flex items-center justify-between p-3 border rounded-md bg-background"
              >
                <div className="flex items-center space-x-3 overflow-hidden">
                  <div className="flex-shrink-0 w-10 h-10 bg-muted rounded-md flex items-center justify-center">
                    {file.type.startsWith("image/") ? (
                      <img
                        src={URL.createObjectURL(file) || "/placeholder.svg"}
                        alt={file.name}
                        className="w-10 h-10 object-cover rounded-md"
                      />
                    ) : (
                      <div className="text-xs font-medium uppercase">{file.name.split(".").pop()}</div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium truncate">{file.name}</p>
                    <p className="text-xs text-muted-foreground">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                    {errors[file.name] && (
                      <p className="text-xs text-destructive flex items-center mt-1">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        {errors[file.name]}
                      </p>
                    )}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation()
                    removeFile(index)
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
          <Button onClick={uploadFiles} disabled={isUploading || selectedFiles.length === 0} className="mt-2">
            {isUploading ? "Subiendo..." : "Subir archivos"}
          </Button>
        </div>
      )}

      {/* Progreso de carga */}
      {Object.keys(uploadProgress).length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Progreso de carga</h4>
          <div className="space-y-2">
            {Object.entries(uploadProgress).map(([fileId, progress]) => (
              <div key={fileId} className="space-y-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm">
                    {progress.metadata?.originalName || "Archivo"}
                    {progress.status === "success" && <CheckCircle className="h-4 w-4 text-green-500 inline ml-2" />}
                    {progress.status === "error" && <AlertCircle className="h-4 w-4 text-destructive inline ml-2" />}
                  </p>
                  <p className="text-sm">{Math.round(progress.progress)}%</p>
                </div>
                <Progress value={progress.progress} className="h-2" />
                {progress.error && <p className="text-xs text-destructive">{progress.error}</p>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
