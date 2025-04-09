"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import DashboardLayout from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowLeft, Plus, Trash, QrCode, Save, AlertCircle } from "lucide-react"
import Link from "next/link"
import { useLanguage } from "@/components/language-context"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { PDFViewer } from "@/components/pdf-generator"
import { Alert, AlertDescription } from "@/components/ui/alert"

// Mock data for inventory items
const mockInventoryItems = [
  { id: 1, sku: "SKU001", name: "产品A", category: "电子产品", quantity: 120, location: "A-01-01" },
  { id: 2, sku: "SKU002", name: "产品B", category: "办公用品", quantity: 85, location: "B-02-03" },
  { id: 3, sku: "SKU003", name: "产品C", category: "电子产品", quantity: 32, location: "A-03-02" },
  { id: 4, sku: "SKU004", name: "产品D", category: "家具", quantity: 15, location: "C-01-04" },
  { id: 5, sku: "SKU005", name: "产品E", category: "办公用品", quantity: 200, location: "B-04-01" },
]

export default function InventoryOutPage() {
  const router = useRouter()
  const { t } = useLanguage()
  const [reference, setReference] = useState("")
  const [destination, setDestination] = useState("sale")
  const [notes, setNotes] = useState("")
  const [selectedProduct, setSelectedProduct] = useState("")
  const [quantity, setQuantity] = useState(1)
  const [items, setItems] = useState<any[]>([])
  const [isClient, setIsClient] = useState(false)
  const [scanCode, setScanCode] = useState("")
  const [scanResult, setScanResult] = useState<any>(null)
  const [scanError, setScanError] = useState<string | null>(null)
  const [showDocument, setShowDocument] = useState(false)
  const [documentId, setDocumentId] = useState("")
  const [isScanning, setIsScanning] = useState(false)
  const scanInputRef = useRef<HTMLInputElement>(null)
  // Add state for PDF items
  const [pdfItems, setPdfItems] = useState<any[]>([])

  useEffect(() => {
    setIsClient(true)
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true"
    if (!isLoggedIn) {
      router.push("/login")
    }
  }, [router])

  useEffect(() => {
    // Focus the scan input when scanning mode is activated
    if (isScanning && scanInputRef.current) {
      scanInputRef.current.focus()
    }
  }, [isScanning])

  // 修改 handleAddItem 函数，确保正确累加相同SKU的数量
  const handleAddItem = () => {
    if (selectedProduct && quantity > 0) {
      const product = mockInventoryItems.find((p) => p.sku === selectedProduct)
      if (product) {
        // 检查产品是否已存在于列表中
        const existingItemIndex = items.findIndex((item) => item.sku === selectedProduct)

        if (existingItemIndex >= 0) {
          // 更新已存在产品的数量
          const updatedItems = [...items]
          updatedItems[existingItemIndex].quantity += quantity

          // 检查是否超出可用库存
          if (updatedItems[existingItemIndex].quantity > product.quantity) {
            alert(
              `${t("inventory.out.exceed")} ${product.name} ${t("inventory.out.current.stock")} ${product.quantity}`,
            )
            return
          }

          setItems(updatedItems)
        } else {
          // 检查是否超出可用库存
          if (quantity > product.quantity) {
            alert(
              `${t("inventory.out.exceed")} ${product.name} ${t("inventory.out.current.stock")} ${product.quantity}`,
            )
            return
          }

          // 添加新产品
          setItems([
            ...items,
            {
              id: product.id,
              sku: product.sku,
              name: product.name,
              quantity: quantity,
              location: product.location,
              available: product.quantity,
            },
          ])
        }

        // 重置表单
        setSelectedProduct("")
        setQuantity(1)
      }
    }
  }

  // Update the handleRemoveItem function to use scanId
  const handleRemoveItem = (id: string) => {
    setItems(items.filter((item) => (item.scanId || item.sku) !== id))
  }

  // Add a function to merge items when submitting
  const handleSubmit = () => {
    // Merge identical SKUs for the final document
    const mergedItems = items.reduce((acc, item) => {
      const existingItemIndex = acc.findIndex((i) => i.sku === item.sku)
      if (existingItemIndex >= 0) {
        acc[existingItemIndex].quantity += item.quantity
      } else {
        // Create a new object without scanId and scanTime
        const { scanId, scanTime, ...rest } = item
        acc.push(rest)
      }
      return acc
    }, [])

    // 生成出库单号
    const timestamp = new Date().getTime()
    const randomNum = Math.floor(Math.random() * 1000)
    const newDocumentId = `OUT-${timestamp}-${randomNum}`
    setDocumentId(newDocumentId)

    // 显示出库单
    setShowDocument(true)

    // Use mergedItems for the PDF viewer
    setPdfItems(mergedItems)
  }

  const handleScanSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    processScanCode(scanCode)
    setScanCode("")

    // Re-focus the input field after processing
    if (scanInputRef.current) {
      scanInputRef.current.focus()
    }
  }

  const processScanCode = (code: string) => {
    if (!code) return

    try {
      // 查找产品
      const product = mockInventoryItems.find((p) => p.sku === code)

      if (product) {
        setScanResult({
          found: true,
          item: product,
        })

        // 添加扫描的产品到列表
        addScannedProductToList(product)
      } else {
        setScanResult({
          found: false,
          code,
        })
        setScanError(`未找到产品: ${code}`)
        setTimeout(() => setScanError(null), 3000)
      }
    } catch (error) {
      console.error("处理扫码错误:", error)
      setScanError("扫码处理出错，请重试")
      setTimeout(() => setScanError(null), 3000)
    }
  }

  // Modify the addScannedProductToList function to add each scanned item individually
  const addScannedProductToList = (product) => {
    // Check if quantity would exceed available stock
    if (1 > product.quantity) {
      alert(`${t("inventory.out.exceed")} ${product.name} ${t("inventory.out.current.stock")} ${product.quantity}`)
      return
    }

    // Add each scanned item as a new entry with a unique ID
    const timestamp = new Date().getTime()
    setItems((prevItems) => [
      ...prevItems,
      {
        id: product.id,
        sku: product.sku,
        name: product.name,
        quantity: 1,
        location: product.location,
        available: product.quantity,
        scanId: `${product.sku}-${timestamp}`, // Add a unique ID for each scan
        scanTime: new Date().toLocaleTimeString(),
      },
    ])
  }

  const toggleScanMode = () => {
    setIsScanning(!isScanning)
    if (!isScanning) {
      // Focus will be set by the useEffect
      setScanResult(null)
    }
  }

  if (!isClient) {
    return null // Prevent hydration errors
  }

  return (
    <DashboardLayout>
      <div className="p-4 md:p-8">
        <div className="flex items-center gap-2 mb-6">
          <Link href="/inventory">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">{t("inventory.out.title")}</h1>
            <p className="text-muted-foreground">{t("inventory.out.subtitle")}</p>
          </div>
        </div>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>{t("inventory.out.info")}</CardTitle>
              <CardDescription>{t("inventory.out.info.desc")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="reference">{t("inventory.out.reference")}</Label>
                  <Input
                    id="reference"
                    placeholder={t("inventory.out.reference.placeholder")}
                    value={reference}
                    onChange={(e) => setReference(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="destination">{t("inventory.out.destination")}</Label>
                  <Select value={destination} onValueChange={setDestination}>
                    <SelectTrigger id="destination">
                      <SelectValue placeholder={t("inventory.out.destination")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sale">{t("inventory.out.destination.sale")}</SelectItem>
                      <SelectItem value="return">{t("inventory.out.destination.return")}</SelectItem>
                      <SelectItem value="transfer">{t("inventory.out.destination.transfer")}</SelectItem>
                      <SelectItem value="other">{t("inventory.out.destination.other")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="notes">{t("inventory.out.notes")}</Label>
                  <Input
                    id="notes"
                    placeholder={t("inventory.out.notes.placeholder")}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t("inventory.out.add.product")}</CardTitle>
              <CardDescription>{t("inventory.out.add.product.desc")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {!isScanning ? (
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 space-y-2">
                    <Label htmlFor="product">{t("inventory.out.product")}</Label>
                    <Select value={selectedProduct} onValueChange={setSelectedProduct}>
                      <SelectTrigger id="product">
                        <SelectValue placeholder={t("inventory.out.product")} />
                      </SelectTrigger>
                      <SelectContent>
                        {mockInventoryItems.map((product) => (
                          <SelectItem key={product.id} value={product.sku}>
                            {product.name} ({product.sku}) - {t("inventory.out.available")}: {product.quantity}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="w-32 space-y-2">
                    <Label htmlFor="quantity">{t("inventory.out.quantity")}</Label>
                    <Input
                      id="quantity"
                      type="number"
                      min="1"
                      value={quantity}
                      onChange={(e) => setQuantity(Number.parseInt(e.target.value) || 1)}
                    />
                  </div>
                  <div className="flex items-end">
                    <Button onClick={handleAddItem} disabled={!selectedProduct || quantity < 1}>
                      <Plus className="mr-2 h-4 w-4" />
                      {t("inventory.out.add")}
                    </Button>
                  </div>
                  <div className="flex items-end">
                    <Button variant="outline" onClick={toggleScanMode}>
                      <QrCode className="mr-2 h-4 w-4" />
                      {t("inventory.out.scan")}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <form onSubmit={handleScanSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="scan-code">扫码输入</Label>
                      <div className="flex gap-2">
                        <Input
                          id="scan-code"
                          ref={scanInputRef}
                          placeholder="将扫码枪对准条码扫描"
                          value={scanCode}
                          onChange={(e) => setScanCode(e.target.value)}
                          autoComplete="off"
                          className="flex-1"
                        />
                        <Button type="submit">确认</Button>
                        <Button variant="outline" onClick={toggleScanMode} className="ml-2">
                          取消
                        </Button>
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">
                        将扫码枪对准条码扫描，或手动输入条码后点击确认
                      </p>
                    </div>
                  </form>

                  {scanError && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{scanError}</AlertDescription>
                    </Alert>
                  )}

                  {scanResult && (
                    <div className="p-4 border rounded-md bg-gray-50">
                      <div className="flex items-center gap-4">
                        <div className="rounded-full p-2 bg-green-100">
                          <QrCode className="h-4 w-4 text-green-500" />
                        </div>
                        <div>
                          <p className="font-medium">
                            {scanResult.found
                              ? `${t("inventory.out.scan.result")}: ${scanResult.item.name}`
                              : "未找到产品"}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {scanResult.found ? `SKU: ${scanResult.item.sku}` : `条码: ${scanResult.code || scanCode}`}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t("inventory.out.product.list")}</CardTitle>
              <CardDescription>{t("inventory.out.product.list.desc")}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto max-h-[400px] overflow-y-auto">
                <Table>
                  {/* Update the TableHeader to include scan time */}
                  <TableHeader className="sticky top-0 bg-white">
                    <TableRow>
                      <TableHead>{t("table.sku")}</TableHead>
                      <TableHead>{t("table.name")}</TableHead>
                      <TableHead>{t("table.quantity")}</TableHead>
                      <TableHead>{t("table.location")}</TableHead>
                      <TableHead>{t("table.available")}</TableHead>
                      <TableHead>扫描时间</TableHead>
                      <TableHead>{t("table.actions")}</TableHead>
                    </TableRow>
                  </TableHeader>
                  {/* Update the table to show scan time and use scanId as the key */}
                  <TableBody>
                    {items.length > 0 ? (
                      items.map((item) => (
                        <TableRow key={item.scanId || item.sku}>
                          <TableCell className="font-medium">{item.sku}</TableCell>
                          <TableCell>{item.name}</TableCell>
                          <TableCell>{item.quantity}</TableCell>
                          <TableCell>{item.location}</TableCell>
                          <TableCell>{item.available}</TableCell>
                          <TableCell>{item.scanTime}</TableCell>
                          <TableCell>
                            <Button variant="ghost" size="sm" onClick={() => handleRemoveItem(item.scanId || item.sku)}>
                              <Trash className="h-4 w-4 text-red-500" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-4">
                          {t("inventory.out.product.empty")}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">{t("inventory.out.cancel")}</Button>
              <Button onClick={handleSubmit} disabled={items.length === 0}>
                <Save className="mr-2 h-4 w-4" />
                {t("inventory.out.complete")}
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* 出库单对话框 - 使用PDF查看器 */}
        <Dialog open={showDocument} onOpenChange={setShowDocument}>
          <DialogContent className="max-w-4xl h-[80vh] flex flex-col p-0">
            <DialogHeader className="p-4 border-b">
              <DialogTitle>{t("inventory.out.document")}</DialogTitle>
              <DialogDescription>{documentId}</DialogDescription>
            </DialogHeader>
            <div className="flex-1 overflow-hidden">
              {/* Update the PDFViewer to use pdfItems */}
              <PDFViewer
                data={{
                  documentId,
                  reference,
                  source: destination,
                  notes,
                  items: pdfItems, // Use merged items
                  type: "out",
                }}
                onClose={() => {
                  setShowDocument(false)
                  router.push("/transactions")
                }}
              />
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  )
}

