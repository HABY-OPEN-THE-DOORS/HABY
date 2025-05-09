"use client"

import { useState } from "react"
import { useNotifications } from "@/providers/notification-provider"
import { NotificationList } from "@/components/notification/notification-list"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Search, Trash2 } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export default function NotificationsPage() {
  const { notifications, deleteAllNotifications } = useNotifications()
  const [filter, setFilter] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")

  const filteredNotifications = notifications.filter((notification) => {
    // Filtrar por tipo
    if (filter !== "all" && notification.type !== filter) {
      return false
    }

    // Filtrar por búsqueda
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return notification.title.toLowerCase().includes(query) || notification.message.toLowerCase().includes(query)
    }

    return true
  })

  return (
    <div className="container py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Notificaciones</h1>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline" size="sm">
              <Trash2 className="h-4 w-4 mr-2" />
              Eliminar todas
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>¿Eliminar todas las notificaciones?</AlertDialogTitle>
              <AlertDialogDescription>
                Esta acción no se puede deshacer. Todas tus notificaciones serán eliminadas permanentemente.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={deleteAllNotifications}>Eliminar</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <Tabs defaultValue="all" value={filter} onValueChange={setFilter}>
          <TabsList>
            <TabsTrigger value="all">Todas</TabsTrigger>
            <TabsTrigger value="assignment">Tareas</TabsTrigger>
            <TabsTrigger value="announcement">Anuncios</TabsTrigger>
            <TabsTrigger value="grade">Calificaciones</TabsTrigger>
            <TabsTrigger value="comment">Comentarios</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="relative w-full sm:w-auto">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar notificaciones..."
            className="pl-8 w-full sm:w-[250px]"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <NotificationList showEmpty={true} />
      </div>

      {/* Copyright notice */}
      <div className="mt-12 pt-6 border-t text-center text-xs text-muted-foreground">
        <p>
          © {new Date().getFullYear()} HABY-CLASS. Todos los derechos reservados.
          <br />
          Desarrollado por HABY - Heber Zadkiel Garcia Perez
        </p>
      </div>
    </div>
  )
}
