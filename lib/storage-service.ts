import { ref, uploadBytesResumable, getDownloadURL, deleteObject, listAll } from "firebase/storage"
import { storage } from "@/lib/firebase"
import { v4 as uuidv4 } from "uuid"

export interface FileMetadata {
  id: string
  name: string
  originalName: string
  type: string
  size: number
  url: string
  path: string
  thumbnailUrl?: string
  createdAt: number
  updatedAt: number
  uploadedBy: string
  folderId?: string
  classId?: string
}

export interface FileUploadProgress {
  progress: number
  status: "pending" | "uploading" | "success" | "error"
  metadata?: FileMetadata
  error?: string
}

export class StorageService {
  static async uploadFile(
    file: File,
    path: string,
    metadata: Partial<FileMetadata>,
    onProgress?: (progress: FileUploadProgress) => void,
  ): Promise<FileMetadata> {
    const fileId = uuidv4()
    const fileExtension = file.name.split(".").pop() || ""
    const fileName = `${fileId}.${fileExtension}`
    const filePath = `${path}/${fileName}`
    const storageRef = ref(storage, filePath)

    // Iniciar progreso
    onProgress?.({
      progress: 0,
      status: "uploading",
    })

    // Subir archivo
    const uploadTask = uploadBytesResumable(storageRef, file)

    return new Promise((resolve, reject) => {
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          onProgress?.({
            progress,
            status: "uploading",
          })
        },
        (error) => {
          onProgress?.({
            progress: 0,
            status: "error",
            error: error.message,
          })
          reject(error)
        },
        async () => {
          // Obtener URL de descarga
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref)

          // Generar thumbnail para imágenes y videos si es necesario
          let thumbnailUrl: string | undefined = undefined
          if (file.type.startsWith("image/")) {
            thumbnailUrl = downloadURL // Para imágenes, usamos la misma URL por ahora
          } else if (file.type.startsWith("video/")) {
            // Aquí se podría implementar la generación de thumbnails para videos
            // Por ahora, usamos un placeholder
            thumbnailUrl = `/placeholder.svg?height=200&width=300&text=Video`
          }

          const fileMetadata: FileMetadata = {
            id: fileId,
            name: fileName,
            originalName: file.name,
            type: file.type,
            size: file.size,
            url: downloadURL,
            path: filePath,
            thumbnailUrl,
            createdAt: Date.now(),
            updatedAt: Date.now(),
            uploadedBy: metadata.uploadedBy || "unknown",
            folderId: metadata.folderId,
            classId: metadata.classId,
          }

          onProgress?.({
            progress: 100,
            status: "success",
            metadata: fileMetadata,
          })

          resolve(fileMetadata)
        },
      )
    })
  }

  static async deleteFile(path: string): Promise<void> {
    const storageRef = ref(storage, path)
    await deleteObject(storageRef)
  }

  static async getFileUrl(path: string): Promise<string> {
    const storageRef = ref(storage, path)
    return await getDownloadURL(storageRef)
  }

  static async listFiles(path: string): Promise<string[]> {
    const storageRef = ref(storage, path)
    const result = await listAll(storageRef)
    return result.items.map((item) => item.fullPath)
  }

  static getFileTypeIcon(type: string): string {
    if (type.startsWith("image/")) {
      return "image"
    } else if (type.startsWith("video/")) {
      return "video"
    } else if (type.startsWith("audio/")) {
      return "audio"
    } else if (type.includes("pdf")) {
      return "pdf"
    } else if (type.includes("word") || type.includes("document")) {
      return "doc"
    } else if (type.includes("excel") || type.includes("sheet")) {
      return "sheet"
    } else if (type.includes("powerpoint") || type.includes("presentation")) {
      return "presentation"
    } else if (type.includes("zip") || type.includes("rar") || type.includes("tar") || type.includes("compressed")) {
      return "archive"
    } else {
      return "file"
    }
  }

  static formatFileSize(bytes: number): string {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }
}
