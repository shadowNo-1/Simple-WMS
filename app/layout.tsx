import type React from "react"
import "@/app/globals.css"
import type { Metadata } from "next"
import { LanguageProvider } from "@/components/language-context"
import { initializePluginSystem } from "@/lib/plugin-system"

// 初始化插件系统
if (typeof window !== "undefined") {
  initializePluginSystem().catch(console.error)
}

export const metadata: Metadata = {
  title: "SimpleWMS - 简易仓库管理系统",
  description: "一个简单易用的仓库管理系统",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="zh-CN">
      <body>
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  )
}



import './globals.css'