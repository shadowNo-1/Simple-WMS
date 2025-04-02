"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/components/ui/use-toast"
import { Icons } from "@/components/icons"
import { useTranslation } from "@/lib/i18n"
import { useAuth } from "@/lib/auth-context"
import Link from "next/link"
import { useBranding } from "@/lib/branding-context"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function LoginPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { t } = useTranslation()
  const { login } = useAuth()
  const { branding } = useBranding()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    remember: false,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, remember: checked }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const success = await login(formData.username, formData.password)

      if (success) {
        router.push("/dashboard")
      } else {
        toast({
          title: "Error",
          description: "Invalid username or password",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Login error:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-2">
            {branding.icon ? (
              <img src={branding.icon || "/placeholder.svg"} alt="Logo" className="h-12 w-12" />
            ) : (
              <Icons.inventory className="h-12 w-12" />
            )}
          </div>
          <CardTitle className="text-2xl">{t("login")}</CardTitle>
          <CardDescription>{branding.siteName || t("appName")}</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="grid gap-4">
            <Alert>
              <AlertDescription>测试账号: admin / 密码: password</AlertDescription>
            </Alert>
            <div className="grid gap-2">
              <Label htmlFor="username">{t("username")}</Label>
              <Input
                id="username"
                name="username"
                type="text"
                placeholder="admin"
                value={formData.username}
                onChange={handleChange}
                required
                disabled={isLoading}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">{t("password")}</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
                disabled={isLoading}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="remember"
                checked={formData.remember}
                onCheckedChange={handleCheckboxChange}
                disabled={isLoading}
              />
              <Label htmlFor="remember" className="text-sm">
                {t("rememberMe")}
              </Label>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col">
            <Button className="w-full" type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Icons.sun className="mr-2 h-4 w-4 animate-spin" />
                  {t("login")}...
                </>
              ) : (
                t("login")
              )}
            </Button>
            <div className="mt-4 text-center text-sm">
              {t("noAccount")}{" "}
              <Link href="/register" className="underline underline-offset-4 hover:text-primary">
                {t("register")}
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

