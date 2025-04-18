"use client"

import { useState } from "react"
import Link from "next/link"
import { DashboardShell } from "@/components/dashboard/shell"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, MoreHorizontal, Users, Calendar, FileText } from "lucide-react"
import { ClassStream } from "@/components/class/stream"
import { ClassAssignments } from "@/components/class/assignments"
import { ClassPeople } from "@/components/class/people"
import { ClassGrades } from "@/components/class/grades"
import { cn } from "@/lib/utils"
import { useLanguage } from "@/providers/language-provider"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"

export default function ClassPage({ params }: { params: { id: string } }) {
  const [activeTab, setActiveTab] = useState("stream")
  const { t } = useLanguage()

  // En una aplicación real, obtendrías los datos de la clase según el ID
  const classData = {
    id: params.id,
    title: "Matemáticas 101",
    description: "Introducción a conceptos matemáticos básicos y técnicas de resolución de problemas.",
    section: "Sección A",
    studentCount: 28,
    color: "bg-class-blue",
    teacherName: "Dr. Juan Pérez",
    code: "abc123",
    nextAssignment: {
      title: "Ejercicios de álgebra",
      dueDate: "Hoy, 11:59 PM",
    },
  }

  return (
    <DashboardShell>
      <div className={cn("h-2 w-full rounded-sm", classData.color, "mb-4")} />
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-1" />
                {t("class.back")}
              </Button>
            </Link>
            <h1 className="text-2xl font-bold tracking-tight">{classData.title}</h1>
          </div>
          <p className="text-muted-foreground flex flex-wrap items-center gap-x-2 gap-y-1">
            <span>{classData.section}</span>
            <span className="text-xs">•</span>
            <span className="flex items-center">
              <Users className="h-4 w-4 mr-1" />
              {classData.studentCount} {t("class.students")}
            </span>
            <span className="text-xs">•</span>
            <span>
              {t("class.teacher")}: {classData.teacherName}
            </span>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="outline" className="px-3 py-1 text-xs">
            Código: {classData.code}
          </Badge>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Más opciones</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Calendar className="h-4 w-4 mr-2" />
                Ver calendario
              </DropdownMenuItem>
              <DropdownMenuItem>
                <FileText className="h-4 w-4 mr-2" />
                Exportar calificaciones
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive focus:text-destructive">Abandonar clase</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {classData.nextAssignment && (
        <div className="mb-6 p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Calendar className="h-5 w-5 text-amber-600 dark:text-amber-400 mr-2" />
              <div>
                <p className="font-medium">Próxima entrega: {classData.nextAssignment.title}</p>
                <p className="text-sm text-amber-700 dark:text-amber-300">Vence: {classData.nextAssignment.dueDate}</p>
              </div>
            </div>
            <Button size="sm" variant="outline" className="border-amber-300 dark:border-amber-700">
              Ver tarea
            </Button>
          </div>
        </div>
      )}

      <Tabs defaultValue="stream" value={activeTab} onValueChange={setActiveTab} className="mt-6">
        <TabsList className="w-full sm:w-auto">
          <TabsTrigger value="stream">{t("class.tabs.stream")}</TabsTrigger>
          <TabsTrigger value="assignments">{t("class.tabs.assignments")}</TabsTrigger>
          <TabsTrigger value="people">{t("class.tabs.people")}</TabsTrigger>
          <TabsTrigger value="grades">{t("class.tabs.grades")}</TabsTrigger>
        </TabsList>
        <TabsContent value="stream" className="mt-6">
          <ClassStream classId={params.id} />
        </TabsContent>
        <TabsContent value="assignments" className="mt-6">
          <ClassAssignments classId={params.id} />
        </TabsContent>
        <TabsContent value="people" className="mt-6">
          <ClassPeople classId={params.id} />
        </TabsContent>
        <TabsContent value="grades" className="mt-6">
          <ClassGrades classId={params.id} />
        </TabsContent>
      </Tabs>
    </DashboardShell>
  )
}
