import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Logo } from "@/components/logo"

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full max-w-[400px] flex-col items-center justify-center space-y-6 px-4 py-8 text-center">
        <Logo className="h-12 w-12" />
        <div className="space-y-2">
          <h1 className="text-4xl font-bold">404</h1>
          <h2 className="text-xl font-semibold">Página no encontrada</h2>
          <p className="text-balance text-muted-foreground">
            Lo sentimos, no pudimos encontrar la página que estás buscando.
          </p>
        </div>
        <Link href="/">
          <Button>Volver al inicio</Button>
        </Link>
      </div>
    </div>
  )
}
