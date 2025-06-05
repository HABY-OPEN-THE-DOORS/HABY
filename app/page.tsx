"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, BookOpen, Users, Award, Shield, CheckCircle, Zap, Globe, Lightbulb } from "lucide-react"
import { motion } from "framer-motion"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header/Navigation */}
      <header className="sticky top-0 z-50 border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="container flex h-16 items-center justify-between px-4 md:px-8">
          <div className="flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-purple-600" />
            <span className="text-xl font-bold">HABY-CLASS</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="#features" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
              Características
            </Link>
            <Link href="#benefits" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
              Beneficios
            </Link>
            <Link
              href="#testimonials"
              className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
            >
              Testimonios
            </Link>
            <Link href="#faq" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
              FAQ
            </Link>
            <Link href="/login" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
              Iniciar Sesión
            </Link>
            <Link href="/signup">
              <Button className="bg-purple-600 hover:bg-purple-700 text-white">Registrarse</Button>
            </Link>
          </nav>
          <div className="md:hidden">
            <Button variant="ghost" size="icon">
              <span className="sr-only">Abrir menú</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-6 w-6"
              >
                <line x1="4" x2="20" y1="12" y2="12" />
                <line x1="4" x2="20" y1="6" y2="6" />
                <line x1="4" x2="20" y1="18" y2="18" />
              </svg>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-white to-purple-50 py-16 md:py-24">
        <div className="absolute inset-0 bg-grid-slate-900/[0.04] bg-[center_top_-1px] [mask-image:linear-gradient(to_bottom,white,transparent)]"></div>
        <div className="container relative px-4 md:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-8 items-center">
            <motion.div
              className="space-y-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900">
                Plataforma educativa moderna para todos
              </h1>
              <p className="text-lg md:text-xl text-gray-600 max-w-lg">
                Simplifica la enseñanza y mejora el aprendizaje con nuestra plataforma intuitiva diseñada para
                estudiantes y profesores.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/signup">
                  <Button className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                    Comenzar ahora
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/demo">
                  <Button
                    variant="outline"
                    className="w-full sm:w-auto border-purple-200 hover:border-purple-300 hover:bg-purple-50 transition-all duration-300"
                  >
                    Ver demo
                  </Button>
                </Link>
              </div>
            </motion.div>
            <motion.div
              className="relative lg:pl-8"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="relative rounded-xl overflow-hidden shadow-2xl transform transition-transform hover:scale-[1.02] duration-500">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-purple-600/0 rounded-xl"></div>
                <div className="flex items-center justify-center p-12 bg-white rounded-xl">
                  <img src="/images/logo-haby-oficial.png" alt="HABY-CLASS Logo" className="w-full max-w-md h-auto" />
                </div>
              </div>
              <div className="absolute -bottom-6 -left-6 h-24 w-24 rounded-full bg-purple-600/20 blur-2xl"></div>
              <div className="absolute -top-6 -right-6 h-24 w-24 rounded-full bg-purple-600/20 blur-2xl"></div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white border-y border-gray-100">
        <div className="container px-4 md:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { number: "10,000+", label: "Estudiantes" },
              { number: "500+", label: "Profesores" },
              { number: "1,000+", label: "Cursos" },
              { number: "98%", label: "Satisfacción" },
            ].map((stat, index) => (
              <motion.div
                key={index}
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <p className="text-3xl md:text-4xl font-bold text-purple-600">{stat.number}</p>
                <p className="text-sm md:text-base text-gray-600">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 md:py-24 bg-white">
        <div className="container px-4 md:px-8">
          <motion.div
            className="text-center max-w-3xl mx-auto mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Características principales</h2>
            <p className="text-lg text-gray-600">
              Nuestra plataforma está diseñada para hacer que la educación sea más accesible, interactiva y efectiva.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <BookOpen className="h-10 w-10 text-purple-600" />,
                title: "Clases virtuales",
                description:
                  "Crea y gestiona clases virtuales con facilidad. Comparte materiales, asigna tareas y comunícate con tus estudiantes en un solo lugar.",
              },
              {
                icon: <Users className="h-10 w-10 text-purple-600" />,
                title: "Colaboración en tiempo real",
                description:
                  "Facilita la colaboración entre estudiantes y profesores con herramientas de comunicación en tiempo real y espacios de trabajo compartidos.",
              },
              {
                icon: <Award className="h-10 w-10 text-purple-600" />,
                title: "Seguimiento de progreso",
                description:
                  "Monitorea el progreso de los estudiantes con análisis detallados y estadísticas que te ayudan a identificar áreas de mejora.",
              },
              {
                icon: <Shield className="h-10 w-10 text-purple-600" />,
                title: "Seguridad y privacidad",
                description:
                  "Protegemos tus datos con las más altas medidas de seguridad y cumplimos con todas las regulaciones de privacidad.",
              },
              {
                icon: <Lightbulb className="h-10 w-10 text-purple-600" />,
                title: "Recursos educativos",
                description:
                  "Accede a una amplia biblioteca de recursos educativos que puedes utilizar en tus clases para enriquecer la experiencia de aprendizaje.",
              },
              {
                icon: <Globe className="h-10 w-10 text-purple-600" />,
                title: "Comunidad educativa",
                description:
                  "Forma parte de una comunidad educativa global donde puedes compartir ideas, recursos y mejores prácticas con otros educadores.",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-xl p-6 border border-gray-100 shadow-card hover:shadow-card-hover transition-all duration-300 transform hover:-translate-y-1"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="mb-4 inline-flex items-center justify-center w-12 h-12 rounded-lg bg-purple-100">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-16 md:py-24 bg-gray-50">
        <div className="container px-4 md:px-8">
          <motion.div
            className="text-center max-w-3xl mx-auto mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Beneficios para estudiantes y profesores</h2>
            <p className="text-lg text-gray-600">
              HABY-CLASS ofrece ventajas únicas para todos los miembros de la comunidad educativa.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12">
            <motion.div
              className="bg-white rounded-xl overflow-hidden shadow-lg"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <div className="bg-gradient-to-r from-purple-600 to-purple-700 py-6 px-8">
                <h3 className="text-2xl font-bold text-white">Para estudiantes</h3>
              </div>
              <div className="p-8">
                <ul className="space-y-4">
                  {[
                    "Acceso a materiales de clase en cualquier momento y lugar",
                    "Seguimiento claro de tareas y fechas de entrega",
                    "Comunicación directa con profesores y compañeros",
                    "Retroalimentación inmediata sobre el progreso",
                    "Organización eficiente de materiales de estudio",
                    "Participación activa en discusiones y actividades colaborativas",
                    "Acceso a recursos educativos adicionales",
                  ].map((benefit, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>

            <motion.div
              className="bg-white rounded-xl overflow-hidden shadow-lg"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 py-6 px-8">
                <h3 className="text-2xl font-bold text-white">Para profesores</h3>
              </div>
              <div className="p-8">
                <ul className="space-y-4">
                  {[
                    "Gestión simplificada de clases y estudiantes",
                    "Creación y distribución eficiente de tareas",
                    "Seguimiento detallado del progreso de los estudiantes",
                    "Herramientas de calificación automatizadas",
                    "Comunicación efectiva con estudiantes y padres",
                    "Acceso a recursos pedagógicos innovadores",
                    "Reducción de tareas administrativas",
                    "Análisis de datos para mejorar la enseñanza",
                  ].map((benefit, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container px-4 md:px-8">
          <motion.div
            className="text-center max-w-3xl mx-auto mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Cómo funciona</h2>
            <p className="text-lg text-gray-600">
              Descubre lo fácil que es comenzar a utilizar HABY-CLASS en tu institución educativa.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Regístrate",
                description: "Crea tu cuenta como estudiante o profesor en menos de 2 minutos.",
                icon: <Users className="h-8 w-8 text-purple-600" />,
              },
              {
                step: "02",
                title: "Configura tu clase",
                description: "Crea tu primera clase o únete a una existente con un código de invitación.",
                icon: <BookOpen className="h-8 w-8 text-purple-600" />,
              },
              {
                step: "03",
                title: "¡Comienza a aprender!",
                description: "Accede a materiales, participa en discusiones y completa tareas.",
                icon: <Zap className="h-8 w-8 text-purple-600" />,
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                className="relative"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <div className="bg-white rounded-xl p-8 border border-gray-100 shadow-lg relative z-10">
                  <div className="absolute -top-4 -left-4 w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center font-bold text-purple-600">
                    {item.step}
                  </div>
                  <div className="pt-6">
                    <div className="mb-4 inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-50">
                      {item.icon}
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                    <p className="text-gray-600">{item.description}</p>
                  </div>
                </div>
                {index < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform translate-x-1/2 z-0">
                    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M20 0L40 20L20 40L0 20L20 0Z" fill="#F3F4F6" />
                      <path
                        d="M18 12L26 20L18 28"
                        stroke="#A855F7"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-16 md:py-24 bg-gray-50">
        <div className="container px-4 md:px-8">
          <motion.div
            className="text-center max-w-3xl mx-auto mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Lo que dicen nuestros usuarios</h2>
            <p className="text-lg text-gray-600">
              Descubre por qué estudiantes y profesores eligen HABY-CLASS para mejorar su experiencia educativa.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                quote:
                  "HABY-CLASS ha transformado la forma en que enseño. Ahora puedo dedicar más tiempo a mis estudiantes y menos a tareas administrativas.",
                author: "María Rodríguez",
                role: "Profesora de Matemáticas",
                avatar: "/placeholder.svg?height=100&width=100",
              },
              {
                quote:
                  "Como estudiante, me encanta poder acceder a todos mis materiales de clase en un solo lugar. Las notificaciones me ayudan a mantenerme al día con mis tareas.",
                author: "Carlos Sánchez",
                role: "Estudiante de Ingeniería",
                avatar: "/placeholder.svg?height=100&width=100",
              },
              {
                quote:
                  "La plataforma es intuitiva y fácil de usar. Ha mejorado significativamente la comunicación entre profesores y estudiantes en nuestra institución.",
                author: "Laura González",
                role: "Directora Académica",
                avatar: "/placeholder.svg?height=100&width=100",
              },
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                className="bg-white p-6 rounded-xl shadow-lg"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="flex flex-col h-full">
                  <div className="mb-4">
                    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M9.33333 21.3333C7.86667 21.3333 6.66667 20.8 5.73333 19.7333C4.8 18.6667 4.33333 17.3333 4.33333 15.7333C4.33333 14 4.93333 12.2667 6.13333 10.5333C7.33333 8.8 9.06667 7.33333 11.3333 6.13333L13.3333 8.66667C11.7333 9.46667 10.5333 10.3333 9.73333 11.2667C8.93333 12.2 8.53333 13.0667 8.53333 13.8667C8.53333 14.2 8.6 14.4667 8.73333 14.6667C8.86667 14.8667 9.06667 15 9.33333 15.0667C10.0667 15.2 10.6667 15.5333 11.1333 16.0667C11.6 16.6 11.8333 17.2 11.8333 17.8667C11.8333 18.8 11.5 19.6 10.8333 20.2667C10.1667 20.9333 9.33333 21.2667 8.33333 21.2667L9.33333 21.3333ZM21.3333 21.3333C19.8667 21.3333 18.6667 20.8 17.7333 19.7333C16.8 18.6667 16.3333 17.3333 16.3333 15.7333C16.3333 14 16.9333 12.2667 18.1333 10.5333C19.3333 8.8 21.0667 7.33333 23.3333 6.13333L25.3333 8.66667C23.7333 9.46667 22.5333 10.3333 21.7333 11.2667C20.9333 12.2 20.5333 13.0667 20.5333 13.8667C20.5333 14.2 20.6 14.4667 20.7333 14.6667C20.8667 14.8667 21.0667 15 21.3333 15.0667C22.0667 15.2 22.6667 15.5333 23.1333 16.0667C23.6 16.6 23.8333 17.2 23.8333 17.8667C23.8333 18.8 23.5 19.6 22.8333 20.2667C22.1667 20.9333 21.3333 21.2667 20.3333 21.2667L21.3333 21.3333ZM21.3333 21.3333C19.8667 21.3333 18.6667 20.8 17.7333 19.7333C16.8 18.6667 16.3333 17.3333 16.3333 15.7333C16.3333 14 16.9333 12.2667 18.1333 10.5333C19.3333 8.8 21.0667 7.33333 23.3333 6.13333L25.3333 8.66667C23.7333 9.46667 22.5333 10.3333 21.7333 11.2667C20.9333 12.2 20.5333 13.0667 20.5333 13.8667C20.5333 14.2 20.6 14.4667 20.7333 14.6667C20.8667 14.8667 21.0667 15 21.3333 15.0667C22.0667 15.2 22.6667 15.5333 23.1333 16.0667C23.6 16.6 23.8333 17.2 23.8333 17.8667C23.8333 18.8 23.5 19.6 22.8333 20.2667C22.1667 20.9333 21.3333 21.2667 20.3333 21.2667L21.3333 21.3333Z"
                        fill="#A855F7"
                      />
                    </svg>
                  </div>
                  <p className="text-gray-700 mb-6 flex-grow">{testimonial.quote}</p>
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                      <img
                        src={testimonial.avatar || "/placeholder.svg"}
                        alt={testimonial.author}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-semibold">{testimonial.author}</p>
                      <p className="text-sm text-gray-600">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-16 md:py-24 bg-white">
        <div className="container px-4 md:px-8">
          <motion.div
            className="text-center max-w-3xl mx-auto mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Preguntas frecuentes</h2>
            <p className="text-lg text-gray-600">Encuentra respuestas a las preguntas más comunes sobre HABY-CLASS.</p>
          </motion.div>

          <div className="max-w-3xl mx-auto">
            {[
              {
                question: "¿Cómo puedo crear una cuenta en HABY-CLASS?",
                answer:
                  "Crear una cuenta es muy sencillo. Solo tienes que hacer clic en el botón 'Registrarse' en la parte superior de la página, completar el formulario con tus datos y verificar tu correo electrónico. Una vez verificado, podrás acceder a todas las funcionalidades de la plataforma.",
              },
              {
                question: "¿HABY-CLASS es gratuito para estudiantes?",
                answer:
                  "Sí, HABY-CLASS ofrece un plan gratuito para estudiantes que incluye todas las funcionalidades básicas necesarias para participar en clases, acceder a materiales y completar tareas. También ofrecemos planes premium con características adicionales para instituciones educativas.",
              },
              {
                question: "¿Cómo puedo unirme a una clase existente?",
                answer:
                  "Para unirte a una clase existente, necesitas el código de clase que te proporcionará tu profesor. Una vez que tengas el código, inicia sesión en tu cuenta, haz clic en 'Unirse a una clase' e introduce el código. Automáticamente serás añadido a la clase y podrás acceder a todos sus materiales y actividades.",
              },
              {
                question: "¿Es segura la información que comparto en HABY-CLASS?",
                answer:
                  "Absolutamente. La seguridad y privacidad de tus datos son nuestra prioridad. Utilizamos encriptación de extremo a extremo para proteger toda la información compartida en la plataforma y cumplimos con todas las regulaciones de protección de datos aplicables. Además, nunca compartimos tu información con terceros sin tu consentimiento explícito.",
              },
              {
                question: "¿Puedo acceder a HABY-CLASS desde mi dispositivo móvil?",
                answer:
                  "Sí, HABY-CLASS está optimizado para funcionar en cualquier dispositivo. Puedes acceder a través de tu navegador web en smartphones y tablets, o descargar nuestra aplicación móvil disponible para iOS y Android para una experiencia aún mejor.",
              },
              {
                question: "¿Qué tipo de soporte técnico ofrece HABY-CLASS?",
                answer:
                  "Ofrecemos soporte técnico a través de múltiples canales: correo electrónico, chat en vivo y un centro de ayuda completo con tutoriales y guías. Nuestro equipo de soporte está disponible de lunes a viernes de 8:00 a 20:00 horas para ayudarte con cualquier problema o duda que puedas tener.",
              },
            ].map((faq, index) => (
              <motion.div
                key={index}
                className="mb-6 border-b border-gray-200 pb-6 last:border-0 last:pb-0"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <h3 className="text-xl font-semibold mb-2">{faq.question}</h3>
                <p className="text-gray-600">{faq.answer}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-gradient-to-r from-purple-600 to-purple-800 text-white">
        <div className="container px-4 md:px-8">
          <motion.div
            className="max-w-3xl mx-auto text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">¿Listo para transformar tu experiencia educativa?</h2>
            <p className="text-lg text-purple-100 mb-8">
              Únete a miles de estudiantes y profesores que ya están utilizando HABY-CLASS para mejorar su experiencia
              educativa.
            </p>
            <Link href="/signup">
              <Button className="bg-white text-purple-700 hover:bg-purple-50 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                Crear cuenta gratuita
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="container px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <BookOpen className="h-6 w-6 text-purple-400" />
                <span className="text-xl font-bold text-white">HABY-CLASS</span>
              </div>
              <p className="text-gray-400 mb-4">
                Plataforma educativa moderna para simplificar la enseñanza y mejorar el aprendizaje.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <span className="sr-only">Twitter</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <span className="sr-only">GitHub</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      fillRule="evenodd"
                      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4 text-white">Enlaces rápidos</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/login" className="text-gray-400 hover:text-white transition-colors">
                    Iniciar sesión
                  </Link>
                </li>
                <li>
                  <Link href="/signup" className="text-gray-400 hover:text-white transition-colors">
                    Registrarse
                  </Link>
                </li>
                <li>
                  <Link href="#features" className="text-gray-400 hover:text-white transition-colors">
                    Características
                  </Link>
                </li>
                <li>
                  <Link href="#about" className="text-gray-400 hover:text-white transition-colors">
                    Acerca de
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4 text-white">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/terms" className="text-gray-400 hover:text-white transition-colors">
                    Términos y condiciones
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors">
                    Política de privacidad
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} HABY-CLASS. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
