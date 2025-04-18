import Link from "next/link"
import { Button } from "@/components/ui/button"
import { MainNav } from "@/components/main-nav"
import { FallbackNav } from "@/components/fallback-nav"
import { ThemeSwitcher } from "@/components/theme-switcher"
import { LanguageSwitcher } from "@/components/language-switcher"
import { HeroSection } from "@/components/sections/hero-section"
import { FeatureSection } from "@/components/sections/feature-section"
import { TestimonialSection } from "@/components/sections/testimonial-section"
import { CTASection } from "@/components/sections/cta-section"
import { SiteFooter } from "@/components/site-footer"
import { ClientOnly } from "@/components/client-only"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
          <ClientOnly fallback={<FallbackNav />}>
            <MainNav />
          </ClientOnly>
          <div className="ml-auto flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <ThemeSwitcher />
              <LanguageSwitcher />
            </div>
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
        <HeroSection />
        <FeatureSection />
        <TestimonialSection />
        <CTASection />
      </main>
      <SiteFooter />
    </div>
  )
}
