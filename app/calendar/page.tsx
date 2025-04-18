import Link from "next/link"
import { Button } from "@/components/ui/button"
import { MainNav } from "@/components/main-nav"
import { SiteFooter } from "@/components/site-footer"
import { LanguageThemeSelector } from "@/components/language-theme-selector"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ClientCalendar } from "@/components/client-calendar"

// Definición de tipos para los eventos
export interface CalendarEvent {
  id: string
  title: string
  date: string // Formato ISO para serialización
  className: string
  color: string
}

// Datos de ejemplo para los eventos con fechas serializadas
const events: CalendarEvent[] = [
  {
    id: "1",
    title: "Entrega de Tarea: Matemáticas",
    date: "2023-04-15", // Formato ISO para fechas
    className: "Matemáticas 101",
    color: "bg-class-blue",
  },
  {
    id: "2",
    title: "Examen Parcial: Física",
    date: "2023-04-18",
    className: "Física para Principiantes",
    color: "bg-class-purple",
  },
  {
    id: "3",
    title: "Proyecto Final: Programación",
    date: "2023-04-25",
    className: "Introducción a la Programación",
    color: "bg-class-green",
  },
]

export default function CalendarPage() {
  // Fecha actual para mostrar eventos del día (en formato ISO)
  const today = new Date().toISOString().split("T")[0]

  // Filtrar eventos para hoy
  const todayEvents = events.filter((event) => event.date === today)

  // Filtrar eventos futuros (comparando strings de fecha)
  const upcomingEvents = events.filter((event) => event.date >= today)

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
          <MainNav />
          <div className="ml-auto flex items-center space-x-4">
            <LanguageThemeSelector />
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
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">Calendario</h1>
              <p className="max-w-[700px] text-muted-foreground md:text-xl">
                Organiza tu tiempo y mantente al día con todas tus tareas y eventos académicos.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Calendario</CardTitle>
                  <CardDescription>Visualiza tus eventos y fechas importantes</CardDescription>
                </CardHeader>
                <CardContent>
                  <ClientCalendar />
                </CardContent>
              </Card>

              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Eventos de Hoy</CardTitle>
                    <CardDescription>
                      {new Date().toLocaleDateString("es-ES", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <EventsList events={todayEvents} />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Próximos Eventos</CardTitle>
                    <CardDescription>Eventos programados para los próximos días</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <EventsList events={upcomingEvents} showDate={true} />
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}

// Componente de servidor para renderizar la lista de eventos
function EventsList({ events, showDate = false }: { events: CalendarEvent[]; showDate?: boolean }) {
  if (events.length === 0) {
    return <p className="text-muted-foreground">No hay eventos programados.</p>
  }

  return (
    <div className="space-y-4">
      {events.map((event) => (
        <div key={event.id} className="flex items-center space-x-4">
          <div className={`h-4 w-4 rounded-full ${event.color}`}></div>
          <div>
            <p className="font-medium">{event.title}</p>
            <p className="text-sm text-muted-foreground">
              {event.className}
              {showDate && (
                <>
                  {" • "}
                  {new Date(event.date).toLocaleDateString("es-ES", { day: "numeric", month: "long" })}
                </>
              )}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}
