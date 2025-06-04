"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { WifiOff } from "lucide-react"

export default function OfflinePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background">
      <div className="max-w-md w-full mx-auto text-center space-y-6">
        <div className="bg-muted/30 p-6 rounded-full w-24 h-24 mx-auto flex items-center justify-center">
          <WifiOff className="h-12 w-12 text-muted-foreground" />
        </div>

        <h1 className="text-3xl font-bold tracking-tight">Sin conexión</h1>

        <p className="text-muted-foreground">
          Parece que no tienes conexión a internet. Algunas funciones pueden no estar disponibles hasta que te vuelvas a
          conectar.
        </p>

        <div className="space-y-4 pt-4">
          <Button className="w-full" onClick={() => window.location.reload()}>
            Intentar nuevamente
          </Button>

          <Link href="/dashboard" passHref>
            <Button variant="outline" className="w-full">
              Ir al Dashboard
            </Button>
          </Link>
        </div>

        <p className="text-sm text-muted-foreground pt-4">
          HABY-CLASS funciona parcialmente sin conexión. Puedes acceder a contenido previamente cargado.
        </p>
      </div>
    </div>
  )
}
