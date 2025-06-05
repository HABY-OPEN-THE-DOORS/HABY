import { db } from "@/lib/firebase"
import {
  collection,
  addDoc,
  query,
  where,
  orderBy,
  getDocs,
  updateDoc,
  doc,
  serverTimestamp,
  type Timestamp,
  deleteDoc,
  writeBatch,
  limit,
} from "firebase/firestore"

export interface Notification {
  id?: string
  userId: string
  title: string
  message: string
  type: NotificationType
  read: boolean
  actionUrl?: string
  createdAt?: Timestamp | Date | any
  sourceId?: string
  sourceType?: string
  icon?: string
}

export type NotificationType =
  | "announcement"
  | "assignment"
  | "comment"
  | "grade"
  | "invitation"
  | "material"
  | "message"
  | "reminder"
  | "system"

// Check if we're in demo mode
const isDemoMode = process.env.NEXT_PUBLIC_DEMO_MODE === "true" || (db as any)?._isMock === true

// Mock data for demo mode
const mockNotifications: Notification[] = [
  {
    id: "1",
    userId: "demo-user",
    title: "Bienvenido a HABY-CLASS",
    message: "¡Gracias por probar nuestra plataforma educativa! Explora todas las funcionalidades disponibles.",
    type: "system",
    read: false,
    createdAt: new Date(),
    icon: "star",
  },
  {
    id: "2",
    userId: "demo-user",
    title: "Nueva tarea en Matemáticas",
    message: "Se ha asignado una nueva tarea: Ecuaciones cuadráticas. Fecha límite: 15 de enero.",
    type: "assignment",
    read: false,
    actionUrl: "/dashboard/classes/math/assignments/1",
    createdAt: new Date(Date.now() - 3600000), // 1 hour ago
    icon: "file-text",
  },
  {
    id: "3",
    userId: "demo-user",
    title: "Calificación publicada",
    message: "Has recibido 95/100 en el examen de Historia del siglo XX. ¡Excelente trabajo!",
    type: "grade",
    read: true,
    actionUrl: "/dashboard/classes/history/grades",
    createdAt: new Date(Date.now() - 7200000), // 2 hours ago
    icon: "award",
  },
  {
    id: "4",
    userId: "demo-user",
    title: "Nuevo anuncio en Física",
    message: "El profesor ha publicado información importante sobre el laboratorio de la próxima semana.",
    type: "announcement",
    read: false,
    actionUrl: "/dashboard/classes/physics/stream",
    createdAt: new Date(Date.now() - 10800000), // 3 hours ago
    icon: "megaphone",
  },
  {
    id: "5",
    userId: "demo-user",
    title: "Recordatorio de entrega",
    message: "La tarea de Literatura vence mañana a las 23:59. No olvides subirla a tiempo.",
    type: "reminder",
    read: false,
    actionUrl: "/dashboard/classes/literature/assignments/5",
    createdAt: new Date(Date.now() - 14400000), // 4 hours ago
    icon: "bell",
  },
]

export class NotificationService {
  static async createNotification(notification: Omit<Notification, "id" | "read" | "createdAt">): Promise<string> {
    if (isDemoMode) {
      console.log("Demo mode: Creating notification", notification)
      const newNotification: Notification = {
        ...notification,
        id: `demo-${Date.now()}`,
        read: false,
        createdAt: new Date(),
      }
      mockNotifications.unshift(newNotification)
      return newNotification.id!
    }

    try {
      const notificationRef = collection(db, "notifications")
      const docRef = await addDoc(notificationRef, {
        ...notification,
        read: false,
        createdAt: serverTimestamp(),
      })
      return docRef.id
    } catch (error) {
      console.error("Error creating notification:", error)
      throw error
    }
  }

  static async getNotifications(userId: string, limitCount = 50): Promise<Notification[]> {
    if (isDemoMode) {
      console.log("Demo mode: Getting notifications for user", userId)
      return mockNotifications
        .filter((n) => n.userId === userId || n.userId === "demo-user")
        .sort((a, b) => {
          const dateA = a.createdAt instanceof Date ? a.createdAt : new Date(a.createdAt || 0)
          const dateB = b.createdAt instanceof Date ? b.createdAt : new Date(b.createdAt || 0)
          return dateB.getTime() - dateA.getTime()
        })
        .slice(0, limitCount)
    }

    try {
      const notificationsQuery = query(
        collection(db, "notifications"),
        where("userId", "==", userId),
        orderBy("createdAt", "desc"),
        limit(limitCount),
      )

      const querySnapshot = await getDocs(notificationsQuery)
      return querySnapshot.docs.map(
        (doc) =>
          ({
            id: doc.id,
            ...doc.data(),
          }) as Notification,
      )
    } catch (error) {
      console.error("Error getting notifications:", error)
      throw error
    }
  }

