import Link from "next/link"
import { Button } from "@/components/ui/button"
import { MainNav } from "@/components/main-nav"
import { SiteFooter } from "@/components/site-footer"
import { LanguageThemeSelector } from "@/components/language-theme-selector"

export default function AboutPage() {
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
          <h1 className="text-3xl font-bold mb-6">Acerca de HABY-CLASS</h1>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Nuestra Misión</h2>
            <p className="text-muted-foreground mb-4">
              HABY-CLASS es una plataforma educativa moderna inspirada en Google Classroom, diseñada para simplificar la
              enseñanza y mejorar el aprendizaje. Nuestra misión es proporcionar herramientas intuitivas que faciliten
              la gestión de clases, la comunicación entre profesores y estudiantes, y la organización de contenido
              educativo.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Fundador</h2>
            <p className="text-muted-foreground">
              HABY-CLASS fue fundada por <strong>Heber Zadkiel Garcia Perez</strong>, con la visión de crear una
              plataforma educativa accesible y eficiente para instituciones educativas de todos los tamaños.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Referencias y Fuentes</h2>
            <p className="text-muted-foreground mb-2">
              Este proyecto se ha desarrollado basándose en las siguientes fuentes:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>
                <a
                  href="https://www.bookwidgets.com/blog/es/2020/05/guia-para-principiantes-de-google-classroom"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  Guía para principiantes de Google Classroom - BookWidgets
                </a>
              </li>
              <li>
                <a
                  href="https://cuaed.unam.mx/descargas/Manual-Google-Classroom.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  Manual de Google Classroom - CUAED UNAM
                </a>
              </li>
            </ul>
          </section>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
