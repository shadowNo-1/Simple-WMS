"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { Icons } from "@/components/icons"
import { useTranslation } from "@/lib/i18n"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Mock data - in a real app you would fetch this from an API
const mockProducts = [
  { id: "1", code: "P001", name: "笔记本电脑" },
  { id: "2", code: "P002", name: "办公桌" },
  { id: "3", code: "P003", name: "打印机" },
  { id: "4", code: "P004", name: "手机" },
  { id: "5", code: "P005", name: "键盘" },
]

export default function StockInPage() {
  const { t } = useTranslation()
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("manual")
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    productId: "",
    quantity: "1",
    barcode: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({ ...prev, productId: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // In a real application, you would make an API call here
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: t("success"),
        description: "库存已成功更新",
      })

      // Reset form after successful submission
      setFormData({
        productId: "",
        quantity: "1",
        barcode: "",
      })
    } catch (error) {
      toast({
        title: t("error"),
        description: String(error),
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleScan = async () => {
    setIsLoading(true)

    try {
      // In a real application, you would process the scanned barcode here
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mock finding a product by barcode
      const product = mockProducts[Math.floor(Math.random() * mockProducts.length)]

      setFormData({
        productId: product.id,
        quantity: "1",
        barcode: `${product.code}-${Date.now()}`,
      })

      toast({
        title: t("success"),
        description: `已扫描产品: ${product.name}`,
      })
    } catch (error) {
      toast({
        title: t("error"),
        description: String(error),
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>{t("stockIn")}</CardTitle>
          <CardDescription>添加产品到库存</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="manual">手动输入</TabsTrigger>
              <TabsTrigger value="barcode">扫码入库</TabsTrigger>
            </TabsList>
            <TabsContent value="manual">
              <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="productId">{t("productName")}</Label>
                  <Select value={formData.productId} onValueChange={handleSelectChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="选择产品" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockProducts.map((product) => (
                        <SelectItem key={product.id} value={product.id}>
                          {product.name} ({product.code})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="quantity">{t("quantity")}</Label>
                  <Input
                    id="quantity"
                    name="quantity"
                    type="number"
                    min="1"
                    value={formData.quantity}
                    onChange={handleChange}
                    required
                    disabled={isLoading}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading || !formData.productId}>
                  {isLoading ? (
                    <>
                      <Icons.sun className="mr-2 h-4 w-4 animate-spin" />
                      处理中...
                    </>
                  ) : (
                    t("stockIn")
                  )}
                </Button>
              </form>
            </TabsContent>
            <TabsContent value="barcode">
              <div className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="barcode">条码</Label>
                  <div className="flex gap-2">
                    <Input
                      id="barcode"
                      name="barcode"
                      value={formData.barcode}
                      onChange={handleChange}
                      placeholder="扫描或输入条码"
                      disabled={isLoading}
                      className="flex-1"
                    />
                    <Button type="button" variant="outline" size="icon" onClick={handleScan} disabled={isLoading}>
                      <Icons.scan className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {formData.barcode && (
                  <>
                    <div className="pt-4 border-t">
                      <div className="text-sm font-medium">已识别产品:</div>
                      <div className="text-lg font-bold">
                        {mockProducts.find((p) => p.id === formData.productId)?.name || "未知产品"}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {mockProducts.find((p) => p.id === formData.productId)?.code || ""}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="scanQuantity">{t("quantity")}</Label>
                      <Input
                        id="scanQuantity"
                        name="quantity"
                        type="number"
                        min="1"
                        value={formData.quantity}
                        onChange={handleChange}
                        required
                        disabled={isLoading}
                      />
                    </div>

                    <Button className="w-full" onClick={handleSubmit} disabled={isLoading || !formData.productId}>
                      {isLoading ? (
                        <>
                          <Icons.sun className="mr-2 h-4 w-4 animate-spin" />
                          处理中...
                        </>
                      ) : (
                        t("stockIn")
                      )}
                    </Button>
                  </>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="ghost" onClick={() => window.history.back()}>
            返回
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

