"use client"

import { BookOpen, Calendar, FileText, MessageSquare, Users, Award } from "lucide-react"
import { useLanguage } from "@/providers/language-provider"
import { motion } from "framer-motion"

const features = [
  {
    icon: FileText,
    titleKey: "features.assignments.title",
    descriptionKey: "features.assignments.description",
  },
  {
    icon: MessageSquare,
    titleKey: "features.communication.title",
    descriptionKey: "features.communication.description",
  },
  {
    icon: BookOpen,
    titleKey: "features.materials.title",
    descriptionKey: "features.materials.description",
  },
  {
    icon: Users,
    titleKey: "features.management.title",
    descriptionKey: "features.management.description",
  },
  {
    icon: Calendar,
    titleKey: "features.calendar.title",
    descriptionKey: "features.calendar.description",
  },
  {
    icon: Award,
    titleKey: "features.analytics.title",
    descriptionKey: "features.analytics.description",
  },
]

export function FeatureSection() {
  const { t } = useLanguage()

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  }

  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/50">
      <div className="container px-4 md:px-6">
        <motion.div
          className="flex flex-col items-center justify-center space-y-4 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">{t("features.title")}</h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              {t("features.description")}
            </p>
          </div>
        </motion.div>
        <motion.div
          className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2 lg:grid-cols-3"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm transition-all hover:shadow-md"
              variants={item}
            >
              <div className="rounded-full bg-primary/10 p-3">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold">{t(feature.titleKey)}</h3>
              <p className="text-center text-muted-foreground">{t(feature.descriptionKey)}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
