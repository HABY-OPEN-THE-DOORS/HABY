import Link from "next/link"
import { Button } from "@/components/ui/button"
import { MainNav } from "@/components/main-nav"
import { SiteFooter } from "@/components/site-footer"
import { LanguageThemeSelector } from "@/components/language-theme-selector"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Calendar, FileText, MessageSquare, Users, Award, CheckCircle } from "lucide-react"

export default function FeaturesPage() {
  const features = [
    {
      icon: <FileText className="h-10 w-10 text-primary" />,
      title: "Tareas y Calificaciones",
      description:
        "Crea, distribuye y califica tareas con facilidad. Proporciona retroalimentación y realiza un seguimiento del progreso de los estudiantes.",
    },
    {
      icon: <MessageSquare className="h-10 w-10 text-primary" />,
      title: "Comunicación",
      description:
        "Publica anuncios, participa en discusiones y proporciona retroalimentación en tiempo real a los estudiantes.",
    },
    {
      icon: <BookOpen className="h-10 w-10 text-primary" />,
      title: "Materiales del Curso",
      description: "Organiza y comparte materiales del curso, recursos y enlaces en un solo lugar centralizado.",
    },
    {
      icon: <Users className="h-10 w-10 text-primary" />,
      title: "Gestión de Clases",
      description: "Añade estudiantes fácilmente, crea secciones de clase y gestiona permisos y accesos.",
    },
    {
      icon: <Calendar className="h-10 w-10 text-primary" />,
      title: "Integración con Calendario",
      description:
        "Mantén un seguimiento de las fechas de entrega, horarios de clase y eventos importantes con la integración del calendario.",
    },
    {
      icon: <Award className="h-10 w-10 text-primary" />,
      title: "Análisis e Información",
      description:
        "Realiza un seguimiento del rendimiento de los estudiantes, identifica tendencias y obtén información para mejorar las estrategias de enseñanza.",
    },
  ]

  const additionalFeatures = [
    {
      icon: <CheckCircle className="h-5 w-5 text-primary" />,
      title: "Interfaz Intuitiva",
      description: "Diseñada para ser fácil de usar tanto para profesores como para estudiantes.",
    },
    {
      icon: <CheckCircle className="h-5 w-5 text-primary" />,
      title: "Acceso Móvil",
      description: "Accede a tu clase desde cualquier dispositivo, en cualquier momento.",
    },
    {
      icon: <CheckCircle className="h-5 w-5 text-primary" />,
      title: "Seguridad Avanzada",
      description: "Protección de datos y privacidad para todos los usuarios.",
    },
    {
      icon: <CheckCircle className="h-5 w-5 text-primary" />,
      title: "Personalización",
      description: "Adapta la plataforma a tus necesidades específicas.",
    },
    {
      icon: <CheckCircle className="h-5 w-5 text-primary" />,
      title: "Soporte Multilingüe",
      description: "Disponible en varios idiomas para una audiencia global.",
    },
    {
      icon: <CheckCircle className="h-5 w-5 text-primary" />,
      title: "Actualizaciones Regulares",
      description: "Mejoras continuas basadas en la retroalimentación de los usuarios.",
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
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  Características que Potencian la Educación
                </h1>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Todo lo que necesitas para gestionar tu aula de forma eficiente y efectiva
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
              {features.map((feature, index) => (
                <Card key={index} className="flex flex-col items-center text-center">
                  <CardHeader>
                    <div className="rounded-full bg-primary/10 p-3 mb-4">{feature.icon}</div>
                    <CardTitle>{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">{feature.description}</CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tighter">Más Características</h2>
              <p className="max-w-[600px] text-muted-foreground">
                Descubre todas las herramientas que HABY-CLASS ofrece para mejorar la experiencia educativa
              </p>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {additionalFeatures.map((feature, index) => (
                <div key={index} className="flex items-start space-x-4">
                  {feature.icon}
                  <div>
                    <h3 className="font-medium">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-12 flex justify-center">
              <Link href="/signup">
                <Button size="lg">Comenzar Ahora</Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