  static async getUnreadCount(userId: string): Promise<number> {
    if (isDemoMode) {
      console.log("Demo mode: Getting unread count for user", userId)
      return mockNotifications.filter((n) => (n.userId === userId || n.userId === "demo-user") && !n.read).length
    }

    try {
      const notificationsQuery = query(
        collection(db, "notifications"),
        where("userId", "==", userId),
        where("read", "==", false),
      )

      const querySnapshot = await getDocs(notificationsQuery)
      return querySnapshot.size
    } catch (error) {
      console.error("Error getting unread count:", error)
      throw error
    }
  }

  static async markAsRead(notificationId: string): Promise<void> {
    if (isDemoMode) {
      console.log("Demo mode: Marking notification as read", notificationId)
      const notification = mockNotifications.find((n) => n.id === notificationId)
      if (notification) {
        notification.read = true
      }
      return
    }

    try {
      const notificationRef = doc(db, "notifications", notificationId)
      await updateDoc(notificationRef, {
        read: true,
      })
    } catch (error) {
      console.error("Error marking notification as read:", error)
      throw error
    }
  }

  static async markAllAsRead(userId: string): Promise<void> {
    if (isDemoMode) {
      console.log("Demo mode: Marking all notifications as read for user", userId)
      mockNotifications.forEach((notification) => {
        if (notification.userId === userId || notification.userId === "demo-user") {
          notification.read = true
        }
      })
      return
    }

    try {
      const notificationsQuery = query(
        collection(db, "notifications"),
        where("userId", "==", userId),
        where("read", "==", false),
      )

      const querySnapshot = await getDocs(notificationsQuery)

      const batch = writeBatch(db)
      querySnapshot.docs.forEach((doc) => {
        batch.update(doc.ref, { read: true })
      })

      await batch.commit()
    } catch (error) {
      console.error("Error marking all notifications as read:", error)
      throw error
    }
  }

  static async deleteNotification(notificationId: string): Promise<void> {
    if (isDemoMode) {
      console.log("Demo mode: Deleting notification", notificationId)
      const index = mockNotifications.findIndex((n) => n.id === notificationId)
      if (index > -1) {
        mockNotifications.splice(index, 1)
      }
      return
    }

    try {
      const notificationRef = doc(db, "notifications", notificationId)
      await deleteDoc(notificationRef)
    } catch (error) {
      console.error("Error deleting notification:", error)
      throw error
    }
  }

  static async deleteAllNotifications(userId: string): Promise<void> {
    if (isDemoMode) {
      console.log("Demo mode: Deleting all notifications for user", userId)
      for (let i = mockNotifications.length - 1; i >= 0; i--) {
        if (mockNotifications[i].userId === userId || mockNotifications[i].userId === "demo-user") {
          mockNotifications.splice(i, 1)
        }
      }
      return
    }

    try {
      const notificationsQuery = query(collection(db, "notifications"), where("userId", "==", userId))

      const querySnapshot = await getDocs(notificationsQuery)

      const batch = writeBatch(db)
      querySnapshot.docs.forEach((doc) => {
        batch.delete(doc.ref)
      })

      await batch.commit()
    } catch (error) {
      console.error("Error deleting all notifications:", error)
      throw error
    }
  }

  // Métodos de ayuda para crear notificaciones específicas
  static async notifyNewAnnouncement(
    userIds: string[],
    className: string,
    announcementTitle: string,
    classId: string,
    announcementId: string,
  ): Promise<void> {
    try {
      const notification = {
        title: `Nuevo anuncio en ${className}`,
        message: announcementTitle,
        type: "announcement" as NotificationType,
        actionUrl: `/dashboard/classes/${classId}/stream?announcement=${announcementId}`,
        sourceId: announcementId,
        sourceType: "announcement",
        icon: "megaphone",
      }

      const promises = userIds.map((userId) =>
        this.createNotification({
          ...notification,
          userId,
        }),
      )

      await Promise.all(promises)
    } catch (error) {
      console.error("Error notifying new announcement:", error)
      throw error
    }
  }

