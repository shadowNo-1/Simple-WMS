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
import { useDb } from "@/lib/db"
import { useAuth } from "@/lib/auth-context"

export default function StockOutPage() {
  const { t } = useTranslation()
  const { toast } = useToast()
  const { getAllProducts, stockOut } = useDb()
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState("manual")
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    productId: "",
    quantity: "1",
    barcode: "",
  })

  const products = getAllProducts()

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
      if (!user) {
        throw new Error("用户未登录")
      }

      if (!formData.productId) {
        throw new Error("请选择产品")
      }

      const quantity = Number.parseInt(formData.quantity)
      if (isNaN(quantity) || quantity <= 0) {
        throw new Error("请输入有效的数量")
      }

      const product = products.find((p) => p.id === formData.productId)
      if (!product) {
        throw new Error("产品不存在")
      }

      if (product.quantity < quantity) {
        throw new Error(`库存不足，当前库存: ${product.quantity}`)
      }

      const result = stockOut(formData.productId, quantity, user.id, user.name)

      if (result) {
        toast({
          title: t("success"),
          description: `已成功为 ${result.productName} 出库 ${quantity} 个`,
        })

        // Reset form after successful submission
        setFormData({
          productId: "",
          quantity: "1",
          barcode: "",
        })
      }
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
      const product = products[Math.floor(Math.random() * products.length)]

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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">{t("stockOut")}</h1>
      </div>

      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>{t("stockOut")}</CardTitle>
          <CardDescription>从库存中移除产品</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="manual">手动输入</TabsTrigger>
              <TabsTrigger value="barcode">扫码出库</TabsTrigger>
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
                      {products.map((product) => (
                        <SelectItem key={product.id} value={product.id}>
                          {product.name} ({product.code}) - 库存: {product.quantity}
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
                    t("stockOut")
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
                        {products.find((p) => p.id === formData.productId)?.name || "未知产品"}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {products.find((p) => p.id === formData.productId)?.code || ""} - 库存:{" "}
                        {products.find((p) => p.id === formData.productId)?.quantity || 0}
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
                        t("stockOut")
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

