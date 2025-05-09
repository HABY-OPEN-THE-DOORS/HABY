"use client"

import Link from "next/link"
import { Logo } from "@/components/logo"
import { useState, useEffect, useCallback } from "react"
import { SocialLinks } from "@/components/social-links"
import { useLanguage } from "@/providers/language-provider"
import { CopyrightNotice } from "@/components/copyright-notice"

// Traducciones predeterminadas para cuando el proveedor de idioma no está disponible
const defaultTranslations: Record<string, string> = {
  "footer.quick_links": "Enlaces rápidos",
  "footer.legal": "Legal",
  "footer.support": "Soporte",
  "nav.home": "Inicio",
  "nav.calendar": "Calendario",
  "nav.about": "Acerca de",
  "nav.privacy": "Privacidad",
  "nav.terms": "Términos",
  "nav.contact": "Contacto",
  "nav.help": "Ayuda",
  "footer.rights": "Todos los derechos reservados.",
  "footer.follow_us": "Síguenos en redes sociales",
}

/**
 * Componente SiteFooter - Pie de página del sitio
 * Muestra enlaces de navegación, información legal y de soporte
 * @returns Componente React con el pie de página
 */
export function SiteFooter() {
  const [translations, setTranslations] = useState<Record<string, string>>(defaultTranslations)
  const { t: providerT, languageReady } = useLanguage()

  useEffect(() => {
    if (languageReady) {
      // Actualizar las traducciones con las del proveedor
      const updatedTranslations = { ...defaultTranslations }
      Object.keys(defaultTranslations).forEach((key) => {
        updatedTranslations[key] = providerT(key)
      })

      setTranslations(updatedTranslations)
    }
  }, [providerT, languageReady])

  // Función de traducción local
  const t = useCallback((key: string) => translations[key] || key, [translations])

  const footerSections = [
    {
      titleKey: "footer.quick_links",
      links: [
        { href: "/", label: t("nav.home") },
        { href: "/calendar", label: t("nav.calendar") },
      ],
    },
    {
      titleKey: "footer.legal",
      links: [
        { href: "/about", label: t("nav.about") },
        { href: "/privacy", label: t("nav.privacy") },
        { href: "/terms", label: t("nav.terms") },
      ],
    },
    {
      titleKey: "footer.support",
      links: [
        { href: "/contact", label: t("nav.contact") },
        { href: "/help", label: t("nav.help") },
      ],
    },
  ]

  return (
    <footer className="w-full border-t py-6 md:py-0">
      <div className="container flex flex-col md:flex-row justify-between py-10">
        <div className="mb-6 md:mb-0">
          <div className="flex items-center mb-4">
            <Logo size="md" showText={true} showFullName={true} />
          </div>
          <p className="text-sm text-muted-foreground max-w-xs mt-2">
            HABY-CLASS, plataforma educativa fundada por Heber Zadkiel Garcia Perez.
          </p>

          {/* Redes sociales */}
          <div className="mt-4">
            <h3 className="text-sm font-medium mb-2">{t("footer.follow_us")}</h3>
            <SocialLinks />
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
          {footerSections.map((section, sectionIndex) => (
            <div key={sectionIndex} className="space-y-4">
              <h3 className="text-sm font-medium">{t(section.titleKey)}</h3>
              <ul className="space-y-2 text-sm">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <Link href={link.href} className="text-muted-foreground hover:text-foreground">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div className="container border-t py-6 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} HABY-CLASS. {t("footer.rights")}
      </div>
      {/* Asegúrate de incluir el componente CopyrightNotice al final del footer */}
      <CopyrightNotice />
    </footer>
  )
}
