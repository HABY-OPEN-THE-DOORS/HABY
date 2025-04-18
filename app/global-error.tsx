"use client"

import { Button } from "@/components/ui/button"
import { Logo } from "@/components/logo"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html>
      <body>
        <div className="flex min-h-screen flex-col items-center justify-center">
          <div className="mx-auto flex w-full max-w-[400px] flex-col items-center justify-center space-y-6 px-4 py-8 text-center">
            <Logo className="h-12 w-12" />
            <div className="space-y-2">
              <h1 className="text-4xl font-bold">Error</h1>
              <h2 className="text-xl font-semibold">Algo salió mal</h2>
              <p className="text-balance text-muted-foreground">Lo sentimos, ha ocurrido un error inesperado.</p>
            </div>
            <Button onClick={() => reset()}>Intentar de nuevo</Button>
          </div>
        </div>
      </body>
    </html>
  )
}
