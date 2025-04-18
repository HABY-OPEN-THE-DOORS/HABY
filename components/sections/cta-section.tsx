"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/providers/language-provider"
import { motion } from "framer-motion"
import { SocialLinks } from "@/components/social-links"

export function CTASection() {
  const { t, language } = useLanguage()

  const ctaTexts = {
    es: {
      title: "Comienza tu viaje educativo hoy",
      description:
        "Únete a miles de educadores y estudiantes que ya están transformando su experiencia de aprendizaje con HABY-CLASS.",
      registerButton: "Registrarse gratis",
      contactButton: "Contactar con ventas",
      socialText: "Síguenos en nuestras redes sociales",
    },
    en: {
      title: "Start your educational journey today",
      description:
        "Join thousands of educators and students who are already transforming their learning experience with HABY-CLASS.",
      registerButton: "Register for free",
      contactButton: "Contact sales",
      socialText: "Follow us on social media",
    },
  }

  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-primary text-primary-foreground">
      <div className="container px-4 md:px-6">
        <motion.div
          className="flex flex-col items-center justify-center space-y-4 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">{ctaTexts[language].title}</h2>
            <p className="max-w-[700px] md:text-xl/relaxed">{ctaTexts[language].description}</p>
          </div>
          <div className="flex flex-col gap-2 min-[400px]:flex-row pt-4">
            <Link href="/signup">
              <Button size="lg" variant="secondary" className="w-full">
                {ctaTexts[language].registerButton}
              </Button>
            </Link>
            <Link href="/contact">
              <Button
                size="lg"
                variant="outline"
                className="w-full border-primary-foreground/20 hover:bg-primary-foreground/10"
              >
                {ctaTexts[language].contactButton}
              </Button>
            </Link>
          </div>

          <div className="mt-8 space-y-4">
            <p className="text-primary-foreground/80">{ctaTexts[language].socialText}</p>
            <SocialLinks variant="outline" className="justify-center" size="default" />
          </div>
        </motion.div>
      </div>
    </section>
  )
}
