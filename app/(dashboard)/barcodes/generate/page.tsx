"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { Icons } from "@/components/icons"
import { useTranslation } from "@/lib/i18n"
import { useDb } from "@/lib/db"

export default function GenerateBarcodePage() {
  const { t } = useTranslation()
  const { toast } = useToast()
  const { getAllProducts } = useDb()
  const [barcodeType, setBarcodeType] = useState("barcode")
  const [isLoading, setIsLoading] = useState(false)
  const [barcodeImageUrl, setBarcodeImageUrl] = useState("")
  const [formData, setFormData] = useState({
    productId: "",
    quantity: "1",
    customText: "",
  })

  const products = getAllProducts()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({ ...prev, productId: value }))
  }

  const generateBarcode = async () => {
    setIsLoading(true)

    try {
      // In a real application, you would call an API to generate the barcode
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Using placeholder SVG for demonstration
      const selectedProduct = products.find((p) => p.id === formData.productId)
      const text = selectedProduct ? `${selectedProduct.code}-${selectedProduct.name}` : formData.customText

      // Create a fake barcode URL - in a real app, this would be a generated image
      const placeholderUrl =
        barcodeType === "qrcode"
          ? `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(text)}`
          : `/placeholder.svg?height=100&width=250&text=${encodeURIComponent(text)}`

      setBarcodeImageUrl(placeholderUrl)

      toast({
        title: t("success"),
        description: `${barcodeType === "qrcode" ? "二维码" : "条形码"}已生成`,
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    generateBarcode()
  }

  const handlePrint = () => {
    // In a real application, this would trigger printing
    toast({
      title: "打印",
      description: "正在发送到打印机...",
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">{t("generateBarcode")}</h1>
      </div>

      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>{t("generateBarcode")}</CardTitle>
          <CardDescription>为产品生成条形码或二维码</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={barcodeType} onValueChange={setBarcodeType}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="barcode">条形码</TabsTrigger>
              <TabsTrigger value="qrcode">二维码</TabsTrigger>
            </TabsList>

            <TabsContent value="barcode" className="space-y-4 mt-4">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="productId">{t("productName")}</Label>
                  <Select value={formData.productId} onValueChange={handleSelectChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="选择产品" />
                    </SelectTrigger>
                    <SelectContent>
                      {products.map((product) => (
                        <SelectItem key={product.id} value={product.id}>
                          {product.name} ({product.code})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="quantity">标签数量</Label>
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
                      生成中...
                    </>
                  ) : (
                    "生成条形码"
                  )}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="qrcode" className="space-y-4 mt-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="productId">{t("productName")}</Label>
                  <Select value={formData.productId} onValueChange={handleSelectChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="选择产品" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="custom">自定义文本</SelectItem>
                      {products.map((product) => (
                        <SelectItem key={product.id} value={product.id}>
                          {product.name} ({product.code})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {formData.productId === "custom" && (
                  <div className="space-y-2">
                    <Label htmlFor="customText">自定义文本</Label>
                    <Input
                      id="customText"
                      name="customText"
                      value={formData.customText}
                      onChange={handleChange}
                      placeholder="输入要编码的文本"
                      disabled={isLoading}
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="quantity">标签数量</Label>
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

                <Button
                  className="w-full"
                  onClick={generateBarcode}
                  disabled={isLoading || (!formData.productId && !formData.customText)}
                >
                  {isLoading ? (
                    <>
                      <Icons.sun className="mr-2 h-4 w-4 animate-spin" />
                      生成中...
                    </>
                  ) : (
                    "生成二维码"
                  )}
                </Button>
              </div>
            </TabsContent>
          </Tabs>

          {barcodeImageUrl && (
            <div className="mt-6 pt-6 border-t border-border">
              <div className="flex flex-col items-center justify-center gap-4">
                <div className="text-center">
                  <div className="text-sm font-medium mb-2">预览:</div>
                  <div className="p-4 bg-white rounded-md">
                    <img
                      src={barcodeImageUrl || "/placeholder.svg"}
                      alt="Generated Barcode"
                      className="max-w-full h-auto"
                    />
                  </div>
                </div>
                <Button onClick={handlePrint} className="w-full">
                  <Icons.clipboard className="mr-2 h-4 w-4" />
                  打印
                </Button>
              </div>
            </div>
          )}
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

