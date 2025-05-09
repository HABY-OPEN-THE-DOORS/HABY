"use client"

import { useState } from "react"
import { FileUploader } from "@/components/file-upload/file-uploader"
import { FileViewer } from "@/components/file-upload/file-viewer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import type { FileMetadata } from "@/lib/storage-service"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/providers/auth-context"
import { FolderPlus, Search, Folder } from "lucide-react"
import { usePermissions } from "@/hooks/use-permissions"

interface FolderType {
  id: string
  name: string
  description?: string
  parentId?: string
}

interface FileManagerProps {
  classId: string
  initialFiles?: FileMetadata[]
  initialFolders?: FolderType[]
  onFileUpload?: (files: FileMetadata[]) => void
  onFileDelete?: (file: FileMetadata) => void
  onFolderCreate?: (folder: FolderType) => void
  onFolderDelete?: (folderId: string) => void
}

export function FileManager({
  classId,
  initialFiles = [],
  initialFolders = [],
  onFileUpload,
  onFileDelete,
  onFolderCreate,
  onFolderDelete,
}: FileManagerProps) {
  const [files, setFiles] = useState<FileMetadata[]>(initialFiles)
  const [folders, setFolders] = useState<FolderType[]>(initialFolders)
  const [currentFolder, setCurrentFolder] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddFolderDialogOpen, setIsAddFolderDialogOpen] = useState(false)
  const [newFolder, setNewFolder] = useState<Partial<FolderType>>({
    name: "",
    description: "",
    parentId: null,
  })
  const [activeTab, setActiveTab] = useState<string>("all")
  const { toast } = useToast()
  const { userData } = useAuth()
  const { can } = usePermissions()

  // Filtrar archivos por carpeta y término de búsqueda
  const filteredFiles = files.filter(
    (file) =>
      (currentFolder === null || file.folderId === currentFolder) &&
      (file.originalName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        file.type.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (activeTab === "all" || file.type.startsWith(activeTab + "/")),
  )

  // Filtrar carpetas por carpeta padre
  const filteredFolders = folders.filter(
    (folder) => folder.parentId === currentFolder && folder.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleFileUpload = (uploadedFiles: FileMetadata[]) => {
    // Añadir la carpeta actual a los archivos
    const filesWithFolder = uploadedFiles.map((file) => ({
      ...file,
      folderId: currentFolder || undefined,
    }))

    setFiles((prev) => [...prev, ...filesWithFolder])

    if (onFileUpload) {
      onFileUpload(filesWithFolder)
    }
  }

  const handleFileDelete = (file: FileMetadata) => {
    setFiles((prev) => prev.filter((f) => f.id !== file.id))

    if (onFileDelete) {
      onFileDelete(file)
    }

    toast({
      title: "Archivo eliminado",
      description: `Se ha eliminado el archivo "${file.originalName}"`,
    })
  }

  const handleCreateFolder = () => {
    if (!newFolder.name) return

    const folder: FolderType = {
      id: `folder-${Date.now()}`,
      name: newFolder.name,
      description: newFolder.description,
      parentId: currentFolder || undefined,
    }

    setFolders((prev) => [...prev, folder])
    setNewFolder({
      name: "",
      description: "",
      parentId: currentFolder || undefined,
    })
    setIsAddFolderDialogOpen(false)

    if (onFolderCreate) {
      onFolderCreate(folder)
    }

    toast({
      title: "Carpeta creada",
      description: `Se ha creado la carpeta "${folder.name}"`,
    })
  }

  const handleDeleteFolder = (folderId: string) => {
    // Verificar si la carpeta tiene archivos o subcarpetas
    const hasFiles = files.some((file) => file.folderId === folderId)
    const hasSubfolders = folders.some((folder) => folder.parentId === folderId)

    if (hasFiles || hasSubfolders) {
      toast({
        title: "No se puede eliminar",
        description: "La carpeta contiene archivos o subcarpetas. Muévelos o elimínalos primero.",
        variant: "destructive",
      })
      return
    }

    setFolders((prev) => prev.filter((folder) => folder.id !== folderId))

    if (onFolderDelete) {
      onFolderDelete(folderId)
    }

    toast({
      title: "Carpeta eliminada",
      description: "Se ha eliminado la carpeta correctamente",
    })
  }

  const navigateToFolder = (folderId: string | null) => {
    setCurrentFolder(folderId)
    setActiveTab("all")
  }

  const getCurrentFolderPath = () => {
    if (!currentFolder) return []

    const path: FolderType[] = []
    let current = folders.find((folder) => folder.id === currentFolder)

    while (current) {
      path.unshift(current)
      current = current.parentId ? folders.find((folder) => folder.id === current?.parentId) : undefined
    }

    return path
  }

  const folderPath = getCurrentFolderPath()

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          {currentFolder ? (
            <div className="flex items-center space-x-2 text-sm">
              <Button variant="ghost" size="sm" onClick={() => navigateToFolder(null)}>
                Archivos
              </Button>
              {folderPath.map((folder, index) => (
                <div key={folder.id} className="flex items-center">
                  <span className="mx-1 text-muted-foreground">/</span>
                  {index === folderPath.length - 1 ? (
                    <span className="font-medium">{folder.name}</span>
                  ) : (
                    <Button variant="ghost" size="sm" onClick={() => navigateToFolder(folder.id)}>
                      {folder.name}
                    </Button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <h3 className="text-lg font-medium">Archivos y recursos</h3>
          )}
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <div className="relative w-full sm:w-auto">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar archivos..."
              className="pl-8 w-full sm:w-[200px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {can("upload_materials") && (
            <>
              <Dialog open={isAddFolderDialogOpen} onOpenChange={setIsAddFolderDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <FolderPlus className="h-4 w-4 mr-2" />
                    Nueva carpeta
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Crear nueva carpeta</DialogTitle>
                    <DialogDescription>Organiza tus archivos en carpetas temáticas.</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="folder-name">Nombre de la carpeta</Label>
                      <Input
                        id="folder-name"
                        value={newFolder.name || ""}
                        onChange={(e) => setNewFolder({ ...newFolder, name: e.target.value })}
                        placeholder="Ej. Unidad 3: Funciones"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="folder-description">Descripción (opcional)</Label>
                      <Input
                        id="folder-description"
                        value={newFolder.description || ""}
                        onChange={(e) => setNewFolder({ ...newFolder, description: e.target.value })}
                        placeholder="Describe el contenido de esta carpeta"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsAddFolderDialogOpen(false)}>
                      Cancelar
                    </Button>
                    <Button onClick={handleCreateFolder}>Crear carpeta</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </>
          )}
        </div>
      </div>

      {/* Filtros por tipo de archivo */}
      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">Todos</TabsTrigger>
          <TabsTrigger value="image">Imágenes</TabsTrigger>
          <TabsTrigger value="video">Videos</TabsTrigger>
          <TabsTrigger value="audio">Audio</TabsTrigger>
          <TabsTrigger value="application">Documentos</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Carpetas */}
      {filteredFolders.length > 0 && (
        <div className="space-y-4">
          <h4 className="text-sm font-medium">Carpetas</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredFolders.map((folder) => (
              <div
                key={folder.id}
                className="border rounded-lg p-4 cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => navigateToFolder(folder.id)}
              >
                <div className="flex items-start">
                  <Folder className="h-8 w-8 text-yellow-500 mr-3 flex-shrink-0" />
                  <div className="min-w-0">
                    <h4 className="font-medium truncate">{folder.name}</h4>
                    {folder.description && (
                      <p className="text-sm text-muted-foreground truncate">{folder.description}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Carga de archivos */}
      {can("upload_materials") && (
        <div className="space-y-4">
          <h4 className="text-sm font-medium">Subir archivos</h4>
          <FileUploader
            path={`classes/${classId}/files`}
            metadata={{
              uploadedBy: userData?.uid || "unknown",
              classId,
              folderId: currentFolder || undefined,
            }}
            onUploadComplete={handleFileUpload}
            maxFiles={10}
            maxSize={50 * 1024 * 1024} // 50MB
          />
        </div>
      )}

      {/* Visualización de archivos */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium">
          {filteredFiles.length} {filteredFiles.length === 1 ? "archivo" : "archivos"}
        </h4>
        <FileViewer
          files={filteredFiles}
          onDelete={can("delete_materials") ? handleFileDelete : undefined}
          showActions={can("view_materials")}
        />
      </div>
    </div>
  )
}
