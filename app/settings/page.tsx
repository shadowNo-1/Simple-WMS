"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import DashboardLayout from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Settings, Save, User, Building, Bell, Database, Printer, Warehouse, Shield } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function SettingsPage() {
  const router = useRouter()
  const [isClient, setIsClient] = useState(false)
  const [activeTab, setActiveTab] = useState("general")

  // ICP备案和公安备案信息
  const [icpNumber, setIcpNumber] = useState("")
  const [icpLink, setIcpLink] = useState("")
  const [securityNumber, setSecurityNumber] = useState("")
  const [securityLink, setSecurityLink] = useState("")
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [securityIcon, setSecurityIcon] = useState<string | null>(null)

  useEffect(() => {
    setIsClient(true)
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true"
    if (!isLoggedIn) {
      router.push("/login")
    }

    // 加载备案信息
    const storedIcpInfo = localStorage.getItem("icpInfo")
    const storedSecurityInfo = localStorage.getItem("securityInfo")
    const storedBarcodeFormat = localStorage.getItem("barcodeFormat")

    if (storedIcpInfo) {
      const icpInfo = JSON.parse(storedIcpInfo)
      setIcpNumber(icpInfo.number || "")
      setIcpLink(icpInfo.link || "")
    } else {
      // 默认值
      setIcpNumber("京ICP备12345678号")
      setIcpLink("https://beian.miit.gov.cn/")
    }

    if (storedSecurityInfo) {
      const securityInfo = JSON.parse(storedSecurityInfo)
      setSecurityNumber(securityInfo.number || "")
      setSecurityLink(securityInfo.link || "")
      setSecurityIcon(securityInfo.icon || null)
    } else {
      // 默认值
      setSecurityNumber("京公网安备11010502030143号")
      setSecurityLink("http://www.beian.gov.cn/")
    }

    // 如果存在条码格式设置，则在页面加载后设置选择框的值
    if (storedBarcodeFormat && document.getElementById("barcode-format")) {
      ;(document.getElementById("barcode-format") as HTMLSelectElement).value = storedBarcodeFormat
    }
  }, [router])

  const handleSaveRecordInfo = () => {
    // 保存备案信息到本地存储
    localStorage.setItem(
      "icpInfo",
      JSON.stringify({
        number: icpNumber,
        link: icpLink,
      }),
    )

    localStorage.setItem(
      "securityInfo",
      JSON.stringify({
        number: securityNumber,
        link: securityLink,
        icon: securityIcon,
      }),
    )

    // 显示保存成功提示
    setSaveSuccess(true)
    setTimeout(() => setSaveSuccess(false), 3000)

    // 自动刷新页面以应用新设置
    window.location.reload()
  }

  // 添加新的函数处理通用设置保存
  const handleSaveGeneralSettings = () => {
    // 在实际应用中，这里会保存设置到后端或本地存储
    // 显示保存成功提示
    setSaveSuccess(true)
    setTimeout(() => setSaveSuccess(false), 3000)

    // 自动刷新页面以应用新设置
    window.location.reload()
  }

  // 添加新的函数处理公司信息保存
  const handleSaveCompanyInfo = () => {
    // 在实际应用中，这里会保存设置到后端或本地存储
    // 显示保存成功提示
    setSaveSuccess(true)
    setTimeout(() => setSaveSuccess(false), 3000)

    // 自动刷新页面以应用新设置
    window.location.reload()
  }

  // 添加新的函数处理通知设置保存
  const handleSaveNotificationSettings = () => {
    // 在实际应用中，这里会保存设置到后端或本地存储
    // 显示保存成功提示
    setSaveSuccess(true)
    setTimeout(() => setSaveSuccess(false), 3000)

    // 自动刷新页面以应用新设置
    window.location.reload()
  }

  // 添加新的函数处理系统配置保存
  const handleSaveSystemConfig = () => {
    // 获取当前选择的条码格式
    const barcodeFormat = document.getElementById("barcode-format") as HTMLSelectElement
    const selectedFormat = barcodeFormat ? barcodeFormat.value : "code128"

    // 保存到本地存储
    localStorage.setItem("barcodeFormat", selectedFormat)

    // 在实际应用中，这里会保存设置到后端或本地存储
    // 显示保存成功提示
    setSaveSuccess(true)
    setTimeout(() => setSaveSuccess(false), 3000)

    // 自动刷新页面以应用新设置
    window.location.reload()
  }

  if (!isClient) {
    return null // Prevent hydration errors
  }

  return (
    <DashboardLayout>
      <div className="p-4 md:p-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">系统设置</h1>
            <p className="text-muted-foreground">管理系统配置和偏好设置</p>
          </div>
        </div>

        {saveSuccess && (
          <Alert className="mb-4 bg-green-50 border-green-200">
            <AlertDescription className="text-green-600">设置已成功保存！</AlertDescription>
          </Alert>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 w-full">
            <TabsTrigger value="general">
              <Settings className="mr-2 h-4 w-4" />
              通用设置
            </TabsTrigger>
            <TabsTrigger value="company">
              <Building className="mr-2 h-4 w-4" />
              公司信息
            </TabsTrigger>
            <TabsTrigger value="warehouses">
              <Warehouse className="mr-2 h-4 w-4" />
              仓库管理
            </TabsTrigger>
            <TabsTrigger value="users">
              <User className="mr-2 h-4 w-4" />
              用户管理
            </TabsTrigger>
            <TabsTrigger value="notifications">
              <Bell className="mr-2 h-4 w-4" />
              通知设置
            </TabsTrigger>
            <TabsTrigger value="system">
              <Database className="mr-2 h-4 w-4" />
              系统配置
            </TabsTrigger>
            <TabsTrigger value="record">
              <Shield className="mr-2 h-4 w-4" />
              备案信息
            </TabsTrigger>
          </TabsList>

          <TabsContent value="general">
            <Card>
              <CardHeader>
                <CardTitle>通用设置</CardTitle>
                <CardDescription>配置系统的基本设置</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="language">系统语言</Label>
                    <Select defaultValue="zh-CN">
                      <SelectTrigger id="language">
                        <SelectValue placeholder="选择语言" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="zh-CN">简体中文</SelectItem>
                        <SelectItem value="en-US">English</SelectItem>
                        <SelectItem value="ja-JP">日本語</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="timezone">时区</Label>
                    <Select defaultValue="Asia/Shanghai">
                      <SelectTrigger id="timezone">
                        <SelectValue placeholder="选择时区" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Asia/Shanghai">中国标准时间 (UTC+8)</SelectItem>
                        <SelectItem value="America/New_York">美国东部时间 (UTC-5)</SelectItem>
                        <SelectItem value="Europe/London">格林威治标准时间 (UTC+0)</SelectItem>
                        <SelectItem value="Asia/Tokyo">日本标准时间 (UTC+9)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="date-format">日期格式</Label>
                    <Select defaultValue="yyyy-MM-dd">
                      <SelectTrigger id="date-format">
                        <SelectValue placeholder="选择日期格式" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="yyyy-MM-dd">YYYY-MM-DD</SelectItem>
                        <SelectItem value="dd/MM/yyyy">DD/MM/YYYY</SelectItem>
                        <SelectItem value="MM/dd/yyyy">MM/DD/YYYY</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="dark-mode">深色模式</Label>
                      <p className="text-sm text-muted-foreground">启用系统深色模式</p>
                    </div>
                    <Switch id="dark-mode" />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleSaveGeneralSettings}>
                  <Save className="mr-2 h-4 w-4" />
                  保存设置
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="company">
            <Card>
              <CardHeader>
                <CardTitle>公司信息</CardTitle>
                <CardDescription>设置您的公司基本信息</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="company-name">公司名称</Label>
                    <Input id="company-name" placeholder="输入公司名称" defaultValue="示例公司有限公司" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="company-address">公司地址</Label>
                    <Input
                      id="company-address"
                      placeholder="输入公司地址"
                      defaultValue="上海市浦东新区张江高科技园区"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="company-phone">联系电话</Label>
                      <Input id="company-phone" placeholder="输入联系电话" defaultValue="021-12345678" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="company-email">电子邮箱</Label>
                      <Input
                        id="company-email"
                        type="email"
                        placeholder="输入电子邮箱"
                        defaultValue="contact@example.com"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="company-tax">税号</Label>
                    <Input id="company-tax" placeholder="输入公司税号" defaultValue="91310000XXXXXXXX" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="company-logo">公司Logo</Label>
                    <div className="flex items-center gap-4">
                      <div className="h-16 w-16 rounded-md border flex items-center justify-center bg-gray-50">
                        <Building className="h-8 w-8 text-gray-400" />
                      </div>
                      <Button variant="outline">上传Logo</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleSaveCompanyInfo}>
                  <Save className="mr-2 h-4 w-4" />
                  保存信息
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="warehouses">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>仓库管理</CardTitle>
                  <CardDescription>管理系统中的仓库</CardDescription>
                </div>
                <Button>
                  <Warehouse className="mr-2 h-4 w-4" />
                  添加仓库
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="rounded-md border">
                    <div className="flex items-center justify-between p-4">
                      <div className="flex items-center gap-4">
                        <Warehouse className="h-8 w-8 text-gray-500" />
                        <div>
                          <h3 className="font-medium">主仓库</h3>
                          <p className="text-sm text-muted-foreground">上海市浦东新区</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          编辑
                        </Button>
                        <Button variant="outline" size="sm" className="text-red-500">
                          删除
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-md border">
                    <div className="flex items-center justify-between p-4">
                      <div className="flex items-center gap-4">
                        <Warehouse className="h-8 w-8 text-gray-500" />
                        <div>
                          <h3 className="font-medium">北区仓库</h3>
                          <p className="text-sm text-muted-foreground">北京市朝阳区</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          编辑
                        </Button>
                        <Button variant="outline" size="sm" className="text-red-500">
                          删除
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-md border">
                    <div className="flex items-center justify-between p-4">
                      <div className="flex items-center gap-4">
                        <Warehouse className="h-8 w-8 text-gray-500" />
                        <div>
                          <h3 className="font-medium">南区仓库</h3>
                          <p className="text-sm text-muted-foreground">广州市天河区</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          编辑
                        </Button>
                        <Button variant="outline" size="sm" className="text-red-500">
                          删除
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>用户管理</CardTitle>
                  <CardDescription>管理系统用户和权限</CardDescription>
                </div>
                <Button>
                  <User className="mr-2 h-4 w-4" />
                  添加用户
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="rounded-md border">
                    <div className="flex items-center justify-between p-4">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                          <User className="h-5 w-5 text-gray-600" />
                        </div>
                        <div>
                          <h3 className="font-medium">管理员</h3>
                          <p className="text-sm text-muted-foreground">admin@example.com</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">管理员</span>
                        <Button variant="outline" size="sm">
                          编辑
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-md border">
                    <div className="flex items-center justify-between p-4">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                          <User className="h-5 w-5 text-gray-600" />
                        </div>
                        <div>
                          <h3 className="font-medium">仓库管理员</h3>
                          <p className="text-sm text-muted-foreground">warehouse@example.com</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">仓库管理员</span>
                        <Button variant="outline" size="sm">
                          编辑
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-md border">
                    <div className="flex items-center justify-between p-4">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                          <User className="h-5 w-5 text-gray-600" />
                        </div>
                        <div>
                          <h3 className="font-medium">操作员</h3>
                          <p className="text-sm text-muted-foreground">operator@example.com</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800">操作员</span>
                        <Button variant="outline" size="sm">
                          编辑
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>通知设置</CardTitle>
                <CardDescription>配置系统通知和提醒</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="low-stock">低库存提醒</Label>
                      <p className="text-sm text-muted-foreground">当库存低于最小库存量时发送通知</p>
                    </div>
                    <Switch id="low-stock" defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="out-of-stock">缺货提醒</Label>
                      <p className="text-sm text-muted-foreground">当产品缺货时发送通知</p>
                    </div>
                    <Switch id="out-of-stock" defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="new-transaction">新交易提醒</Label>
                      <p className="text-sm text-muted-foreground">当有新的出入库操作时发送通知</p>
                    </div>
                    <Switch id="new-transaction" />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="inventory-check">盘点提醒</Label>
                      <p className="text-sm text-muted-foreground">当有新的盘点任务时发送通知</p>
                    </div>
                    <Switch id="inventory-check" defaultChecked />
                  </div>

                  <div className="space-y-2 pt-4">
                    <Label htmlFor="notification-email">通知邮箱</Label>
                    <Input
                      id="notification-email"
                      type="email"
                      placeholder="输入接收通知的邮箱"
                      defaultValue="admin@example.com"
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleSaveNotificationSettings}>
                  <Save className="mr-2 h-4 w-4" />
                  保存设置
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="system">
            <Card>
              <CardHeader>
                <CardTitle>系统配置</CardTitle>
                <CardDescription>配置系统高级设置</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="backup-frequency">自动备份频率</Label>
                    <Select defaultValue="daily">
                      <SelectTrigger id="backup-frequency">
                        <SelectValue placeholder="选择备份频率" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">每天</SelectItem>
                        <SelectItem value="weekly">每周</SelectItem>
                        <SelectItem value="monthly">每月</SelectItem>
                        <SelectItem value="never">从不</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="printer-config">打印机配置</Label>
                    <div className="flex items-center gap-2">
                      <Select defaultValue="default">
                        <SelectTrigger id="printer-config">
                          <SelectValue placeholder="选择打印机" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="default">默认打印机</SelectItem>
                          <SelectItem value="label">标签打印机</SelectItem>
                          <SelectItem value="receipt">收据打印机</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button variant="outline" size="icon">
                        <Printer className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="barcode-format">条码格式</Label>
                    <Select defaultValue="code128" id="barcode-format">
                      <SelectTrigger id="barcode-format">
                        <SelectValue placeholder="选择条码格式" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="code128">Code 128</SelectItem>
                        <SelectItem value="code39">Code 39</SelectItem>
                        <SelectItem value="ean13">EAN-13</SelectItem>
                        <SelectItem value="qrcode">QR Code</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="debug-mode">调试模式</Label>
                      <p className="text-sm text-muted-foreground">启用系统调试模式</p>
                    </div>
                    <Switch id="debug-mode" />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={() => {
                    if (confirm("确定要恢复默认设置吗？")) {
                      // 在实际应用中，这里会恢复默认设置
                      setSaveSuccess(true)
                      setTimeout(() => setSaveSuccess(false), 3000)
                      window.location.reload()
                    }
                  }}
                >
                  恢复默认设置
                </Button>
                <Button onClick={handleSaveSystemConfig}>
                  <Save className="mr-2 h-4 w-4" />
                  保存配置
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="record">
            <Card>
              <CardHeader>
                <CardTitle>备案信息</CardTitle>
                <CardDescription>设置网站底部显示的ICP备案和公安备案信息</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="icp-number">ICP备案号</Label>
                    <Input
                      id="icp-number"
                      placeholder="例如：京ICP备12345678号"
                      value={icpNumber}
                      onChange={(e) => setIcpNumber(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="icp-link">ICP备案链接</Label>
                    <Input
                      id="icp-link"
                      placeholder="例如：https://beian.miit.gov.cn/"
                      value={icpLink}
                      onChange={(e) => setIcpLink(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="security-number">公安备案号</Label>
                    <Input
                      id="security-number"
                      placeholder="例如：京公网安备11010502030143号"
                      value={securityNumber}
                      onChange={(e) => setSecurityNumber(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="security-link">公安备案链接</Label>
                    <Input
                      id="security-link"
                      placeholder="例如：http://www.beian.gov.cn/"
                      value={securityLink}
                      onChange={(e) => setSecurityLink(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="security-icon">公安备案图标</Label>
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-md border flex items-center justify-center bg-gray-50">
                        {securityIcon ? (
                          <img src={securityIcon || "/placeholder.svg"} alt="公安备案图标" className="h-8 w-8" />
                        ) : (
                          <Shield className="h-6 w-6 text-gray-400" />
                        )}
                      </div>
                      <Input
                        id="security-icon"
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) {
                            const reader = new FileReader()
                            reader.onloadend = () => {
                              setSecurityIcon(reader.result as string)
                              // 保存到本地存储
                              const securityInfo = JSON.parse(localStorage.getItem("securityInfo") || "{}")
                              securityInfo.icon = reader.result
                              localStorage.setItem("securityInfo", JSON.stringify(securityInfo))
                            }
                            reader.readAsDataURL(file)
                          }
                        }}
                      />
                    </div>
                  </div>

                  <div className="pt-4">
                    <Label>预览</Label>
                    <div className="mt-2 p-4 border rounded-md">
                      <div className="flex flex-col md:flex-row items-center justify-center gap-4">
                        {icpNumber && (
                          <a
                            href={icpLink || "https://beian.miit.gov.cn/"}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-500 hover:text-gray-700"
                          >
                            {icpNumber}
                          </a>
                        )}

                        {securityNumber && (
                          <a
                            href={securityLink || "http://www.beian.gov.cn/"}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center text-gray-500 hover:text-gray-700"
                          >
                            {securityIcon ? (
                              <img
                                src={securityIcon || "/placeholder.svg"}
                                alt="公安备案图标"
                                className="h-4 w-4 mr-1"
                              />
                            ) : (
                              <Shield className="h-4 w-4 mr-1" />
                            )}
                            {securityNumber}
                          </a>
                        )}
                      </div>
                      <div className="mt-2 text-center text-gray-500">
                        © {new Date().getFullYear()} SimpleWMS 版权所有
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleSaveRecordInfo}>
                  <Save className="mr-2 h-4 w-4" />
                  保存备案信息
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}

