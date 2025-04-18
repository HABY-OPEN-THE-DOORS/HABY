import Link from "next/link"
import { Button } from "@/components/ui/button"
import { MainNav } from "@/components/main-nav"
import { SiteFooter } from "@/components/site-footer"
import { LanguageThemeSelector } from "@/components/language-theme-selector"

export default function PrivacyPage() {
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
          <h1 className="text-3xl font-bold mb-6">Política de Privacidad</h1>

          <div className="prose prose-sm sm:prose lg:prose-lg dark:prose-invert">
            <p>Última actualización: 1 de abril de 2023</p>

            <h2>1. Introducción</h2>
            <p>
              En HABY-CLASS, valoramos y respetamos tu privacidad. Esta Política de Privacidad explica cómo recopilamos,
              usamos, divulgamos y protegemos tu información cuando utilizas nuestra plataforma educativa.
            </p>

            <h2>2. Información que Recopilamos</h2>
            <p>Podemos recopilar los siguientes tipos de información:</p>
            <ul>
              <li>
                <strong>Información de registro:</strong> Cuando creas una cuenta, recopilamos tu nombre, dirección de
                correo electrónico, contraseña, rol (estudiante o profesor) y, en algunos casos, información
                institucional.
              </li>
              <li>
                <strong>Información de perfil:</strong> Puedes proporcionar información adicional como foto de perfil,
                biografía y enlaces a sitios web.
              </li>
              <li>
                <strong>Contenido del usuario:</strong> Incluye tareas, comentarios, mensajes y otros materiales que
                publicas o cargas en la plataforma.
              </li>
              <li>
                <strong>Información de uso:</strong> Recopilamos datos sobre cómo interactúas con nuestra plataforma,
                incluyendo las páginas que visitas, las características que utilizas y el tiempo que pasas en la
                plataforma.
              </li>
              <li>
                <strong>Información del dispositivo:</strong> Podemos recopilar información sobre tu dispositivo, como
                dirección IP, tipo de navegador, sistema operativo y configuración de idioma.
              </li>
            </ul>

            <h2>3. Cómo Utilizamos tu Información</h2>
            <p>Utilizamos la información recopilada para:</p>
            <ul>
              <li>Proporcionar, mantener y mejorar nuestra plataforma educativa.</li>
              <li>Procesar y completar transacciones.</li>
              <li>Enviar información técnica, actualizaciones, alertas de seguridad y mensajes de soporte.</li>
              <li>Responder a tus comentarios, preguntas y solicitudes.</li>
              <li>Desarrollar nuevos productos, servicios y características.</li>
              <li>Monitorear y analizar tendencias, uso y actividades.</li>
              <li>Detectar, investigar y prevenir actividades fraudulentas y no autorizadas.</li>
              <li>Personalizar y mejorar tu experiencia en la plataforma.</li>
            </ul>

            <h2>4. Compartir y Divulgación de Información</h2>
            <p>Podemos compartir tu información en las siguientes circunstancias:</p>
            <ul>
              <li>
                <strong>Con otros usuarios:</strong> Cuando participas en una clase, cierta información (como tu nombre,
                foto de perfil y contenido que publicas) será visible para otros usuarios de esa clase.
              </li>
              <li>
                <strong>Con proveedores de servicios:</strong> Podemos compartir información con proveedores de
                servicios que nos ayudan a operar, desarrollar o mejorar nuestra plataforma.
              </li>
              <li>
                <strong>Para cumplir con la ley:</strong> Podemos divulgar información si creemos de buena fe que es
                necesario para cumplir con una obligación legal, proteger la seguridad de cualquier persona, abordar
                fraudes o problemas técnicos, o proteger nuestros derechos.
              </li>
            </ul>

            <h2>5. Seguridad de la Información</h2>
            <p>
              Implementamos medidas de seguridad diseñadas para proteger tu información personal contra acceso no
              autorizado, alteración, divulgación o destrucción. Sin embargo, ningún sistema es completamente seguro, y
              no podemos garantizar la seguridad absoluta de tu información.
            </p>

            <h2>6. Tus Derechos y Opciones</h2>
            <p>
              Dependiendo de tu ubicación, puedes tener ciertos derechos con respecto a tu información personal,
              incluyendo:
            </p>
            <ul>
              <li>Acceder a tu información personal.</li>
              <li>Corregir información inexacta o incompleta.</li>
              <li>Eliminar tu información personal.</li>
              <li>Oponerte al procesamiento de tu información.</li>
              <li>Retirar tu consentimiento en cualquier momento.</li>
            </ul>

            <h2>7. Cambios a esta Política</h2>
            <p>
              Podemos actualizar esta Política de Privacidad periódicamente. Te notificaremos sobre cambios
              significativos publicando la nueva Política de Privacidad en esta página y, si es necesario, por correo
              electrónico.
            </p>

            <h2>8. Contacto</h2>
            <p>
              Si tienes preguntas o inquietudes sobre esta Política de Privacidad o nuestras prácticas de privacidad,
              contáctanos en: <a href="mailto:privacy@haby-class.com">privacy@haby-class.com</a>
            </p>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
