"use client"

import { DashboardShell } from "@/components/dashboard/shell"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { ROLE_CAPABILITIES, type UserRole } from "@/lib/roles-permissions"
import { CheckCircle, HelpCircle, Shield, User, Users, XCircle } from "lucide-react"
import { useState } from "react"

export default function RolesHelpPage() {
  const [activeTab, setActiveTab] = useState<UserRole>("student")

  const capabilities = ROLE_CAPABILITIES[activeTab]

  return (
    <DashboardShell>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Guía de Roles y Permisos</h1>
          <p className="text-muted-foreground">
            Aprende sobre los diferentes roles y sus capacidades en la plataforma HABY-CLASS.
          </p>
        </div>
      </div>

      <Tabs
        defaultValue="student"
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as UserRole)}
        className="mt-6"
      >
        <TabsList>
          <TabsTrigger value="student" className="flex items-center">
            <User className="mr-2 h-4 w-4" />
            Estudiante
          </TabsTrigger>
          <TabsTrigger value="teacher" className="flex items-center">
            <Users className="mr-2 h-4 w-4" />
            Profesor
          </TabsTrigger>
          <TabsTrigger value="admin" className="flex items-center">
            <Shield className="mr-2 h-4 w-4" />
            Administrador
          </TabsTrigger>
        </TabsList>

        <TabsContent value="student" className="space-y-6 mt-6">
          <RoleGuide
            roleName="Estudiante"
            description="Como estudiante, puedes unirte a clases, acceder a materiales, entregar tareas y participar en discusiones."
            capabilities={capabilities}
            faqs={[
              {
                question: "¿Cómo me uno a una clase?",
                answer:
                  "Para unirte a una clase, necesitas un código de invitación proporcionado por tu profesor. Ve a la página principal del dashboard y haz clic en 'Unirse a clase', luego ingresa el código de invitación.",
              },
              {
                question: "¿Puedo ver las calificaciones de otros estudiantes?",
                answer:
                  "No, solo puedes ver tus propias calificaciones. Los profesores son los únicos que pueden ver y gestionar las calificaciones de todos los estudiantes.",
              },
              {
                question: "¿Cómo entrego una tarea?",
                answer:
                  "Ve a la pestaña 'Tareas' dentro de tu clase, selecciona la tarea que deseas entregar y haz clic en el botón 'Entregar'. Puedes adjuntar archivos o escribir tu respuesta según el tipo de tarea.",
              },
              {
                question: "¿Puedo abandonar una clase?",
                answer:
                  "Sí, puedes abandonar una clase en cualquier momento. Ve a la configuración de la clase y selecciona 'Abandonar clase'. Ten en cuenta que esto eliminará tu acceso a todos los materiales y tareas de esa clase.",
              },
              {
                question: "¿Cómo puedo comunicarme con mi profesor?",
                answer:
                  "Puedes comunicarte con tu profesor a través de comentarios en anuncios, mensajes directos o correo electrónico, dependiendo de las opciones habilitadas por tu profesor.",
              },
            ]}
          />
        </TabsContent>

        <TabsContent value="teacher" className="space-y-6 mt-6">
          <RoleGuide
            roleName="Profesor"
            description="Como profesor, puedes crear y gestionar clases, materiales, tareas, calificaciones y comunicarte con tus estudiantes."
            capabilities={capabilities}
            faqs={[
              {
                question: "¿Cómo creo una nueva clase?",
                answer:
                  "Ve a la página principal del dashboard y haz clic en 'Crear clase'. Completa la información requerida como nombre, sección, materia y descripción. Una vez creada, podrás invitar estudiantes y añadir contenido.",
              },
              {
                question: "¿Cómo invito estudiantes a mi clase?",
                answer:
                  "Cada clase tiene un código único de invitación que puedes compartir con tus estudiantes. También puedes invitarlos directamente por correo electrónico desde la pestaña 'Personas' de tu clase.",
              },
              {
                question: "¿Puedo reutilizar materiales entre diferentes clases?",
                answer:
                  "Sí, puedes copiar materiales, tareas y anuncios entre tus diferentes clases. Esto te permite reutilizar contenido sin tener que crearlo desde cero.",
              },
              {
                question: "¿Cómo califico las tareas de los estudiantes?",
                answer:
                  "Ve a la pestaña 'Tareas' o 'Calificaciones' dentro de tu clase. Allí podrás ver las entregas de los estudiantes, asignar puntuaciones y proporcionar retroalimentación.",
              },
              {
                question: "¿Puedo ver estadísticas sobre el rendimiento de mis estudiantes?",
                answer:
                  "Sí, la plataforma ofrece análisis y estadísticas sobre el rendimiento de tus estudiantes, incluyendo tasas de entrega, calificaciones promedio y progreso individual.",
              },
            ]}
          />
        </TabsContent>

        <TabsContent value="admin" className="space-y-6 mt-6">
          <RoleGuide
            roleName="Administrador"
            description="Como administrador, tienes control total sobre la plataforma, incluyendo la gestión de usuarios, clases y configuraciones del sistema."
            capabilities={capabilities}
            faqs={[
              {
                question: "¿Cómo gestiono los usuarios de la plataforma?",
                answer:
                  "Ve a la sección de 'Administración > Usuarios' donde podrás ver, crear, editar y eliminar usuarios, así como cambiar sus roles y permisos.",
              },
              {
                question: "¿Puedo acceder a todas las clases de la plataforma?",
                answer:
                  "Sí, como administrador tienes acceso a todas las clases creadas en la plataforma, independientemente de quién las haya creado.",
              },
              {
                question: "¿Cómo realizo copias de seguridad del sistema?",
                answer:
                  "Ve a 'Administración > Sistema > Copias de seguridad' donde podrás programar copias automáticas o realizar copias manuales de la base de datos y archivos del sistema.",
              },
              {
                question: "¿Puedo personalizar la apariencia global de la plataforma?",
                answer:
                  "Sí, puedes personalizar logotipos, colores, textos y otras configuraciones visuales desde la sección 'Administración > Apariencia'.",
              },
              {
                question: "¿Cómo gestiono las integraciones con servicios externos?",
                answer:
                  "Ve a 'Administración > Integraciones' donde podrás configurar conexiones con servicios como Google Drive, OneDrive, sistemas de videoconferencia y otras herramientas educativas.",
              },
            ]}
          />
        </TabsContent>
      </Tabs>

      {/* Copyright notice */}
      <div className="mt-12 pt-6 border-t text-center text-xs text-muted-foreground">
        <p>
          © {new Date().getFullYear()} HABY-CLASS. Todos los derechos reservados.
          <br />
          Desarrollado por HABY - Heber Zadkiel Garcia Perez
        </p>
      </div>
    </DashboardShell>
  )
}

interface RoleGuideProps {
  roleName: string
  description: string
  capabilities: (typeof ROLE_CAPABILITIES)["student"]
  faqs: { question: string; answer: string }[]
}

function RoleGuide({ roleName, description, capabilities, faqs }: RoleGuideProps) {
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Rol: {roleName}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium mb-4">Lo que puedes hacer</h3>
              <ul className="space-y-2">
                {capabilities.canDo.map((capability, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>{capability}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-4">Limitaciones</h3>
              <ul className="space-y-2">
                {capabilities.cannotDo.map((limitation, index) => (
                  <li key={index} className="flex items-start">
                    <XCircle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>{limitation}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <HelpCircle className="h-5 w-5 mr-2" />
            Preguntas frecuentes
          </CardTitle>
          <CardDescription>Respuestas a preguntas comunes sobre el rol de {roleName.toLowerCase()}.</CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger>{faq.question}</AccordionTrigger>
                <AccordionContent>{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
    </>
  )
}
