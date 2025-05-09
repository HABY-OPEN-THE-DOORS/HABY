import Link from "next/link"
import { ChevronRight, BookOpen, FileText, Calendar, Bell, MessageSquare, HelpCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MainNav } from "@/components/main-nav"
import { SiteFooter } from "@/components/site-footer"

export default function StudentsGuidePage() {
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
              <h1 className="text-3xl font-bold tracking-tight">Guía para Estudiantes</h1>
              <p className="text-lg text-muted-foreground">
                Aprende a utilizar todas las funcionalidades de HABY-CLASS como estudiante
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
                <TabsTrigger value="classes">Unirse a clases</TabsTrigger>
                <TabsTrigger value="assignments">Tareas</TabsTrigger>
                <TabsTrigger value="grades">Calificaciones</TabsTrigger>
                <TabsTrigger value="communication">Comunicación</TabsTrigger>
              </TabsList>

              <TabsContent value="getting-started" className="mt-6 space-y-8">
                <div className="grid gap-6 md:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>Creación de cuenta</CardTitle>
                      <CardDescription>Cómo registrarte como estudiante en HABY-CLASS</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ol className="list-decimal pl-5 space-y-2">
                        <li>Visita la página principal de HABY-CLASS</li>
                        <li>Haz clic en el botón "Registrarse" en la esquina superior derecha</li>
                        <li>Selecciona "Estudiante" como tu rol</li>
                        <li>Completa el formulario con tus datos personales</li>
                        <li>Verifica tu correo electrónico siguiendo el enlace enviado</li>
                        <li>Completa tu perfil con información adicional</li>
                      </ol>
                    </CardContent>
                    <CardFooter>
                      <Link
                        href="/guides/students/account-setup"
                        className="text-sm text-blue-600 hover:underline flex items-center"
                      >
                        Ver guía detallada <ChevronRight className="h-4 w-4 ml-1" />
                      </Link>
                    </CardFooter>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Navegación por el dashboard</CardTitle>
                      <CardDescription>Conoce la interfaz principal para estudiantes</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <p>El dashboard de estudiante te permite acceder a todas las funcionalidades:</p>
                        <ul className="space-y-2">
                          <li className="flex items-center">
                            <BookOpen className="h-5 w-5 mr-2 text-purple-600" />
                            <span>Tus clases y materiales</span>
                          </li>
                          <li className="flex items-center">
                            <FileText className="h-5 w-5 mr-2 text-purple-600" />
                            <span>Tareas pendientes y completadas</span>
                          </li>
                          <li className="flex items-center">
                            <Calendar className="h-5 w-5 mr-2 text-purple-600" />
                            <span>Calendario con fechas importantes</span>
                          </li>
                          <li className="flex items-center">
                            <Bell className="h-5 w-5 mr-2 text-purple-600" />
                            <span>Notificaciones y anuncios</span>
                          </li>
                          <li className="flex items-center">
                            <MessageSquare className="h-5 w-5 mr-2 text-purple-600" />
                            <span>Mensajes y comunicaciones</span>
                          </li>
                        </ul>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Link
                        href="/guides/students/dashboard-overview"
                        className="text-sm text-blue-600 hover:underline flex items-center"
                      >
                        Explorar el dashboard <ChevronRight className="h-4 w-4 ml-1" />
                      </Link>
                    </CardFooter>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Video tutorial: Primeros pasos para estudiantes</CardTitle>
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
                        Aprende a configurar tu perfil de estudiante, incluyendo foto de perfil, información personal,
                        preferencias de notificaciones y más.
                      </p>
                    </CardContent>
                    <CardFooter>
                      <Link
                        href="/guides/students/profile-setup"
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
                        href="/guides/students/account-settings"
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
                        href="/guides/students/customization"
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
                      <CardTitle>Unirse a una clase</CardTitle>
                      <CardDescription>Cómo inscribirte en clases con código de invitación</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ol className="list-decimal pl-5 space-y-2">
                        <li>Accede a tu dashboard de estudiante</li>
                        <li>Haz clic en el botón "Unirse a clase"</li>
                        <li>Ingresa el código de clase proporcionado por tu profesor</li>
                        <li>Confirma tu inscripción</li>
                        <li>La clase aparecerá en tu lista de clases</li>
                      </ol>
                    </CardContent>
                    <CardFooter>
                      <Link
                        href="/guides/students/join-class"
                        className="text-sm text-blue-600 hover:underline flex items-center"
                      >
                        Ver guía detallada <ChevronRight className="h-4 w-4 ml-1" />
                      </Link>
                    </CardFooter>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Navegación por clases</CardTitle>
                      <CardDescription>Cómo acceder y utilizar los recursos de tus clases</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <p>Dentro de cada clase, encontrarás diferentes secciones:</p>
                        <ul className="space-y-2">
                          <li className="flex items-start">
                            <div className="bg-purple-100 text-purple-800 rounded-full h-5 w-5 flex items-center justify-center text-xs font-bold mr-2 mt-0.5">
                              1
                            </div>
                            <span>Novedades: anuncios y actualizaciones recientes</span>
                          </li>
                          <li className="flex items-start">
                            <div className="bg-purple-100 text-purple-800 rounded-full h-5 w-5 flex items-center justify-center text-xs font-bold mr-2 mt-0.5">
                              2
                            </div>
                            <span>Trabajo de clase: tareas, exámenes y actividades</span>
                          </li>
                          <li className="flex items-start">
                            <div className="bg-purple-100 text-purple-800 rounded-full h-5 w-5 flex items-center justify-center text-xs font-bold mr-2 mt-0.5">
                              3
                            </div>
                            <span>Personas: compañeros y profesores</span>
                          </li>
                          <li className="flex items-start">
                            <div className="bg-purple-100 text-purple-800 rounded-full h-5 w-5 flex items-center justify-center text-xs font-bold mr-2 mt-0.5">
                              4
                            </div>
                            <span>Calificaciones: tus evaluaciones y retroalimentación</span>
                          </li>
                        </ul>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Link
                        href="/guides/students/class-navigation"
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
                      <CardTitle>Acceso a materiales</CardTitle>
                      <CardDescription>Cómo encontrar y utilizar recursos educativos</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p>
                        Aprende a acceder, descargar y utilizar los materiales educativos compartidos por tus
                        profesores, incluyendo documentos, presentaciones y videos.
                      </p>
                    </CardContent>
                    <CardFooter>
                      <Link
                        href="/guides/students/access-materials"
                        className="text-sm text-blue-600 hover:underline flex items-center"
                      >
                        Ver guía <ChevronRight className="h-4 w-4 ml-1" />
                      </Link>
                    </CardFooter>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Organización de clases</CardTitle>
                      <CardDescription>Mantén tus clases ordenadas</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p>
                        Aprende a organizar tus clases, marcar favoritos, archivar clases pasadas y personalizar la
                        visualización de tu dashboard.
                      </p>
                    </CardContent>
                    <CardFooter>
                      <Link
                        href="/guides/students/organize-classes"
                        className="text-sm text-blue-600 hover:underline flex items-center"
                      >
                        Ver guía <ChevronRight className="h-4 w-4 ml-1" />
                      </Link>
                    </CardFooter>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Abandonar una clase</CardTitle>
                      <CardDescription>Cómo salir de una clase correctamente</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p>
                        Aprende el procedimiento correcto para abandonar una clase cuando sea necesario, y qué sucede
                        con tus datos y calificaciones.
                      </p>
                    </CardContent>
                    <CardFooter>
                      <Link
                        href="/guides/students/leave-class"
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
                      <CardTitle>Visualización de tareas</CardTitle>
                      <CardDescription>Cómo encontrar y entender tus asignaciones</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <p>Puedes ver tus tareas de diferentes maneras:</p>
                        <ul className="space-y-2">
                          <li className="flex items-start">
                            <div className="bg-purple-100 text-purple-800 rounded-full h-5 w-5 flex items-center justify-center text-xs font-bold mr-2 mt-0.5">
                              A
                            </div>
                            <span>En el dashboard: resumen de tareas pendientes</span>
                          </li>
                          <li className="flex items-start">
                            <div className="bg-purple-100 text-purple-800 rounded-full h-5 w-5 flex items-center justify-center text-xs font-bold mr-2 mt-0.5">
                              B
                            </div>
                            <span>En cada clase: sección "Trabajo de clase"</span>
                          </li>
                          <li className="flex items-start">
                            <div className="bg-purple-100 text-purple-800 rounded-full h-5 w-5 flex items-center justify-center text-xs font-bold mr-2 mt-0.5">
                              C
                            </div>
                            <span>En el calendario: organizado por fechas de entrega</span>
                          </li>
                          <li className="flex items-start">
                            <div className="bg-purple-100 text-purple-800 rounded-full h-5 w-5 flex items-center justify-center text-xs font-bold mr-2 mt-0.5">
                              D
                            </div>
                            <span>En la sección "Pendientes": filtrado por estado</span>
                          </li>
                        </ul>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Link
                        href="/guides/students/view-assignments"
                        className="text-sm text-blue-600 hover:underline flex items-center"
                      >
                        Ver guía detallada <ChevronRight className="h-4 w-4 ml-1" />
                      </Link>
                    </CardFooter>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Entrega de tareas</CardTitle>
                      <CardDescription>Cómo completar y enviar tus trabajos</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ol className="list-decimal pl-5 space-y-2">
                        <li>Accede a la tarea desde tu clase o dashboard</li>
                        <li>Lee cuidadosamente las instrucciones y criterios</li>
                        <li>Prepara tu trabajo según los requisitos</li>
                        <li>Sube archivos o completa la actividad en línea</li>
                        <li>Revisa tu trabajo antes de enviarlo</li>
                        <li>Haz clic en "Entregar" para finalizar</li>
                        <li>Verifica la confirmación de entrega</li>
                      </ol>
                    </CardContent>
                    <CardFooter>
                      <Link
                        href="/guides/students/submit-assignments"
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
                      <CardTitle>Trabajos grupales</CardTitle>
                      <CardDescription>Cómo colaborar en tareas de equipo</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p>
                        Aprende a participar en trabajos grupales, colaborar con compañeros y gestionar las
                        responsabilidades compartidas en proyectos de equipo.
                      </p>
                    </CardContent>
                    <CardFooter>
                      <Link
                        href="/guides/students/group-assignments"
                        className="text-sm text-blue-600 hover:underline flex items-center"
                      >
                        Ver guía <ChevronRight className="h-4 w-4 ml-1" />
                      </Link>
                    </CardFooter>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Cuestionarios y exámenes</CardTitle>
                      <CardDescription>Cómo realizar evaluaciones en línea</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p>
                        Aprende a acceder y completar cuestionarios, exámenes y otras evaluaciones en línea, incluyendo
                        consejos para gestionar el tiempo.
                      </p>
                    </CardContent>
                    <CardFooter>
                      <Link
                        href="/guides/students/quizzes-exams"
                        className="text-sm text-blue-600 hover:underline flex items-center"
                      >
                        Ver guía <ChevronRight className="h-4 w-4 ml-1" />
                      </Link>
                    </CardFooter>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Gestión del tiempo</CardTitle>
                      <CardDescription>Organiza tus entregas eficientemente</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p>
                        Aprende estrategias para gestionar tu tiempo, establecer recordatorios y planificar tus entregas
                        para cumplir con todas las fechas límite.
                      </p>
                    </CardContent>
                    <CardFooter>
                      <Link
                        href="/guides/students/time-management"
                        className="text-sm text-blue-600 hover:underline flex items-center"
                      >
                        Ver guía <ChevronRight className="h-4 w-4 ml-1" />
                      </Link>
                    </CardFooter>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="grades" className="mt-6 space-y-8">
                <div className="grid gap-6 md:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>Visualización de calificaciones</CardTitle>
                      <CardDescription>Cómo acceder y entender tus evaluaciones</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ol className="list-decimal pl-5 space-y-2">
                        <li>Accede a la sección "Calificaciones" dentro de tu clase</li>
                        <li>Visualiza el resumen general de todas tus calificaciones</li>
                        <li>Revisa calificaciones individuales por tarea</li>
                        <li>Lee la retroalimentación proporcionada por tu profesor</li>
                        <li>Identifica áreas de mejora y fortalezas</li>
                        <li>Consulta tu promedio general y por categorías</li>
                      </ol>
                    </CardContent>
                    <CardFooter>
                      <Link
                        href="/guides/students/view-grades"
                        className="text-sm text-blue-600 hover:underline flex items-center"
                      >
                        Ver guía detallada <ChevronRight className="h-4 w-4 ml-1" />
                      </Link>
                    </CardFooter>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Retroalimentación</CardTitle>
                      <CardDescription>Cómo aprovechar los comentarios de tus profesores</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <p>La retroalimentación es esencial para tu aprendizaje:</p>
                        <ul className="space-y-2">
                          <li className="flex items-start">
                            <div className="bg-purple-100 text-purple-800 rounded-full h-5 w-5 flex items-center justify-center text-xs font-bold mr-2 mt-0.5">
                              1
                            </div>
                            <span>Lee cuidadosamente todos los comentarios</span>
                          </li>
                          <li className="flex items-start">
                            <div className="bg-purple-100 text-purple-800 rounded-full h-5 w-5 flex items-center justify-center text-xs font-bold mr-2 mt-0.5">
                              2
                            </div>
                            <span>Identifica patrones en las correcciones</span>
                          </li>
                          <li className="flex items-start">
                            <div className="bg-purple-100 text-purple-800 rounded-full h-5 w-5 flex items-center justify-center text-xs font-bold mr-2 mt-0.5">
                              3
                            </div>
                            <span>Haz preguntas si algo no está claro</span>
                          </li>
                          <li className="flex items-start">
                            <div className="bg-purple-100 text-purple-800 rounded-full h-5 w-5 flex items-center justify-center text-xs font-bold mr-2 mt-0.5">
                              4
                            </div>
                            <span>Aplica las sugerencias en futuros trabajos</span>
                          </li>
                        </ul>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Link
                        href="/guides/students/feedback"
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
                      <CardTitle>Seguimiento de progreso</CardTitle>
                      <CardDescription>Monitorea tu desempeño académico</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p>
                        Aprende a utilizar las herramientas de seguimiento para monitorear tu progreso académico,
                        identificar tendencias y establecer metas de mejora.
                      </p>
                    </CardContent>
                    <CardFooter>
                      <Link
                        href="/guides/students/progress-tracking"
                        className="text-sm text-blue-600 hover:underline flex items-center"
                      >
                        Ver guía <ChevronRight className="h-4 w-4 ml-1" />
                      </Link>
                    </CardFooter>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Solicitud de revisión</CardTitle>
                      <CardDescription>Cómo pedir aclaraciones sobre calificaciones</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p>
                        Aprende el proceso adecuado para solicitar revisiones o aclaraciones sobre tus calificaciones
                        cuando tengas dudas o consideres que hay un error.
                      </p>
                    </CardContent>
                    <CardFooter>
                      <Link
                        href="/guides/students/grade-review"
                        className="text-sm text-blue-600 hover:underline flex items-center"
                      >
                        Ver guía <ChevronRight className="h-4 w-4 ml-1" />
                      </Link>
                    </CardFooter>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Exportación de calificaciones</CardTitle>
                      <CardDescription>Guarda un registro de tu desempeño</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p>
                        Aprende a exportar y guardar tus calificaciones en diferentes formatos para mantener un registro
                        personal de tu desempeño académico.
                      </p>
                    </CardContent>
                    <CardFooter>
                      <Link
                        href="/guides/students/export-grades"
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
                      <CardTitle>Comunicación con profesores</CardTitle>
                      <CardDescription>Cómo interactuar efectivamente con tus docentes</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ol className="list-decimal pl-5 space-y-2">
                        <li>Utiliza un lenguaje formal y respetuoso</li>
                        <li>Sé claro y específico en tus consultas</li>
                        <li>Usa el canal de comunicación apropiado (mensajes, comentarios)</li>
                        <li>Respeta los horarios de atención establecidos</li>
                        <li>Revisa si tu pregunta ya ha sido respondida antes</li>
                        <li>Agradece la ayuda recibida</li>
                      </ol>
                    </CardContent>
                    <CardFooter>
                      <Link
                        href="/guides/students/teacher-communication"
                        className="text-sm text-blue-600 hover:underline flex items-center"
                      >
                        Ver guía detallada <ChevronRight className="h-4 w-4 ml-1" />
                      </Link>
                    </CardFooter>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Participación en discusiones</CardTitle>
                      <CardDescription>Cómo contribuir en foros y debates</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <p>Para participar efectivamente en discusiones:</p>
                        <ul className="space-y-2">
                          <li className="flex items-start">
                            <div className="bg-purple-100 text-purple-800 rounded-full h-5 w-5 flex items-center justify-center text-xs font-bold mr-2 mt-0.5">
                              1
                            </div>
                            <span>Lee cuidadosamente el tema y las contribuciones previas</span>
                          </li>
                          <li className="flex items-start">
                            <div className="bg-purple-100 text-purple-800 rounded-full h-5 w-5 flex items-center justify-center text-xs font-bold mr-2 mt-0.5">
                              2
                            </div>
                            <span>Aporta ideas originales o complementarias</span>
                          </li>
                          <li className="flex items-start">
                            <div className="bg-purple-100 text-purple-800 rounded-full h-5 w-5 flex items-center justify-center text-xs font-bold mr-2 mt-0.5">
                              3
                            </div>
                            <span>Fundamenta tus opiniones con argumentos o fuentes</span>
                          </li>
                          <li className="flex items-start">
                            <div className="bg-purple-100 text-purple-800 rounded-full h-5 w-5 flex items-center justify-center text-xs font-bold mr-2 mt-0.5">
                              4
                            </div>
                            <span>Respeta las opiniones diferentes a la tuya</span>
                          </li>
                        </ul>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Link
                        href="/guides/students/discussion-participation"
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
                      <CardTitle>Colaboración entre compañeros</CardTitle>
                      <CardDescription>Cómo trabajar efectivamente en equipo</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p>
                        Aprende estrategias para colaborar efectivamente con tus compañeros en proyectos grupales,
                        discusiones y actividades colaborativas.
                      </p>
                    </CardContent>
                    <CardFooter>
                      <Link
                        href="/guides/students/peer-collaboration"
                        className="text-sm text-blue-600 hover:underline flex items-center"
                      >
                        Ver guía <ChevronRight className="h-4 w-4 ml-1" />
                      </Link>
                    </CardFooter>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Notificaciones</CardTitle>
                      <CardDescription>Mantente informado de todas las actividades</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p>
                        Aprende a configurar y gestionar tus notificaciones para estar al tanto de anuncios, nuevas
                        tareas, calificaciones y mensajes importantes.
                      </p>
                    </CardContent>
                    <CardFooter>
                      <Link
                        href="/guides/students/notifications"
                        className="text-sm text-blue-600 hover:underline flex items-center"
                      >
                        Ver guía <ChevronRight className="h-4 w-4 ml-1" />
                      </Link>
                    </CardFooter>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Etiqueta en línea</CardTitle>
                      <CardDescription>Normas de comportamiento digital</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p>
                        Aprende las normas de comportamiento adecuado en entornos educativos digitales, incluyendo
                        comunicación respetuosa y uso responsable de la plataforma.
                      </p>
                    </CardContent>
                    <CardFooter>
                      <Link
                        href="/guides/students/online-etiquette"
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
