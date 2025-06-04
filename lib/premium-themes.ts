export type PremiumTheme = {
  name: string
  id: string
  description: string
  inspiration: string
  colors: {
    primary: string
    secondary: string
    accent: string
    success: string
    warning: string
    error: string
    info: string
    neutral: string
    surface: string
    background: string
  }
  gradients: {
    primary: string
    secondary: string
    accent: string
    hero: string
    card: string
  }
  cssVars: {
    light: Record<string, string>
    dark: Record<string, string>
  }
}

export const premiumThemes: PremiumTheme[] = [
  {
    name: "Aurora Borealis",
    id: "aurora",
    description: "Inspirado en la majestuosa aurora boreal",
    inspiration: "Colores etéreos que evocan la belleza natural del cielo nocturno",
    colors: {
      primary: "#6366F1", // Índigo vibrante
      secondary: "#8B5CF6", // Púrpura elegante
      accent: "#06B6D4", // Cian brillante
      success: "#10B981", // Esmeralda
      warning: "#F59E0B", // Ámbar dorado
      error: "#EF4444", // Coral suave
      info: "#3B82F6", // Azul cielo
      neutral: "#64748B", // Gris pizarra
      surface: "#F8FAFC", // Blanco nieve
      background: "#FFFFFF", // Blanco puro
    },
    gradients: {
      primary: "linear-gradient(135deg, #6366F1 0%, #8B5CF6 50%, #06B6D4 100%)",
      secondary: "linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)",
      accent: "linear-gradient(135deg, #06B6D4 0%, #3B82F6 100%)",
      hero: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      card: "linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)",
    },
    cssVars: {
      light: {
        "--background": "0 0% 100%",
        "--foreground": "222.2 84% 4.9%",
        "--card": "0 0% 100%",
        "--card-foreground": "222.2 84% 4.9%",
        "--popover": "0 0% 100%",
        "--popover-foreground": "222.2 84% 4.9%",
        "--primary": "239 84% 67%",
        "--primary-foreground": "0 0% 98%",
        "--secondary": "262 83% 58%",
        "--secondary-foreground": "0 0% 98%",
        "--muted": "210 40% 96%",
        "--muted-foreground": "215.4 16.3% 46.9%",
        "--accent": "186 100% 44%",
        "--accent-foreground": "0 0% 98%",
        "--destructive": "0 84% 60%",
        "--destructive-foreground": "0 0% 98%",
        "--border": "214.3 31.8% 91.4%",
        "--input": "214.3 31.8% 91.4%",
        "--ring": "239 84% 67%",
        "--radius": "0.75rem",
      },
      dark: {
        "--background": "222.2 84% 4.9%",
        "--foreground": "210 40% 98%",
        "--card": "222.2 84% 4.9%",
        "--card-foreground": "210 40% 98%",
        "--popover": "222.2 84% 4.9%",
        "--popover-foreground": "210 40% 98%",
        "--primary": "239 84% 67%",
        "--primary-foreground": "222.2 84% 4.9%",
        "--secondary": "262 83% 58%",
        "--secondary-foreground": "210 40% 98%",
        "--muted": "217.2 32.6% 17.5%",
        "--muted-foreground": "215 20.2% 65.1%",
        "--accent": "186 100% 44%",
        "--accent-foreground": "222.2 84% 4.9%",
        "--destructive": "0 84% 60%",
        "--destructive-foreground": "210 40% 98%",
        "--border": "217.2 32.6% 17.5%",
        "--input": "217.2 32.6% 17.5%",
        "--ring": "239 84% 67%",
      },
    },
  },
  {
    name: "Sunset Paradise",
    id: "sunset",
    description: "Inspirado en atardeceres tropicales",
    inspiration: "Colores cálidos que evocan la serenidad de un atardecer perfecto",
    colors: {
      primary: "#F97316", // Naranja vibrante
      secondary: "#EC4899", // Rosa fucsia
      accent: "#8B5CF6", // Púrpura real
      success: "#22C55E", // Verde lima
      warning: "#EAB308", // Amarillo dorado
      error: "#DC2626", // Rojo cereza
      info: "#0EA5E9", // Azul cielo
      neutral: "#6B7280", // Gris cálido
      surface: "#FEF7F0", // Crema suave
      background: "#FFFBF7", // Blanco cálido
    },
    gradients: {
      primary: "linear-gradient(135deg, #F97316 0%, #EC4899 50%, #8B5CF6 100%)",
      secondary: "linear-gradient(135deg, #EC4899 0%, #F97316 100%)",
      accent: "linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)",
      hero: "linear-gradient(135deg, #ff9a9e 0%, #fecfef 50%, #fecfef 100%)",
      card: "linear-gradient(145deg, #fffbf7 0%, #fef7f0 100%)",
    },
    cssVars: {
      light: {
        "--background": "33 100% 98%",
        "--foreground": "20 14.3% 4.1%",
        "--card": "33 100% 98%",
        "--card-foreground": "20 14.3% 4.1%",
        "--popover": "0 0% 100%",
        "--popover-foreground": "20 14.3% 4.1%",
        "--primary": "20 91% 48%",
        "--primary-foreground": "0 0% 98%",
        "--secondary": "330 81% 60%",
        "--secondary-foreground": "0 0% 98%",
        "--muted": "33 100% 96%",
        "--muted-foreground": "215.4 16.3% 46.9%",
        "--accent": "262 83% 58%",
        "--accent-foreground": "0 0% 98%",
        "--destructive": "0 72% 51%",
        "--destructive-foreground": "0 0% 98%",
        "--border": "33 100% 94%",
        "--input": "33 100% 94%",
        "--ring": "20 91% 48%",
        "--radius": "0.75rem",
      },
      dark: {
        "--background": "20 14.3% 4.1%",
        "--foreground": "33 100% 96%",
        "--card": "20 14.3% 4.1%",
        "--card-foreground": "33 100% 96%",
        "--popover": "20 14.3% 4.1%",
        "--popover-foreground": "33 100% 96%",
        "--primary": "20 91% 48%",
        "--primary-foreground": "20 14.3% 4.1%",
        "--secondary": "330 81% 60%",
        "--secondary-foreground": "33 100% 96%",
        "--muted": "12 6.5% 15.1%",
        "--muted-foreground": "24 5.4% 63.9%",
        "--accent": "262 83% 58%",
        "--accent-foreground": "20 14.3% 4.1%",
        "--destructive": "0 72% 51%",
        "--destructive-foreground": "33 100% 96%",
        "--border": "12 6.5% 15.1%",
        "--input": "12 6.5% 15.1%",
        "--ring": "20 91% 48%",
      },
    },
  },
  {
    name: "Ocean Depths",
    id: "ocean",
    description: "Inspirado en las profundidades del océano",
    inspiration: "Azules profundos y verdes marinos que transmiten calma y profesionalismo",
    colors: {
      primary: "#0F766E", // Verde azulado profundo
      secondary: "#0891B2", // Azul océano
      accent: "#7C3AED", // Púrpura profundo
      success: "#059669", // Verde esmeralda
      warning: "#D97706", // Naranja ámbar
      error: "#DC2626", // Rojo coral
      info: "#0284C7", // Azul información
      neutral: "#475569", // Gris pizarra
      surface: "#F0FDFA", // Verde agua muy claro
      background: "#FFFFFF", // Blanco puro
    },
    gradients: {
      primary: "linear-gradient(135deg, #0F766E 0%, #0891B2 50%, #7C3AED 100%)",
      secondary: "linear-gradient(135deg, #0891B2 0%, #0F766E 100%)",
      accent: "linear-gradient(135deg, #7C3AED 0%, #0891B2 100%)",
      hero: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      card: "linear-gradient(145deg, #ffffff 0%, #f0fdfa 100%)",
    },
    cssVars: {
      light: {
        "--background": "0 0% 100%",
        "--foreground": "222.2 84% 4.9%",
        "--card": "0 0% 100%",
        "--card-foreground": "222.2 84% 4.9%",
        "--popover": "0 0% 100%",
        "--popover-foreground": "222.2 84% 4.9%",
        "--primary": "172 81% 24%",
        "--primary-foreground": "0 0% 98%",
        "--secondary": "188 95% 32%",
        "--secondary-foreground": "0 0% 98%",
        "--muted": "166 76% 97%",
        "--muted-foreground": "215.4 16.3% 46.9%",
        "--accent": "262 83% 58%",
        "--accent-foreground": "0 0% 98%",
        "--destructive": "0 72% 51%",
        "--destructive-foreground": "0 0% 98%",
        "--border": "166 76% 94%",
        "--input": "166 76% 94%",
        "--ring": "172 81% 24%",
        "--radius": "0.75rem",
      },
      dark: {
        "--background": "222.2 84% 4.9%",
        "--foreground": "166 76% 97%",
        "--card": "222.2 84% 4.9%",
        "--card-foreground": "166 76% 97%",
        "--popover": "222.2 84% 4.9%",
        "--popover-foreground": "166 76% 97%",
        "--primary": "172 81% 24%",
        "--primary-foreground": "222.2 84% 4.9%",
        "--secondary": "188 95% 32%",
        "--secondary-foreground": "166 76% 97%",
        "--muted": "217.2 32.6% 17.5%",
        "--muted-foreground": "215 20.2% 65.1%",
        "--accent": "262 83% 58%",
        "--accent-foreground": "222.2 84% 4.9%",
        "--destructive": "0 72% 51%",
        "--destructive-foreground": "166 76% 97%",
        "--border": "217.2 32.6% 17.5%",
        "--input": "217.2 32.6% 17.5%",
        "--ring": "172 81% 24%",
      },
    },
  },
  {
    name: "Royal Elegance",
    id: "royal",
    description: "Inspirado en la elegancia real",
    inspiration: "Púrpuras reales y dorados que transmiten lujo y sofisticación",
    colors: {
      primary: "#7C3AED", // Púrpura real
      secondary: "#C026D3", // Magenta vibrante
      accent: "#F59E0B", // Dorado elegante
      success: "#10B981", // Verde esmeralda
      warning: "#F59E0B", // Ámbar dorado
      error: "#EF4444", // Rojo elegante
      info: "#3B82F6", // Azul real
      neutral: "#6B7280", // Gris elegante
      surface: "#FEFBFF", // Blanco lavanda
      background: "#FFFFFF", // Blanco puro
    },
    gradients: {
      primary: "linear-gradient(135deg, #7C3AED 0%, #C026D3 50%, #F59E0B 100%)",
      secondary: "linear-gradient(135deg, #C026D3 0%, #7C3AED 100%)",
      accent: "linear-gradient(135deg, #F59E0B 0%, #C026D3 100%)",
      hero: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      card: "linear-gradient(145deg, #ffffff 0%, #fefbff 100%)",
    },
    cssVars: {
      light: {
        "--background": "0 0% 100%",
        "--foreground": "222.2 84% 4.9%",
        "--card": "0 0% 100%",
        "--card-foreground": "222.2 84% 4.9%",
        "--popover": "0 0% 100%",
        "--popover-foreground": "222.2 84% 4.9%",
        "--primary": "262 83% 58%",
        "--primary-foreground": "0 0% 98%",
        "--secondary": "292 84% 61%",
        "--secondary-foreground": "0 0% 98%",
        "--muted": "270 20% 98%",
        "--muted-foreground": "215.4 16.3% 46.9%",
        "--accent": "43 96% 56%",
        "--accent-foreground": "222.2 84% 4.9%",
        "--destructive": "0 84% 60%",
        "--destructive-foreground": "0 0% 98%",
        "--border": "270 20% 94%",
        "--input": "270 20% 94%",
        "--ring": "262 83% 58%",
        "--radius": "0.75rem",
      },
      dark: {
        "--background": "222.2 84% 4.9%",
        "--foreground": "270 20% 98%",
        "--card": "222.2 84% 4.9%",
        "--card-foreground": "270 20% 98%",
        "--popover": "222.2 84% 4.9%",
        "--popover-foreground": "270 20% 98%",
        "--primary": "262 83% 58%",
        "--primary-foreground": "222.2 84% 4.9%",
        "--secondary": "292 84% 61%",
        "--secondary-foreground": "270 20% 98%",
        "--muted": "217.2 32.6% 17.5%",
        "--muted-foreground": "215 20.2% 65.1%",
        "--accent": "43 96% 56%",
        "--accent-foreground": "222.2 84% 4.9%",
        "--destructive": "0 84% 60%",
        "--destructive-foreground": "270 20% 98%",
        "--border": "217.2 32.6% 17.5%",
        "--input": "217.2 32.6% 17.5%",
        "--ring": "262 83% 58%",
      },
    },
  },
  {
    name: "Forest Serenity",
    id: "forest",
    description: "Inspirado en bosques serenos",
    inspiration: "Verdes naturales y tierras que evocan tranquilidad y crecimiento",
    colors: {
      primary: "#059669", // Verde bosque
      secondary: "#0D9488", // Verde azulado
      accent: "#7C2D12", // Marrón tierra
      success: "#16A34A", // Verde éxito
      warning: "#CA8A04", // Amarillo mostaza
      error: "#DC2626", // Rojo natural
      info: "#0284C7", // Azul cielo
      neutral: "#57534E", // Gris piedra
      surface: "#F0FDF4", // Verde muy claro
      background: "#FFFFFF", // Blanco puro
    },
    gradients: {
      primary: "linear-gradient(135deg, #059669 0%, #0D9488 50%, #7C2D12 100%)",
      secondary: "linear-gradient(135deg, #0D9488 0%, #059669 100%)",
      accent: "linear-gradient(135deg, #7C2D12 0%, #059669 100%)",
      hero: "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)",
      card: "linear-gradient(145deg, #ffffff 0%, #f0fdf4 100%)",
    },
    cssVars: {
      light: {
        "--background": "0 0% 100%",
        "--foreground": "222.2 84% 4.9%",
        "--card": "0 0% 100%",
        "--card-foreground": "222.2 84% 4.9%",
        "--popover": "0 0% 100%",
        "--popover-foreground": "222.2 84% 4.9%",
        "--primary": "160 84% 39%",
        "--primary-foreground": "0 0% 98%",
        "--secondary": "172 82% 29%",
        "--secondary-foreground": "0 0% 98%",
        "--muted": "138 76% 97%",
        "--muted-foreground": "215.4 16.3% 46.9%",
        "--accent": "17 88% 20%",
        "--accent-foreground": "0 0% 98%",
        "--destructive": "0 72% 51%",
        "--destructive-foreground": "0 0% 98%",
        "--border": "138 76% 94%",
        "--input": "138 76% 94%",
        "--ring": "160 84% 39%",
        "--radius": "0.75rem",
      },
      dark: {
        "--background": "222.2 84% 4.9%",
        "--foreground": "138 76% 97%",
        "--card": "222.2 84% 4.9%",
        "--card-foreground": "138 76% 97%",
        "--popover": "222.2 84% 4.9%",
        "--popover-foreground": "138 76% 97%",
        "--primary": "160 84% 39%",
        "--primary-foreground": "222.2 84% 4.9%",
        "--secondary": "172 82% 29%",
        "--secondary-foreground": "138 76% 97%",
        "--muted": "217.2 32.6% 17.5%",
        "--muted-foreground": "215 20.2% 65.1%",
        "--accent": "17 88% 20%",
        "--accent-foreground": "138 76% 97%",
        "--destructive": "0 72% 51%",
        "--destructive-foreground": "138 76% 97%",
        "--border": "217.2 32.6% 17.5%",
        "--input": "217.2 32.6% 17.5%",
        "--ring": "160 84% 39%",
      },
    },
  },
]

export function getPremiumThemeById(id: string): PremiumTheme | undefined {
  return premiumThemes.find((theme) => theme.id === id)
}

export function getDefaultPremiumTheme(): PremiumTheme {
  return premiumThemes[0] // Aurora Borealis como tema por defecto
}
