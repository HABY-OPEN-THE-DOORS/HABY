import { AlertTriangle } from "lucide-react"

export function CopyrightNotice() {
  return (
    <div className="bg-muted py-4">
      <div className="container">
        <div className="flex items-start gap-3 p-3 text-sm bg-muted/50 rounded-lg">
          <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium mb-1">Aviso de Propiedad Intelectual</p>
            <p className="text-muted-foreground">
              HABY-CLASS es una plataforma educativa desarrollada por HABY. Todos los derechos de propiedad intelectual,
              incluyendo pero no limitado a derechos de autor, marcas comerciales, patentes, secretos comerciales y
              know-how relacionados con HABY-CLASS, pertenecen exclusivamente a HABY y a su creador, Heber Zadkiel
              Garcia Perez. Queda prohibida la reproducción, distribución, modificación o cualquier otro uso no
              autorizado de esta plataforma o sus componentes.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
