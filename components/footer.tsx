import Link from "next/link"
import { Logo } from "@/components/logo"

export function Footer() {
  return (
    <footer className="w-full border-t bg-background">
      <div className="container flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <Logo className="h-6 w-6" />
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            &copy; {new Date().getFullYear()} HABY-CLASS. All rights reserved.
          </p>
        </div>
        <div className="flex gap-4">
          <Link href="/terms" className="text-sm text-muted-foreground underline underline-offset-4">
            Terms
          </Link>
          <Link href="/privacy" className="text-sm text-muted-foreground underline underline-offset-4">
            Privacy
          </Link>
        </div>
      </div>
    </footer>
  )
}
