"use client"

import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Users, BookOpen, MoreHorizontal } from "lucide-react"
import { useLanguage } from "@/providers/language-provider"
import { motion } from "framer-motion"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"

interface ClassData {
  id: string
  name: string
  description: string
  section: string
  color: string
  teacherId?: string
  code?: string
}

interface ClassCardProps {
  classData: ClassData
  studentCount?: number
  teacherName?: string
}

export function ClassCard({ classData, studentCount = 0, teacherName }: ClassCardProps) {
  const { t } = useLanguage()

  return (
    <Link href={`/dashboard/classes/${classData.id}`} className="block">
      <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.2 }}>
        <Card className="h-full overflow-hidden transition-all hover:shadow-md relative group">
          <div
            className={cn(
              "h-2 w-full",
              classData.color === "bg-purple-600"
                ? "bg-haby-accent"
                : classData.color === "bg-blue-600"
                  ? "bg-haby-accent-light"
                  : classData.color === "bg-green-600"
                    ? "bg-haby-success"
                    : classData.color === "bg-red-600"
                      ? "bg-haby-error"
                      : classData.color === "bg-amber-500"
                        ? "bg-haby-warning"
                        : classData.color === "bg-teal-600"
                          ? "bg-haby-info"
                          : classData.color || "bg-haby-accent",
            )}
          />
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="line-clamp-1">{classData.name}</CardTitle>
                <CardDescription className="flex items-center text-sm">
                  <span>{classData.section}</span>
                  <span className="mx-2">•</span>
                  <span className="flex items-center">
                    <Users className="h-3 w-3 mr-1" />
                    {studentCount} {t("class.students")}
                  </span>
                </CardDescription>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">Más opciones</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Ver detalles</DropdownMenuItem>
                  <DropdownMenuItem>Copiar código de clase</DropdownMenuItem>
                  <DropdownMenuItem>Archivar clase</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground line-clamp-3">{classData.description}</p>
          </CardContent>
          <CardFooter className="flex justify-between border-t pt-4 pb-2">
            {teacherName && (
              <div className="flex items-center text-sm text-muted-foreground">
                <BookOpen className="h-3 w-3 mr-1" />
                <span>
                  {t("class.teacher")}: {teacherName}
                </span>
              </div>
            )}
            {classData.code && (
              <Badge variant="outline" className="ml-auto">
                Código: {classData.code}
              </Badge>
            )}
          </CardFooter>
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
        </Card>
      </motion.div>
    </Link>
  )
}
