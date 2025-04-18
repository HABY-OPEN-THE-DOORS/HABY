import Link from "next/link"
import { Button } from "@/components/ui/button"
import { MainNav } from "@/components/main-nav"
import { SiteFooter } from "@/components/site-footer"
import { LanguageThemeSelector } from "@/components/language-theme-selector"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, MapPin, Phone } from "lucide-react"
import { SocialLinks } from "@/components/social-links"

export default function ContactPage() {
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
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">Contacto</h1>
              <p className="max-w-[700px] text-muted-foreground md:text-xl">
                Estamos aquí para ayudarte. Ponte en contacto con nosotros si tienes alguna pregunta o comentario.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              <div>
                <form className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nombre</Label>
                    <Input id="name" placeholder="Tu nombre" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Correo electrónico</Label>
                    <Input id="email" type="email" placeholder="tu@ejemplo.com" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subject">Asunto</Label>
                    <Input id="subject" placeholder="Asunto de tu mensaje" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message">Mensaje</Label>
                    <Textarea id="message" placeholder="Tu mensaje" className="min-h-[150px]" />
                  </div>
                  <Button type="submit" className="w-full">
                    Enviar mensaje
                  </Button>
                </form>
              </div>

              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Información de contacto</CardTitle>
                    <CardDescription>Otras formas de ponerte en contacto con nosotros</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-start space-x-4">
                      <Mail className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <h3 className="font-medium">Correo electrónico</h3>
                        <p className="text-sm text-muted-foreground">habyopenthedoors@gmail.com</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-4">
                      <Phone className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <h3 className="font-medium">Teléfono</h3>
                        <p className="text-sm text-muted-foreground">+52 220 437 2038</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-4">
                      <MapPin className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <h3 className="font-medium">Dirección</h3>
                        <p className="text-sm text-muted-foreground">
                          Av. Universidad 3000, CU, Coyoacán, 04510 Ciudad de México, CDMX
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Nueva tarjeta para redes sociales */}
                <Card>
                  <CardHeader>
                    <CardTitle>Redes Sociales</CardTitle>
                    <CardDescription>Síguenos en nuestras redes sociales</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col space-y-4">
                      <SocialLinks showLabels={true} variant="outline" className="flex-col items-start" />
                    </div>
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
