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

interface ClassCardProps {
  id: string
  title: string
  description: string
  section: string
  studentCount: number
  color: string
}

function ClassCard({ id, title, description, section, studentCount, color }: ClassCardProps) {
  return (
    <Card className="overflow-hidden">
      <div className={`h-2 ${color}`} />
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
            <DropdownMenuItem>Edit</DropdownMenuItem>
            <DropdownMenuItem>Duplicate</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Archive</DropdownMenuItem>
            <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent>
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
  )
}

export function ClassGrid() {
  const classes = [
    {
      id: "1",
      title: "Mathematics 101",
      description: "Introduction to basic mathematical concepts and problem-solving techniques.",
      section: "Section A",
      studentCount: 28,
      color: "bg-green-500",
    },
    {
      id: "2",
      title: "Physics for Beginners",
      description: "Fundamental principles of physics and their applications in everyday life.",
      section: "Section B",
      studentCount: 24,
      color: "bg-purple-500",
    },
    {
      id: "3",
      title: "Introduction to Programming",
      description: "Learn the basics of programming using Python and solve real-world problems.",
      section: "Section C",
      studentCount: 32,
      color: "bg-blue-500",
    },
    {
      id: "4",
      title: "History of Art",
      description: "Explore the evolution of art through different periods and cultures.",
      section: "Section A",
      studentCount: 18,
      color: "bg-amber-500",
    },
    {
      id: "5",
      title: "English Literature",
      description: "Analysis of classic and contemporary literary works and their cultural context.",
      section: "Section B",
      studentCount: 26,
      color: "bg-red-500",
    },
    {
      id: "6",
      title: "Chemistry Fundamentals",
      description: "Introduction to chemical principles, elements, and reactions.",
      section: "Section C",
      studentCount: 22,
      color: "bg-teal-500",
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {classes.map((classItem) => (
        <ClassCard key={classItem.id} {...classItem} />
      ))}
    </div>
  )
}
