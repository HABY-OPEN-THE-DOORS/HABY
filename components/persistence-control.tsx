/**
 * HABY-CLASS - Control de Persistencia de Datos
 * Permite a los usuarios gestionar la temporalidad de sus datos
 */

"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { AlertTriangle, Clock, Database, Download, Save, Shield, Upload } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { usePermissions } from "@/hooks/use-permissions"

interface PersistenceControlProps {
  isPersistent: boolean
  expiresAt: Date | null
  hasUnsavedChanges: boolean
  isLoading: boolean
  onPersistenceChange: (persistent: boolean) => void
  onExpirationChange: (minutes: number | null) => void
  onSave: () => Promise<boolean>
  onExport?: () => any
  onImport?: (data: any) => void
  dataType?: string
  className?: string
}

const EXPIRATION_OPTIONS = [
  { value: null, label: "Sin expiración", description: "Los datos se mantienen indefinidamente" },
  { value: 30, label: "30 minutos", description: "Ideal para borradores temporales" },
  { value: 60, label: "1 hora", description: "Para trabajo en progreso" },
  { value: 240, label: "4 horas", description: "Para sesiones de trabajo largas" },
  { value: 1440, label: "1 día", description: "Para revisiones diarias" },
  { value: 10080, label: "1 semana", description: "Para proyectos semanales" },
  { value: 43200, label: "1 mes", description: "Para archivos temporales" },
]

export function PersistenceControl({
  isPersistent,
  expiresAt,
  hasUnsavedChanges,
  isLoading,
  onPersistenceChange,
  onExpirationChange,
  onSave,
  onExport,
  onImport,
  dataType = "datos",
  className = "",
}: PersistenceControlProps) {
  const [isExporting, setIsExporting] = useState(false)
  const [isImporting, setIsImporting] = useState(false)
  const { toast } = useToast()
  const { can } = usePermissions()

  const handleSave = async () => {
    const success = await onSave()
    if (success) {
      toast({
        title: "Guardado exitoso",
        description: `${dataType} ${isPersistent ? "guardados permanentemente" : "guardados temporalmente"}`,
      })
    }
  }

  const handleExport = async () => {
    if (!onExport) return

    try {
      setIsExporting(true)
      const exportedData = onExport()

      if (exportedData) {
        const blob = new Blob([JSON.stringify(exportedData, null, 2)], {
          type: "application/json",
        })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `haby-class-${dataType}-${new Date().toISOString().split("T")[0]}.json`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)

        toast({
          title: "Exportación exitosa",
          description: `${dataType} exportados correctamente`,
        })
      }
    } catch (error) {
      toast({
        title: "Error en exportación",
        description: "No se pudieron exportar los datos",
        variant: "destructive",
      })
    } finally {
      setIsExporting(false)
    }
  }

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!onImport || !event.target.files?.[0]) return

    try {
      setIsImporting(true)
      const file = event.target.files[0]
      const text = await file.text()
      const data = JSON.parse(text)

      onImport(data)

      toast({
        title: "Importación exitosa",
        description: `${dataType} importados correctamente`,
      })
    } catch (error) {
      toast({
        title: "Error en importación",
        description: "El archivo no es válido o está corrupto",
        variant: "destructive",
      })
    } finally {
      setIsImporting(false)
      // Limpiar el input
      event.target.value = ""
    }
  }

  const getExpirationStatus = () => {
    if (!expiresAt) return null

    const now = new Date()
    const timeLeft = expiresAt.getTime() - now.getTime()

    if (timeLeft <= 0) {
      return { status: "expired", message: "Expirado", color: "destructive" }
    }

    const hoursLeft = Math.floor(timeLeft / (1000 * 60 * 60))
    const minutesLeft = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60))

    if (hoursLeft > 0) {
      return {
        status: "active",
        message: `Expira en ${hoursLeft}h ${minutesLeft}m`,
        color: hoursLeft < 1 ? "destructive" : hoursLeft < 4 ? "warning" : "secondary",
      }
    } else {
      return {
        status: "active",
        message: `Expira en ${minutesLeft}m`,
        color: minutesLeft < 30 ? "destructive" : "warning",
      }
    }
  }

  const expirationStatus = getExpirationStatus()

  return (
    <Card className={`shadow-soft ${className}`}>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Control de Persistencia
        </CardTitle>
        <CardDescription>Gestiona cómo y cuándo se guardan tus {dataType}</CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Estado actual */}
        <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            <span className="text-sm font-medium">Estado actual:</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={isPersistent ? "default" : "secondary"}>{isPersistent ? "Permanente" : "Temporal"}</Badge>
            {expirationStatus && (
              <Badge variant={expirationStatus.color as any}>
                <Clock className="h-3 w-3 mr-1" />
                {expirationStatus.message}
              </Badge>
            )}
            {hasUnsavedChanges && (
              <Badge variant="outline">
                <AlertTriangle className="h-3 w-3 mr-1" />
                Sin guardar
              </Badge>
            )}
          </div>
        </div>

        {/* Control de persistencia */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="persistent-toggle" className="text-sm font-medium">
                Almacenamiento permanente
              </Label>
              <p className="text-xs text-muted-foreground">
                Los datos se guardan indefinidamente hasta que los elimines
              </p>
            </div>
            <Switch
              id="persistent-toggle"
              checked={isPersistent}
              onCheckedChange={onPersistenceChange}
              disabled={isLoading}
            />
          </div>

          {/* Control de expiración (solo si no es permanente) */}
          {!isPersistent && (
            <div className="space-y-2">
              <Label className="text-sm font-medium">Tiempo de expiración</Label>
              <Select
                value={expiresAt ? String(Math.round((expiresAt.getTime() - Date.now()) / 60000)) : "null"}
                onValueChange={(value) => onExpirationChange(value === "null" ? null : Number.parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar tiempo de expiración" />
                </SelectTrigger>
                <SelectContent>
                  {EXPIRATION_OPTIONS.map((option) => (
                    <SelectItem key={String(option.value)} value={String(option.value)}>
                      <div className="flex flex-col">
                        <span>{option.label}</span>
                        <span className="text-xs text-muted-foreground">{option.description}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        <Separator />

        {/* Acciones */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Button onClick={handleSave} disabled={!hasUnsavedChanges || isLoading} className="flex-1">
              <Save className="h-4 w-4 mr-2" />
              {isLoading ? "Guardando..." : "Guardar cambios"}
            </Button>
          </div>

          {/* Exportar/Importar (solo si el usuario tiene permisos) */}
          {(can("export_data") || can("import_data")) && (
            <div className="flex items-center gap-2">
              {onExport && can("export_data") && (
                <Button variant="outline" onClick={handleExport} disabled={isExporting} className="flex-1">
                  <Download className="h-4 w-4 mr-2" />
                  {isExporting ? "Exportando..." : "Exportar"}
                </Button>
              )}

              {onImport && can("import_data") && (
                <div className="flex-1">
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleImport}
                    className="hidden"
                    id="import-file"
                    disabled={isImporting}
                  />
                  <Button
                    variant="outline"
                    onClick={() => document.getElementById("import-file")?.click()}
                    disabled={isImporting}
                    className="w-full"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    {isImporting ? "Importando..." : "Importar"}
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Información adicional */}
        {!isPersistent && expirationStatus?.status === "expired" && (
          <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
            <div className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-4 w-4" />
              <span className="text-sm font-medium">Datos expirados</span>
            </div>
            <p className="text-xs text-destructive/80 mt-1">
              Los datos han expirado y serán eliminados automáticamente. Guarda los cambios para renovar.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
