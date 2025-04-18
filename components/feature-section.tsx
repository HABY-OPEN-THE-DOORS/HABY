import { BookOpen, Calendar, FileText, MessageSquare, Users, Award } from "lucide-react"

export function FeatureSection() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/50">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Features that Empower Education</h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Everything you need to manage your classroom efficiently and effectively
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
          <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
            <div className="rounded-full bg-primary/10 p-3">
              <FileText className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold">Assignments & Grading</h3>
            <p className="text-center text-muted-foreground">
              Create, distribute, and grade assignments with ease. Provide feedback and track student progress.
            </p>
          </div>
          <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
            <div className="rounded-full bg-primary/10 p-3">
              <MessageSquare className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold">Communication</h3>
            <p className="text-center text-muted-foreground">
              Post announcements, engage in discussions, and provide real-time feedback to students.
            </p>
          </div>
          <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
            <div className="rounded-full bg-primary/10 p-3">
              <BookOpen className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold">Course Materials</h3>
            <p className="text-center text-muted-foreground">
              Organize and share course materials, resources, and links in one centralized location.
            </p>
          </div>
          <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
            <div className="rounded-full bg-primary/10 p-3">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold">Class Management</h3>
            <p className="text-center text-muted-foreground">
              Easily add students, create class sections, and manage permissions and access.
            </p>
          </div>
          <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
            <div className="rounded-full bg-primary/10 p-3">
              <Calendar className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold">Calendar Integration</h3>
            <p className="text-center text-muted-foreground">
              Keep track of due dates, class schedules, and important events with calendar integration.
            </p>
          </div>
          <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
            <div className="rounded-full bg-primary/10 p-3">
              <Award className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold">Analytics & Insights</h3>
            <p className="text-center text-muted-foreground">
              Track student performance, identify trends, and gain insights to improve teaching strategies.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
