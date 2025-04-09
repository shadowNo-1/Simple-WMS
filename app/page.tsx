"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { ArrowRight, BarChart3, Package, QrCode } from "lucide-react"
import { useLanguage } from "@/components/language-context"
import { useState, useEffect } from "react"

export default function Home() {
  const { t } = useLanguage()
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return null // Prevent hydration errors
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b">
        <div className="container flex items-center justify-between h-16 px-4 md:px-6">
          <Link href="/" className="flex items-center gap-2 text-lg font-semibold">
            <Package className="h-6 w-6" />
            <span>{t("app.name")}</span>
          </Link>
          <nav className="hidden md:flex gap-6">
            <Link href="/dashboard" className="text-sm font-medium hover:underline underline-offset-4">
              {t("nav.dashboard")}
            </Link>
            <Link href="/inventory" className="text-sm font-medium hover:underline underline-offset-4">
              {t("nav.inventory")}
            </Link>
            <Link href="/transactions" className="text-sm font-medium hover:underline underline-offset-4">
              {t("nav.transactions")}
            </Link>
            <Link href="/check" className="text-sm font-medium hover:underline underline-offset-4">
              {t("nav.check")}
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button>{t("home.login")}</Button>
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:grid-cols-2">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">{t("home.title")}</h1>
                  <p className="max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                    {t("home.description")}
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/login">
                    <Button className="px-8">
                      {t("home.get.started")}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <img
                  src="/placeholder.svg?height=400&width=400"
                  alt="WMS Dashboard Preview"
                  className="rounded-lg object-cover"
                  width={400}
                  height={400}
                />
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  {t("home.features.title")}
                </h2>
                <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  {t("home.features.subtitle")}
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 mt-8">
              <Card>
                <CardHeader className="flex flex-row items-center gap-4 pb-2">
                  <Package className="h-8 w-8" />
                  <CardTitle>{t("home.feature.inventory.title")}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{t("home.feature.inventory.desc")}</CardDescription>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center gap-4 pb-2">
                  <QrCode className="h-8 w-8" />
                  <CardTitle>{t("home.feature.barcode.title")}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{t("home.feature.barcode.desc")}</CardDescription>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center gap-4 pb-2">
                  <BarChart3 className="h-8 w-8" />
                  <CardTitle>{t("home.feature.check.title")}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{t("home.feature.check.desc")}</CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t">
        <div className="container flex flex-col gap-2 py-4 md:h-16 md:flex-row md:items-center md:justify-between md:py-0">
          <div className="text-xs text-gray-500">
            © 2025 {t("app.name")}. {t("app.copyright")}
          </div>
          <div className="flex gap-4 text-xs text-gray-500">
            <Link href="#" className="hover:underline underline-offset-4">
              {t("home.terms")}
            </Link>
            <Link href="#" className="hover:underline underline-offset-4">
              {t("home.privacy")}
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

