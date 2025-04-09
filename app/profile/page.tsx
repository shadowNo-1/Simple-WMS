"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import DashboardLayout from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User, Mail, Phone, Lock, Bell, Shield, Save, Upload, Clock, LogOut } from "lucide-react"

export default function ProfilePage() {
  const router = useRouter()
  const [isClient, setIsClient] = useState(false)
  const [activeTab, setActiveTab] = useState("profile")

  useEffect(() => {
    setIsClient(true)
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true"
    if (!isLoggedIn) {
      router.push("/login")
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn")
    router.push("/login")
  }

  if (!isClient) {
    return null // Prevent hydration errors
  }

  return (
    <DashboardLayout>
      <div className="p-4 md:p-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">个人中心</h1>
            <p className="text-muted-foreground">管理您的个人信息和账户设置</p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-4">
          <Card className="md:col-span-1">
            <CardContent className="p-6">
              <div className="flex flex-col items-center space-y-4">
                <Avatar className="h-24 w-24">
                  <AvatarImage src="/placeholder.svg?height=96&width=96" alt="用户头像" />
                  <AvatarFallback>管理</AvatarFallback>
                </Avatar>
                <div className="text-center">
                  <h2 className="text-xl font-bold">管理员</h2>
                  <p className="text-sm text-muted-foreground">admin@example.com</p>
                </div>
                <Button variant="outline" className="w-full">
                  <Upload className="mr-2 h-4 w-4" />
                  更换头像
                </Button>
              </div>

              <div className="mt-6 space-y-2">
                <Button variant="ghost" className="w-full justify-start" onClick={() => setActiveTab("profile")}>
                  <User className="mr-2 h-4 w-4" />
                  个人信息
                </Button>
                <Button variant="ghost" className="w-full justify-start" onClick={() => setActiveTab("security")}>
                  <Lock className="mr-2 h-4 w-4" />
                  安全设置
                </Button>
                <Button variant="ghost" className="w-full justify-start" onClick={() => setActiveTab("notifications")}>
                  <Bell className="mr-2 h-4 w-4" />
                  通知设置
                </Button>
                <Button variant="ghost" className="w-full justify-start" onClick={() => setActiveTab("activity")}>
                  <Clock className="mr-2 h-4 w-4" />
                  活动记录
                </Button>
              </div>

              <div className="mt-6 pt-6 border-t">
                <Button variant="destructive" className="w-full" onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  退出登录
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="md:col-span-3">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
              <TabsList className="grid grid-cols-4 w-full">
                <TabsTrigger value="profile">
                  <User className="mr-2 h-4 w-4 md:hidden" />
                  <span className="hidden md:inline mr-2">
                    <User className="h-4 w-4" />
                  </span>
                  个人信息
                </TabsTrigger>
                <TabsTrigger value="security">
                  <Lock className="mr-2 h-4 w-4 md:hidden" />
                  <span className="hidden md:inline mr-2">
                    <Lock className="h-4 w-4" />
                  </span>
                  安全设置
                </TabsTrigger>
                <TabsTrigger value="notifications">
                  <Bell className="mr-2 h-4 w-4 md:hidden" />
                  <span className="hidden md:inline mr-2">
                    <Bell className="h-4 w-4" />
                  </span>
                  通知设置
                </TabsTrigger>
                <TabsTrigger value="activity">
                  <Clock className="mr-2 h-4 w-4 md:hidden" />
                  <span className="hidden md:inline mr-2">
                    <Clock className="h-4 w-4" />
                  </span>
                  活动记录
                </TabsTrigger>
              </TabsList>

              <TabsContent value="profile">
                <Card>
                  <CardHeader>
                    <CardTitle>个人信息</CardTitle>
                    <CardDescription>更新您的个人信息</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="full-name">姓名</Label>
                        <Input id="full-name" placeholder="输入姓名" defaultValue="管理员" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="display-name">显示名称</Label>
                        <Input id="display-name" placeholder="输入显示名称" defaultValue="管理员" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">电子邮箱</Label>
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <Input id="email" type="email" placeholder="输入电子邮箱" defaultValue="admin@example.com" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">手机号码</Label>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <Input id="phone" placeholder="输入手机号码" defaultValue="13800138000" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="position">职位</Label>
                      <Input id="position" placeholder="输入职位" defaultValue="系统管理员" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bio">个人简介</Label>
                      <Input id="bio" placeholder="输入个人简介" defaultValue="负责系统管理和维护" />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button>
                      <Save className="mr-2 h-4 w-4" />
                      保存信息
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>

              <TabsContent value="security">
                <Card>
                  <CardHeader>
                    <CardTitle>安全设置</CardTitle>
                    <CardDescription>管理您的账户安全设置</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="current-password">当前密码</Label>
                      <div className="flex items-center gap-2">
                        <Lock className="h-4 w-4 text-muted-foreground" />
                        <Input id="current-password" type="password" placeholder="输入当前密码" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="new-password">新密码</Label>
                      <div className="flex items-center gap-2">
                        <Lock className="h-4 w-4 text-muted-foreground" />
                        <Input id="new-password" type="password" placeholder="输入新密码" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">确认新密码</Label>
                      <div className="flex items-center gap-2">
                        <Lock className="h-4 w-4 text-muted-foreground" />
                        <Input id="confirm-password" type="password" placeholder="再次输入新密码" />
                      </div>
                    </div>

                    <div className="pt-4 border-t">
                      <h3 className="text-lg font-medium mb-2">双因素认证</h3>
                      <p className="text-sm text-muted-foreground mb-4">启用双因素认证以增强账户安全性</p>
                      <Button variant="outline">
                        <Shield className="mr-2 h-4 w-4" />
                        设置双因素认证
                      </Button>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button>
                      <Save className="mr-2 h-4 w-4" />
                      更新密码
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>

              <TabsContent value="notifications">
                <Card>
                  <CardHeader>
                    <CardTitle>通知设置</CardTitle>
                    <CardDescription>管理您接收的通知</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">电子邮件通知</h3>
                          <p className="text-sm text-muted-foreground">接收系统通知到您的邮箱</p>
                        </div>
                        <div className="flex items-center h-5">
                          <input
                            id="email-notifications"
                            type="checkbox"
                            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                            defaultChecked
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">库存警告</h3>
                          <p className="text-sm text-muted-foreground">当库存低于最小库存量时通知您</p>
                        </div>
                        <div className="flex items-center h-5">
                          <input
                            id="inventory-alerts"
                            type="checkbox"
                            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                            defaultChecked
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">交易通知</h3>
                          <p className="text-sm text-muted-foreground">当有新的出入库操作时通知您</p>
                        </div>
                        <div className="flex items-center h-5">
                          <input
                            id="transaction-notifications"
                            type="checkbox"
                            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">系统更新</h3>
                          <p className="text-sm text-muted-foreground">接收系统更新和维护通知</p>
                        </div>
                        <div className="flex items-center h-5">
                          <input
                            id="system-updates"
                            type="checkbox"
                            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                            defaultChecked
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button>
                      <Save className="mr-2 h-4 w-4" />
                      保存设置
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>

              <TabsContent value="activity">
                <Card>
                  <CardHeader>
                    <CardTitle>活动记录</CardTitle>
                    <CardDescription>查看您的账户活动记录</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="border-b pb-4">
                        <div className="flex items-start gap-4">
                          <div className="rounded-full p-2 bg-blue-100">
                            <User className="h-4 w-4 text-blue-500" />
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm font-medium">登录成功</p>
                            <p className="text-xs text-muted-foreground">IP地址: 192.168.1.1</p>
                            <p className="text-xs text-muted-foreground">2025-04-15 08:30</p>
                          </div>
                        </div>
                      </div>

                      <div className="border-b pb-4">
                        <div className="flex items-start gap-4">
                          <div className="rounded-full p-2 bg-green-100">
                            <Lock className="h-4 w-4 text-green-500" />
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm font-medium">密码修改</p>
                            <p className="text-xs text-muted-foreground">您的账户密码已更新</p>
                            <p className="text-xs text-muted-foreground">2025-04-10 14:15</p>
                          </div>
                        </div>
                      </div>

                      <div className="border-b pb-4">
                        <div className="flex items-start gap-4">
                          <div className="rounded-full p-2 bg-yellow-100">
                            <Mail className="h-4 w-4 text-yellow-500" />
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm font-medium">邮箱验证</p>
                            <p className="text-xs text-muted-foreground">您的邮箱已验证</p>
                            <p className="text-xs text-muted-foreground">2025-04-05 09:45</p>
                          </div>
                        </div>
                      </div>

                      <div className="border-b pb-4">
                        <div className="flex items-start gap-4">
                          <div className="rounded-full p-2 bg-purple-100">
                            <User className="h-4 w-4 text-purple-500" />
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm font-medium">个人信息更新</p>
                            <p className="text-xs text-muted-foreground">您的个人信息已更新</p>
                            <p className="text-xs text-muted-foreground">2025-04-01 16:20</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline">查看更多活动</Button>
                  </CardFooter>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

