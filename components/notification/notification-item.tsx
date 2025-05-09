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

  const formattedTime = notification.createdAt
    ? formatDistanceToNow(notification.createdAt.toDate(), { addSuffix: true, locale: es })
    : ""

  return (
    <div
      className={cn(
        "p-4 hover:bg-muted/50 cursor-pointer transition-colors",
        notification.read ? "bg-white" : "bg-blue-50",
      )}
      onClick={handleClick}
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-1">{getIcon()}</div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium">{notification.title}</p>
          <p className="text-sm text-muted-foreground line-clamp-2">{notification.message}</p>
          <p className="text-xs text-muted-foreground mt-1">{formattedTime}</p>
        </div>
        <div className="flex-shrink-0 flex items-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" onClick={(e) => e.stopPropagation()}>
                <MoreVertical className="h-4 w-4" />
                <span className="sr-only">Opciones</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {!notification.read && (
                <DropdownMenuItem onClick={handleMarkAsRead} disabled={isMarking}>
                  <Check className="h-4 w-4 mr-2" />
                  Marcar como leída
                </DropdownMenuItem>
              )}
              <DropdownMenuItem
                onClick={handleDelete}
                disabled={isDeleting}
                className="text-destructive focus:text-destructive"
              >
                <X className="h-4 w-4 mr-2" />
                Eliminar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  )
}
