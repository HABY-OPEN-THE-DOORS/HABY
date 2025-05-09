"use client"

import { useNotifications } from "@/providers/notification-provider"
import { NotificationItem } from "@/components/notification/notification-item"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Loader2 } from "lucide-react"

interface NotificationListProps {
  maxHeight?: string
  showEmpty?: boolean
  limit?: number
}

export function NotificationList({ maxHeight = "none", showEmpty = true, limit }: NotificationListProps) {
  const { notifications, loading } = useNotifications()

  const displayNotifications = limit ? notifications.slice(0, limit) : notifications

  if (loading) {
    return (
      <div className="flex justify-center items-center p-6">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (displayNotifications.length === 0 && showEmpty) {
    return (
      <div className="p-6 text-center text-muted-foreground">
        <p>No tienes notificaciones</p>
      </div>
    )
  }

  return (
    <ScrollArea className={maxHeight !== "none" ? `max-h-[${maxHeight}]` : ""}>
      <div className="divide-y">
        {displayNotifications.map((notification) => (
          <NotificationItem key={notification.id} notification={notification} />
        ))}
      </div>
    </ScrollArea>
  )
}
