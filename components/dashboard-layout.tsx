"use client"

import { DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Package, Menu, X, Globe, User, Warehouse, ChevronDown, Shield } from "lucide-react"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useLanguage, type Language } from "@/components/language-context"
import { pluginRegistry } from "@/lib/plugin-system"

interface DashboardLayoutProps {
  children: React.ReactNode
}

// Mock data for warehouses
const warehouses = [
  { id: 1, name: "主仓库", location: "上海" },
  { id: 2, name: "北区仓库", location: "北京" },
  { id: 3, name: "南区仓库", location: "广州" },
]

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isClient, setIsClient] = useState(false)
  const [currentWarehouse, setCurrentWarehouse] = useState(warehouses[0])
  const { language, setLanguage, t } = useLanguage()
  const [navItems, setNavItems] = useState<any[]>([])

  // 从本地存储获取备案信息
  const [icpInfo, setIcpInfo] = useState({ number: "", link: "" })
  const [securityInfo, setSecurityInfo] = useState({ number: "", link: "", icon: null })

  useEffect(() => {
    setIsClient(true)

    // 获取备案信息
    const storedIcpInfo = localStorage.getItem("icpInfo")
    const storedSecurityInfo = localStorage.getItem("securityInfo")

    if (storedIcpInfo) {
      setIcpInfo(JSON.parse(storedIcpInfo))
    } else {
      // 默认值
      setIcpInfo({ number: "京ICP备12345678号", link: "https://beian.miit.gov.cn/" })
    }

    if (storedSecurityInfo) {
      setSecurityInfo(JSON.parse(storedSecurityInfo))
    } else {
      // 默认值
      setSecurityInfo({ number: "京公网安备11010502030143号", link: "http://www.beian.gov.cn/", icon: null })
    }

    // 获取导航项
    if (typeof window !== "undefined") {
      // 从插件系统获取导航项
      const items = pluginRegistry.getAllNavItems() || []

      // 如果插件系统未初始化，使用默认导航
      if (items.length === 0) {
        setNavItems([
          { name: t("nav.dashboard"), href: "/dashboard", icon: "LayoutDashboard" },
          { name: t("nav.inventory"), href: "/inventory", icon: "Package" },
          { name: t("nav.transactions"), href: "/transactions", icon: "ArrowDownUp" },
          { name: t("nav.codes"), href: "/codes", icon: "QrCode" },
          { name: t("nav.check"), href: "/check", icon: "ClipboardList" },
          { name: t("nav.settings"), href: "/settings", icon: "Settings" },
        ])
      } else {
        // 排序导航项
        setNavItems(items.sort((a, b) => (a.order || 50) - (b.order || 50)))
      }
    }
  }, [t])

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn")
    router.push("/login")
  }

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang)
  }

  const getLanguageLabel = () => {
    switch (language) {
      case "zh-CN":
        return "简体中文"
      case "en-US":
        return "English"
      case "ja-JP":
        return "日本語"
      default:
        return "简体中文"
    }
  }

  if (!isClient) {
    return null // Prevent hydration errors
  }

  return (
    <div className="flex h-screen flex-col">
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar for desktop */}
        <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
          <div className="flex flex-col flex-grow border-r bg-white pt-5">
            <div className="flex items-center justify-center h-16 flex-shrink-0 px-4">
              <Link href="/dashboard" className="flex items-center gap-2 text-lg font-semibold">
                <Package className="h-6 w-6" />
                <span>{t("app.name")}</span>
              </Link>
            </div>

            {/* Warehouse selector */}
            <div className="px-4 mt-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full justify-between">
                    <div className="flex items-center">
                      <Warehouse className="mr-2 h-4 w-4" />
                      <span>{currentWarehouse.name}</span>
                    </div>
                    <ChevronDown className="h-4 w-4 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  <DropdownMenuLabel>{t("warehouse.select")}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {warehouses.map((warehouse) => (
                    <DropdownMenuItem
                      key={warehouse.id}
                      onClick={() => setCurrentWarehouse(warehouse)}
                      className={cn("cursor-pointer", currentWarehouse.id === warehouse.id && "bg-gray-100")}
                    >
                      <Warehouse className="mr-2 h-4 w-4" />
                      <span>{warehouse.name}</span>
                      <span className="ml-auto text-xs text-muted-foreground">{warehouse.location}</span>
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Link href="/warehouses" className="flex w-full">
                      {t("warehouse.manage")}
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="mt-5 flex-1 flex flex-col overflow-y-auto">
              <nav className="flex-1 px-2 space-y-1">
                {navItems.map((item) => {
                  const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`)
                  const Icon = item.icon

                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={cn(
                        isActive ? "bg-gray-100 text-gray-900" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                        "group flex items-center px-2 py-2 text-sm font-medium rounded-md",
                      )}
                    >
                      {Icon && (
                        <Icon
                          className={cn(
                            isActive ? "text-gray-500" : "text-gray-400 group-hover:text-gray-500",
                            "mr-3 flex-shrink-0 h-5 w-5",
                          )}
                          aria-hidden="true"
                        />
                      )}
                      {item.name}
                    </Link>
                  )
                })}
              </nav>
            </div>
            <div className="flex-shrink-0 flex border-t p-4">
              <div className="flex items-center w-full">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="w-full justify-start">
                      <Avatar className="h-8 w-8 mr-2">
                        <AvatarImage src="/placeholder.svg?height=32&width=32" alt="用户头像" />
                        <AvatarFallback>管理</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col items-start">
                        <span className="text-sm font-medium">管理员</span>
                        <span className="text-xs text-muted-foreground">admin@example.com</span>
                      </div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuItem>
                      <Link href="/profile" className="flex items-center w-full">
                        <User className="mr-2 h-4 w-4" />
                        {t("user.profile")}
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Link href="/settings" className="flex items-center w-full">
                        <User className="mr-2 h-4 w-4" />
                        {t("user.settings")}
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuSub>
                      <DropdownMenuSubTrigger>
                        <Globe className="mr-2 h-4 w-4" />
                        <span>
                          {t("user.language")}: {getLanguageLabel()}
                        </span>
                      </DropdownMenuSubTrigger>
                      <DropdownMenuSubContent>
                        <DropdownMenuItem onClick={() => handleLanguageChange("zh-CN")}>
                          <span className={language === "zh-CN" ? "font-bold" : ""}>简体中文</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleLanguageChange("en-US")}>
                          <span className={language === "en-US" ? "font-bold" : ""}>English</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleLanguageChange("ja-JP")}>
                          <span className={language === "ja-JP" ? "font-bold" : ""}>日本語</span>
                        </DropdownMenuItem>
                      </DropdownMenuSubContent>
                    </DropdownMenuSub>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>
                      <User className="mr-2 h-4 w-4" />
                      {t("user.logout")}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile sidebar */}
        <div className={cn("fixed inset-0 flex z-40 md:hidden", isSidebarOpen ? "block" : "hidden")}>
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setIsSidebarOpen(false)}></div>
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
            <div className="absolute top-0 right-0 -mr-12 pt-2">
              <button
                type="button"
                className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                onClick={() => setIsSidebarOpen(false)}
              >
                <span className="sr-only">Close sidebar</span>
                <X className="h-6 w-6 text-white" aria-hidden="true" />
              </button>
            </div>
            <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
              <div className="flex-shrink-0 flex items-center justify-center px-4">
                <Link href="/dashboard" className="flex items-center gap-2 text-lg font-semibold">
                  <Package className="h-6 w-6" />
                  <span>{t("app.name")}</span>
                </Link>
              </div>

              {/* Mobile warehouse selector */}
              <div className="px-4 mt-4">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="w-full justify-between">
                      <div className="flex items-center">
                        <Warehouse className="mr-2 h-4 w-4" />
                        <span>{currentWarehouse.name}</span>
                      </div>
                      <ChevronDown className="h-4 w-4 opacity-50" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56">
                    <DropdownMenuLabel>{t("warehouse.select")}</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {warehouses.map((warehouse) => (
                      <DropdownMenuItem
                        key={warehouse.id}
                        onClick={() => setCurrentWarehouse(warehouse)}
                        className={cn("cursor-pointer", currentWarehouse.id === warehouse.id && "bg-gray-100")}
                      >
                        <Warehouse className="mr-2 h-4 w-4" />
                        <span>{warehouse.name}</span>
                        <span className="ml-auto text-xs text-muted-foreground">{warehouse.location}</span>
                      </DropdownMenuItem>
                    ))}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <Link href="/warehouses" className="flex w-full">
                        {t("warehouse.manage")}
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <nav className="mt-5 px-2 space-y-1">
                {navItems.map((item) => {
                  const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`)
                  const Icon = item.icon

                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={cn(
                        isActive ? "bg-gray-100 text-gray-900" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                        "group flex items-center px-2 py-2 text-base font-medium rounded-md",
                      )}
                      onClick={() => setIsSidebarOpen(false)}
                    >
                      {Icon && (
                        <Icon
                          className={cn(
                            isActive ? "text-gray-500" : "text-gray-400 group-hover:text-gray-500",
                            "mr-4 flex-shrink-0 h-5 w-5",
                          )}
                          aria-hidden="true"
                        />
                      )}
                      {item.name}
                    </Link>
                  )
                })}
              </nav>
            </div>
            <div className="flex-shrink-0 flex border-t p-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="w-full justify-start">
                    <div className="flex items-center">
                      <Globe className="mr-2 h-4 w-4" />
                      <span>{getLanguageLabel()}</span>
                    </div>
                    <ChevronDown className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem onClick={() => handleLanguageChange("zh-CN")}>
                    <span className={language === "zh-CN" ? "font-bold" : ""}>简体中文</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleLanguageChange("en-US")}>
                    <span className={language === "en-US" ? "font-bold" : ""}>English</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleLanguageChange("ja-JP")}>
                    <span className={language === "ja-JP" ? "font-bold" : ""}>日本語</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="flex-shrink-0 flex border-t p-4">
              <Button variant="ghost" className="w-full justify-start" onClick={handleLogout}>
                <User className="mr-2 h-4 w-4" />
                {t("user.logout")}
              </Button>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="md:pl-64 flex flex-col flex-1">
          <div className="sticky top-0 z-10 md:hidden pl-1 pt-1 sm:pl-3 sm:pt-3 bg-white border-b">
            <button
              type="button"
              className="-ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
              onClick={() => setIsSidebarOpen(true)}
            >
              <span className="sr-only">Open sidebar</span>
              <Menu className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <main className="flex-1 overflow-y-auto">
            {children}

            {/* Footer with ICP and Public Security record - now inside main content area to scroll with content */}
            <footer className="bg-white border-t py-4 px-6 text-center text-sm text-gray-500">
              <div className="flex flex-col md:flex-row items-center justify-center gap-4">
                {icpInfo.number && (
                  <a
                    href={icpInfo.link || "https://beian.miit.gov.cn/"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-gray-700"
                  >
                    {icpInfo.number}
                  </a>
                )}

                {securityInfo.number && (
                  <a
                    href={securityInfo.link || "http://www.beian.gov.cn/"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center hover:text-gray-700"
                  >
                    {securityInfo.icon ? (
                      <img src={securityInfo.icon || "/placeholder.svg"} alt="公安备案图标" className="h-4 w-4 mr-1" />
                    ) : (
                      <Shield className="h-4 w-4 mr-1" />
                    )}
                    {securityInfo.number}
                  </a>
                )}
              </div>
              <div className="mt-2">
                © {new Date().getFullYear()} {t("app.name")} {t("app.copyright")}
              </div>
            </footer>
          </main>
        </div>
      </div>
    </div>
  )
}

