"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Package, Shield } from "lucide-react"
import Link from "next/link"

export default function LoginPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const [isClient, setIsClient] = useState(false)

  // 添加状态变量
  const [icpInfo, setIcpInfo] = useState({ number: "", link: "" })
  const [securityInfo, setSecurityInfo] = useState({ number: "", link: "", icon: null })

  useEffect(() => {
    setIsClient(true)

    // 加载备案信息
    try {
      const storedIcpInfo = localStorage.getItem("icpInfo")
      const storedSecurityInfo = localStorage.getItem("securityInfo")

      if (storedIcpInfo) {
        setIcpInfo(JSON.parse(storedIcpInfo))
      } else {
        setIcpInfo({ number: "京ICP备12345678号", link: "https://beian.miit.gov.cn/" })
      }

      if (storedSecurityInfo) {
        setSecurityInfo(JSON.parse(storedSecurityInfo))
      } else {
        setSecurityInfo({ number: "京公网安备11010502030143号", link: "http://www.beian.gov.cn/", icon: null })
      }
    } catch (e) {
      console.error("Error loading record info:", e)
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // In a real application, you would validate credentials against your backend
    // For demo purposes, we'll just simulate a login
    setTimeout(() => {
      // Mock successful login
      localStorage.setItem("isLoggedIn", "true")
      router.push("/dashboard")
      setIsLoading(false)
    }, 1000)
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-4">
            <Package className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-2xl text-center">登录</CardTitle>
          <CardDescription className="text-center">输入您的用户名和密码登录系统</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">用户名</Label>
              <Input
                id="username"
                placeholder="输入用户名"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">密码</Label>
                <Link href="/forgot-password" className="text-xs text-primary hover:underline">
                  忘记密码?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="输入密码"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full" type="submit" disabled={isLoading}>
              {isLoading ? "登录中..." : "登录"}
            </Button>
          </CardFooter>
        </form>
      </Card>

      {/* 添加备案信息 */}
      <footer className="mt-8 text-center text-sm text-gray-500">
        <div className="flex flex-col md:flex-row items-center justify-center gap-4">
          {isClient && (
            <>
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
            </>
          )}
        </div>
        <div className="mt-2">© {new Date().getFullYear()} SimpleWMS 版权所有</div>
      </footer>
    </div>
  )
}

