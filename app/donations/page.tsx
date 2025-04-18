import Link from "next/link"
import { Button } from "@/components/ui/button"
import { MainNav } from "@/components/main-nav"
import { SiteFooter } from "@/components/site-footer"
import { LanguageThemeSelector } from "@/components/language-theme-selector"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Check } from "lucide-react"

export default function DonationsPage() {
  const donationTiers = [
    {
      name: "Básico",
      price: "5",
      description: "Apoya nuestro proyecto con una pequeña contribución",
      features: ["Agradecimiento en nuestra página web", "Acceso a actualizaciones por correo electrónico"],
      buttonText: "Donar $5",
      highlighted: false,
    },
    {
      name: "Colaborador",
      price: "20",
      description: "Ayúdanos a mejorar y expandir nuestras funcionalidades",
      features: [
        "Agradecimiento en nuestra página web",
        "Acceso a actualizaciones por correo electrónico",
        "Insignia de colaborador en tu perfil",
        "Acceso anticipado a nuevas funciones",
      ],
      buttonText: "Donar $20",
      highlighted: true,
    },
    {
      name: "Patrocinador",
      price: "50",
      description: "Conviértete en un patrocinador oficial del proyecto",
      features: [
        "Agradecimiento en nuestra página web",
        "Acceso a actualizaciones por correo electrónico",
        "Insignia de patrocinador en tu perfil",
        "Acceso anticipado a nuevas funciones",
        "Mención en nuestros créditos",
        "Soporte prioritario",
      ],
      buttonText: "Donar $50",
      highlighted: false,
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
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">Apoya Nuestro Proyecto</h1>
              <p className="max-w-[700px] text-muted-foreground md:text-xl">
                HABY-CLASS es un proyecto educativo sin fines de lucro. Tu donación nos ayuda a mantener y mejorar la
                plataforma para todos.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:gap-8">
              {donationTiers.map((tier, index) => (
                <Card key={index} className={`flex flex-col ${tier.highlighted ? "border-primary shadow-lg" : ""}`}>
                  <CardHeader>
                    <CardTitle>{tier.name}</CardTitle>
                    <CardDescription>{tier.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <div className="mb-4">
                      <span className="text-4xl font-bold">${tier.price}</span>
                      <span className="text-muted-foreground"> / donación</span>
                    </div>
                    <ul className="space-y-2">
                      {tier.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center">
                          <Check className="h-4 w-4 text-primary mr-2" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full" variant={tier.highlighted ? "default" : "outline"}>
                      {tier.buttonText}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>

            <div className="mt-16 flex flex-col items-center justify-center space-y-4 text-center">
              <h2 className="text-2xl font-bold">Otras Formas de Contribuir</h2>
              <p className="max-w-[600px] text-muted-foreground">
                Si no puedes hacer una donación monetaria, hay otras formas de apoyar nuestro proyecto:
              </p>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3 mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Comparte el Proyecto</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Ayúdanos a difundir HABY-CLASS compartiendo en redes sociales o recomendándolo a otros educadores.
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Contribuye con Código</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Si tienes habilidades de programación, puedes contribuir al desarrollo de nuevas funcionalidades o
                      mejoras.
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Envía Comentarios</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Tus comentarios y sugerencias nos ayudan a mejorar la plataforma para todos los usuarios.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
