import type React from "react"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/providers/theme-provider"
import { AuthProvider } from "@/providers/auth-provider"
import { LanguageProvider } from "@/providers/language-provider"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

export const metadata = {
  title: "HABY-CLASS - Plataforma Educativa Premium",
  description:
    "La plataforma educativa más avanzada y hermosa para gestionar clases, estudiantes y contenido académico.",
  keywords: "educación, plataforma educativa, gestión académica, clases online, HABY-CLASS",
  authors: [{ name: "HABY-CLASS Team" }],
  creator: "HABY-CLASS",
  publisher: "HABY-CLASS",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://haby-class.vercel.app"),
  openGraph: {
    title: "HABY-CLASS - Plataforma Educativa Premium",
    description:
      "La plataforma educativa más avanzada y hermosa para gestionar clases, estudiantes y contenido académico.",
    url: "https://haby-class.vercel.app",
    siteName: "HABY-CLASS",
    images: [
      {
        url: "/images/og-image.png",
        width: 1200,
        height: 630,
        alt: "HABY-CLASS - Plataforma Educativa Premium",
      },
    ],
    locale: "es_ES",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "HABY-CLASS - Plataforma Educativa Premium",
    description:
      "La plataforma educativa más avanzada y hermosa para gestionar clases, estudiantes y contenido académico.",
    images: ["/images/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" suppressHydrationWarning className={inter.variable}>
      <body className={`${inter.className} font-sans antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange={false}>
          <LanguageProvider>
            <AuthProvider>
              <div className="relative min-h-screen bg-background">{children}</div>
              <Toaster />
            </AuthProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
