"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { Icons } from "@/components/icons"
import { useLanguage, useTranslation, LANGUAGES } from "@/lib/i18n"
import { useBranding } from "@/lib/branding-context"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"

// 模拟用户数据
const mockUsers = [
  {
    id: "1",
    name: "Admin User",
    email: "admin@example.com",
    role: "admin",
    status: "active",
    lastLogin: new Date(Date.now() - 2 * 60 * 60 * 1000),
  },
  {
    id: "2",
    name: "仓库管理员",
    email: "warehouse@example.com",
    role: "manager",
    status: "active",
    lastLogin: new Date(Date.now() - 24 * 60 * 60 * 1000),
  },
  {
    id: "3",
    name: "普通用户",
    email: "user@example.com",
    role: "user",
    status: "inactive",
    lastLogin: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
  },
]

export default function SettingsPage() {
  const { t } = useTranslation()
  const { language, setLanguage } = useLanguage()
  const { toast } = useToast()
  const { branding, updateBranding } = useBranding()
  const [mounted, setMounted] = useState(false)
  const [users, setUsers] = useState(mockUsers)
  const [isUserDialogOpen, setIsUserDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedUserId, setSelectedUserId] = useState("")
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
  })

  const [generalSettings, setGeneralSettings] = useState({
    companyName: "示例公司",
    warehouseName: "主仓库",
    allowNegativeStock: false,
    defaultLanguage: language,
  })

  const [barcodeSettings, setBarcodeSettings] = useState({
    barcodePrefix: "WMS",
    defaultBarcodeType: "code128",
    showProductName: true,
    showQuantity: true,
  })

  const [notificationSettings, setNotificationSettings] = useState({
    lowStockAlert: true,
    lowStockThreshold: "10",
    emailNotifications: false,
    emailAddress: "",
  })

  const [appearanceSettings, setAppearanceSettings] = useState({
    siteName: "简易 WMS 系统",
    iconPreview: "",
    copyright: "© 2025 示例公司. 保留所有权利.",
    primaryColor: "blue",
  })

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted) {
      setAppearanceSettings({
        siteName: branding.siteName,
        iconPreview: branding.icon,
        copyright: branding.copyright,
        primaryColor: branding.primaryColor,
      })
    }
  }, [branding, mounted])

  const themeColors = [
    { name: "蓝色", value: "blue", hex: "#2563eb" },
    { name: "红色", value: "red", hex: "#dc2626" },
    { name: "绿色", value: "green", hex: "#16a34a" },
    { name: "紫色", value: "purple", hex: "#9333ea" },
    { name: "橙色", value: "orange", hex: "#ea580c" },
    { name: "粉色", value: "pink", hex: "#db2777" },
  ]

  const handleIconChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setAppearanceSettings({
          ...appearanceSettings,
          iconPreview: event.target?.result as string,
        })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSaveGeneralSettings = async () => {
    try {
      // 保存基本设置
      await new Promise((resolve) => setTimeout(resolve, 500))

      // 更新语言
      if (generalSettings.defaultLanguage !== language) {
        setLanguage(generalSettings.defaultLanguage)
      }

      toast({
        title: "基本设置已保存",
        description: "您的基本设置已成功更新",
      })
    } catch (error) {
      toast({
        title: t("error"),
        description: String(error),
        variant: "destructive",
      })
    }
  }

  const handleSaveAppearanceSettings = async () => {
    try {
      // 保存外观设置
      await new Promise((resolve) => setTimeout(resolve, 500))

      // 更新品牌设置
      updateBranding({
        siteName: appearanceSettings.siteName,
        icon: appearanceSettings.iconPreview,
        copyright: appearanceSettings.copyright,
        primaryColor: appearanceSettings.primaryColor,
      })

      toast({
        title: "外观设置已保存",
        description: "您的外观设置已成功更新",
      })
    } catch (error) {
      toast({
        title: t("error"),
        description: String(error),
        variant: "destructive",
      })
    }
  }

  const handleSaveBarcodeSettings = async () => {
    try {
      // 保存条码设置
      await new Promise((resolve) => setTimeout(resolve, 500))

      toast({
        title: "条码设置已保存",
        description: "您的条码设置已成功更新",
      })
    } catch (error) {
      toast({
        title: t("error"),
        description: String(error),
        variant: "destructive",
      })
    }
  }

  const handleSaveNotificationSettings = async () => {
    try {
      // 保存通知设置
      await new Promise((resolve) => setTimeout(resolve, 500))

      toast({
        title: "通知设置已保存",
        description: "您的通知设置已成功更新",
      })
    } catch (error) {
      toast({
        title: t("error"),
        description: String(error),
        variant: "destructive",
      })
    }
  }

  const handleAddUser = () => {
    // 验证表单
    if (!newUser.name || !newUser.email || !newUser.password) {
      toast({
        title: "错误",
        description: "请填写所有必填字段",
        variant: "destructive",
      })
      return
    }

    // 添加新用户
    const newUserId = (users.length + 1).toString()
    setUsers([
      ...users,
      {
        id: newUserId,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        status: "active",
        lastLogin: new Date(),
      },
    ])

    // 重置表单并关闭对话框
    setNewUser({
      name: "",
      email: "",
      password: "",
      role: "user",
    })
    setIsUserDialogOpen(false)

    toast({
      title: "用户已添加",
      description: `${newUser.name} 已成功添加到系统`,
    })
  }

  const handleDeleteUser = () => {
    if (!selectedUserId) return

    setUsers(users.filter((user) => user.id !== selectedUserId))
    setIsDeleteDialogOpen(false)

    toast({
      title: "用户已删除",
      description: "用户已成功从系统中删除",
    })
  }

  const handleToggleUserStatus = (userId: string) => {
    setUsers(
      users.map((user) =>
        user.id === userId ? { ...user, status: user.status === "active" ? "inactive" : "active" } : user,
      ),
    )

    const user = users.find((u) => u.id === userId)
    if (user) {
      toast({
        title: `用户已${user.status === "active" ? "禁用" : "启用"}`,
        description: `${user.name} 已${user.status === "active" ? "禁用" : "启用"}`,
      })
    }
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("zh-CN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">系统设置</h1>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          <TabsTrigger value="general">基本设置</TabsTrigger>
          <TabsTrigger value="appearance">外观设置</TabsTrigger>
          <TabsTrigger value="barcode">条码设置</TabsTrigger>
          <TabsTrigger value="notifications">通知设置</TabsTrigger>
          <TabsTrigger value="users">用户管理</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>基本设置</CardTitle>
              <CardDescription>配置系统的基本信息</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="companyName">公司名称</Label>
                <Input
                  id="companyName"
                  value={generalSettings.companyName}
                  onChange={(e) => setGeneralSettings({ ...generalSettings, companyName: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="warehouseName">仓库名称</Label>
                <Input
                  id="warehouseName"
                  value={generalSettings.warehouseName}
                  onChange={(e) => setGeneralSettings({ ...generalSettings, warehouseName: e.target.value })}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="allowNegativeStock">允许负库存</Label>
                  <p className="text-sm text-muted-foreground">允许出库操作导致库存为负数</p>
                </div>
                <Switch
                  id="allowNegativeStock"
                  checked={generalSettings.allowNegativeStock}
                  onCheckedChange={(value) => setGeneralSettings({ ...generalSettings, allowNegativeStock: value })}
                />
              </div>

              <Separator />

              <div className="space-y-2">
                <Label htmlFor="defaultLanguage">默认语言</Label>
                <Select
                  value={generalSettings.defaultLanguage}
                  onValueChange={(value) => setGeneralSettings({ ...generalSettings, defaultLanguage: value })}
                >
                  <SelectTrigger id="defaultLanguage">
                    <SelectValue placeholder="选择语言" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(LANGUAGES).map(([code, name]) => (
                      <SelectItem key={code} value={code}>
                        {name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button onClick={handleSaveGeneralSettings}>
                <Icons.settings className="mr-2 h-4 w-4" />
                保存基本设置
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="appearance">
          <Card>
            <CardHeader>
              <CardTitle>外观设置</CardTitle>
              <CardDescription>自定义系统的外观和品牌信息</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="siteName">网站名称</Label>
                <Input
                  id="siteName"
                  value={appearanceSettings.siteName}
                  onChange={(e) => setAppearanceSettings({ ...appearanceSettings, siteName: e.target.value })}
                  placeholder="简易 WMS 系统"
                />
                <p className="text-sm text-muted-foreground">显示在浏览器标签和页面顶部的名称</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="siteIcon">网站图标</Label>
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-md border border-dashed">
                    {appearanceSettings.iconPreview ? (
                      <img
                        src={appearanceSettings.iconPreview || "/placeholder.svg"}
                        alt="Site Icon"
                        className="h-12 w-12 object-contain"
                      />
                    ) : (
                      <Icons.inventory className="h-8 w-8 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex-1">
                    <Input
                      id="siteIcon"
                      type="file"
                      accept="image/*"
                      onChange={handleIconChange}
                      className="cursor-pointer"
                    />
                    <p className="mt-1 text-xs text-muted-foreground">推荐尺寸: 512x512 像素, 格式: PNG, SVG</p>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label htmlFor="copyright">版权信息</Label>
                <Input
                  id="copyright"
                  value={appearanceSettings.copyright}
                  onChange={(e) => setAppearanceSettings({ ...appearanceSettings, copyright: e.target.value })}
                  placeholder="© 2025 公司名称. 保留所有权利."
                />
                <p className="text-sm text-muted-foreground">显示在页面底部的版权信息</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="primaryColor">主题色</Label>
                <div className="flex gap-2">
                  {themeColors.map((color) => (
                    <button
                      key={color.value}
                      type="button"
                      className={`h-8 w-8 rounded-full ${
                        appearanceSettings.primaryColor === color.value ? "ring-2 ring-offset-2 ring-primary" : ""
                      }`}
                      style={{ backgroundColor: color.hex }}
                      onClick={() => setAppearanceSettings({ ...appearanceSettings, primaryColor: color.value })}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button onClick={handleSaveAppearanceSettings}>
                <Icons.settings className="mr-2 h-4 w-4" />
                保存外观设置
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="barcode">
          <Card>
            <CardHeader>
              <CardTitle>条码设置</CardTitle>
              <CardDescription>配置条码生成和扫描选项</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="barcodePrefix">条码前缀</Label>
                <Input
                  id="barcodePrefix"
                  value={barcodeSettings.barcodePrefix}
                  onChange={(e) => setBarcodeSettings({ ...barcodeSettings, barcodePrefix: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="defaultBarcodeType">默认条码类型</Label>
                <Select
                  value={barcodeSettings.defaultBarcodeType}
                  onValueChange={(value) => setBarcodeSettings({ ...barcodeSettings, defaultBarcodeType: value })}
                >
                  <SelectTrigger id="defaultBarcodeType">
                    <SelectValue placeholder="选择条码类型" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="code128">Code 128</SelectItem>
                    <SelectItem value="qrcode">QR Code</SelectItem>
                    <SelectItem value="ean13">EAN-13</SelectItem>
                    <SelectItem value="code39">Code 39</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="showProductName">在条码上显示产品名称</Label>
                  <p className="text-sm text-muted-foreground">在打印的条码标签上显示产品名称</p>
                </div>
                <Switch
                  id="showProductName"
                  checked={barcodeSettings.showProductName}
                  onCheckedChange={(value) => setBarcodeSettings({ ...barcodeSettings, showProductName: value })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="showQuantity">在条码上显示数量</Label>
                  <p className="text-sm text-muted-foreground">在打印的条码标签上显示产品数量</p>
                </div>
                <Switch
                  id="showQuantity"
                  checked={barcodeSettings.showQuantity}
                  onCheckedChange={(value) => setBarcodeSettings({ ...barcodeSettings, showQuantity: value })}
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button onClick={handleSaveBarcodeSettings}>
                <Icons.settings className="mr-2 h-4 w-4" />
                保存条码设置
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>通知设置</CardTitle>
              <CardDescription>配置系统通知和提醒</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="lowStockAlert">低库存提醒</Label>
                  <p className="text-sm text-muted-foreground">当产品库存低于阈值时发送提醒</p>
                </div>
                <Switch
                  id="lowStockAlert"
                  checked={notificationSettings.lowStockAlert}
                  onCheckedChange={(value) =>
                    setNotificationSettings({ ...notificationSettings, lowStockAlert: value })
                  }
                />
              </div>

              {notificationSettings.lowStockAlert && (
                <div className="space-y-2">
                  <Label htmlFor="lowStockThreshold">低库存阈值</Label>
                  <Input
                    id="lowStockThreshold"
                    type="number"
                    min="0"
                    value={notificationSettings.lowStockThreshold}
                    onChange={(e) =>
                      setNotificationSettings({ ...notificationSettings, lowStockThreshold: e.target.value })
                    }
                  />
                </div>
              )}

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="emailNotifications">电子邮件通知</Label>
                  <p className="text-sm text-muted-foreground">通过电子邮件接收系统通知</p>
                </div>
                <Switch
                  id="emailNotifications"
                  checked={notificationSettings.emailNotifications}
                  onCheckedChange={(value) =>
                    setNotificationSettings({ ...notificationSettings, emailNotifications: value })
                  }
                />
              </div>

              {notificationSettings.emailNotifications && (
                <div className="space-y-2">
                  <Label htmlFor="emailAddress">电子邮件地址</Label>
                  <Input
                    id="emailAddress"
                    type="email"
                    placeholder="example@company.com"
                    value={notificationSettings.emailAddress}
                    onChange={(e) => setNotificationSettings({ ...notificationSettings, emailAddress: e.target.value })}
                  />
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button onClick={handleSaveNotificationSettings}>
                <Icons.settings className="mr-2 h-4 w-4" />
                保存通知设置
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="users">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>用户管理</CardTitle>
                  <CardDescription>管理系统用户和权限</CardDescription>
                </div>
                <Button onClick={() => setIsUserDialogOpen(true)}>
                  <Icons.user className="mr-2 h-4 w-4" />
                  添加用户
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>用户名</TableHead>
                      <TableHead>邮箱</TableHead>
                      <TableHead>角色</TableHead>
                      <TableHead>状态</TableHead>
                      <TableHead>最后登录</TableHead>
                      <TableHead className="text-right">操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              user.role === "admin" ? "default" : user.role === "manager" ? "secondary" : "outline"
                            }
                          >
                            {user.role === "admin" ? "管理员" : user.role === "manager" ? "仓库管理员" : "普通用户"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={user.status === "active" ? "success" : "destructive"}>
                            {user.status === "active" ? "启用" : "禁用"}
                          </Badge>
                        </TableCell>
                        <TableCell>{formatDate(user.lastLogin)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="outline" size="sm" onClick={() => handleToggleUserStatus(user.id)}>
                              {user.status === "active" ? "禁用" : "启用"}
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => {
                                setSelectedUserId(user.id)
                                setIsDeleteDialogOpen(true)
                              }}
                            >
                              删除
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* 添加用户对话框 */}
      <Dialog open={isUserDialogOpen} onOpenChange={setIsUserDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>添加用户</DialogTitle>
            <DialogDescription>添加新用户到系统</DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="userName">用户名</Label>
              <Input
                id="userName"
                value={newUser.name}
                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                placeholder="例如: 张三"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="userEmail">邮箱</Label>
              <Input
                id="userEmail"
                type="email"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                placeholder="例如: user@example.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="userPassword">密码</Label>
              <Input
                id="userPassword"
                type="password"
                value={newUser.password}
                onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="userRole">角色</Label>
              <Select value={newUser.role} onValueChange={(value) => setNewUser({ ...newUser, role: value })}>
                <SelectTrigger id="userRole">
                  <SelectValue placeholder="选择角色" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">管理员</SelectItem>
                  <SelectItem value="manager">仓库管理员</SelectItem>
                  <SelectItem value="user">普通用户</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsUserDialogOpen(false)}>
              取消
            </Button>
            <Button onClick={handleAddUser}>添加用户</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 删除用户确认对话框 */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>确认删除</DialogTitle>
            <DialogDescription>您确定要删除此用户吗？此操作无法撤销。</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              取消
            </Button>
            <Button variant="destructive" onClick={handleDeleteUser}>
              确认删除
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

