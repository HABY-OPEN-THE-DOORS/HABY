export type ThemeColor = {
  name: string
  id: string
  primary: string
  secondary: string
  accent: string
  success: string
  warning: string
  error: string
  info: string
  cssVars: {
    light: Record<string, string>
    dark: Record<string, string>
  }
}

export const themes: ThemeColor[] = [
  {
    name: "Default",
    id: "default",
    primary: "#2C3E50",
    secondary: "#3498DB",
    accent: "#1A365D",
    success: "#2F855A",
    warning: "#C05621",
    error: "#9B2C2C",
    info: "#2B6CB0",
    cssVars: {
      light: {
        "--primary": "210 64% 24%",
        "--primary-foreground": "210 40% 98%",
        "--secondary": "210 40% 96.1%",
        "--secondary-foreground": "222.2 47.4% 11.2%",
        "--accent": "217.2 32.6% 17.5%",
        "--accent-foreground": "210 40% 98%",
      },
      dark: {
        "--primary": "210 64% 24%",
        "--primary-foreground": "210 40% 98%",
        "--secondary": "217.2 32.6% 17.5%",
        "--secondary-foreground": "210 40% 98%",
        "--accent": "217.2 32.6% 17.5%",
        "--accent-foreground": "210 40% 98%",
      },
    },
  },
  {
    name: "Ocean",
    id: "ocean",
    primary: "#0D4C73",
    secondary: "#00A8E8",
    accent: "#003459",
    success: "#2E8B57",
    warning: "#FF8C00",
    error: "#B22222",
    info: "#4682B4",
    cssVars: {
      light: {
        "--primary": "202 79% 25%",
        "--primary-foreground": "210 40% 98%",
        "--secondary": "196 100% 45%",
        "--secondary-foreground": "210 40% 98%",
        "--accent": "203 100% 17%",
        "--accent-foreground": "210 40% 98%",
      },
      dark: {
        "--primary": "202 79% 25%",
        "--primary-foreground": "210 40% 98%",
        "--secondary": "196 100% 45%",
        "--secondary-foreground": "210 40% 98%",
        "--accent": "203 100% 17%",
        "--accent-foreground": "210 40% 98%",
      },
    },
  },
  {
    name: "Forest",
    id: "forest",
    primary: "#2D5F2D",
    secondary: "#97BC62",
    accent: "#1E3F1E",
    success: "#388E3C",
    warning: "#F57C00",
    error: "#D32F2F",
    info: "#1976D2",
    cssVars: {
      light: {
        "--primary": "120 35% 28%",
        "--primary-foreground": "210 40% 98%",
        "--secondary": "84 36% 56%",
        "--secondary-foreground": "210 40% 98%",
        "--accent": "120 35% 18%",
        "--accent-foreground": "210 40% 98%",
      },
      dark: {
        "--primary": "120 35% 28%",
        "--primary-foreground": "210 40% 98%",
        "--secondary": "84 36% 56%",
        "--secondary-foreground": "210 40% 98%",
        "--accent": "120 35% 18%",
        "--accent-foreground": "210 40% 98%",
      },
    },
  },
  {
    name: "Sunset",
    id: "sunset",
    primary: "#B83B5E",
    secondary: "#F08A5D",
    accent: "#6A2C70",
    success: "#43A047",
    warning: "#FFB300",
    error: "#E53935",
    info: "#039BE5",
    cssVars: {
      light: {
        "--primary": "343 51% 48%",
        "--primary-foreground": "210 40% 98%",
        "--secondary": "25 86% 65%",
        "--secondary-foreground": "210 40% 98%",
        "--accent": "291 43% 31%",
        "--accent-foreground": "210 40% 98%",
      },
      dark: {
        "--primary": "343 51% 48%",
        "--primary-foreground": "210 40% 98%",
        "--secondary": "25 86% 65%",
        "--secondary-foreground": "210 40% 98%",
        "--accent": "291 43% 31%",
        "--accent-foreground": "210 40% 98%",
      },
    },
  },
  {
    name: "Monochrome",
    id: "monochrome",
    primary: "#2C2C2C",
    secondary: "#757575",
    accent: "#0F0F0F",
    success: "#4CAF50",
    warning: "#FF9800",
    error: "#F44336",
    info: "#2196F3",
    cssVars: {
      light: {
        "--primary": "0 0% 17%",
        "--primary-foreground": "0 0% 100%",
        "--secondary": "0 0% 46%",
        "--secondary-foreground": "0 0% 100%",
        "--accent": "0 0% 6%",
        "--accent-foreground": "0 0% 100%",
      },
      dark: {
        "--primary": "0 0% 17%",
        "--primary-foreground": "0 0% 100%",
        "--secondary": "0 0% 46%",
        "--secondary-foreground": "0 0% 100%",
        "--accent": "0 0% 6%",
        "--accent-foreground": "0 0% 100%",
      },
    },
  },
]

export function getThemeById(id: string): ThemeColor | undefined {
  return themes.find((theme) => theme.id === id)
}

export function getDefaultTheme(): ThemeColor {
  return themes[0]
}
