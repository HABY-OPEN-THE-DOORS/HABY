"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { formatDistanceToNow } from "date-fns"
import { es } from "date-fns/locale"
import { Bell, Megaphone, FileText, MessageCircle, Award, UserPlus, File, X, Check, MoreVertical } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useNotifications } from "@/providers/notification-provider"
import type { Notification } from "@/lib/notification-service"
import { cn } from "@/lib/utils"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface NotificationItemProps {
  notification: Notification
}

export function NotificationItem({ notification }: NotificationItemProps) {
  const router = useRouter()
  const { markAsRead, deleteNotification } = useNotifications()
  const [isDeleting, setIsDeleting] = useState(false)
  const [isMarking, setIsMarking] = useState(false)

  const getIcon = () => {
    switch (notification.type) {
      case "announcement":
        return <Megaphone className="h-5 w-5 text-blue-500" />
      case "assignment":
        return <FileText className="h-5 w-5 text-purple-500" />
      case "comment":
        return <MessageCircle className="h-5 w-5 text-green-500" />
      case "grade":
        return <Award className="h-5 w-5 text-yellow-500" />
      case "invitation":
        return <UserPlus className="h-5 w-5 text-indigo-500" />
      case "material":
        return <File className="h-5 w-5 text-cyan-500" />
      case "reminder":
        return <Bell className="h-5 w-5 text-red-500" />
      default:
        return <Bell className="h-5 w-5 text-gray-500" />
    }
  }

  const handleClick = async () => {
    if (!notification.read && notification.id) {
      setIsMarking(true)
      await markAsRead(notification.id)
      setIsMarking(false)
    }

    if (notification.actionUrl) {
      router.push(notification.actionUrl)
    }
  }

  const handleMarkAsRead = async (e: React.MouseEvent) => {
    e.stopPropagation()
    if (notification.id && !notification.read) {
      setIsMarking(true)
      await markAsRead(notification.id)
      setIsMarking(false)
    }
  }

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation()
    if (notification.id) {
      setIsDeleting(true)
      await deleteNotification(notification.id)
      setIsDeleting(false)
    }
  }

  // Helper function to safely convert timestamp to Date
  const getDateFromTimestamp = (timestamp: any): Date => {
    if (!timestamp) {
      return new Date()
    }

    // If it's already a Date object
    if (timestamp instanceof Date) {
      return timestamp
    }

    // If it's a Firestore Timestamp with toDate method
    if (timestamp.toDate && typeof timestamp.toDate === "function") {
      return timestamp.toDate()
    }

    // If it's a mock timestamp with seconds property
    if (timestamp.seconds) {
      return new Date(timestamp.seconds * 1000)
    }

    // If it's a number (milliseconds)
    if (typeof timestamp === "number") {
      return new Date(timestamp)
    }

    // If it's a string
    if (typeof timestamp === "string") {
      return new Date(timestamp)
    }

    // Fallback to current date
    return new Date()
  }

  const formattedTime = notification.createdAt
    ? formatDistanceToNow(getDateFromTimestamp(notification.createdAt), {
        addSuffix: true,
        locale: es,
      })
    : "Hace un momento"

  return (
    <div
      className={cn(
        "p-4 hover:bg-muted/50 cursor-pointer transition-colors border-b border-border/50 last:border-b-0",
        notification.read ? "bg-background" : "bg-blue-50 dark:bg-blue-950/20",
      )}
      onClick={handleClick}
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-1">{getIcon()}</div>
        <div className="flex-1 min-w-0">
          <p
            className={cn(
              "text-sm line-clamp-1",
              notification.read ? "font-normal text-muted-foreground" : "font-medium text-foreground",
            )}
          >
            {notification.title}
          </p>
          <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{notification.message}</p>
          <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
            <span>{formattedTime}</span>
            {!notification.read && <span className="inline-block w-2 h-2 bg-blue-500 rounded-full ml-2" />}
          </p>
        </div>
        <div className="flex-shrink-0 flex items-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => e.stopPropagation()}>
                <MoreVertical className="h-4 w-4" />
                <span className="sr-only">Opciones</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {!notification.read && (
                <DropdownMenuItem onClick={handleMarkAsRead} disabled={isMarking}>
                  <Check className="h-4 w-4 mr-2" />
                  {isMarking ? "Marcando..." : "Marcar como leída"}
                </DropdownMenuItem>
              )}
              <DropdownMenuItem
                onClick={handleDelete}
                disabled={isDeleting}
                className="text-destructive focus:text-destructive"
              >
                <X className="h-4 w-4 mr-2" />
                {isDeleting ? "Eliminando..." : "Eliminar"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  )
}
