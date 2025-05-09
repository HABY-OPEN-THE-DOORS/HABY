import Link from "next/link"
import { BookOpen, GraduationCap, Shield, HelpCircle, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { MainNav } from "@/components/main-nav"
import { SiteFooter } from "@/components/site-footer"

export default function GuidesPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
          <MainNav />
          <div className="ml-auto flex items-center space-x-4">
            <Link href="/login">
              <Button variant="outline">Iniciar sesión</Button>
            </Link>
            <Link href="/signup">
              <Button>Registrarse</Button>
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="container py-10">
          <div className="flex flex-col items-start gap-4 md:flex-row md:justify-between">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tight">Guías de Uso</h1>
              <p className="text-lg text-muted-foreground">
                Aprende a utilizar todas las funcionalidades de HABY-CLASS según tu rol
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Link href="/help">
                <Button variant="outline">Centro de ayuda</Button>
              </Link>
            </div>
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-3">
            <Card className="flex flex-col">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <GraduationCap className="h-6 w-6 text-purple-600" />
                  <CardTitle>Guía para Estudiantes</CardTitle>
                </div>
                <CardDescription>
                  Aprende a unirte a clases, entregar tareas y comunicarte con tus profesores y compañeros.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <ChevronRight className="h-4 w-4 mr-2 text-purple-600" />
                    <span>Unirse a clases con código de invitación</span>
                  </li>
                  <li className="flex items-center">
                    <ChevronRight className="h-4 w-4 mr-2 text-purple-600" />
                    <span>Entregar tareas y trabajos</span>
                  </li>
                  <li className="flex items-center">
                    <ChevronRight className="h-4 w-4 mr-2 text-purple-600" />
                    <span>Consultar calificaciones y retroalimentación</span>
                  </li>
                  <li className="flex items-center">
                    <ChevronRight className="h-4 w-4 mr-2 text-purple-600" />
                    <span>Participar en discusiones y foros</span>
                  </li>
                  <li className="flex items-center">
                    <ChevronRight className="h-4 w-4 mr-2 text-purple-600" />
                    <span>Gestionar notificaciones y calendario</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Link href="/guides/students" className="w-full">
                  <Button className="w-full">Ver guía completa</Button>
                </Link>
              </CardFooter>
            </Card>

            <Card className="flex flex-col">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <BookOpen className="h-6 w-6 text-purple-600" />
                  <CardTitle>Guía para Profesores</CardTitle>
                </div>
                <CardDescription>
                  Aprende a crear y gestionar tus clases, asignar tareas y calificar el trabajo de los estudiantes.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <ChevronRight className="h-4 w-4 mr-2 text-purple-600" />
                    <span>Crear y personalizar clases</span>
                  </li>
                  <li className="flex items-center">
                    <ChevronRight className="h-4 w-4 mr-2 text-purple-600" />
                    <span>Gestionar estudiantes y materiales</span>
                  </li>
                  <li className="flex items-center">
                    <ChevronRight className="h-4 w-4 mr-2 text-purple-600" />
                    <span>Crear y evaluar tareas</span>
                  </li>
                  <li className="flex items-center">
                    <ChevronRight className="h-4 w-4 mr-2 text-purple-600" />
                    <span>Gestionar calificaciones y retroalimentación</span>
                  </li>
                  <li className="flex items-center">
                    <ChevronRight className="h-4 w-4 mr-2 text-purple-600" />
                    <span>Comunicarse con estudiantes</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Link href="/guides/teachers" className="w-full">
                  <Button className="w-full">Ver guía completa</Button>
                </Link>
              </CardFooter>
            </Card>

            <Card className="flex flex-col">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Shield className="h-6 w-6 text-purple-600" />
                  <CardTitle>Guía para Administradores</CardTitle>
                </div>
                <CardDescription>
                  Aprende a gestionar usuarios, clases y configuraciones a nivel de institución.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <ChevronRight className="h-4 w-4 mr-2 text-purple-600" />
                    <span>Gestionar usuarios y permisos</span>
                  </li>
                  <li className="flex items-center">
                    <ChevronRight className="h-4 w-4 mr-2 text-purple-600" />
                    <span>Configurar políticas institucionales</span>
                  </li>
                  <li className="flex items-center">
                    <ChevronRight className="h-4 w-4 mr-2 text-purple-600" />
                    <span>Supervisar clases y actividades</span>
                  </li>
                  <li className="flex items-center">
                    <ChevronRight className="h-4 w-4 mr-2 text-purple-600" />
                    <span>Generar informes y estadísticas</span>
                  </li>
                  <li className="flex items-center">
                    <ChevronRight className="h-4 w-4 mr-2 text-purple-600" />
                    <span>Personalizar la plataforma</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Link href="/guides/admin" className="w-full">
                  <Button className="w-full">Ver guía completa</Button>
                </Link>
              </CardFooter>
            </Card>
          </div>

          <div className="mt-12">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <HelpCircle className="h-6 w-6 text-purple-600" />
                  <CardTitle>Recursos adicionales</CardTitle>
                </div>
                <CardDescription>Otros recursos útiles para aprovechar al máximo HABY-CLASS</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-3">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Tutoriales en video</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Aprende visualmente con nuestros tutoriales paso a paso para cada funcionalidad.
                    </p>
                    <Link href="/resources/videos">
                      <Button variant="outline" size="sm">
                        Ver tutoriales
                      </Button>
                    </Link>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-2">Preguntas frecuentes</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Encuentra respuestas a las dudas más comunes sobre el uso de la plataforma.
                    </p>
                    <Link href="/help#faq">
                      <Button variant="outline" size="sm">
                        Ver FAQ
                      </Button>
                    </Link>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-2">Soporte técnico</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      ¿Necesitas ayuda adicional? Contacta con nuestro equipo de soporte.
                    </p>
                    <Link href="/contact">
                      <Button variant="outline" size="sm">
                        Contactar soporte
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
