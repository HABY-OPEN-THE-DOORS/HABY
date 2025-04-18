"use client"

import { useLanguage } from "@/providers/language-provider"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { motion } from "framer-motion"

const testimonials = [
  {
    quote:
      "HABY-CLASS ha transformado la forma en que enseño. La organización de tareas y la comunicación con los estudiantes nunca había sido tan sencilla.",
    author: "María Rodríguez",
    role: "Profesora de Matemáticas",
    avatar: "/placeholder.svg?height=40&width=40",
    initials: "MR",
  },
  {
    quote:
      "Como estudiante, me encanta poder acceder a todos mis materiales y tareas en un solo lugar. La interfaz es intuitiva y fácil de usar.",
    author: "Carlos Sánchez",
    role: "Estudiante de Ingeniería",
    avatar: "/placeholder.svg?height=40&width=40",
    initials: "CS",
  },
  {
    quote:
      "La plataforma ha mejorado significativamente la participación de los estudiantes en mis clases. Recomendaría HABY-CLASS a cualquier educador.",
    author: "Ana Martínez",
    role: "Profesora de Historia",
    avatar: "/placeholder.svg?height=40&width=40",
    initials: "AM",
  },
]

export function TestimonialSection() {
  const { t, language } = useLanguage()

  // Añadir después de la declaración de useLanguage
  const testimonialTexts = {
    es: {
      title: "Lo que dicen nuestros usuarios",
      description: "Descubre cómo HABY-CLASS está transformando la educación para profesores y estudiantes.",
    },
    en: {
      title: "What our users say",
      description: "Discover how HABY-CLASS is transforming education for teachers and students.",
    },
  }

  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-background">
      <div className="container px-4 md:px-6">
        <motion.div
          className="flex flex-col items-center justify-center space-y-4 text-center mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">{testimonialTexts[language].title}</h2>
            <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed">
              {testimonialTexts[language].description}
            </p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full">
                <CardContent className="p-6 flex flex-col h-full">
                  <div className="flex-1">
                    <p className="text-muted-foreground italic mb-6">"{testimonial.quote}"</p>
                  </div>
                  <div className="flex items-center">
                    <Avatar className="h-10 w-10 mr-4">
                      <AvatarImage src={testimonial.avatar} alt={testimonial.author} />
                      <AvatarFallback>{testimonial.initials}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{testimonial.author}</p>
                      <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
