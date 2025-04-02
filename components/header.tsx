"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import { ModeToggle } from "@/components/mode-toggle"
import { LanguageToggle } from "@/components/language-toggle"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useTranslation } from "@/lib/i18n"
import { useAuth } from "@/lib/auth-context"
import { useBranding } from "@/lib/branding-context"

export default function Header() {
  const pathname = usePathname()
  const { user, logout, isLoading } = useAuth()
  const { t } = useTranslation()
  const [mounted, setMounted] = useState(false)
  const { branding } = useBranding()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  // Don't show header on login page
  if (pathname === "/auth/login") {
    return null
  }

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
    : "U"

  return (
    <header className="sticky top-0 z-40 border-b bg-background">
      <div className="container flex h-16 items-center justify-between py-4">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            {branding.icon ? (
              <img src={branding.icon || "/placeholder.svg"} alt="Logo" className="h-6 w-6" />
            ) : (
              <Icons.inventory className="h-6 w-6" />
            )}
            <span className="font-bold">{branding.siteName || t("appName")}</span>
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <ModeToggle />
          <LanguageToggle />

          {!isLoading && user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>{initials}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Icons.user className="mr-2 h-4 w-4" />
                  <span>{t("profile")}</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Icons.settings className="mr-2 h-4 w-4" />
                  <span>{t("settings")}</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => {
                    logout()
                    window.location.href = "/auth/login"
                  }}
                >
                  <Icons.logout className="mr-2 h-4 w-4" />
                  <span>{t("logout")}</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button variant="outline" size="sm" asChild>
              <Link href="/auth/login">
                <Icons.user className="mr-2 h-4 w-4" />
                {t("login")}
              </Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}

