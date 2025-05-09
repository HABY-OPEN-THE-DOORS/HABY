"use client"

import { useState } from "react"
import { DashboardShell } from "@/components/dashboard/shell"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { useAuth } from "@/providers/auth-provider"
import { useToast } from "@/hooks/use-toast"
import { useLanguage } from "@/providers/language-provider"
import { useTheme } from "next-themes"
import { LoadingScreen } from "@/components/loading-screen"
import { motion } from "framer-motion"
import { Bell, Globe, Lock, Moon, Shield, User, Sun, Palette } from "lucide-react"
import { useThemeColor } from "@/hooks/use-theme-color"
import { themes } from "@/lib/themes"

export default function SettingsPage() {
  const { userData, isLoading, updateUserProfile } = useAuth()
  const { toast } = useToast()
  const { language, setLanguage, t } = useLanguage()
  const { theme, setTheme } = useTheme()
  const { themeColor, setThemeColor } = useThemeColor()

  const [isUpdating, setIsUpdating] = useState(false)
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    assignmentReminders: true,
    classAnnouncements: true,
    gradeUpdates: true,
  })

  const [privacySettings, setPrivacySettings] = useState({
    showOnlineStatus: true,
    allowProfileViewing: true,
    showLastActive: false,
  })

  if (isLoading) {
    return <LoadingScreen />
  }

  const handleNotificationChange = (key: string, value: boolean) => {
    setNotificationSettings((prev) => ({
      ...prev,
      [key]: value,
    }))

    toast({
      title: "Configuración actualizada",
      description: "Tus preferencias de notificaciones han sido actualizadas.",
    })
  }

  const handlePrivacyChange = (key: string, value: boolean) => {
    setPrivacySettings((prev) => ({
      ...prev,
      [key]: value,
    }))

    toast({
      title: "Configuración actualizada",
      description: "Tus preferencias de privacidad han sido actualizadas.",
    })
  }

  const handleLanguageChange = (newLanguage: "es" | "en") => {
    setLanguage(newLanguage)
    toast({
      title: "Idioma actualizado",
      description:
        newLanguage === "es" ? "El idioma ha sido cambiado a Español." : "Language has been changed to English.",
    })
  }

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme)
    toast({
      title: "Tema actualizado",
      description: newTheme === "dark" ? "El tema ha sido cambiado a oscuro." : "El tema ha sido cambiado a claro.",
    })
  }

  const handleThemeColorChange = (themeId: string) => {
    setThemeColor(themeId)
    toast({
      title: "Color del tema actualizado",
      description: "El color del tema ha sido actualizado correctamente.",
    })
  }

  return (
    <DashboardShell>
      <div className="flex flex-col space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Configuración</h1>
          <p className="text-muted-foreground">Administra tus preferencias y configuración de cuenta</p>
        </div>

        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid grid-cols-4 md:w-fit">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="notifications">Notificaciones</TabsTrigger>
            <TabsTrigger value="privacy">Privacidad</TabsTrigger>
            <TabsTrigger value="security">Seguridad</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-4 mt-6">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
              <Card className="shadow-soft">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Globe className="mr-2 h-5 w-5" />
                    Idioma y Región
                  </CardTitle>
                  <CardDescription>Configura el idioma y la región de tu cuenta</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="language">Idioma</Label>
                    <div className="grid grid-cols-2 gap-4">
                      <Button
                        variant={language === "es" ? "default" : "outline"}
                        className="w-full justify-start"
                        onClick={() => handleLanguageChange("es")}
                      >
                        <span className="mr-2">🇪🇸</span>
                        Español
                      </Button>
                      <Button
                        variant={language === "en" ? "default" : "outline"}
                        className="w-full justify-start"
                        onClick={() => handleLanguageChange("en")}
                      >
                        <span className="mr-2">🇺🇸</span>
                        English
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <Card className="shadow-soft">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Moon className="mr-2 h-5 w-5" />
                    Apariencia
                  </CardTitle>
                  <CardDescription>Personaliza la apariencia de la aplicación</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="theme">Tema</Label>
                    <div className="grid grid-cols-2 gap-4">
                      <Button
                        variant={theme === "light" ? "default" : "outline"}
                        className="w-full justify-start"
                        onClick={() => handleThemeChange("light")}
                      >
                        <Sun className="mr-2 h-4 w-4" />
                        Claro
                      </Button>
                      <Button
                        variant={theme === "dark" ? "default" : "outline"}
                        className="w-full justify-start"
                        onClick={() => handleThemeChange("dark")}
                      >
                        <Moon className="mr-2 h-4 w-4" />
                        Oscuro
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <Card className="shadow-soft">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Palette className="mr-2 h-5 w-5" />
                    Colores del Tema
                  </CardTitle>
                  <CardDescription>Elige el esquema de colores que prefieras</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="themeColor">Esquema de colores</Label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                      {themes.map((theme) => (
                        <Button
                          key={theme.id}
                          variant="outline"
                          className={`w-full justify-center p-4 h-auto flex flex-col items-center gap-2 ${
                            themeColor.id === theme.id ? "ring-2 ring-primary" : ""
                          }`}
                          style={{
                            borderColor: theme.primary,
                          }}
                          onClick={() => handleThemeColorChange(theme.id)}
                        >
                          <div className="flex gap-1">
                            <div className="h-4 w-4 rounded-full" style={{ backgroundColor: theme.primary }} />
                            <div className="h-4 w-4 rounded-full" style={{ backgroundColor: theme.secondary }} />
                            <div className="h-4 w-4 rounded-full" style={{ backgroundColor: theme.accent }} />
                          </div>
                          <span className="text-xs font-medium">{theme.name}</span>
                        </Button>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
            >
              <Card className="shadow-soft">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <User className="mr-2 h-5 w-5" />
                    Información de Perfil
                  </CardTitle>
                  <CardDescription>Actualiza tu información personal</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">Nombre</Label>
                      <Input id="firstName" defaultValue={userData?.firstName || ""} placeholder="Tu nombre" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Apellido</Label>
                      <Input id="lastName" defaultValue={userData?.lastName || ""} placeholder="Tu apellido" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Correo electrónico</Label>
                    <Input
                      id="email"
                      type="email"
                      defaultValue={userData?.email || ""}
                      placeholder="tu@ejemplo.com"
                      disabled
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button isLoading={isUpdating} loadingText="Guardando...">
                    Guardar cambios
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-4 mt-6">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
              <Card className="shadow-soft">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Bell className="mr-2 h-5 w-5" />
                    Preferencias de Notificaciones
                  </CardTitle>
                  <CardDescription>Configura cómo y cuándo quieres recibir notificaciones</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="email-notifications">Notificaciones por correo</Label>
                      <p className="text-sm text-muted-foreground">
                        Recibe notificaciones importantes por correo electrónico
                      </p>
                    </div>
                    <Switch
                      id="email-notifications"
                      checked={notificationSettings.emailNotifications}
                      onCheckedChange={(checked) => handleNotificationChange("emailNotifications", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="assignment-reminders">Recordatorios de tareas</Label>
                      <p className="text-sm text-muted-foreground">
                        Recibe recordatorios sobre fechas de entrega próximas
                      </p>
                    </div>
                    <Switch
                      id="assignment-reminders"
                      checked={notificationSettings.assignmentReminders}
                      onCheckedChange={(checked) => handleNotificationChange("assignmentReminders", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="class-announcements">Anuncios de clase</Label>
                      <p className="text-sm text-muted-foreground">
                        Recibe notificaciones cuando se publiquen anuncios en tus clases
                      </p>
                    </div>
                    <Switch
                      id="class-announcements"
                      checked={notificationSettings.classAnnouncements}
                      onCheckedChange={(checked) => handleNotificationChange("classAnnouncements", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="grade-updates">Actualizaciones de calificaciones</Label>
                      <p className="text-sm text-muted-foreground">
                        Recibe notificaciones cuando se actualicen tus calificaciones
                      </p>
                    </div>
                    <Switch
                      id="grade-updates"
                      checked={notificationSettings.gradeUpdates}
                      onCheckedChange={(checked) => handleNotificationChange("gradeUpdates", checked)}
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="privacy" className="space-y-4 mt-6">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
              <Card className="shadow-soft">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Shield className="mr-2 h-5 w-5" />
                    Configuración de Privacidad
                  </CardTitle>
                  <CardDescription>Controla quién puede ver tu información y actividad</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="show-online">Mostrar estado en línea</Label>
                      <p className="text-sm text-muted-foreground">
                        Permite que otros usuarios vean cuando estás en línea
                      </p>
                    </div>
                    <Switch
                      id="show-online"
                      checked={privacySettings.showOnlineStatus}
                      onCheckedChange={(checked) => handlePrivacyChange("showOnlineStatus", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="allow-profile">Permitir ver perfil</Label>
                      <p className="text-sm text-muted-foreground">
                        Permite que otros usuarios vean tu perfil completo
                      </p>
                    </div>
                    <Switch
                      id="allow-profile"
                      checked={privacySettings.allowProfileViewing}
                      onCheckedChange={(checked) => handlePrivacyChange("allowProfileViewing", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="show-last-active">Mostrar última actividad</Label>
                      <p className="text-sm text-muted-foreground">
                        Muestra a otros usuarios cuándo fue tu última actividad
                      </p>
                    </div>
                    <Switch
                      id="show-last-active"
                      checked={privacySettings.showLastActive}
                      onCheckedChange={(checked) => handlePrivacyChange("showLastActive", checked)}
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="security" className="space-y-4 mt-6">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
              <Card className="shadow-soft">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Lock className="mr-2 h-5 w-5" />
                    Seguridad de la Cuenta
                  </CardTitle>
                  <CardDescription>Administra la seguridad de tu cuenta</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Contraseña actual</Label>
                    <Input id="current-password" type="password" placeholder="••••••••" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="new-password">Nueva contraseña</Label>
                      <Input id="new-password" type="password" placeholder="••••••••" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirmar contraseña</Label>
                      <Input id="confirm-password" type="password" placeholder="••••••••" />
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button>Cambiar contraseña</Button>
                </CardFooter>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <Card className="shadow-soft">
                <CardHeader>
                  <CardTitle className="text-destructive">Zona de peligro</CardTitle>
                  <CardDescription>Acciones irreversibles para tu cuenta</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Una vez que elimines tu cuenta, no hay vuelta atrás. Por favor, asegúrate de que realmente quieres
                    hacer esto.
                  </p>
                  <Button variant="destructive">Eliminar cuenta</Button>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardShell>
  )
}
