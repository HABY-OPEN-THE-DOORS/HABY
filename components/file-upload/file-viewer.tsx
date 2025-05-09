"use client"

import { useState } from "react"
import { type FileMetadata, StorageService } from "@/lib/storage-service"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Download,
  Eye,
  File,
  FileText,
  Film,
  ImageIcon,
  MoreVertical,
  Music,
  Pencil,
  Trash2,
  FileArchive,
  FileSpreadsheet,
  FileCode,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { usePermissions } from "@/hooks/use-permissions"

interface FileViewerProps {
  files: FileMetadata[]
  onDelete?: (file: FileMetadata) => void
  onEdit?: (file: FileMetadata) => void
  className?: string
  showActions?: boolean
}

export function FileViewer({ files, onDelete, onEdit, className, showActions = true }: FileViewerProps) {
  const [selectedFile, setSelectedFile] = useState<FileMetadata | null>(null)
  const { can } = usePermissions()

  const getFileIcon = (type: string) => {
    if (type.startsWith("image/")) {
      return <ImageIcon className="h-6 w-6 text-blue-500" />
    } else if (type.startsWith("video/")) {
      return <Film className="h-6 w-6 text-red-500" />
    } else if (type.startsWith("audio/")) {
      return <Music className="h-6 w-6 text-purple-500" />
    } else if (type.includes("pdf")) {
      return <FileText className="h-6 w-6 text-orange-500" />
    } else if (type.includes("spreadsheet") || type.includes("excel") || type.includes("csv")) {
      return <FileSpreadsheet className="h-6 w-6 text-green-500" />
    } else if (type.includes("zip") || type.includes("rar") || type.includes("tar") || type.includes("compressed")) {
      return <FileArchive className="h-6 w-6 text-yellow-500" />
    } else if (type.includes("html") || type.includes("css") || type.includes("javascript") || type.includes("json")) {
      return <FileCode className="h-6 w-6 text-cyan-500" />
    } else {
      return <File className="h-6 w-6 text-gray-500" />
    }
  }

  const renderFilePreview = (file: FileMetadata) => {
    if (file.type.startsWith("image/")) {
      return (
        <div className="relative aspect-video bg-muted rounded-md overflow-hidden">
          <img src={file.url || "/placeholder.svg"} alt={file.originalName} className="w-full h-full object-cover" />
        </div>
      )
    } else if (file.type.startsWith("video/")) {
      return (
        <div className="relative aspect-video bg-muted rounded-md overflow-hidden">
          <video src={file.url} controls className="w-full h-full object-cover">
            Tu navegador no soporta la reproducción de videos.
          </video>
        </div>
      )
    } else if (file.type.startsWith("audio/")) {
      return (
        <div className="p-4 bg-muted rounded-md">
          <audio src={file.url} controls className="w-full">
            Tu navegador no soporta la reproducción de audio.
          </audio>
        </div>
      )
    } else {
      return (
        <div className="aspect-video bg-muted rounded-md flex items-center justify-center">
          <div className="text-center p-4">
            {getFileIcon(file.type)}
            <p className="mt-2 text-sm font-medium">{file.originalName}</p>
            <p className="text-xs text-muted-foreground">{StorageService.formatFileSize(file.size)}</p>
          </div>
        </div>
      )
    }
  }

  const handlePreview = (file: FileMetadata) => {
    setSelectedFile(file)
  }

  const handleDownload = (file: FileMetadata) => {
    window.open(file.url, "_blank")
  }

  return (
    <div className={cn("space-y-4", className)}>
      {files.length === 0 ? (
        <div className="text-center py-12 border rounded-lg bg-muted/20">
          <File className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">No hay archivos</h3>
          <p className="text-muted-foreground">Aún no se han subido archivos.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {files.map((file) => (
            <Card key={file.id} className="overflow-hidden">
              <CardHeader className="p-0">
                <div className="cursor-pointer" onClick={() => handlePreview(file)}>
                  {file.type.startsWith("image/") ? (
                    <div className="aspect-video bg-muted">
                      <img
                        src={file.url || "/placeholder.svg"}
                        alt={file.originalName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="aspect-video bg-muted flex items-center justify-center p-4">
                      {getFileIcon(file.type)}
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="min-w-0">
                    <CardTitle className="text-base truncate">{file.originalName}</CardTitle>
                    <p className="text-xs text-muted-foreground mt-1">
                      {StorageService.formatFileSize(file.size)} • {new Date(file.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  {showActions && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handlePreview(file)}>
                          <Eye className="h-4 w-4 mr-2" />
                          Ver
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDownload(file)}>
                          <Download className="h-4 w-4 mr-2" />
                          Descargar
                        </DropdownMenuItem>
                        {onEdit && can("edit_materials") && (
                          <DropdownMenuItem onClick={() => onEdit(file)}>
                            <Pencil className="h-4 w-4 mr-2" />
                            Editar
                          </DropdownMenuItem>
                        )}
                        {onDelete && can("delete_materials") && (
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onClick={() => onDelete(file)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Eliminar
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>
              </CardContent>
              <CardFooter className="p-4 pt-0">
                <Badge variant="outline" className="text-xs">
                  {file.type.split("/")[0]}
                </Badge>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Diálogo de vista previa */}
      <Dialog open={!!selectedFile} onOpenChange={(open) => !open && setSelectedFile(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>{selectedFile?.originalName}</DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            {selectedFile && (
              <>
                {renderFilePreview(selectedFile)}
                <div className="mt-4 flex justify-between items-center">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Subido el {new Date(selectedFile.createdAt).toLocaleDateString()} •{" "}
                      {StorageService.formatFileSize(selectedFile.size)}
                    </p>
                  </div>
                  <Button onClick={() => handleDownload(selectedFile)}>
                    <Download className="h-4 w-4 mr-2" />
                    Descargar
                  </Button>
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
