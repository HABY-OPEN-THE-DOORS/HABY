"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Info } from "lucide-react"

interface TermsDialogProps {
  onAccept: (accepted: boolean) => void
  accepted: boolean
}

export function TermsDialog({ onAccept, accepted }: TermsDialogProps) {
  const [open, setOpen] = useState(false)

  const handleAccept = () => {
    onAccept(true)
    setOpen(false)
  }

  return (
    <div className="flex items-start space-x-2 py-2">
      <Checkbox id="terms" checked={accepted} onCheckedChange={(checked) => onAccept(!!checked)} className="mt-1" />
      <div className="grid gap-1.5 leading-none">
        <label
          htmlFor="terms"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Acepto los{" "}
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <button className="text-purple-600 hover:underline focus:outline-none">términos y condiciones</button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Términos y Condiciones de HABY-CLASS</DialogTitle>
                <DialogDescription>
                  Por favor, lee detenidamente los siguientes términos y condiciones antes de utilizar nuestra
                  plataforma.
                </DialogDescription>
              </DialogHeader>

              <ScrollArea className="h-[60vh] mt-4 pr-4">
                <div className="space-y-6 text-sm">
                  <section>
                    <h3 className="text-base font-semibold mb-2">1. Introducción</h3>
                    <p>
                      Bienvenido a HABY-CLASS, una plataforma educativa diseñada para facilitar la enseñanza y el
                      aprendizaje. Estos términos y condiciones rigen el uso de nuestra plataforma y establecen los
                      derechos y obligaciones entre HABY-CLASS y sus usuarios.
                    </p>
                  </section>

                  <section>
                    <h3 className="text-base font-semibold mb-2">2. Recopilación de Datos</h3>
                    <p className="mb-2">
                      Para proporcionar nuestros servicios, recopilamos los siguientes datos personales:
                    </p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Nombre completo</li>
                      <li>Dirección de correo electrónico</li>
                      <li>Folio académico</li>
                      <li>CURP (Clave Única de Registro de Población)</li>
                      <li>Departamento académico (para profesores)</li>
                      <li>Información de uso y actividad en la plataforma</li>
                    </ul>
                  </section>

                  <section>
                    <h3 className="text-base font-semibold mb-2">3. Finalidad de los Datos</h3>
                    <p className="mb-2">Los datos recopilados se utilizan para los siguientes propósitos:</p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Crear y gestionar tu cuenta de usuario</li>
                      <li>Autenticar tu identidad y prevenir el uso no autorizado</li>
                      <li>Personalizar tu experiencia educativa</li>
                      <li>Facilitar la comunicación entre estudiantes y profesores</li>
                      <li>Mejorar nuestros servicios y desarrollar nuevas funcionalidades</li>
                      <li>Cumplir con obligaciones legales y regulatorias</li>
                    </ul>
                  </section>

                  <section>
                    <h3 className="text-base font-semibold mb-2">4. Almacenamiento y Protección de Datos</h3>
                    <p>
                      Tus datos personales se almacenan en servidores seguros y se protegen mediante medidas técnicas y
                      organizativas adecuadas para prevenir el acceso no autorizado, la pérdida o la alteración de la
                      información. Utilizamos encriptación de datos y seguimos las mejores prácticas de la industria en
                      materia de seguridad informática.
                    </p>
                  </section>

                  <section>
                    <h3 className="text-base font-semibold mb-2">5. Compartición de Datos</h3>
                    <p>
                      No compartimos tus datos personales con terceros sin tu consentimiento, excepto cuando sea
                      necesario para proporcionar nuestros servicios o cuando estemos legalmente obligados a hacerlo.
                    </p>
                  </section>

                  <section>
                    <h3 className="text-base font-semibold mb-2">6. Derechos del Usuario</h3>
                    <p className="mb-2">Como usuario, tienes derecho a:</p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Acceder a tus datos personales</li>
                      <li>Rectificar datos inexactos</li>
                      <li>Solicitar la eliminación de tus datos</li>
                      <li>Oponerte al tratamiento de tus datos</li>
                      <li>Solicitar la limitación del tratamiento</li>
                      <li>Solicitar la portabilidad de tus datos</li>
                    </ul>
                  </section>

                  <section>
                    <h3 className="text-base font-semibold mb-2">7. Responsabilidades del Usuario</h3>
                    <p>
                      Como usuario de HABY-CLASS, eres responsable de mantener la confidencialidad de tu cuenta y
                      contraseña, así como de todas las actividades que se realicen bajo tu cuenta. Te comprometes a
                      utilizar la plataforma de manera ética y legal, respetando los derechos de otros usuarios y
                      cumpliendo con todas las leyes aplicables.
                    </p>
                  </section>

                  <section>
                    <h3 className="text-base font-semibold mb-2">8. Propiedad Intelectual</h3>
                    <p>
                      Todo el contenido disponible en HABY-CLASS, incluyendo pero no limitado a textos, gráficos,
                      logotipos, iconos, imágenes, clips de audio, descargas digitales y software, es propiedad de
                      HABY-CLASS o de sus proveedores de contenido y está protegido por las leyes de propiedad
                      intelectual.
                    </p>
                  </section>

                  <section>
                    <h3 className="text-base font-semibold mb-2">9. Contacto</h3>
                    <p>
                      Si tienes preguntas o inquietudes sobre estos términos y condiciones o sobre el tratamiento de tus
                      datos personales, puedes contactarnos a través de nuestro formulario de contacto o enviando un
                      correo electrónico a privacy@haby-class.com.
                    </p>
                  </section>

                  <section>
                    <h3 className="text-base font-semibold mb-2">10. Modificaciones</h3>
                    <p>
                      Nos reservamos el derecho de modificar estos términos y condiciones en cualquier momento. Las
                      modificaciones entrarán en vigor inmediatamente después de su publicación en la plataforma. Te
                      recomendamos revisar periódicamente estos términos para estar informado de cualquier cambio.
                    </p>
                  </section>

                  <div className="pt-4 border-t border-gray-200">
                    <div className="flex items-start space-x-2 bg-blue-50 p-3 rounded-md">
                      <Info className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                      <p className="text-blue-700 text-sm">
                        Al aceptar estos términos y condiciones, confirmas que has leído, entendido y aceptado todas las
                        disposiciones aquí contenidas y consientes el tratamiento de tus datos personales de acuerdo con
                        lo establecido en este documento.
                      </p>
                    </div>
                  </div>
                </div>
              </ScrollArea>

              <DialogFooter className="mt-4">
                <Button variant="outline" onClick={() => setOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleAccept} className="bg-purple-600 hover:bg-purple-700 text-white">
                  Aceptar términos
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </label>
        <p className="text-xs text-gray-500">
          Al registrarte, aceptas que recopilemos y procesemos tus datos personales para brindarte nuestros servicios
          educativos.
        </p>
      </div>
    </div>
  )
}
