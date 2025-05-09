import Link from "next/link"
import { ChevronRight, BookOpen, Users, FileText, Calendar, Bell, HelpCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MainNav } from "@/components/main-nav"
import { SiteFooter } from "@/components/site-footer"

export default function TeachersGuidePage() {
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
              <h1 className="text-3xl font-bold tracking-tight">Guía para Profesores</h1>
              <p className="text-lg text-muted-foreground">
                Aprende a utilizar todas las funcionalidades de HABY-CLASS como profesor
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Link href="/guides">
                <Button variant="outline">Todas las guías</Button>
              </Link>
              <Link href="/help">
                <Button variant="outline">Centro de ayuda</Button>
              </Link>
            </div>
          </div>

          <div className="mt-8">
            <Tabs defaultValue="getting-started" className="w-full">
              <TabsList className="grid w-full grid-cols-2 md:grid-cols-5">
                <TabsTrigger value="getting-started">Primeros pasos</TabsTrigger>
                <TabsTrigger value="classes">Gestión de clases</TabsTrigger>
                <TabsTrigger value="assignments">Tareas</TabsTrigger>
                <TabsTrigger value="grading">Calificaciones</TabsTrigger>
                <TabsTrigger value="communication">Comunicación</TabsTrigger>
              </TabsList>

              <TabsContent value="getting-started" className="mt-6 space-y-8">
                <div className="grid gap-6 md:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>Creación de cuenta</CardTitle>
                      <CardDescription>Cómo registrarte como profesor en HABY-CLASS</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ol className="list-decimal pl-5 space-y-2">
                        <li>Visita la página principal de HABY-CLASS</li>
                        <li>Haz clic en el botón "Registrarse" en la esquina superior derecha</li>
                        <li>Selecciona "Profesor" como tu rol</li>
                        <li>Completa el formulario con tus datos personales y académicos</li>
                        <li>Verifica tu correo electrónico siguiendo el enlace enviado</li>
                        <li>Completa tu perfil con información adicional</li>
                      </ol>
                    </CardContent>
                    <CardFooter>
                      <Link
                        href="/guides/teachers/account-setup"
                        className="text-sm text-blue-600 hover:underline flex items-center"
                      >
                        Ver guía detallada <ChevronRight className="h-4 w-4 ml-1" />
                      </Link>
                    </CardFooter>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Navegación por el dashboard</CardTitle>
                      <CardDescription>Conoce la interfaz principal para profesores</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <p>El dashboard de profesor te permite acceder a todas las funcionalidades:</p>
                        <ul className="space-y-2">
                          <li className="flex items-center">
                            <BookOpen className="h-5 w-5 mr-2 text-purple-600" />
                            <span>Gestión de clases y materiales</span>
                          </li>
                          <li className="flex items-center">
                            <Users className="h-5 w-5 mr-2 text-purple-600" />
                            <span>Administración de estudiantes</span>
                          </li>
                          <li className="flex items-center">
                            <FileText className="h-5 w-5 mr-2 text-purple-600" />
                            <span>Creación y evaluación de tareas</span>
                          </li>
                          <li className="flex items-center">
                            <Calendar className="h-5 w-5 mr-2 text-purple-600" />
                            <span>Calendario académico</span>
                          </li>
                          <li className="flex items-center">
                            <Bell className="h-5 w-5 mr-2 text-purple-600" />
                            <span>Centro de notificaciones</span>
                          </li>
                        </ul>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Link
                        href="/guides/teachers/dashboard-overview"
                        className="text-sm text-blue-600 hover:underline flex items-center"
                      >
                        Explorar el dashboard <ChevronRight className="h-4 w-4 ml-1" />
                      </Link>
                    </CardFooter>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Video tutorial: Primeros pasos para profesores</CardTitle>
                    <CardDescription>Una guía visual para comenzar a utilizar HABY-CLASS</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="aspect-video bg-muted rounded-md flex items-center justify-center">
                      <HelpCircle className="h-12 w-12 text-muted-foreground" />
                      <span className="ml-2 text-muted-foreground">Video tutorial</span>
                    </div>
                  </CardContent>
                </Card>

                <div className="grid gap-6 md:grid-cols-3">
                  <Card>
                    <CardHeader>
                      <CardTitle>Configuración de perfil</CardTitle>
                      <CardDescription>Personaliza tu información y preferencias</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p>
                        Aprende a configurar tu perfil de profesor, incluyendo información académica, foto de perfil,
                        preferencias de notificaciones y más.
                      </p>
                    </CardContent>
                    <CardFooter>
                      <Link
                        href="/guides/teachers/profile-setup"
                        className="text-sm text-blue-600 hover:underline flex items-center"
                      >
                        Ver guía <ChevronRight className="h-4 w-4 ml-1" />
                      </Link>
                    </CardFooter>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Configuración de cuenta</CardTitle>
                      <CardDescription>Gestiona tus datos de acceso y seguridad</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p>
                        Aprende a cambiar tu contraseña, configurar la autenticación de dos factores y gestionar los
                        permisos de tu cuenta.
                      </p>
                    </CardContent>
                    <CardFooter>
                      <Link
                        href="/guides/teachers/account-settings"
                        className="text-sm text-blue-600 hover:underline flex items-center"
                      >
                        Ver guía <ChevronRight className="h-4 w-4 ml-1" />
                      </Link>
                    </CardFooter>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Personalización</CardTitle>
                      <CardDescription>Adapta HABY-CLASS a tus preferencias</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p>
                        Aprende a personalizar la interfaz, cambiar el tema, ajustar el idioma y configurar otras
                        opciones de visualización.
                      </p>
                    </CardContent>
                    <CardFooter>
                      <Link
                        href="/guides/teachers/customization"
                        className="text-sm text-blue-600 hover:underline flex items-center"
                      >
                        Ver guía <ChevronRight className="h-4 w-4 ml-1" />
                      </Link>
                    </CardFooter>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="classes" className="mt-6 space-y-8">
                <div className="grid gap-6 md:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>Creación de clases</CardTitle>
                      <CardDescription>Cómo crear y configurar nuevas clases</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ol className="list-decimal pl-5 space-y-2">
                        <li>Accede a tu dashboard de profesor</li>
                        <li>Haz clic en el botón "Crear Clase"</li>
                        <li>Completa la información básica (nombre, sección, materia)</li>
                        <li>Configura las opciones avanzadas (plantillas, personalización)</li>
                        <li>Establece los permisos y configuración de acceso</li>
                        <li>Haz clic en "Crear" para finalizar</li>
                      </ol>
                    </CardContent>
                    <CardFooter>
                      <Link
                        href="/guides/teachers/create-class"
                        className="text-sm text-blue-600 hover:underline flex items-center"
                      >
                        Ver guía detallada <ChevronRight className="h-4 w-4 ml-1" />
                      </Link>
                    </CardFooter>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Gestión de estudiantes</CardTitle>
                      <CardDescription>Cómo añadir y administrar estudiantes en tus clases</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <p>Existen varias formas de añadir estudiantes a tus clases:</p>
                        <ul className="space-y-2">
                          <li className="flex items-start">
                            <div className="bg-purple-100 text-purple-800 rounded-full h-5 w-5 flex items-center justify-center text-xs font-bold mr-2 mt-0.5">
                              1
                            </div>
                            <span>Compartir el código de clase para que los estudiantes se unan</span>
                          </li>
                          <li className="flex items-start">
                            <div className="bg-purple-100 text-purple-800 rounded-full h-5 w-5 flex items-center justify-center text-xs font-bold mr-2 mt-0.5">
                              2
                            </div>
                            <span>Invitar estudiantes directamente por correo electrónico</span>
                          </li>
                          <li className="flex items-start">
                            <div className="bg-purple-100 text-purple-800 rounded-full h-5 w-5 flex items-center justify-center text-xs font-bold mr-2 mt-0.5">
                              3
                            </div>
                            <span>Importar una lista de estudiantes desde un archivo CSV</span>
                          </li>
                        </ul>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Link
                        href="/guides/teachers/manage-students"
                        className="text-sm text-blue-600 hover:underline flex items-center"
                      >
                        Ver guía detallada <ChevronRight className="h-4 w-4 ml-1" />
                      </Link>
                    </CardFooter>
                  </Card>
                </div>

                <div className="grid gap-6 md:grid-cols-3">
                  <Card>
                    <CardHeader>
                      <CardTitle>Organización de materiales</CardTitle>
                      <CardDescription>Cómo subir y organizar recursos educativos</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p>
                        Aprende a subir, organizar y compartir materiales educativos como documentos, presentaciones,
                        videos y enlaces con tus estudiantes.
                      </p>
                    </CardContent>
                    <CardFooter>
                      <Link
                        href="/guides/teachers/manage-materials"
                        className="text-sm text-blue-600 hover:underline flex items-center"
                      >
                        Ver guía <ChevronRight className="h-4 w-4 ml-1" />
                      </Link>
                    </CardFooter>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Temas y módulos</CardTitle>
                      <CardDescription>Organiza tu clase en secciones temáticas</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p>
                        Aprende a estructurar tu clase en temas o módulos para organizar mejor los materiales, tareas y
                        actividades por unidades temáticas.
                      </p>
                    </CardContent>
                    <CardFooter>
                      <Link
                        href="/guides/teachers/topics-modules"
                        className="text-sm text-blue-600 hover:underline flex items-center"
                      >
                        Ver guía <ChevronRight className="h-4 w-4 ml-1" />
                      </Link>
                    </CardFooter>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Configuración avanzada</CardTitle>
                      <CardDescription>Personaliza la experiencia de tu clase</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p>
                        Aprende a configurar opciones avanzadas como permisos, visibilidad, plantillas personalizadas y
                        más para tus clases.
                      </p>
                    </CardContent>
                    <CardFooter>
                      <Link
                        href="/guides/teachers/class-advanced-settings"
                        className="text-sm text-blue-600 hover:underline flex items-center"
                      >
                        Ver guía <ChevronRight className="h-4 w-4 ml-1" />
                      </Link>
                    </CardFooter>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="assignments" className="mt-6 space-y-8">
                <div className="grid gap-6 md:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>Creación de tareas</CardTitle>
                      <CardDescription>Cómo crear diferentes tipos de tareas</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <p>HABY-CLASS te permite crear diferentes tipos de tareas:</p>
                        <ul className="space-y-2">
                          <li className="flex items-start">
                            <div className="bg-purple-100 text-purple-800 rounded-full h-5 w-5 flex items-center justify-center text-xs font-bold mr-2 mt-0.5">
                              A
                            </div>
                            <span>Tareas con entrega de archivos</span>
                          </li>
                          <li className="flex items-start">
                            <div className="bg-purple-100 text-purple-800 rounded-full h-5 w-5 flex items-center justify-center text-xs font-bold mr-2 mt-0.5">
                              B
                            </div>
                            <span>Cuestionarios y exámenes</span>
                          </li>
                          <li className="flex items-start">
                            <div className="bg-purple-100 text-purple-800 rounded-full h-5 w-5 flex items-center justify-center text-xs font-bold mr-2 mt-0.5">
                              C
                            </div>
                            <span>Preguntas de discusión</span>
                          </li>
                          <li className="flex items-start">
                            <div className="bg-purple-100 text-purple-800 rounded-full h-5 w-5 flex items-center justify-center text-xs font-bold mr-2 mt-0.5">
                              D
                            </div>
                            <span>Proyectos colaborativos</span>
                          </li>
                        </ul>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Link
                        href="/guides/teachers/create-assignments"
                        className="text-sm text-blue-600 hover:underline flex items-center"
                      >
                        Ver guía detallada <ChevronRight className="h-4 w-4 ml-1" />
                      </Link>
                    </CardFooter>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Configuración de fechas y plazos</CardTitle>
                      <CardDescription>Gestión de fechas de publicación y entrega</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ol className="list-decimal pl-5 space-y-2">
                        <li>Establece la fecha de publicación (cuándo los estudiantes verán la tarea)</li>
                        <li>Configura la fecha límite de entrega</li>
                        <li>Establece políticas para entregas tardías</li>
                        <li>Configura recordatorios automáticos</li>
                        <li>Programa la publicación de calificaciones</li>
                      </ol>
                    </CardContent>
                    <CardFooter>
                      <Link
                        href="/guides/teachers/assignment-deadlines"
                        className="text-sm text-blue-600 hover:underline flex items-center"
                      >
                        Ver guía detallada <ChevronRight className="h-4 w-4 ml-1" />
                      </Link>
                    </CardFooter>
                  </Card>
                </div>

                <div className="grid gap-6 md:grid-cols-3">
                  <Card>
                    <CardHeader>
                      <CardTitle>Rúbricas de evaluación</CardTitle>
                      <CardDescription>Crea criterios claros para calificar</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p>
                        Aprende a crear rúbricas detalladas para evaluar el trabajo de tus estudiantes con criterios
                        claros y consistentes.
                      </p>
                    </CardContent>
                    <CardFooter>
                      <Link
                        href="/guides/teachers/rubrics"
                        className="text-sm text-blue-600 hover:underline flex items-center"
                      >
                        Ver guía <ChevronRight className="h-4 w-4 ml-1" />
                      </Link>
                    </CardFooter>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Plantillas de tareas</CardTitle>
                      <CardDescription>Reutiliza formatos para ahorrar tiempo</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p>
                        Aprende a crear y utilizar plantillas para diferentes tipos de tareas, ahorrando tiempo en la
                        creación de actividades similares.
                      </p>
                    </CardContent>
                    <CardFooter>
                      <Link
                        href="/guides/teachers/assignment-templates"
                        className="text-sm text-blue-600 hover:underline flex items-center"
                      >
                        Ver guía <ChevronRight className="h-4 w-4 ml-1" />
                      </Link>
                    </CardFooter>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Tareas grupales</CardTitle>
                      <CardDescription>Configura trabajos colaborativos</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p>
                        Aprende a crear y gestionar tareas grupales, incluyendo la formación de equipos, evaluación
                        individual y grupal.
                      </p>
                    </CardContent>
                    <CardFooter>
                      <Link
                        href="/guides/teachers/group-assignments"
                        className="text-sm text-blue-600 hover:underline flex items-center"
                      >
                        Ver guía <ChevronRight className="h-4 w-4 ml-1" />
                      </Link>
                    </CardFooter>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="grading" className="mt-6 space-y-8">
                <div className="grid gap-6 md:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>Calificación de tareas</CardTitle>
                      <CardDescription>Cómo evaluar el trabajo de los estudiantes</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ol className="list-decimal pl-5 space-y-2">
                        <li>Accede a la sección de tareas pendientes por calificar</li>
                        <li>Revisa las entregas de los estudiantes</li>
                        <li>Utiliza las rúbricas para evaluar objetivamente</li>
                        <li>Proporciona retroalimentación detallada</li>
                        <li>Asigna calificaciones numéricas o cualitativas</li>
                        <li>Publica las calificaciones para los estudiantes</li>
                      </ol>
                    </CardContent>
                    <CardFooter>
                      <Link
                        href="/guides/teachers/grading-assignments"
                        className="text-sm text-blue-600 hover:underline flex items-center"
                      >
                        Ver guía detallada <ChevronRight className="h-4 w-4 ml-1" />
                      </Link>
                    </CardFooter>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Libro de calificaciones</CardTitle>
                      <CardDescription>Gestión del registro de calificaciones</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <p>El libro de calificaciones te permite:</p>
                        <ul className="space-y-2">
                          <li className="flex items-start">
                            <div className="bg-purple-100 text-purple-800 rounded-full h-5 w-5 flex items-center justify-center text-xs font-bold mr-2 mt-0.5">
                              1
                            </div>
                            <span>Ver todas las calificaciones de la clase en un solo lugar</span>
                          </li>
                          <li className="flex items-start">
                            <div className="bg-purple-100 text-purple-800 rounded-full h-5 w-5 flex items-center justify-center text-xs font-bold mr-2 mt-0.5">
                              2
                            </div>
                            <span>Organizar tareas por categorías y ponderaciones</span>
                          </li>
                          <li className="flex items-start">
                            <div className="bg-purple-100 text-purple-800 rounded-full h-5 w-5 flex items-center justify-center text-xs font-bold mr-2 mt-0.5">
                              3
                            </div>
                            <span>Calcular promedios y calificaciones finales</span>
                          </li>
                          <li className="flex items-start">
                            <div className="bg-purple-100 text-purple-800 rounded-full h-5 w-5 flex items-center justify-center text-xs font-bold mr-2 mt-0.5">
                              4
                            </div>
                            <span>Exportar calificaciones en diferentes formatos</span>
                          </li>
                        </ul>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Link
                        href="/guides/teachers/gradebook"
                        className="text-sm text-blue-600 hover:underline flex items-center"
                      >
                        Ver guía detallada <ChevronRight className="h-4 w-4 ml-1" />
                      </Link>
                    </CardFooter>
                  </Card>
                </div>

                <div className="grid gap-6 md:grid-cols-3">
                  <Card>
                    <CardHeader>
                      <CardTitle>Estadísticas y análisis</CardTitle>
                      <CardDescription>Comprende el rendimiento de tu clase</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p>
                        Aprende a utilizar las herramientas de análisis para visualizar el rendimiento de tus
                        estudiantes, identificar tendencias y áreas de mejora.
                      </p>
                    </CardContent>
                    <CardFooter>
                      <Link
                        href="/guides/teachers/performance-analytics"
                        className="text-sm text-blue-600 hover:underline flex items-center"
                      >
                        Ver guía <ChevronRight className="h-4 w-4 ml-1" />
                      </Link>
                    </CardFooter>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Retroalimentación efectiva</CardTitle>
                      <CardDescription>Mejores prácticas para comentarios</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p>
                        Aprende técnicas para proporcionar retroalimentación constructiva y efectiva que ayude a tus
                        estudiantes a mejorar su desempeño.
                      </p>
                    </CardContent>
                    <CardFooter>
                      <Link
                        href="/guides/teachers/effective-feedback"
                        className="text-sm text-blue-600 hover:underline flex items-center"
                      >
                        Ver guía <ChevronRight className="h-4 w-4 ml-1" />
                      </Link>
                    </CardFooter>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Políticas de calificación</CardTitle>
                      <CardDescription>Establece reglas claras y justas</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p>
                        Aprende a configurar políticas de calificación transparentes, incluyendo escalas, ponderaciones
                        y manejo de casos especiales.
                      </p>
                    </CardContent>
                    <CardFooter>
                      <Link
                        href="/guides/teachers/grading-policies"
                        className="text-sm text-blue-600 hover:underline flex items-center"
                      >
                        Ver guía <ChevronRight className="h-4 w-4 ml-1" />
                      </Link>
                    </CardFooter>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="communication" className="mt-6 space-y-8">
                <div className="grid gap-6 md:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>Anuncios de clase</CardTitle>
                      <CardDescription>Comunica información importante</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ol className="list-decimal pl-5 space-y-2">
                        <li>Accede a la sección "Novedades" de tu clase</li>
                        <li>Haz clic en "Crear anuncio"</li>
                        <li>Redacta tu mensaje con formato enriquecido</li>
                        <li>Añade archivos adjuntos si es necesario</li>
                        <li>Configura opciones de notificación</li>
                        <li>Publica inmediatamente o programa para más tarde</li>
                      </ol>
                    </CardContent>
                    <CardFooter>
                      <Link
                        href="/guides/teachers/class-announcements"
                        className="text-sm text-blue-600 hover:underline flex items-center"
                      >
                        Ver guía detallada <ChevronRight className="h-4 w-4 ml-1" />
                      </Link>
                    </CardFooter>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Mensajería directa</CardTitle>
                      <CardDescription>Comunicación individual con estudiantes</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <p>La mensajería directa te permite:</p>
                        <ul className="space-y-2">
                          <li className="flex items-start">
                            <div className="bg-purple-100 text-purple-800 rounded-full h-5 w-5 flex items-center justify-center text-xs font-bold mr-2 mt-0.5">
                              1
                            </div>
                            <span>Comunicarte de forma privada con estudiantes individuales</span>
                          </li>
                          <li className="flex items-start">
                            <div className="bg-purple-100 text-purple-800 rounded-full h-5 w-5 flex items-center justify-center text-xs font-bold mr-2 mt-0.5">
                              2
                            </div>
                            <span>Enviar recordatorios personalizados</span>
                          </li>
                          <li className="flex items-start">
                            <div className="bg-purple-100 text-purple-800 rounded-full h-5 w-5 flex items-center justify-center text-xs font-bold mr-2 mt-0.5">
                              3
                            </div>
                            <span>Proporcionar retroalimentación confidencial</span>
                          </li>
                          <li className="flex items-start">
                            <div className="bg-purple-100 text-purple-800 rounded-full h-5 w-5 flex items-center justify-center text-xs font-bold mr-2 mt-0.5">
                              4
                            </div>
                            <span>Mantener un registro de todas las comunicaciones</span>
                          </li>
                        </ul>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Link
                        href="/guides/teachers/direct-messaging"
                        className="text-sm text-blue-600 hover:underline flex items-center"
                      >
                        Ver guía detallada <ChevronRight className="h-4 w-4 ml-1" />
                      </Link>
                    </CardFooter>
                  </Card>
                </div>

                <div className="grid gap-6 md:grid-cols-3">
                  <Card>
                    <CardHeader>
                      <CardTitle>Foros de discusión</CardTitle>
                      <CardDescription>Promueve la participación activa</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p>
                        Aprende a crear y moderar foros de discusión para fomentar la participación y el aprendizaje
                        colaborativo entre tus estudiantes.
                      </p>
                    </CardContent>
                    <CardFooter>
                      <Link
                        href="/guides/teachers/discussion-forums"
                        className="text-sm text-blue-600 hover:underline flex items-center"
                      >
                        Ver guía <ChevronRight className="h-4 w-4 ml-1" />
                      </Link>
                    </CardFooter>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Notificaciones</CardTitle>
                      <CardDescription>Gestiona alertas y recordatorios</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p>
                        Aprende a configurar y utilizar el sistema de notificaciones para mantener informados a tus
                        estudiantes sobre actividades importantes.
                      </p>
                    </CardContent>
                    <CardFooter>
                      <Link
                        href="/guides/teachers/notifications"
                        className="text-sm text-blue-600 hover:underline flex items-center"
                      >
                        Ver guía <ChevronRight className="h-4 w-4 ml-1" />
                      </Link>
                    </CardFooter>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Comunicación masiva</CardTitle>
                      <CardDescription>Mensajes para múltiples clases</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p>
                        Aprende a enviar comunicaciones a múltiples clases o grupos de estudiantes simultáneamente para
                        anuncios generales.
                      </p>
                    </CardContent>
                    <CardFooter>
                      <Link
                        href="/guides/teachers/mass-communication"
                        className="text-sm text-blue-600 hover:underline flex items-center"
                      >
                        Ver guía <ChevronRight className="h-4 w-4 ml-1" />
                      </Link>
                    </CardFooter>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
