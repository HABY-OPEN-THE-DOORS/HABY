"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Logo } from "@/components/logo"
import { useState, useEffect } from "react"
import { useLanguage } from "@/providers/language-provider"
import { AnimatedElement } from "@/components/ui/animated-element"

/**
 * Traducciones predeterminadas para cuando el proveedor de idioma no está disponible
 */
const defaultTranslations: Record<string, string> = {
  "home.hero.title": "Simplifica la Enseñanza, Mejora el Aprendizaje",
  "home.hero.description":
    "HABY-CLASS es una plataforma de aprendizaje moderna que facilita la creación, compartición y calificación de tareas, la comunicación con los estudiantes y la organización de tu contenido educativo.",
  "home.hero.button.start": "Comenzar",
  "home.hero.button.demo": "Ver Demo",
  "home.hero.platform": "Plataforma Educativa Moderna",
  "home.hero.tagline": "Diseñada para simplificar la gestión del aula y mejorar la experiencia de aprendizaje",
}

/**
 * Componente HeroSection
 * Sección principal de la página de inicio que presenta la plataforma
 */
export function HeroSection() {
  const [translations, setTranslations] = useState<Record<string, string>>(defaultTranslations)
  const { t, ready } = useLanguage()

  // Actualizar traducciones cuando el proveedor de idioma esté listo
  useEffect(() => {
    if (ready) {
      // Actualizar las traducciones con las del proveedor
      const updatedTranslations = { ...defaultTranslations }
      Object.keys(defaultTranslations).forEach((key) => {
        updatedTranslations[key] = t(key)
      })

      setTranslations(updatedTranslations)
    }
  }, [t, ready])

  // Función de traducción local
  const translate = (key: string) => translations[key] || key

  return (
    <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gradient-to-b from-background to-background/80">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
          <AnimatedElement type="slideRight" duration={0.7} className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                {translate("home.hero.title")}
              </h1>
              <p className="max-w-[600px] text-muted-foreground md:text-xl">{translate("home.hero.description")}</p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row pt-4">
              <Link href="/signup">
                <Button size="lg" className="w-full">
                  {translate("home.hero.button.start")}
                </Button>
              </Link>
              <Link href="/demo">
                <Button size="lg" variant="outline" className="w-full">
                  {translate("home.hero.button.demo")}
                </Button>
              </Link>
            </div>
          </AnimatedElement>

          <AnimatedElement type="scale" duration={0.8} delay={0.2} className="flex items-center justify-center">
            <div className="relative flex flex-col items-center justify-center h-[350px] w-full md:h-[450px] lg:h-[500px]">
              <AnimatedElement type="fadeIn" duration={1} delay={0.5}>
                <Logo size="xl" showText={true} className="mb-8" />
              </AnimatedElement>
              <AnimatedElement type="slideUp" duration={0.7} delay={0.7}>
                <div className="w-full max-w-md p-6 rounded-lg bg-card/50 backdrop-blur-sm border shadow-lg">
                  <h2 className="text-2xl font-semibold text-center mb-4">{translate("home.hero.platform")}</h2>
                  <p className="text-center text-muted-foreground">{translate("home.hero.tagline")}</p>
                </div>
              </AnimatedElement>
            </div>
          </AnimatedElement>
        </div>
      </div>
    </section>
  )
}
