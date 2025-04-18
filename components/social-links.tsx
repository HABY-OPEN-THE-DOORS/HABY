"use client"

import { Button } from "@/components/ui/button"
import { Instagram, Facebook, Youtube, MessageCircle, Twitter, Linkedin, Globe } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface SocialLinksProps {
  showLabels?: boolean
  className?: string
  iconSize?: number
  variant?: "default" | "outline" | "ghost"
  size?: "default" | "sm" | "lg" | "icon"
}

export function SocialLinks({
  showLabels = false,
  className = "",
  iconSize = 20,
  variant = "ghost",
  size = "default",
}: SocialLinksProps) {
  const socialLinks = [
    {
      name: "Instagram",
      url: "https://www.instagram.com/habydoors/",
      icon: Instagram,
      color: "hover:text-pink-500",
    },
    {
      name: "Facebook",
      url: "https://www.facebook.com/zadkiel.garcia.31",
      icon: Facebook,
      color: "hover:text-blue-600",
    },
    {
      name: "YouTube",
      url: "https://www.youtube.com/@HABYOpenDoors",
      icon: Youtube,
      color: "hover:text-red-600",
    },
    {
      name: "WhatsApp",
      url: "https://wa.me/522204372038",
      icon: MessageCircle,
      color: "hover:text-green-500",
    },
    {
      name: "Twitter",
      url: "https://twitter.com/habydoors",
      icon: Twitter,
      color: "hover:text-blue-400",
    },
    {
      name: "LinkedIn",
      url: "https://www.linkedin.com/company/habydoors",
      icon: Linkedin,
      color: "hover:text-blue-700",
    },
    {
      name: "Sitio Web",
      url: "https://www.habydoors.com",
      icon: Globe,
      color: "hover:text-teal-500",
    },
  ]

  return (
    <div className={`flex items-center gap-2 flex-wrap ${className}`}>
      <TooltipProvider delayDuration={300}>
        {socialLinks.map((link) => (
          <Tooltip key={link.name}>
            <TooltipTrigger asChild>
              <Button variant={variant} size={size} className={`rounded-full ${link.color}`} asChild>
                <a href={link.url} target="_blank" rel="noopener noreferrer" aria-label={link.name}>
                  <link.icon size={iconSize} />
                  {showLabels && <span className="ml-2">{link.name}</span>}
                </a>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{link.name}</p>
            </TooltipContent>
          </Tooltip>
        ))}
      </TooltipProvider>
    </div>
  )
}
