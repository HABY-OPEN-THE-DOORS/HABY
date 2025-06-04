"use client"

import { memo, useCallback } from "react"
import Link from "next/link"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Users } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { OptimizedImage } from "@/components/optimized-image"
import { LazyLoadWrapper } from "@/components/lazy-load-wrapper"

interface ClassCardProps {
  id: string
  title: string
  description: string
  section: string
  studentCount: number
  color: string
  bannerUrl?: string
  onEdit?: (id: string) => void
  onDelete?: (id: string) => void
  onDuplicate?: (id: string) => void
  onArchive?: (id: string) => void
}

function ClassCardComponent({
  id,
  title,
  description,
  section,
  studentCount,
  color,
  bannerUrl,
  onEdit,
  onDelete,
  onDuplicate,
  onArchive,
}: ClassCardProps) {
  // Usar useCallback para evitar re-renderizados innecesarios
  const handleEdit = useCallback(() => onEdit?.(id), [id, onEdit])
  const handleDelete = useCallback(() => onDelete?.(id), [id, onDelete])
  const handleDuplicate = useCallback(() => onDuplicate?.(id), [id, onDuplicate])
  const handleArchive = useCallback(() => onArchive?.(id), [id, onArchive])

  return (
    <LazyLoadWrapper height={280} className="h-full">
      <Card className="overflow-hidden h-full flex flex-col transition-all duration-300 hover:shadow-medium hover:-translate-y-1">
        <div className={`h-2 ${color}`} />

        {bannerUrl && (
          <div className="h-32 w-full overflow-hidden">
            <OptimizedImage
              src={bannerUrl}
              alt={`Banner for ${title}`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              priority={false}
            />
          </div>
        )}

        <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
          <div className="space-y-1">
            <Link href={`/dashboard/classes/${id}`}>
              <h3 className="font-semibold leading-none tracking-tight hover:underline">{title}</h3>
            </Link>
            <p className="text-sm text-muted-foreground">{section}</p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              {onEdit && <DropdownMenuItem onClick={handleEdit}>Edit</DropdownMenuItem>}
              {onDuplicate && <DropdownMenuItem onClick={handleDuplicate}>Duplicate</DropdownMenuItem>}
              <DropdownMenuSeparator />
              {onArchive && <DropdownMenuItem onClick={handleArchive}>Archive</DropdownMenuItem>}
              {onDelete && (
                <DropdownMenuItem className="text-destructive" onClick={handleDelete}>
                  Delete
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </CardHeader>
        <CardContent className="flex-grow">
          <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>
        </CardContent>
        <CardFooter className="flex justify-between">
          <div className="flex items-center text-sm text-muted-foreground">
            <Users className="mr-1 h-4 w-4" />
            {studentCount} students
          </div>
          <Link href={`/dashboard/classes/${id}`}>
            <Button variant="ghost" size="sm">
              View
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </LazyLoadWrapper>
  )
}

// Usar memo para evitar re-renderizados innecesarios
export const ClassCard = memo(ClassCardComponent)
