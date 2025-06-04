"use client"

import { usePremiumTheme } from "@/hooks/use-premium-theme"
import { premiumThemes } from "@/lib/premium-themes"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Sparkles, Palette, Eye, Heart } from "lucide-react"
import { motion } from "framer-motion"

export function PremiumPaletteShowcase() {
  const { premiumTheme, setPremiumTheme } = usePremiumTheme()

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center space-y-4"
      >
        <div className="flex items-center justify-center gap-2 mb-4">
          <Sparkles className="h-8 w-8 text-gradient-premium" />
          <h2 className="text-4xl font-bold text-gradient-premium">Paletas Premium HABY-CLASS</h2>
          <Sparkles className="h-8 w-8 text-gradient-premium" />
        </div>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Descubre nuestra colección de paletas de colores cuidadosamente diseñadas para crear experiencias visuales
          excepcionales y profesionales.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {premiumThemes.map((theme, index) => (
          <motion.div
            key={theme.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
          >
            <Card
              className={`card-premium cursor-pointer transition-all duration-300 ${
                premiumTheme.id === theme.id ? "ring-2 ring-primary shadow-glow-strong" : ""
              }`}
              onClick={() => setPremiumTheme(theme.id)}
            >
              <CardHeader className="space-y-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl font-bold flex items-center gap-2">
                    <Palette className="h-5 w-5" />
                    {theme.name}
                  </CardTitle>
                  {premiumTheme.id === theme.id && (
                    <Badge className="badge-premium">
                      <Heart className="h-3 w-3 mr-1" />
                      Activo
                    </Badge>
                  )}
                </div>
                <CardDescription className="text-sm">{theme.description}</CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Vista previa del gradiente principal */}
                <div
                  className="h-24 rounded-xl border-2 border-white/20 shadow-medium"
                  style={{ background: theme.gradients.primary }}
                />

                {/* Paleta de colores */}
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-muted-foreground">Colores principales</h4>
                  <div className="grid grid-cols-5 gap-2">
                    {Object.entries(theme.colors)
                      .slice(0, 5)
                      .map(([name, color]) => (
                        <div key={name} className="text-center">
                          <div
                            className="h-12 w-full rounded-lg border border-white/20 shadow-soft"
                            style={{ backgroundColor: color }}
                          />
                          <span className="text-xs text-muted-foreground mt-1 block capitalize">{name}</span>
                        </div>
                      ))}
                  </div>
                </div>

                {/* Gradientes */}
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-muted-foreground">Gradientes</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <div
                      className="h-8 rounded-lg border border-white/20"
                      style={{ background: theme.gradients.secondary }}
                    />
                    <div
                      className="h-8 rounded-lg border border-white/20"
                      style={{ background: theme.gradients.accent }}
                    />
                  </div>
                </div>

                {/* Inspiración */}
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-muted-foreground">Inspiración</h4>
                  <p className="text-xs text-muted-foreground italic">{theme.inspiration}</p>
                </div>

                {/* Botón de selección */}
                <Button
                  className="w-full btn-premium-primary"
                  onClick={() => setPremiumTheme(theme.id)}
                  disabled={premiumTheme.id === theme.id}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  {premiumTheme.id === theme.id ? "Tema Activo" : "Aplicar Tema"}
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Información adicional */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="text-center space-y-4 mt-12"
      >
        <Card className="card-premium max-w-4xl mx-auto">
          <CardContent className="p-8">
            <h3 className="text-2xl font-bold text-gradient-premium mb-4">
              Diseño Premium para una Experiencia Excepcional
            </h3>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Cada paleta ha sido cuidadosamente diseñada por expertos en UX/UI para garantizar la máxima legibilidad,
              accesibilidad y atractivo visual. Los colores se adaptan automáticamente a los modos claro y oscuro,
              manteniendo siempre la armonía visual y la coherencia en toda la aplicación.
            </p>
            <div className="flex flex-wrap justify-center gap-4 mt-6">
              <Badge className="badge-premium-success">
                <Sparkles className="h-3 w-3 mr-1" />
                Accesibilidad WCAG 2.1
              </Badge>
              <Badge className="badge-premium">
                <Heart className="h-3 w-3 mr-1" />
                Diseño Responsive
              </Badge>
              <Badge className="badge-premium-warning">
                <Eye className="h-3 w-3 mr-1" />
                Optimizado para Legibilidad
              </Badge>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
