"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useAuth } from "@/providers/auth-provider"
import { NotificationService, type Notification } from "@/lib/notification-service"
import { useToast } from "@/hooks/use-toast"

interface NotificationContextType {
  notifications: Notification[]
  unreadCount: number
  loading: boolean
  markAsRead: (id: string) => Promise<void>
  markAllAsRead: () => Promise<void>
  deleteNotification: (id: string) => Promise<void>
  deleteAllNotifications: () => Promise<void>
  refreshNotifications: () => Promise<void>
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  const fetchNotifications = async () => {
    if (!user) {
      setNotifications([])
      setUnreadCount(0)
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      const fetchedNotifications = await NotificationService.getNotifications(user.uid)
      setNotifications(fetchedNotifications)

      const count = await NotificationService.getUnreadCount(user.uid)
      setUnreadCount(count)
    } catch (error) {
      console.error("Error fetching notifications:", error)
      toast({
        title: "Error",
        description: "No se pudieron cargar las notificaciones",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchNotifications()

    // En una implementación real, aquí se suscribiría a las notificaciones en tiempo real
    // usando Firebase Realtime Database o Firestore onSnapshot

    // Simulamos actualizaciones periódicas para este ejemplo
    const interval = setInterval(fetchNotifications, 60000) // Cada minuto

    return () => clearInterval(interval)
  }, [user])

  const markAsRead = async (id: string) => {
    try {
      await NotificationService.markAsRead(id)
      setNotifications((prev) =>
        prev.map((notification) => (notification.id === id ? { ...notification, read: true } : notification)),
      )
      setUnreadCount((prev) => Math.max(0, prev - 1))
    } catch (error) {
      console.error("Error marking notification as read:", error)
      toast({
        title: "Error",
        description: "No se pudo marcar la notificación como leída",
        variant: "destructive",
      })
    }
  }

  const markAllAsRead = async () => {
    if (!user) return

    try {
      await NotificationService.markAllAsRead(user.uid)
      setNotifications((prev) => prev.map((notification) => ({ ...notification, read: true })))
      setUnreadCount(0)
    } catch (error) {
      console.error("Error marking all notifications as read:", error)
      toast({
        title: "Error",
        description: "No se pudieron marcar todas las notificaciones como leídas",
        variant: "destructive",
      })
    }
  }

  const deleteNotification = async (id: string) => {
    try {
      await NotificationService.deleteNotification(id)
      const deleted = notifications.find((n) => n.id === id)
      setNotifications((prev) => prev.filter((notification) => notification.id !== id))

      if (deleted && !deleted.read) {
        setUnreadCount((prev) => Math.max(0, prev - 1))
      }
    } catch (error) {
      console.error("Error deleting notification:", error)
      toast({
        title: "Error",
        description: "No se pudo eliminar la notificación",
        variant: "destructive",
      })
    }
  }

  const deleteAllNotifications = async () => {
    if (!user) return

    try {
      await NotificationService.deleteAllNotifications(user.uid)
      setNotifications([])
      setUnreadCount(0)
    } catch (error) {
      console.error("Error deleting all notifications:", error)
      toast({
        title: "Error",
        description: "No se pudieron eliminar todas las notificaciones",
        variant: "destructive",
      })
    }
  }

  const refreshNotifications = fetchNotifications

  const value = {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    deleteAllNotifications,
    refreshNotifications,
  }

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>
}

export function useNotifications() {
  const context = useContext(NotificationContext)
  if (context === undefined) {
    throw new Error("useNotifications must be used within a NotificationProvider")
  }
  return context
}
