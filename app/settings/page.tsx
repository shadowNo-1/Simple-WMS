"use client"

import { useState } from "react"
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

export default function SettingsPage() {
  const { t } = useTranslation()
  const { language, setLanguage } = useLanguage()
  const { toast } = useToast()
  const [isSaving, setIsSaving] = useState(false)

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

  const handleSaveSettings = async () => {
    setIsSaving(true)

    try {
      // In a real app, you would save settings to a database or API
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Update language if changed
      if (generalSettings.defaultLanguage !== language) {
        setLanguage(generalSettings.defaultLanguage)
      }

      toast({
        title: "设置已保存",
        description: "您的系统设置已成功更新",
      })
    } catch (error) {
      toast({
        title: t("error"),
        description: String(error),
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">系统设置</h1>

        <Tabs defaultValue="general">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="general">基本设置</TabsTrigger>
            <TabsTrigger value="barcode">条码设置</TabsTrigger>
            <TabsTrigger value="notifications">通知设置</TabsTrigger>
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
              <CardFooter className="flex justify-between">
                <Button variant="outline">重置</Button>
                <Button onClick={handleSaveSettings} disabled={isSaving}>
                  {isSaving ? (
                    <>
                      <Icons.sun className="mr-2 h-4 w-4 animate-spin" />
                      保存中...
                    </>
                  ) : (
                    "保存更改"
                  )}
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
              <CardFooter className="flex justify-between">
                <Button variant="outline">重置</Button>
                <Button onClick={handleSaveSettings} disabled={isSaving}>
                  {isSaving ? (
                    <>
                      <Icons.sun className="mr-2 h-4 w-4 animate-spin" />
                      保存中...
                    </>
                  ) : (
                    "保存更改"
                  )}
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
                      onChange={(e) =>
                        setNotificationSettings({ ...notificationSettings, emailAddress: e.target.value })
                      }
                    />
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline">重置</Button>
                <Button onClick={handleSaveSettings} disabled={isSaving}>
                  {isSaving ? (
                    <>
                      <Icons.sun className="mr-2 h-4 w-4 animate-spin" />
                      保存中...
                    </>
                  ) : (
                    "保存更改"
                  )}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

