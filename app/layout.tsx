import type React from "react"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/providers/theme-provider"
import { LanguageProvider } from "@/providers/language-provider"
import { AuthProvider } from "@/providers/auth-provider"
import { Toaster } from "@/components/ui/toaster"
import { Analytics } from "@/components/analytics"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

export const metadata = {
  title: "HABY-CLASS",
  description: "Plataforma educativa moderna para simplificar la enseñanza y mejorar el aprendizaje",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <LanguageProvider defaultLanguage="es">
            <AuthProvider>
              {children}
              <Toaster />
              <Analytics />
            </AuthProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
