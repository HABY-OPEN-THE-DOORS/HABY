"use client"

import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useNotifications } from "@/providers/notification-provider"
import { NotificationList } from "@/components/notification/notification-list"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export function NotificationIndicator() {
  const { unreadCount, markAllAsRead } = useNotifications()

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className={cn(
                "absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs",
                unreadCount > 99 ? "min-w-[1.25rem]" : "",
              )}
            >
              {unreadCount > 99 ? "99+" : unreadCount}
            </Badge>
          )}
          <span className="sr-only">Notificaciones</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between p-4 border-b">
          <h4 className="font-medium">Notificaciones</h4>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" onClick={markAllAsRead}>
              Marcar todas como leídas
            </Button>
          )}
        </div>
        <NotificationList maxHeight="400px" />
        <div className="p-2 border-t text-center">
          <Button variant="link" size="sm" asChild>
            <a href="/dashboard/notifications">Ver todas las notificaciones</a>
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
