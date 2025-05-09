"use client"

import { useState } from "react"
import { FileManager } from "@/components/file-upload/file-manager"
import type { FileMetadata } from "@/lib/storage-service"
import { usePermissions } from "@/hooks/use-permissions"

interface Folder {
  id: string
  name: string
  description?: string
  parentId?: string
}

export function ClassMaterials({ classId, userRole }: { classId: string; userRole: string }) {
  const [materials, setMaterials] = useState<FileMetadata[]>([
    {
      id: "1",
      name: "algebra-intro.pdf",
      originalName: "Introducción al Álgebra.pdf",
      type: "application/pdf",
      size: 2.4 * 1024 * 1024,
      url: "#",
      path: `classes/${classId}/files/algebra-intro.pdf`,
      createdAt: Date.now() - 1000000,
      updatedAt: Date.now() - 1000000,
      uploadedBy: "teacher-1",
    },
    {
      id: "2",
      name: "ecuaciones-lineales.mp4",
      originalName: "Video explicativo: Ecuaciones lineales.mp4",
      type: "video/mp4",
      size: 15.7 * 1024 * 1024,
      url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      thumbnailUrl: "/placeholder.svg?height=200&width=300",
      path: `classes/${classId}/files/ecuaciones-lineales.mp4`,
      createdAt: Date.now() - 800000,
      updatedAt: Date.now() - 800000,
      uploadedBy: "teacher-1",
    },
    {
      id: "3",
      name: "funciones-graficos.jpg",
      originalName: "Gráficos de funciones.jpg",
      type: "image/jpeg",
      size: 1.2 * 1024 * 1024,
      url: "/placeholder.svg?height=400&width=600",
      path: `classes/${classId}/files/funciones-graficos.jpg`,
      createdAt: Date.now() - 600000,
      updatedAt: Date.now() - 600000,
      uploadedBy: "teacher-1",
    },
    {
      id: "4",
      name: "proyecto-final.docx",
      originalName: "Instrucciones para el proyecto final.docx",
      type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      size: 0.8 * 1024 * 1024,
      url: "#",
      path: `classes/${classId}/files/proyecto-final.docx`,
      createdAt: Date.now() - 400000,
      updatedAt: Date.now() - 400000,
      uploadedBy: "teacher-1",
      folderId: "folder-1",
    },
    {
      id: "5",
      name: "ejercicios-practica.xlsx",
      originalName: "Ejercicios de práctica.xlsx",
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      size: 0.5 * 1024 * 1024,
      url: "#",
      path: `classes/${classId}/files/ejercicios-practica.xlsx`,
      createdAt: Date.now() - 200000,
      updatedAt: Date.now() - 200000,
      uploadedBy: "teacher-1",
      folderId: "folder-2",
    },
  ])

  const [folders, setFolders] = useState<Folder[]>([
    {
      id: "folder-1",
      name: "Unidad 1: Fundamentos",
      description: "Materiales básicos para comenzar el curso",
    },
    {
      id: "folder-2",
      name: "Unidad 2: Ecuaciones",
      description: "Materiales sobre ecuaciones lineales y cuadráticas",
    },
  ])

  const handleFileUpload = (files: FileMetadata[]) => {
    setMaterials((prev) => [...prev, ...files])
  }

  const handleFileDelete = (file: FileMetadata) => {
    setMaterials((prev) => prev.filter((f) => f.id !== file.id))
  }

  const handleFolderCreate = (folder: Folder) => {
    setFolders((prev) => [...prev, folder])
  }

  const handleFolderDelete = (folderId: string) => {
    setFolders((prev) => prev.filter((folder) => folder.id !== folderId))
    // También eliminar archivos dentro de la carpeta
    setMaterials((prev) => prev.filter((material) => material.folderId !== folderId))
  }

  const { can } = usePermissions()

  return (
    <div className="space-y-6">
      <FileManager
        classId={classId}
        initialFiles={materials}
        initialFolders={folders}
        onFileUpload={handleFileUpload}
        onFileDelete={handleFileDelete}
        onFolderCreate={handleFolderCreate}
        onFolderDelete={handleFolderDelete}
      />

      {/* Copyright notice */}
      <div className="mt-12 pt-6 border-t text-center text-xs text-muted-foreground">
        <p>
          © {new Date().getFullYear()} HABY-CLASS. Todos los derechos reservados.
          <br />
          Desarrollado por HABY - Heber Zadkiel Garcia Perez
        </p>
      </div>
    </div>
  )
}
