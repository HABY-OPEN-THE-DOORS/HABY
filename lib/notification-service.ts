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
} from "firebase/firestore"

export interface Notification {
  id?: string
  userId: string
  title: string
  message: string
  type: NotificationType
  read: boolean
  actionUrl?: string
  createdAt?: Timestamp
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

export class NotificationService {
  static async createNotification(notification: Omit<Notification, "id" | "read" | "createdAt">): Promise<string> {
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

  static async getNotifications(userId: string, limit = 50): Promise<Notification[]> {
    try {
      const notificationsQuery = query(
        collection(db, "notifications"),
        where("userId", "==", userId),
        orderBy("createdAt", "desc"),
        limit(limit),
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
    try {
      const notificationsQuery = query(
        collection(db, "notifications"),
        where("userId", "==", userId),
        where("read", "==", false),
      )

      const querySnapshot = await getDocs(notificationsQuery)

      const batch = db.batch()
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
    try {
      const notificationRef = doc(db, "notifications", notificationId)
      await deleteDoc(notificationRef)
    } catch (error) {
      console.error("Error deleting notification:", error)
      throw error
    }
  }

  static async deleteAllNotifications(userId: string): Promise<void> {
    try {
      const notificationsQuery = query(collection(db, "notifications"), where("userId", "==", userId))

      const querySnapshot = await getDocs(notificationsQuery)

      const batch = db.batch()
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
