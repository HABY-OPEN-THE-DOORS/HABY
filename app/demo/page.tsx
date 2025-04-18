import Link from "next/link"
import { Button } from "@/components/ui/button"
import { MainNav } from "@/components/main-nav"
import { SiteFooter } from "@/components/site-footer"
import { LanguageThemeSelector } from "@/components/language-theme-selector"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ClassCard } from "@/components/dashboard/class-card"

export default function DemoPage() {
  const demoClasses = [
    {
      id: "1",
      name: "Matemáticas 101",
      description: "Introducción a conceptos matemáticos básicos y técnicas de resolución de problemas.",
      section: "Sección A",
      color: "bg-class-blue",
    },
    {
      id: "2",
      name: "Física para Principiantes",
      description: "Fundamentos de física y sus aplicaciones en la vida cotidiana.",
      section: "Sección B",
      color: "bg-class-purple",
    },
    {
      id: "3",
      name: "Introducción a la Programación",
      description: "Aprende los fundamentos de programación usando Python y resuelve problemas del mundo real.",
      section: "Sección C",
      color: "bg-class-green",
    },
    {
      id: "4",
      name: "Historia del Arte",
      description: "Explora la evolución del arte a través de diferentes períodos y culturas.",
      section: "Sección A",
      color: "bg-class-amber",
    },
  ]

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
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">Demo de HABY-CLASS</h1>
              <p className="max-w-[700px] text-muted-foreground md:text-xl">
                Explora las características y funcionalidades de nuestra plataforma educativa
              </p>
            </div>

            <Tabs defaultValue="screenshots" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="screenshots">Características</TabsTrigger>
                <TabsTrigger value="video">Video Demo</TabsTrigger>
              </TabsList>
              <TabsContent value="screenshots" className="mt-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>Dashboard</CardTitle>
                      <CardDescription>Vista general de todas tus clases y tareas pendientes</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4">
                        {demoClasses.slice(0, 2).map((classItem) => (
                          <ClassCard
                            key={classItem.id}
                            classData={classItem}
                            studentCount={Math.floor(Math.random() * 30) + 10}
                          />
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Clases</CardTitle>
                      <CardDescription>
                        Gestiona tus clases con secciones para novedades, trabajo y personas
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="p-4 border rounded-md bg-muted/50">
                          <h3 className="font-medium mb-2">Novedades</h3>
                          <div className="space-y-2">
                            <div className="p-2 bg-background rounded border">Anuncio del profesor</div>
                            <div className="p-2 bg-background rounded border">Comentarios de estudiantes</div>
                          </div>
                        </div>
                        <div className="p-4 border rounded-md bg-muted/50">
                          <h3 className="font-medium mb-2">Trabajo de clase</h3>
                          <div className="space-y-2">
                            <div className="p-2 bg-background rounded border">Tarea 1: Ejercicios</div>
                            <div className="p-2 bg-background rounded border">Tarea 2: Proyecto</div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Tareas</CardTitle>
                      <CardDescription>Crea, asigna y califica tareas fácilmente</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="p-4 border rounded-md">
                          <div className="flex justify-between items-center mb-2">
                            <h3 className="font-medium">Ejercicios de álgebra</h3>
                            <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">100 pts</span>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">Fecha límite: 15 de abril, 2023</p>
                          <div className="flex justify-end">
                            <Button size="sm" variant="outline">
                              Ver detalles
                            </Button>
                          </div>
                        </div>
                        <div className="p-4 border rounded-md">
                          <div className="flex justify-between items-center mb-2">
                            <h3 className="font-medium">Cuestionario de ecuaciones</h3>
                            <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">50 pts</span>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">Fecha límite: 22 de abril, 2023</p>
                          <div className="flex justify-end">
                            <Button size="sm" variant="outline">
                              Ver detalles
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Calificaciones</CardTitle>
                      <CardDescription>Sistema completo de calificaciones y retroalimentación</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="border rounded-md overflow-hidden">
                        <div className="grid grid-cols-4 gap-2 p-3 bg-muted font-medium text-sm">
                          <div>Estudiante</div>
                          <div>Tarea 1</div>
                          <div>Tarea 2</div>
                          <div>Promedio</div>
                        </div>
                        <div className="divide-y">
                          <div className="grid grid-cols-4 gap-2 p-3 text-sm">
                            <div>Ana Martínez</div>
                            <div>95/100</div>
                            <div>48/50</div>
                            <div>95%</div>
                          </div>
                          <div className="grid grid-cols-4 gap-2 p-3 text-sm">
                            <div>Carlos Sánchez</div>
                            <div>87/100</div>
                            <div>45/50</div>
                            <div>90%</div>
                          </div>
                          <div className="grid grid-cols-4 gap-2 p-3 text-sm">
                            <div>María Rodríguez</div>
                            <div>92/100</div>
                            <div>47/50</div>
                            <div>93%</div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              <TabsContent value="video" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Video Tutorial</CardTitle>
                    <CardDescription>
                      Mira este video para conocer todas las funcionalidades de HABY-CLASS
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="aspect-video relative bg-muted rounded-md flex items-center justify-center">
                      <p className="text-muted-foreground">Video demo próximamente</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            <div className="mt-12 flex flex-col items-center justify-center space-y-4 text-center">
              <h2 className="text-2xl font-bold">¿Listo para comenzar?</h2>
              <p className="max-w-[600px] text-muted-foreground">
                Regístrate ahora y comienza a disfrutar de todas las ventajas de HABY-CLASS
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/signup">
                  <Button size="lg">Registrarse</Button>
                </Link>
                <Link href="/contact">
                  <Button variant="outline" size="lg">
                    Contactar para más información
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
