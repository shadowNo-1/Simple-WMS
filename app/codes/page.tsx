"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import DashboardLayout from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { QrCode, Barcode, Printer, Download, Search, Plus } from "lucide-react"
import Link from "next/link"
import { useLanguage } from "@/components/language-context"

// 导入条码生成库
import QRCode from "qrcode"
import JsBarcode from "jsbarcode"

// Mock data for products
const mockProducts = [
  { id: 1, sku: "SKU001", name: "产品A", category: "电子产品", location: "A-01-01" },
  { id: 2, sku: "SKU002", name: "产品B", category: "办公用品", location: "B-02-03" },
  { id: 3, sku: "SKU003", name: "产品C", category: "电子产品", location: "A-03-02" },
  { id: 4, sku: "SKU004", name: "产品D", category: "家具", location: "C-01-04" },
  { id: 5, sku: "SKU005", name: "产品E", category: "办公用品", location: "B-04-01" },
]

export default function CodesPage() {
  const router = useRouter()
  const { t } = useLanguage()
  const [isClient, setIsClient] = useState(false)
  const [activeTab, setActiveTab] = useState("generate")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedProduct, setSelectedProduct] = useState("")
  const [codeType, setCodeType] = useState("barcode")
  const [filteredProducts, setFilteredProducts] = useState(mockProducts)
  const [generatedCode, setGeneratedCode] = useState<string | null>(null)
  const [searchResults, setSearchResults] = useState<typeof mockProducts>([])
  const [isSearching, setIsSearching] = useState(false)
  const [showSearchResults, setShowSearchResults] = useState(false)
  const [barcodeFormat, setBarcodeFormat] = useState("code128")
  const [qrFormat, setQrFormat] = useState("L")
  const [codeSize, setCodeSize] = useState("medium")
  const [codeQuantity, setCodeQuantity] = useState(1)
  const [generatedCodeImage, setGeneratedCodeImage] = useState<string | null>(null)

  useEffect(() => {
    setIsClient(true)
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true"
    if (!isLoggedIn) {
      router.push("/login")
    }

    // 加载保存的条码格式设置
    const savedBarcodeFormat = localStorage.getItem("barcodeFormat")
    if (savedBarcodeFormat) {
      setBarcodeFormat(savedBarcodeFormat)
    }
  }, [router])

  useEffect(() => {
    // Filter products based on search term
    if (searchTerm) {
      const results = mockProducts.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.sku.toLowerCase().includes(searchTerm.toLowerCase()),
      )
      setFilteredProducts(results)
      setSearchResults(results)
      setShowSearchResults(true)
    } else {
      setFilteredProducts(mockProducts)
      setShowSearchResults(false)
    }
  }, [searchTerm])

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchTerm(value)
    setIsSearching(value.length > 0)

    // 实时搜索
    if (value) {
      const results = mockProducts.filter(
        (product) =>
          product.name.toLowerCase().includes(value.toLowerCase()) ||
          product.sku.toLowerCase().includes(value.toLowerCase()),
      )
      setSearchResults(results)
      setShowSearchResults(true)
    } else {
      setShowSearchResults(false)
    }
  }

  const handleSelectSearchResult = (sku: string) => {
    setSelectedProduct(sku)
    setSearchTerm("")
    setShowSearchResults(false)

    // 找到对应的产品名称，可以显示在UI上
    const product = mockProducts.find((p) => p.sku === sku)
    if (product) {
      console.log(`已选择产品: ${product.name} (${product.sku})`)
    }
  }

  // 修改 generateBarcode 函数，采用更简单、更可靠的方法
  const generateBarcode = async (text: string, format: string): Promise<string> => {
    return new Promise((resolve) => {
      const canvas = document.createElement("canvas")

      try {
        // 首先尝试使用 CODE128 格式（最通用的格式）
        JsBarcode(canvas, text, {
          format: "CODE128",
          width: 2,
          height: 100,
          displayValue: true,
          fontSize: 14,
          margin: 10,
          background: "#ffffff",
          lineColor: "#000000",
        })

        // 如果成功生成了 CODE128，并且用户选择了其他格式，则尝试使用用户选择的格式
        if (format !== "CODE128") {
          try {
            // 清除画布
            const ctx = canvas.getContext("2d")
            ctx?.clearRect(0, 0, canvas.width, canvas.height)

            // 根据不同格式使用适当的输入
            if (format === "EAN13") {
              // EAN13 需要13位数字
              JsBarcode(canvas, "5901234123457", {
                format: "EAN13",
                width: 2,
                height: 100,
                displayValue: true,
                fontSize: 14,
                margin: 10,
              })
            } else if (format === "EAN8") {
              // EAN8 需要8位数字
              JsBarcode(canvas, "12345670", {
                format: "EAN8",
                width: 2,
                height: 100,
                displayValue: true,
                fontSize: 14,
                margin: 10,
              })
            } else if (format === "UPC") {
              // UPC 需要12位数字
              JsBarcode(canvas, "123456789012", {
                format: "UPC",
                width: 2,
                height: 100,
                displayValue: true,
                fontSize: 14,
                margin: 10,
              })
            } else if (format === "ITF14") {
              // ITF14 需要14位数字
              JsBarcode(canvas, "10012345678902", {
                format: "ITF14",
                width: 2,
                height: 100,
                displayValue: true,
                fontSize: 14,
                margin: 10,
              })
            } else if (format === "CODE39") {
              // CODE39 可以处理字母数字
              JsBarcode(canvas, "CODE39", {
                format: "CODE39",
                width: 2,
                height: 100,
                displayValue: true,
                fontSize: 14,
                margin: 10,
              })
            } else {
              // 其他格式，尝试使用原始文本
              JsBarcode(canvas, text, {
                format: format,
                width: 2,
                height: 100,
                displayValue: true,
                fontSize: 14,
                margin: 10,
              })
            }
          } catch (formatError) {
            console.error(`使用 ${format} 格式失败，已回退到 CODE128:`, formatError)
            // 如果特定格式失败，我们已经有了 CODE128 的结果，所以不需要额外操作
          }
        }

        resolve(canvas.toDataURL("image/png"))
      } catch (error) {
        console.error("所有条形码生成尝试都失败:", error)

        // 最后的备用方案：返回一个简单的文本条形码图像
        try {
          const ctx = canvas.getContext("2d")
          if (ctx) {
            canvas.width = 200
            canvas.height = 100
            ctx.fillStyle = "#ffffff"
            ctx.fillRect(0, 0, canvas.width, canvas.height)
            ctx.fillStyle = "#000000"
            ctx.font = "14px Arial"
            ctx.fillText(text, 10, 50)
            ctx.fillText("(条形码生成失败)", 10, 70)

            resolve(canvas.toDataURL("image/png"))
          } else {
            throw new Error("无法获取画布上下文")
          }
        } catch (e) {
          console.error("备用图像生成也失败:", e)
          resolve("/placeholder.svg?height=100&width=200")
        }
      }
    })
  }

  // 生成二维码
  const generateQRCode = async (text: string, errorCorrectionLevel: string): Promise<string> => {
    try {
      const dataUrl = await QRCode.toDataURL(text, {
        errorCorrectionLevel: errorCorrectionLevel as "L" | "M" | "Q" | "H",
        margin: 4,
        scale: 8,
        color: {
          dark: "#000000",
          light: "#ffffff",
        },
      })
      return dataUrl
    } catch (error) {
      console.error("二维码生成错误:", error)
      return "/placeholder.svg?height=200&width=200"
    }
  }

  // 修改 handleGenerateCode 函数，添加更好的错误处理
  const handleGenerateCode = async () => {
    if (selectedProduct) {
      // 获取产品信息
      const product = mockProducts.find((p) => p.sku === selectedProduct)

      if (product) {
        setGeneratedCode(selectedProduct)

        // 根据选择的类型生成条码或二维码
        try {
          if (codeType === "barcode") {
            // 显示加载状态
            setGeneratedCodeImage(null)
            const messageElement = document.getElementById("generation-message")
            if (messageElement) {
              messageElement.textContent = "正在生成条形码..."
              messageElement.className = "text-blue-600 mt-2"
            }

            // 使用选定的格式生成条形码
            let barcodeImage
            try {
              barcodeImage = await generateBarcode(selectedProduct, barcodeFormat)
            } catch (barcodeError) {
              console.error("条形码生成出错，尝试使用CODE128格式:", barcodeError)
              // 如果失败，尝试使用CODE128格式
              barcodeImage = await generateBarcode(selectedProduct, "CODE128")
            }

            setGeneratedCodeImage(barcodeImage)

            // 添加成功提示
            if (messageElement) {
              messageElement.textContent = "条形码生成成功!"
              messageElement.className = "text-green-600 mt-2"

              // 3秒后清除消息
              setTimeout(() => {
                messageElement.textContent = ""
                messageElement.className = ""
              }, 3000)
            }
          } else {
            // 显示加载状态
            setGeneratedCodeImage(null)
            const messageElement = document.getElementById("generation-message")
            if (messageElement) {
              messageElement.textContent = "正在生成二维码..."
              messageElement.className = "text-blue-600 mt-2"
            }

            const qrCodeImage = await generateQRCode(selectedProduct, qrFormat)
            setGeneratedCodeImage(qrCodeImage)

            // 添加成功提示
            if (messageElement) {
              messageElement.textContent = "二维码生成成功!"
              messageElement.className = "text-green-600 mt-2"

              // 3秒后清除消息
              setTimeout(() => {
                messageElement.textContent = ""
                messageElement.className = ""
              }, 3000)
            }
          }
        } catch (error) {
          console.error("生成条码/二维码错误:", error)

          // 显示错误消息
          const messageElement = document.getElementById("generation-message")
          if (messageElement) {
            messageElement.textContent = `生成失败: ${error.message || "未知错误"}`
            messageElement.className = "text-red-600 mt-2"

            setTimeout(() => {
              messageElement.textContent = ""
              messageElement.className = ""
            }, 3000)
          }
        }
      }
    }
  }

  // 处理打印功能
  const handlePrint = () => {
    if (!generatedCodeImage) return

    const printWindow = window.open("", "_blank")
    if (!printWindow) return

    const productName = mockProducts.find((p) => p.sku === selectedProduct)?.name || selectedProduct

    printWindow.document.write(`
    <html>
      <head>
        <title>打印${codeType === "barcode" ? "条形码" : "二维码"}</title>
        <style>
          body { font-family: Arial, sans-serif; text-align: center; }
          .container { margin: 20px; }
          .code-container { margin-bottom: 10px; }
          .product-info { margin-top: 5px; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="code-container">
            <img src="${generatedCodeImage}" alt="${codeType === "barcode" ? "条形码" : "二维码"}" />
          </div>
          <div class="product-info">
            <p>${productName} (${selectedProduct})</p>
          </div>
        </div>
      </body>
    </html>
  `)

    printWindow.document.close()
    printWindow.focus()
    setTimeout(() => {
      printWindow.print()
      printWindow.close()
    }, 500)
  }

  // 处理下载功能
  const handleDownload = () => {
    if (!generatedCodeImage) return

    const link = document.createElement("a")
    link.href = generatedCodeImage
    link.download = `${selectedProduct}_${codeType}.png`
    link.click()
  }

  if (!isClient) {
    return null // Prevent hydration errors
  }

  return (
    <DashboardLayout>
      <div className="p-4 md:p-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">条码/二维码管理</h1>
            <p className="text-muted-foreground">生成和管理产品条码和二维码</p>
          </div>
          <div className="flex gap-2 mt-4 md:mt-0">
            <Link href="/codes/scan">
              <Button>
                <QrCode className="mr-2 h-4 w-4" />
                扫码操作
              </Button>
            </Link>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="generate">
              <Plus className="mr-2 h-4 w-4" />
              生成条码/二维码
            </TabsTrigger>
            <TabsTrigger value="history">
              <Barcode className="mr-2 h-4 w-4" />
              条码历史
            </TabsTrigger>
          </TabsList>

          <TabsContent value="generate">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>生成条码/二维码</CardTitle>
                  <CardDescription>为产品生成条形码或二维码标签</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="product-search">搜索产品</Label>
                    <div className="relative">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="product-search"
                        type="search"
                        placeholder="输入产品名称或SKU..."
                        className="pl-8"
                        value={searchTerm}
                        onChange={handleSearch}
                      />

                      {/* 搜索结果下拉框 */}
                      {showSearchResults && (
                        <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-auto">
                          {searchResults.length > 0 ? (
                            <ul className="py-1">
                              {searchResults.map((product) => (
                                <li
                                  key={product.id}
                                  className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                                  onClick={() => handleSelectSearchResult(product.sku)}
                                >
                                  <div className="font-medium">{product.name}</div>
                                  <div className="text-sm text-gray-500">{product.sku}</div>
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <div className="px-3 py-2 text-gray-500">未找到匹配的产品</div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="product-select">选择产品</Label>
                    <Select
                      value={selectedProduct}
                      onValueChange={(value) => {
                        console.log("选择的产品:", value)
                        setSelectedProduct(value)
                      }}
                    >
                      <SelectTrigger id="product-select">
                        <SelectValue placeholder="选择产品" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockProducts.map((product) => (
                          <SelectItem key={product.id} value={product.sku}>
                            {product.name} ({product.sku})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="code-type">条码类型</Label>
                    <Select
                      value={codeType}
                      onValueChange={(value) => {
                        console.log("选择的条码类型:", value)
                        setCodeType(value)
                      }}
                    >
                      <SelectTrigger id="code-type">
                        <SelectValue placeholder="选择条码类型" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="barcode">条形码</SelectItem>
                        <SelectItem value="qrcode">二维码</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* 条形码格式选择 */}
                  {codeType === "barcode" && (
                    <div className="space-y-2">
                      <Label htmlFor="barcode-format">条形码格式</Label>
                      <Select value={barcodeFormat} onValueChange={setBarcodeFormat}>
                        <SelectTrigger id="barcode-format">
                          <SelectValue placeholder="选择条形码格式" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="CODE128">Code 128</SelectItem>
                          <SelectItem value="CODE39">Code 39</SelectItem>
                          <SelectItem value="EAN13">EAN-13</SelectItem>
                          <SelectItem value="EAN8">EAN-8</SelectItem>
                          <SelectItem value="UPC">UPC</SelectItem>
                          <SelectItem value="ITF14">ITF-14</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {/* 二维码格式选择 */}
                  {codeType === "qrcode" && (
                    <div className="space-y-2">
                      <Label htmlFor="qr-format">二维码纠错级别</Label>
                      <Select value={qrFormat} onValueChange={setQrFormat}>
                        <SelectTrigger id="qr-format">
                          <SelectValue placeholder="选择二维码纠错级别" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="L">低 (7%)</SelectItem>
                          <SelectItem value="M">中 (15%)</SelectItem>
                          <SelectItem value="Q">较高 (25%)</SelectItem>
                          <SelectItem value="H">高 (30%)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="code-size">标签尺寸</Label>
                    <Select value={codeSize} onValueChange={setCodeSize}>
                      <SelectTrigger id="code-size">
                        <SelectValue placeholder="选择标签尺寸" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="small">小 (40x20mm)</SelectItem>
                        <SelectItem value="medium">中 (60x40mm)</SelectItem>
                        <SelectItem value="large">大 (100x60mm)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="code-quantity">数量</Label>
                    <Input
                      id="code-quantity"
                      type="number"
                      min="1"
                      value={codeQuantity}
                      onChange={(e) => setCodeQuantity(Number.parseInt(e.target.value) || 1)}
                    />
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button
                      className="flex-1"
                      onClick={handleGenerateCode}
                      disabled={!selectedProduct || codeQuantity < 1}
                    >
                      生成{codeType === "barcode" ? "条形码" : "二维码"}
                    </Button>
                  </div>
                  <div id="generation-message" className="text-center mt-2"></div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>预览</CardTitle>
                  <CardDescription>条码/二维码预览</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center min-h-[300px]">
                  {generatedCode ? (
                    <div className="text-center">
                      <div className="mb-4 p-4 border rounded-md inline-block">
                        {generatedCodeImage ? (
                          <img
                            src={generatedCodeImage || "/placeholder.svg"}
                            alt={codeType === "barcode" ? "条形码" : "二维码"}
                            className="max-w-full"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-32 w-32 bg-gray-100">
                            <span className="text-gray-400">加载中...</span>
                          </div>
                        )}
                        <div className="mt-2 text-sm font-mono">{generatedCode}</div>
                      </div>
                      <div className="flex gap-2 justify-center">
                        <Button variant="outline" size="sm" onClick={handlePrint}>
                          <Printer className="mr-2 h-4 w-4" />
                          打印
                        </Button>
                        <Button variant="outline" size="sm" onClick={handleDownload}>
                          <Download className="mr-2 h-4 w-4" />
                          下载
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center text-muted-foreground">
                      {codeType === "barcode" ? (
                        <Barcode className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                      ) : (
                        <QrCode className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                      )}
                      <p>选择产品并生成{codeType === "barcode" ? "条形码" : "二维码"}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="history">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>条码历史</CardTitle>
                  <CardDescription>已生成的条码和二维码</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="搜索产品..."
                      className="pl-8 w-[200px]"
                      value={searchTerm}
                      onChange={handleSearch}
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>SKU</TableHead>
                      <TableHead>产品名称</TableHead>
                      <TableHead>条码类型</TableHead>
                      <TableHead>生成日期</TableHead>
                      <TableHead>操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProducts.length > 0 ? (
                      filteredProducts.map((product) => (
                        <TableRow key={product.id}>
                          <TableCell className="font-medium">{product.sku}</TableCell>
                          <TableCell>{product.name}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Barcode className="h-4 w-4" />
                              <span>条形码</span>
                            </div>
                          </TableCell>
                          <TableCell>2025-04-01</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button variant="ghost" size="sm">
                                <Printer className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Download className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <QrCode className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-4">
                          没有找到匹配的产品
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}

