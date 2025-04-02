"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

type BrandingType = {
  siteName: string
  icon: string
  copyright: string
  primaryColor: string
}

type BrandingContextType = {
  branding: BrandingType
  updateBranding: (newBranding: Partial<BrandingType>) => void
}

const defaultBranding: BrandingType = {
  siteName: "简易 WMS 系统",
  icon: "",
  copyright: "© 2025 示例公司. 保留所有权利.",
  primaryColor: "blue",
}

const BrandingContext = createContext<BrandingContextType>({
  branding: defaultBranding,
  updateBranding: () => {},
})

export function BrandingProvider({ children }: { children: ReactNode }) {
  const [branding, setBranding] = useState<BrandingType>(defaultBranding)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const storedBranding = localStorage.getItem("branding")
    if (storedBranding) {
      try {
        setBranding({ ...defaultBranding, ...JSON.parse(storedBranding) })
      } catch (error) {
        console.error("Failed to parse stored branding:", error)
        localStorage.removeItem("branding")
      }
    }
  }, [])

  useEffect(() => {
    if (mounted && branding) {
      // Update document title
      document.title = branding.siteName

      // Apply theme color
      const themeColors = {
        blue: "#2563eb",
        red: "#dc2626",
        green: "#16a34a",
        purple: "#9333ea",
        orange: "#ea580c",
        pink: "#db2777",
      }

      const colorValue = themeColors[branding.primaryColor as keyof typeof themeColors] || "#2563eb"

      // 直接修改CSS变量
      document.documentElement.style.setProperty("--primary", colorValue)
      document.documentElement.style.setProperty("--primary-foreground", "#ffffff")

      // 创建一个新的样式元素来覆盖主题颜色
      const styleEl = document.getElementById("theme-color-style") || document.createElement("style")
      styleEl.id = "theme-color-style"
      styleEl.textContent = `
        :root {
          --primary: ${colorValue};
          --primary-foreground: #ffffff;
        }
        .dark {
          --primary: ${colorValue};
          --primary-foreground: #ffffff;
        }
      `

      if (!document.getElementById("theme-color-style")) {
        document.head.appendChild(styleEl)
      }
    }
  }, [branding, mounted])

  const updateBranding = (newBranding: Partial<BrandingType>) => {
    const updatedBranding = { ...branding, ...newBranding }
    setBranding(updatedBranding)
    localStorage.setItem("branding", JSON.stringify(updatedBranding))
  }

  return <BrandingContext.Provider value={{ branding, updateBranding }}>{children}</BrandingContext.Provider>
}

export const useBranding = () => useContext(BrandingContext)

