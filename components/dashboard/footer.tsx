"use client"

import { useEffect, useState } from "react"
import { useTranslation } from "@/lib/i18n"
import { useBranding } from "@/lib/branding-context"

export function Footer() {
  const { t } = useTranslation()
  const { branding } = useBranding()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <footer className="border-t py-4 bg-background">
      <div className="container flex flex-col items-center justify-center gap-2 md:flex-row md:justify-between">
        <p className="text-center text-sm text-muted-foreground">
          {branding.copyright || "© 2025 简易 WMS 系统. 保留所有权利."}
        </p>
        <p className="text-center text-sm text-muted-foreground">版本 1.0.0</p>
      </div>
    </footer>
  )
}

