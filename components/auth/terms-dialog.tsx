"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useLanguage } from "@/providers/language-provider"

/**
 * Componente TermsDialog - Muestra un diálogo con los términos y condiciones
 * @param onAccept - Función callback que se llama cuando se aceptan los términos
 * @param accepted - Estado que indica si los términos han sido aceptados
 * @returns Componente React con el diálogo de términos
 */
interface TermsDialogProps {
  onAccept: (accepted: boolean) => void
  accepted: boolean
}

export function TermsDialog({ onAccept, accepted }: TermsDialogProps) {
  const [open, setOpen] = useState(false)
  const { t } = useLanguage()

  const handleAccept = () => {
    onAccept(true)
    setOpen(false)
  }

  return (
    <div className="flex items-start space-x-2">
      <Checkbox
        id="terms"
        checked={accepted}
        onCheckedChange={(checked) => onAccept(checked as boolean)}
        className={accepted ? "border-primary text-primary" : ""}
      />
      <div className="grid gap-1.5 leading-none">
        <div className="flex items-center gap-1">
          <Label
            htmlFor="terms"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {t("auth.signup.terms")}
          </Label>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button variant="link" className="h-auto p-0 text-sm">
                {t("nav.terms")}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[80vh]">
              <DialogHeader>
                <DialogTitle>Términos y Condiciones de HABY</DialogTitle>
                <DialogDescription>
                  Por favor, lee detenidamente los siguientes términos y condiciones antes de aceptar.
                </DialogDescription>
              </DialogHeader>
              <ScrollArea className="h-[50vh] rounded-md border p-4">
                <div className="space-y-4 text-sm">
                  <h3 className="text-lg font-semibold">1. Introducción</h3>
                  <p>
                    Bienvenido a HABY, una plataforma educativa desarrollada por Heber Zadkiel Garcia Perez. Estos
                    términos y condiciones rigen el uso de nuestra plataforma y servicios relacionados.
                  </p>

                  <h3 className="text-lg font-semibold">2. Uso de la Plataforma</h3>
                  <p>
                    Al registrarte y utilizar HABY, aceptas usar la plataforma únicamente para fines educativos
                    legítimos. No debes utilizar la plataforma para actividades ilegales, fraudulentas o que violen los
                    derechos de otros usuarios.
                  </p>

                  <h3 className="text-lg font-semibold">3. Cuentas de Usuario</h3>
                  <p>
                    Eres responsable de mantener la confidencialidad de tu información de cuenta, incluyendo tu
                    contraseña. Notificarás inmediatamente a HABY sobre cualquier uso no autorizado de tu cuenta.
                  </p>

                  <h3 className="text-lg font-semibold">4. Contenido del Usuario</h3>
                  <p>
                    Al subir contenido a HABY, garantizas que tienes los derechos necesarios para compartir dicho
                    contenido y otorgas a HABY una licencia no exclusiva para usar, modificar, ejecutar, copiar y
                    mostrar dicho contenido en relación con los servicios de HABY.
                  </p>

                  <h3 className="text-lg font-semibold">5. Privacidad</h3>
                  <p>
                    Tu privacidad es importante para nosotros. Nuestra Política de Privacidad explica cómo recopilamos,
                    usamos y protegemos tu información personal cuando utilizas nuestra plataforma.
                  </p>

                  <h3 className="text-lg font-semibold">6. Propiedad Intelectual</h3>
                  <p>
                    HABY y su contenido original, características y funcionalidad son propiedad de Heber Zadkiel Garcia
                    Perez y están protegidos por leyes de propiedad intelectual.
                  </p>

                  <h3 className="text-lg font-semibold">7. Terminación</h3>
                  <p>
                    HABY puede terminar o suspender tu acceso a la plataforma inmediatamente, sin previo aviso ni
                    responsabilidad, por cualquier razón, incluyendo, sin limitación, si incumples estos Términos y
                    Condiciones.
                  </p>

                  <h3 className="text-lg font-semibold">8. Limitación de Responsabilidad</h3>
                  <p>
                    En ningún caso HABY, sus directores, empleados o agentes serán responsables por cualquier daño
                    indirecto, incidental, especial, consecuente o punitivo.
                  </p>

                  <h3 className="text-lg font-semibold">9. Cambios a estos Términos</h3>
                  <p>
                    Nos reservamos el derecho de modificar estos términos de servicio en cualquier momento. Te
                    notificaremos sobre cualquier cambio publicando los nuevos términos en esta plataforma.
                  </p>

                  <h3 className="text-lg font-semibold">10. Contacto</h3>
                  <p>
                    Si tienes alguna pregunta sobre estos Términos y Condiciones, por favor contáctanos a través de los
                    canales de soporte disponibles en la plataforma.
                  </p>

                  <h3 className="text-lg font-semibold">11. Cláusula de Exención de Responsabilidad</h3>
                  <p>
                    Al utilizar HABY, reconoces y aceptas que la plataforma se proporciona "tal cual" y "según
                    disponibilidad", sin garantías de ningún tipo, ya sean expresas o implícitas. HABY no garantiza que
                    la plataforma sea ininterrumpida, oportuna, segura o libre de errores.
                  </p>
                  <p>
                    En la máxima medida permitida por la ley aplicable, HABY no será responsable por daños directos,
                    indirectos, incidentales, especiales, consecuentes o punitivos, incluyendo, pero no limitado a,
                    pérdida de beneficios, datos, uso, buena voluntad u otras pérdidas intangibles, resultantes de:
                  </p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>El uso o la imposibilidad de usar la plataforma</li>
                    <li>Cualquier cambio realizado en la plataforma</li>
                    <li>Acceso no autorizado o alteración de tus transmisiones o datos</li>
                    <li>Declaraciones o conductas de terceros en la plataforma</li>
                    <li>Cualquier otra cuestión relacionada con la plataforma</li>
                  </ul>
                  <p>
                    Esta limitación de responsabilidad se aplicará independientemente de la teoría legal en la que se
                    base la reclamación y de si HABY ha sido advertido de la posibilidad de tales daños.
                  </p>
                </div>
              </ScrollArea>
              <DialogFooter>
                <Button variant="outline" onClick={() => setOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleAccept}>Aceptar términos</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        <p className="text-xs text-muted-foreground">Debes aceptar nuestros términos y condiciones para continuar.</p>
      </div>
    </div>
  )
}
