"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Icons } from "@/components/icons"
import { useTranslation } from "@/lib/i18n"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useDb } from "@/lib/db"
import { useToast } from "@/components/ui/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuth } from "@/lib/auth-context"

export default function InventoryPage() {
  const { t } = useTranslation()
  const { toast } = useToast()
  const { user } = useAuth()
  const { getAllProducts, deleteProduct, addProduct, stockIn, stockOut } = useDb()
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("inventory")
  const [isAddProductDialogOpen, setIsAddProductDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [newProduct, setNewProduct] = useState({
    code: "",
    name: "",
    category: "",
    quantity: "0",
    threshold: "10",
  })

  // 扫码相关状态
  const [isScanning, setIsScanning] = useState(false)
  const [scannedProduct, setScannedProduct] = useState<any | null>(null)
  const [stockQuantity, setStockQuantity] = useState("1")
  const [selectedProductId, setSelectedProductId] = useState("")

  const products = getAllProducts()

  const filteredProducts = products.filter((product) =>
    Object.values(product).some(
      (value) => typeof value === "string" && value.toLowerCase().includes(searchTerm.toLowerCase()),
    ),
  )

  const handleDelete = (id: string) => {
    deleteProduct(id)
    toast({
      title: "产品已删除",
      description: "产品已成功从库存中删除",
    })
  }

  const handleAddProduct = async () => {
    setIsLoading(true)

    try {
      // 验证表单
      if (!newProduct.code || !newProduct.name || !newProduct.category) {
        throw new Error("请填写所有必填字段")
      }

      const quantity = Number.parseInt(newProduct.quantity)
      const threshold = Number.parseInt(newProduct.threshold)

      if (isNaN(quantity) || quantity < 0) {
        throw new Error("请输入有效的数量")
      }

      if (isNaN(threshold) || threshold < 0) {
        throw new Error("请输入有效的阈值")
      }

      // 添加产品
      addProduct({
        code: newProduct.code,
        name: newProduct.name,
        category: newProduct.category,
        quantity: quantity,
        threshold: threshold,
      })

      toast({
        title: "产品已添加",
        description: `${newProduct.name} 已成功添加到库存`,
      })

      // 重置表单并关闭对话框
      setNewProduct({
        code: "",
        name: "",
        category: "",
        quantity: "0",
        threshold: "10",
      })
      setIsAddProductDialogOpen(false)
    } catch (error) {
      toast({
        title: "添加失败",
        description: String(error),
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // 模拟扫码功能
  const startScanning = async (operation: "in" | "out") => {
    setIsScanning(true)

    try {
      // 在实际应用中，这里会使用条码扫描库如Quagga.js或ZXing
      // 为了演示，我们只是在延迟后模拟扫描
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // 随机选择一个产品
      const randomProduct = products[Math.floor(Math.random() * products.length)]
      setScannedProduct(randomProduct)
      setSelectedProductId(randomProduct.id)

      toast({
        title: "扫描成功",
        description: `已识别产品: ${randomProduct.name}`,
      })
    } catch (error) {
      toast({
        title: t("error"),
        description: String(error),
        variant: "destructive",
      })
    } finally {
      setIsScanning(false)
    }
  }

  // 处理入库操作
  const handleStockIn = async () => {
    if (!user || !selectedProductId) return

    try {
      const quantity = Number.parseInt(stockQuantity)
      if (isNaN(quantity) || quantity <= 0) {
        throw new Error("请输入有效的数量")
      }

      const result = stockIn(selectedProductId, quantity, user.id, user.name)

      if (result) {
        toast({
          title: "入库成功",
          description: `已为 ${result.productName} 添加 ${quantity} 个库存`,
        })

        // 重置状态
        setScannedProduct(null)
        setSelectedProductId("")
        setStockQuantity("1")
      }
    } catch (error) {
      toast({
        title: "入库失败",
        description: String(error),
        variant: "destructive",
      })
    }
  }

  // 处理出库操作
  const handleStockOut = async () => {
    if (!user || !selectedProductId) return

    try {
      const quantity = Number.parseInt(stockQuantity)
      if (isNaN(quantity) || quantity <= 0) {
        throw new Error("请输入有效的数量")
      }

      const product = products.find((p) => p.id === selectedProductId)
      if (!product) {
        throw new Error("产品不存在")
      }

      if (product.quantity < quantity) {
        throw new Error(`库存不足，当前库存: ${product.quantity}`)
      }

      const result = stockOut(selectedProductId, quantity, user.id, user.name)

      if (result) {
        toast({
          title: "出库成功",
          description: `已从 ${result.productName} 减少 ${quantity} 个库存`,
        })

        // 重置状态
        setScannedProduct(null)
        setSelectedProductId("")
        setStockQuantity("1")
      }
    } catch (error) {
      toast({
        title: "出库失败",
        description: String(error),
        variant: "destructive",
      })
    }
  }

  // 处理产品选择
  const handleProductSelect = (productId: string) => {
    const product = products.find((p) => p.id === productId)
    if (product) {
      setScannedProduct(product)
      setSelectedProductId(productId)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">{t("inventory")}</h1>
        <Button onClick={() => setIsAddProductDialogOpen(true)}>
          <Icons.inventory className="mr-2 h-4 w-4" />
          {t("newProduct")}
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="inventory">库存列表</TabsTrigger>
          <TabsTrigger value="stockIn">入库</TabsTrigger>
          <TabsTrigger value="stockOut">出库</TabsTrigger>
          <TabsTrigger value="categories">类别管理</TabsTrigger>
          <TabsTrigger value="locations">库位管理</TabsTrigger>
        </TabsList>

        <TabsContent value="inventory" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle>{t("inventoryList")}</CardTitle>
                <div className="flex w-full max-w-sm items-center space-x-2 justify-end">
                  <Input
                    placeholder={t("search")}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="max-w-xs"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t("productCode")}</TableHead>
                      <TableHead>{t("productName")}</TableHead>
                      <TableHead>{t("category")}</TableHead>
                      <TableHead className="text-right">{t("quantity")}</TableHead>
                      <TableHead className="text-right">{t("actions")}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProducts.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="h-24 text-center">
                          No results.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredProducts.map((product) => (
                        <TableRow key={product.id}>
                          <TableCell>{product.code}</TableCell>
                          <TableCell>{product.name}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{product.category}</Badge>
                          </TableCell>
                          <TableCell className="text-right">{product.quantity}</TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <Icons.settings className="h-4 w-4" />
                                  <span className="sr-only">Open menu</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>{t("actions")}</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>{t("editProduct")}</DropdownMenuItem>
                                <DropdownMenuItem>{t("generateBarcode")}</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setActiveTab("stockIn")}>
                                  <Icons.arrowDown className="mr-2 h-4 w-4" />
                                  {t("stockIn")}
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setActiveTab("stockOut")}>
                                  <Icons.arrowUp className="mr-2 h-4 w-4" />
                                  {t("stockOut")}
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(product.id)}>
                                  {t("deleteProduct")}
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stockIn" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t("stockIn")}</CardTitle>
              <CardDescription>添加产品到库存</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="manual" className="space-y-4">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="manual">手动入库</TabsTrigger>
                  <TabsTrigger value="scan">扫码入库</TabsTrigger>
                </TabsList>

                <TabsContent value="manual" className="space-y-4">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="productId">{t("productName")}</Label>
                      <Select value={selectedProductId} onValueChange={handleProductSelect}>
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

                    {selectedProductId && (
                      <>
                        <div className="space-y-2">
                          <Label htmlFor="quantity">{t("quantity")}</Label>
                          <Input
                            id="quantity"
                            type="number"
                            min="1"
                            value={stockQuantity}
                            onChange={(e) => setStockQuantity(e.target.value)}
                          />
                        </div>
                        <Button className="w-full" onClick={handleStockIn}>
                          <Icons.arrowDown className="mr-2 h-4 w-4" />
                          {t("stockIn")}
                        </Button>
                      </>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="scan" className="space-y-4">
                  <div className="space-y-4">
                    <div className="relative border rounded-lg overflow-hidden aspect-video bg-black/5">
                      {!isScanning && !scannedProduct && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Button onClick={() => startScanning("in")}>
                            <Icons.scan className="mr-2 h-4 w-4" />
                            开始扫描
                          </Button>
                        </div>
                      )}

                      {isScanning && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="px-4 py-2 bg-background/80 rounded-lg text-center">
                            <Icons.sun className="h-6 w-6 animate-spin mx-auto mb-2" />
                            <p>扫描中...请将条码对准摄像头</p>
                          </div>
                        </div>
                      )}

                      {!isScanning && scannedProduct && (
                        <div className="p-4 h-full flex flex-col items-center justify-center">
                          <div className="text-center mb-4">
                            <Icons.barcode className="h-10 w-10 mx-auto mb-2" />
                            <h3 className="text-lg font-bold">{scannedProduct.name}</h3>
                            <p className="text-sm text-muted-foreground">{scannedProduct.code}</p>
                          </div>

                          <div className="grid grid-cols-2 gap-x-8 gap-y-2 mt-2 w-full max-w-xs">
                            <div className="text-sm text-muted-foreground">类别:</div>
                            <div className="text-sm font-medium">{scannedProduct.category}</div>

                            <div className="text-sm text-muted-foreground">当前库存:</div>
                            <div className="text-sm font-medium">{scannedProduct.quantity}</div>
                          </div>
                        </div>
                      )}
                    </div>

                    {!isScanning && scannedProduct && (
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="scanQuantity">{t("quantity")}</Label>
                          <Input
                            id="scanQuantity"
                            type="number"
                            min="1"
                            value={stockQuantity}
                            onChange={(e) => setStockQuantity(e.target.value)}
                          />
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            className="flex-1"
                            onClick={() => {
                              setScannedProduct(null)
                              setSelectedProductId("")
                            }}
                          >
                            取消
                          </Button>
                          <Button className="flex-1" onClick={handleStockIn}>
                            <Icons.arrowDown className="mr-2 h-4 w-4" />
                            确认入库
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stockOut" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t("stockOut")}</CardTitle>
              <CardDescription>从库存中移除产品</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="manual" className="space-y-4">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="manual">手动出库</TabsTrigger>
                  <TabsTrigger value="scan">扫码出库</TabsTrigger>
                </TabsList>

                <TabsContent value="manual" className="space-y-4">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="productId">{t("productName")}</Label>
                      <Select value={selectedProductId} onValueChange={handleProductSelect}>
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

                    {selectedProductId && (
                      <>
                        <div className="space-y-2">
                          <Label htmlFor="quantity">{t("quantity")}</Label>
                          <Input
                            id="quantity"
                            type="number"
                            min="1"
                            value={stockQuantity}
                            onChange={(e) => setStockQuantity(e.target.value)}
                          />
                        </div>
                        <Button className="w-full" onClick={handleStockOut}>
                          <Icons.arrowUp className="mr-2 h-4 w-4" />
                          {t("stockOut")}
                        </Button>
                      </>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="scan" className="space-y-4">
                  <div className="space-y-4">
                    <div className="relative border rounded-lg overflow-hidden aspect-video bg-black/5">
                      {!isScanning && !scannedProduct && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Button onClick={() => startScanning("out")}>
                            <Icons.scan className="mr-2 h-4 w-4" />
                            开始扫描
                          </Button>
                        </div>
                      )}

                      {isScanning && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="px-4 py-2 bg-background/80 rounded-lg text-center">
                            <Icons.sun className="h-6 w-6 animate-spin mx-auto mb-2" />
                            <p>扫描中...请将条码对准摄像头</p>
                          </div>
                        </div>
                      )}

                      {!isScanning && scannedProduct && (
                        <div className="p-4 h-full flex flex-col items-center justify-center">
                          <div className="text-center mb-4">
                            <Icons.barcode className="h-10 w-10 mx-auto mb-2" />
                            <h3 className="text-lg font-bold">{scannedProduct.name}</h3>
                            <p className="text-sm text-muted-foreground">{scannedProduct.code}</p>
                          </div>

                          <div className="grid grid-cols-2 gap-x-8 gap-y-2 mt-2 w-full max-w-xs">
                            <div className="text-sm text-muted-foreground">类别:</div>
                            <div className="text-sm font-medium">{scannedProduct.category}</div>

                            <div className="text-sm text-muted-foreground">当前库存:</div>
                            <div className="text-sm font-medium">{scannedProduct.quantity}</div>
                          </div>
                        </div>
                      )}
                    </div>

                    {!isScanning && scannedProduct && (
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="scanQuantity">{t("quantity")}</Label>
                          <Input
                            id="scanQuantity"
                            type="number"
                            min="1"
                            value={stockQuantity}
                            onChange={(e) => setStockQuantity(e.target.value)}
                          />
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            className="flex-1"
                            onClick={() => {
                              setScannedProduct(null)
                              setSelectedProductId("")
                            }}
                          >
                            取消
                          </Button>
                          <Button className="flex-1" onClick={handleStockOut}>
                            <Icons.arrowUp className="mr-2 h-4 w-4" />
                            确认出库
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>类别管理</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex h-[300px] items-center justify-center text-muted-foreground">
                类别管理功能即将推出
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="locations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>库位管理</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex h-[300px] items-center justify-center text-muted-foreground">
                库位管理功能即将推出
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* 添加产品对话框 */}
      <Dialog open={isAddProductDialogOpen} onOpenChange={setIsAddProductDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("newProduct")}</DialogTitle>
            <DialogDescription>添加新产品到库存</DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="productCode">{t("productCode")}</Label>
              <Input
                id="productCode"
                value={newProduct.code}
                onChange={(e) => setNewProduct({ ...newProduct, code: e.target.value })}
                placeholder="例如: P001"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="productName">{t("productName")}</Label>
              <Input
                id="productName"
                value={newProduct.name}
                onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                placeholder="例如: 笔记本电脑"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">{t("category")}</Label>
              <Input
                id="category"
                value={newProduct.category}
                onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                placeholder="例如: 电子产品"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="quantity">{t("quantity")}</Label>
                <Input
                  id="quantity"
                  type="number"
                  min="0"
                  value={newProduct.quantity}
                  onChange={(e) => setNewProduct({ ...newProduct, quantity: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="threshold">库存阈值</Label>
                <Input
                  id="threshold"
                  type="number"
                  min="0"
                  value={newProduct.threshold}
                  onChange={(e) => setNewProduct({ ...newProduct, threshold: e.target.value })}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddProductDialogOpen(false)}>
              取消
            </Button>
            <Button onClick={handleAddProduct} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Icons.sun className="mr-2 h-4 w-4 animate-spin" />
                  添加中...
                </>
              ) : (
                "添加产品"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

