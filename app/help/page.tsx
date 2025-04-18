import Link from "next/link"
import { Button } from "@/components/ui/button"
import { MainNav } from "@/components/main-nav"
import { SiteFooter } from "@/components/site-footer"
import { LanguageThemeSelector } from "@/components/language-theme-selector"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function HelpPage() {
  const faqs = [
    {
      question: "¿Cómo puedo crear una cuenta?",
      answer:
        "Para crear una cuenta, haz clic en el botón 'Registrarse' en la esquina superior derecha de la página de inicio. Completa el formulario con tu información personal y sigue las instrucciones para verificar tu correo electrónico.",
    },
    {
      question: "¿Cómo puedo crear una clase?",
      answer:
        "Una vez que hayas iniciado sesión como profesor, ve a tu dashboard y haz clic en el botón 'Crear Clase'. Completa la información requerida como el nombre de la clase, sección y descripción.",
    },
    {
      question: "¿Cómo puedo unirme a una clase como estudiante?",
      answer:
        "Los estudiantes pueden unirse a una clase utilizando el código de clase proporcionado por el profesor. Ve a tu dashboard, haz clic en 'Unirse a una clase' e ingresa el código.",
    },
    {
      question: "¿Cómo puedo crear y asignar tareas?",
      answer:
        "Como profesor, ve a la página de tu clase y selecciona la pestaña 'Trabajo de clase'. Haz clic en 'Crear Tarea', completa los detalles y asígnala a tus estudiantes.",
    },
    {
      question: "¿Cómo puedo entregar una tarea?",
      answer:
        "Como estudiante, ve a la clase correspondiente, selecciona la pestaña 'Trabajo de clase', encuentra la tarea y haz clic en ella. Sube tu trabajo y haz clic en 'Entregar'.",
    },
    {
      question: "¿Puedo usar HABY-CLASS en mi dispositivo móvil?",
      answer:
        "Sí, HABY-CLASS es completamente responsivo y funciona en todos los dispositivos, incluyendo smartphones y tablets.",
    },
    {
      question: "¿Cómo puedo cambiar mi contraseña?",
      answer:
        "Ve a la configuración de tu cuenta, selecciona 'Seguridad' y haz clic en 'Cambiar contraseña'. Deberás ingresar tu contraseña actual y la nueva contraseña.",
    },
    {
      question: "¿HABY-CLASS es gratuito?",
      answer:
        "Sí, HABY-CLASS es un proyecto educativo sin fines de lucro y es completamente gratuito para todos los usuarios. Aceptamos donaciones para ayudar a mantener y mejorar la plataforma.",
    },
  ]

  const guides = [
    {
      title: "Guía para profesores",
      description: "Aprende a crear y gestionar tus clases, asignar tareas y calificar el trabajo de los estudiantes.",
      link: "/guides/teachers",
    },
    {
      title: "Guía para estudiantes",
      description: "Aprende a unirte a clases, entregar tareas y comunicarte con tus profesores y compañeros.",
      link: "/guides/students",
    },
    {
      title: "Guía de administración",
      description: "Aprende a gestionar usuarios, clases y configuraciones a nivel de institución.",
      link: "/guides/admin",
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
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">Centro de Ayuda</h1>
              <p className="max-w-[700px] text-muted-foreground md:text-xl">
                Encuentra respuestas a tus preguntas y aprende a sacar el máximo provecho de HABY-CLASS.
              </p>
            </div>

            <Tabs defaultValue="faq" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="faq">Preguntas Frecuentes</TabsTrigger>
                <TabsTrigger value="guides">Guías de Uso</TabsTrigger>
              </TabsList>
              <TabsContent value="faq" className="mt-6">
                <Accordion type="single" collapsible className="w-full">
                  {faqs.map((faq, index) => (
                    <AccordionItem key={index} value={`item-${index}`}>
                      <AccordionTrigger>{faq.question}</AccordionTrigger>
                      <AccordionContent>
                        <p className="text-muted-foreground">{faq.answer}</p>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </TabsContent>
              <TabsContent value="guides" className="mt-6">
                <div className="grid gap-6 md:grid-cols-3">
                  {guides.map((guide, index) => (
                    <Card key={index}>
                      <CardHeader>
                        <CardTitle>{guide.title}</CardTitle>
                        <CardDescription>{guide.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Link href={guide.link}>
                          <Button variant="outline" className="w-full">
                            Ver guía
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="mt-12 flex flex-col items-center justify-center space-y-4 text-center">
                  <h2 className="text-2xl font-bold">¿No encuentras lo que buscas?</h2>
                  <p className="max-w-[600px] text-muted-foreground">
                    Si no has encontrado respuesta a tu pregunta, no dudes en contactarnos directamente.
                  </p>
                  <Link href="/contact">
                    <Button>Contactar Soporte</Button>
                  </Link>
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