  static async notifyNewAssignment(
    userIds: string[],
    className: string,
    assignmentTitle: string,
    classId: string,
    assignmentId: string,
    dueDate?: Date,
  ): Promise<void> {
    try {
      let message = assignmentTitle
      if (dueDate) {
        const formattedDate = new Intl.DateTimeFormat("es", {
          day: "numeric",
          month: "long",
          year: "numeric",
        }).format(dueDate)
        message = `${assignmentTitle} - Fecha límite: ${formattedDate}`
      }

      const notification = {
        title: `Nueva tarea en ${className}`,
        message,
        type: "assignment" as NotificationType,
        actionUrl: `/dashboard/classes/${classId}/assignments/${assignmentId}`,
        sourceId: assignmentId,
        sourceType: "assignment",
        icon: "file-text",
      }

      const promises = userIds.map((userId) =>
        this.createNotification({
          ...notification,
          userId,
        }),
      )

      await Promise.all(promises)
    } catch (error) {
      console.error("Error notifying new assignment:", error)
      throw error
    }
  }

  static async notifyGraded(
    userId: string,
    className: string,
    assignmentTitle: string,
    grade: string,
    classId: string,
    assignmentId: string,
  ): Promise<void> {
    try {
      await this.createNotification({
        userId,
        title: `Calificación publicada en ${className}`,
        message: `Has recibido ${grade} en ${assignmentTitle}`,
        type: "grade",
        actionUrl: `/dashboard/classes/${classId}/assignments/${assignmentId}`,
        sourceId: assignmentId,
        sourceType: "grade",
        icon: "award",
      })
    } catch (error) {
      console.error("Error notifying grade:", error)
      throw error
    }
  }

  static async notifyNewComment(
    userId: string,
    authorName: string,
    contentTitle: string,
    contentType: "announcement" | "assignment",
    classId: string,
    contentId: string,
  ): Promise<void> {
    try {
      const actionUrl =
        contentType === "announcement"
          ? `/dashboard/classes/${classId}/stream?announcement=${contentId}`
          : `/dashboard/classes/${classId}/assignments/${contentId}`

      await this.createNotification({
        userId,
        title: `Nuevo comentario`,
        message: `${authorName} comentó en "${contentTitle}"`,
        type: "comment",
        actionUrl,
        sourceId: contentId,
        sourceType: contentType,
        icon: "message-circle",
      })
    } catch (error) {
      console.error("Error notifying new comment:", error)
      throw error
    }
  }

  static async notifyNewMaterial(
    userIds: string[],
    className: string,
    materialTitle: string,
    classId: string,
    materialId: string,
  ): Promise<void> {
    try {
      const notification = {
        title: `Nuevo material en ${className}`,
        message: materialTitle,
        type: "material" as NotificationType,
        actionUrl: `/dashboard/classes/${classId}/materials?material=${materialId}`,
        sourceId: materialId,
        sourceType: "material",
        icon: "file",
      }

      const promises = userIds.map((userId) =>
        this.createNotification({
          ...notification,
          userId,
        }),
      )

      await Promise.all(promises)
    } catch (error) {
      console.error("Error notifying new material:", error)
      throw error
    }
  }

  static async notifyClassInvitation(
    userId: string,
    className: string,
    teacherName: string,
    classId: string,
  ): Promise<void> {
    try {
      await this.createNotification({
        userId,
        title: `Invitación a clase`,
        message: `${teacherName} te ha invitado a unirte a la clase "${className}"`,
        type: "invitation",
        actionUrl: `/dashboard/invitations?class=${classId}`,
        sourceId: classId,
        sourceType: "class",
        icon: "user-plus",
      })
    } catch (error) {
      console.error("Error notifying class invitation:", error)
      throw error
    }
  }

  static async notifyAssignmentReminder(
    userId: string,
    className: string,
    assignmentTitle: string,
    dueDate: Date,
    classId: string,
    assignmentId: string,
  ): Promise<void> {
    try {
      const formattedDate = new Intl.DateTimeFormat("es", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(dueDate)

      await this.createNotification({
        userId,
        title: `Recordatorio de tarea`,
        message: `La tarea "${assignmentTitle}" en ${className} vence el ${formattedDate}`,
        type: "reminder",
        actionUrl: `/dashboard/classes/${classId}/assignments/${assignmentId}`,
        sourceId: assignmentId,
        sourceType: "assignment",
        icon: "bell",
      })
    } catch (error) {
      console.error("Error notifying assignment reminder:", error)
      throw error
    }
  }
}
