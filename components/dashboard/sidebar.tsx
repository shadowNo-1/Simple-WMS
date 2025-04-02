"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Icons } from "@/components/icons"
import { useTranslation } from "@/lib/i18n"
import { useBranding } from "@/lib/branding-context"

const sidebarNavItems = [
  {
    title: "dashboard",
    href: "/dashboard",
    icon: "inventory",
  },
  {
    title: "inventory",
    href: "/inventory",
    icon: "inventory",
  },
  {
    title: "inventoryCount",
    href: "/inventory/count",
    icon: "clipboard",
  },
  {
    title: "generateBarcode",
    href: "/barcodes/generate",
    icon: "barcode",
  },
  {
    title: "scanBarcode",
    href: "/barcodes/scan",
    icon: "scan",
  },
  {
    title: "plugins",
    href: "/plugins",
    icon: "plugins",
  },
  {
    title: "settings",
    href: "/settings",
    icon: "settings",
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const { t } = useTranslation()
  const { branding } = useBranding()

  return (
    <div className="group flex md:flex flex-col h-full w-[240px] border-r bg-background">
      <div className="flex h-14 items-center border-b px-4">
        <Link href="/dashboard" className="flex items-center gap-2">
          <Icons.inventory className="h-6 w-6" />
        </Link>
      </div>
      <ScrollArea className="flex-1">
        <nav className="grid gap-1 px-2 py-4">
          {sidebarNavItems.map((item) => {
            const Icon = Icons[item.icon as keyof typeof Icons]
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
            return (
              <Button
                key={item.href}
                variant={isActive ? "secondary" : "ghost"}
                className={cn("justify-start gap-2", isActive && "bg-secondary")}
                asChild
              >
                <Link href={item.href}>
                  <Icon className="h-4 w-4" />
                  {t(item.title)}
                </Link>
              </Button>
            )
          })}
        </nav>
      </ScrollArea>

      {/* 版权和版本信息 */}
      <div className="border-t p-4">
        <div className="text-xs text-muted-foreground">
          <p>{branding.copyright || "© 2025 简易 WMS 系统. 保留所有权利."}</p>
          <p className="mt-1">版本 1.0.0</p>
        </div>
      </div>
    </div>
  )
}

