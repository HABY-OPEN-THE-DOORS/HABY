"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Send, Image, LinkIcon, FileText } from "lucide-react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface Announcement {
  id: string
  author: {
    name: string
    avatar: string
    initials: string
    role: "teacher" | "student"
  }
  content: string
  timestamp: string
  attachments?: {
    type: "image" | "document" | "link"
    name: string
    url: string
  }[]
  comments?: {
    id: string
    author: {
      name: string
      avatar: string
      initials: string
      role: "teacher" | "student"
    }
    content: string
    timestamp: string
  }[]
}

export function ClassStream({ classId }: { classId: string }) {
  const [newAnnouncement, setNewAnnouncement] = useState("")
  const [attachmentType, setAttachmentType] = useState<"none" | "file" | "link" | "image">("none")
  const [attachmentUrl, setAttachmentUrl] = useState("")
  const [attachmentName, setAttachmentName] = useState("")
  const [showComments, setShowComments] = useState<Record<string, boolean>>({})
  const [newComments, setNewComments] = useState<Record<string, string>>({})

  const [announcements, setAnnouncements] = useState<Announcement[]>([
    {
      id: "1",
      author: {
        name: "Dr. Juan Pérez",
        avatar: "/placeholder.svg",
        initials: "JP",
        role: "teacher",
      },
      content:
        "¡Bienvenidos a Matemáticas 101! Estoy emocionado de comenzar este viaje con todos ustedes. Por favor, asegúrense de revisar el programa del curso y vengan preparados para nuestra primera clase.",
      timestamp: "Hace 2 días",
      attachments: [
        {
          type: "document",
          name: "Programa_Matematicas101.pdf",
          url: "#",
        },
      ],
      comments: [
        {
          id: "1",
          author: {
            name: "Ana Martínez",
            avatar: "/placeholder.svg",
            initials: "AM",
            role: "student",
          },
          content: "¡Gracias profesor! Estoy emocionada por comenzar el curso.",
          timestamp: "Hace 1 día",
        },
      ],
    },
    {
      id: "2",
      author: {
        name: "Dr. Juan Pérez",
        avatar: "/placeholder.svg",
        initials: "JP",
        role: "teacher",
      },
      content:
        "Recordatorio: Su primera tarea vence el próximo viernes. Por favor, envíenla a través de la pestaña de tareas.",
      timestamp: "Hace 1 día",
    },
  ])

  const handleSubmit = () => {
    if (!newAnnouncement.trim() && (!attachmentUrl || !attachmentName)) return

    let attachments
    if (attachmentType !== "none" && attachmentUrl && attachmentName) {
      attachments = [
        {
          type: attachmentType === "file" ? "document" : attachmentType,
          name: attachmentName,
          url: attachmentUrl,
        },
      ]
    }

    const announcement: Announcement = {
      id: Date.now().toString(),
      author: {
        name: "Dr. Juan Pérez",
        avatar: "/placeholder.svg",
        initials: "JP",
        role: "teacher",
      },
      content: newAnnouncement,
      timestamp: "Ahora mismo",
      attachments,
    }

    setAnnouncements([announcement, ...announcements])
    setNewAnnouncement("")
    setAttachmentType("none")
    setAttachmentUrl("")
    setAttachmentName("")
  }

  const toggleComments = (id: string) => {
    setShowComments((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  const handleAddComment = (announcementId: string) => {
    if (!newComments[announcementId]?.trim()) return

    const updatedAnnouncements = announcements.map((announcement) => {
      if (announcement.id === announcementId) {
        const comments = announcement.comments || []
        return {
          ...announcement,
          comments: [
            ...comments,
            {
              id: Date.now().toString(),
              author: {
                name: "Ana Martínez",
                avatar: "/placeholder.svg",
                initials: "AM",
                role: "student",
              },
              content: newComments[announcementId],
              timestamp: "Ahora mismo",
            },
          ],
        }
      }
      return announcement
    })

    setAnnouncements(updatedAnnouncements)
    setNewComments((prev) => ({
      ...prev,
      [announcementId]: "",
    }))
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center space-x-4">
            <Avatar>
              <AvatarImage src="/placeholder.svg" alt="Avatar del usuario" />
              <AvatarFallback>JP</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">Anunciar algo a tu clase</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Comparte un recurso, anuncio o pregunta..."
            value={newAnnouncement}
            onChange={(e) => setNewAnnouncement(e.target.value)}
            className="min-h-[100px]"
          />

          {attachmentType === "file" && (
            <div className="mt-4 space-y-2">
              <Label htmlFor="file-name">Nombre del archivo</Label>
              <Input
                id="file-name"
                value={attachmentName}
                onChange={(e) => setAttachmentName(e.target.value)}
                placeholder="Ej. Tarea1.pdf"
              />
              <Label htmlFor="file-url">URL del archivo</Label>
              <Input
                id="file-url"
                value={attachmentUrl}
                onChange={(e) => setAttachmentUrl(e.target.value)}
                placeholder="https://ejemplo.com/archivo.pdf"
              />
            </div>
          )}

          {attachmentType === "link" && (
            <div className="mt-4 space-y-2">
              <Label htmlFor="link-name">Título del enlace</Label>
              <Input
                id="link-name"
                value={attachmentName}
                onChange={(e) => setAttachmentName(e.target.value)}
                placeholder="Ej. Sitio web interesante"
              />
              <Label htmlFor="link-url">URL</Label>
              <Input
                id="link-url"
                value={attachmentUrl}
                onChange={(e) => setAttachmentUrl(e.target.value)}
                placeholder="https://ejemplo.com"
              />
            </div>
          )}

          {attachmentType === "image" && (
            <div className="mt-4 space-y-2">
              <Label htmlFor="image-name">Título de la imagen</Label>
              <Input
                id="image-name"
                value={attachmentName}
                onChange={(e) => setAttachmentName(e.target.value)}
                placeholder="Ej. Diagrama de flujo"
              />
              <Label htmlFor="image-url">URL de la imagen</Label>
              <Input
                id="image-url"
                value={attachmentUrl}
                onChange={(e) => setAttachmentUrl(e.target.value)}
                placeholder="https://ejemplo.com/imagen.jpg"
              />
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <div className="flex space-x-2">
            <Tabs value={attachmentType} onValueChange={(value) => setAttachmentType(value as any)}>
              <TabsList className="h-9">
                <TabsTrigger value="file" className="px-2">
                  <FileText className="h-4 w-4" />
                </TabsTrigger>
                <TabsTrigger value="link" className="px-2">
                  <LinkIcon className="h-4 w-4" />
                </TabsTrigger>
                <TabsTrigger value="image" className="px-2">
                  <Image className="h-4 w-4" />
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          <Button
            size="sm"
            onClick={handleSubmit}
            disabled={!newAnnouncement.trim() && (!attachmentUrl || !attachmentName)}
          >
            <Send className="h-4 w-4 mr-2" />
            Publicar
          </Button>
        </CardFooter>
      </Card>

      <div className="space-y-4">
        {announcements.map((announcement) => (
          <Card key={announcement.id}>
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-4">
                <Avatar>
                  <AvatarImage src={announcement.author.avatar} alt={announcement.author.name} />
                  <AvatarFallback>{announcement.author.initials}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{announcement.author.name}</p>
                  <p className="text-xs text-muted-foreground">{announcement.timestamp}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm whitespace-pre-line">{announcement.content}</p>

              {announcement.attachments && announcement.attachments.length > 0 && (
                <div className="mt-4">
                  {announcement.attachments.map((attachment, index) => (
                    <div key={index} className="flex items-center p-2 rounded-md bg-muted">
                      {attachment.type === "document" && <FileText className="h-4 w-4 mr-2" />}
                      {attachment.type === "link" && <LinkIcon className="h-4 w-4 mr-2" />}
                      {attachment.type === "image" && <Image className="h-4 w-4 mr-2" />}
                      <a href={attachment.url} className="text-sm text-primary hover:underline">
                        {attachment.name}
                      </a>
                    </div>
                  ))}
                </div>
              )}

              {announcement.comments && announcement.comments.length > 0 && showComments[announcement.id] && (
                <div className="mt-4 space-y-3 pl-4 border-l-2">
                  {announcement.comments.map((comment) => (
                    <div key={comment.id} className="flex items-start space-x-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={comment.author.avatar} alt={comment.author.name} />
                        <AvatarFallback className="text-xs">{comment.author.initials}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center">
                          <p className="text-xs font-medium">{comment.author.name}</p>
                          <p className="text-xs text-muted-foreground ml-2">{comment.timestamp}</p>
                        </div>
                        <p className="text-sm">{comment.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {showComments[announcement.id] && (
                <div className="mt-4 flex items-center space-x-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src="/placeholder.svg" alt="Tu avatar" />
                    <AvatarFallback className="text-xs">AM</AvatarFallback>
                  </Avatar>
                  <Input
                    placeholder="Añadir un comentario..."
                    value={newComments[announcement.id] || ""}
                    onChange={(e) =>
                      setNewComments((prev) => ({
                        ...prev,
                        [announcement.id]: e.target.value,
                      }))
                    }
                    className="h-8 text-sm"
                  />
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleAddComment(announcement.id)}
                    disabled={!newComments[announcement.id]?.trim()}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button variant="ghost" size="sm" onClick={() => toggleComments(announcement.id)}>
                {showComments[announcement.id] ? "Ocultar comentarios" : "Comentar"}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
