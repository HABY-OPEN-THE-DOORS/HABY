import Link from "next/link"
import { Button } from "@/components/ui/button"
import { MainNav } from "@/components/main-nav"
import { SiteFooter } from "@/components/site-footer"
import { LanguageThemeSelector } from "@/components/language-theme-selector"

export default function TermsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
          <MainNav />
          <div className="ml-auto flex items-center space-x-4">
            <LanguageThemeSelector />
            <Link href="/login">
              <Button variant="outline">Iniciar sesión</Button>
            </Link>
            <Link href="/signup">
              <Button>Registrarse</Button>
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1 container py-12">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Términos y Condiciones</h1>

          <div className="prose prose-sm sm:prose lg:prose-lg dark:prose-invert">
            <p>Última actualización: 1 de abril de 2023</p>

            <h2>1. Aceptación de los Términos</h2>
            <p>
              Al acceder o utilizar HABY-CLASS, aceptas estar sujeto a estos Términos y Condiciones y a nuestra Política
              de Privacidad. Si no estás de acuerdo con alguno de estos términos, no utilices nuestra plataforma.
            </p>

            <h2>2. Descripción del Servicio</h2>
            <p>
              HABY-CLASS es una plataforma educativa que permite a profesores y estudiantes crear, compartir y gestionar
              contenido educativo, tareas y comunicaciones en un entorno digital.
            </p>

            <h2>3. Cuentas de Usuario</h2>
            <p>
              Para utilizar ciertas funciones de nuestra plataforma, debes crear una cuenta. Eres responsable de
              mantener la confidencialidad de tu información de cuenta, incluyendo tu contraseña, y de todas las
              actividades que ocurran bajo tu cuenta.
            </p>
            <p>
              Debes notificarnos inmediatamente sobre cualquier uso no autorizado de tu cuenta o cualquier otra
              violación de seguridad. No seremos responsables por ninguna pérdida que puedas sufrir como resultado del
              uso no autorizado de tu cuenta.
            </p>

            <h2>4. Contenido del Usuario</h2>
            <p>
              Nuestra plataforma permite a los usuarios publicar, enlazar y compartir contenido. Eres el único
              responsable de todo el contenido que publiques, enlaces o compartas, y de cualquier consecuencia que
              resulte de ello.
            </p>
            <p>
              Al publicar contenido en nuestra plataforma, nos otorgas una licencia mundial, no exclusiva, libre de
              regalías, sublicenciable y transferible para usar, reproducir, distribuir, preparar trabajos derivados,
              mostrar y ejecutar dicho contenido en relación con nuestros servicios.
            </p>

            <h2>5. Conducta del Usuario</h2>
            <p>Aceptas no utilizar nuestra plataforma para:</p>
            <ul>
              <li>Violar cualquier ley o regulación aplicable.</li>
              <li>Infringir los derechos de propiedad intelectual de terceros.</li>
              <li>Acosar, intimidar o amenazar a otros usuarios.</li>
              <li>Publicar contenido difamatorio, obsceno o ilegal.</li>
              <li>Interferir con el funcionamiento normal de la plataforma.</li>
              <li>Recopilar información personal de otros usuarios sin su consentimiento.</li>
              <li>Suplantar a otra persona o entidad.</li>
            </ul>

            <h2>6. Propiedad Intelectual</h2>
            <p>
              HABY-CLASS y su contenido original, características y funcionalidad son propiedad de Heber Zadkiel Garcia
              Perez y están protegidos por leyes de propiedad intelectual. No puedes reproducir, distribuir, modificar,
              crear trabajos derivados, mostrar públicamente, ejecutar públicamente, republicar, descargar, almacenar o
              transmitir cualquier material de nuestra plataforma sin nuestro consentimiento previo por escrito.
            </p>

            <h2>7. Enlaces a Terceros</h2>
            <p>
              Nuestra plataforma puede contener enlaces a sitios web o servicios de terceros que no son propiedad ni
              están controlados por HABY-CLASS. No tenemos control sobre, y no asumimos responsabilidad por, el
              contenido, políticas de privacidad o prácticas de sitios web o servicios de terceros.
            </p>

            <h2>8. Terminación</h2>
            <p>
              Podemos terminar o suspender tu acceso a nuestra plataforma inmediatamente, sin previo aviso ni
              responsabilidad, por cualquier razón, incluyendo, sin limitación, si incumples estos Términos y
              Condiciones.
            </p>

            <h2>9. Limitación de Responsabilidad</h2>
            <p>
              En ningún caso HABY-CLASS, sus directores, empleados, socios, agentes, proveedores o afiliados serán
              responsables por cualquier daño indirecto, incidental, especial, consecuente o punitivo, incluyendo, sin
              limitación, pérdida de beneficios, datos, uso, buena voluntad u otras pérdidas intangibles, resultantes de
              tu acceso o uso o incapacidad para acceder o usar la plataforma.
            </p>

            <h2>10. Cambios a estos Términos</h2>
            <p>
              Nos reservamos el derecho, a nuestra sola discreción, de modificar o reemplazar estos términos en
              cualquier momento. Si una revisión es material, intentaremos proporcionar un aviso con al menos 30 días de
              anticipación antes de que los nuevos términos entren en vigor.
            </p>

            <h2>11. Contacto</h2>
            <p>
              Si tienes preguntas sobre estos Términos y Condiciones, contáctanos en:
              <a href="mailto:terms@haby-class.com">terms@haby-class.com</a>
            </p>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
