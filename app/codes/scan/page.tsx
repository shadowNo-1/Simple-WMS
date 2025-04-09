"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import DashboardLayout from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { QrCode, ArrowRight, Trash, AlertCircle } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"

// Mock data for inventory items
const mockInventoryItems = [
  { id: 1, sku: "SKU001", name: "产品A", category: "电子产品", quantity: 120, location: "A-01-01" },
  { id: 2, sku: "SKU002", name: "产品B", category: "办公用品", quantity: 85, location: "B-02-03" },
  { id: 3, sku: "SKU003", name: "产品C", category: "电子产品", quantity: 32, location: "A-03-02" },
  { id: 4, sku: "SKU004", name: "产品D", category: "家具", quantity: 15, location: "C-01-04" },
  { id: 5, sku: "SKU005", name: "产品E", category: "办公用品", quantity: 200, location: "B-04-01" },
]

// Mock function to simulate scanning a code
const mockScanCode = (code: string) => {
  // In a real app, this would validate the code against your database
  const item = mockInventoryItems.find((item) => item.sku === code)
  return {
    found: !!item,
    item: item,
  }
}

export default function ScanPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("scan")
  const [scanCode, setScanCode] = useState("")
  const [scanResult, setScanResult] = useState<any>(null)
  const [isClient, setIsClient] = useState(false)
  const [scannedItems, setScannedItems] = useState<any[]>([])
  const [operationType, setOperationType] = useState("in")
  const [scanError, setScanError] = useState<string | null>(null)
  const scanInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setIsClient(true)
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true"
    if (!isLoggedIn) {
      router.push("/login")
    }

    // Focus the scan input field when the component mounts
    if (scanInputRef.current) {
      scanInputRef.current.focus()
    }
  }, [router])

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
      const result = mockScanCode(code)
      setScanResult(result)

      if (result.found) {
        addItemToList(result.item)
      } else {
        setScanError(`未找到产品: ${code}`)
        setTimeout(() => setScanError(null), 3000)
      }
    } catch (error) {
      console.error("处理扫码错误:", error)
      setScanError("扫码处理出错，请重试")
      setTimeout(() => setScanError(null), 3000)
    }
  }

  // Modify the addItemToList function to add each scanned item individually
  const addItemToList = (item: any) => {
    // Add each scanned item as a new entry with a unique ID
    const timestamp = new Date().getTime()
    setScannedItems([
      ...scannedItems,
      {
        ...item,
        scanId: `${item.sku}-${timestamp}`, // Add a unique ID for each scan
        scanQuantity: 1,
        scanTime: new Date().toLocaleTimeString(),
      },
    ])
  }

  // Add a new function to merge items when submitting
  const handleSubmitOperation = () => {
    // Merge identical SKUs for the final operation
    const mergedItems = scannedItems.reduce((acc, item) => {
      const existingItem = acc.find((i) => i.sku === item.sku)
      if (existingItem) {
        existingItem.scanQuantity += item.scanQuantity
      } else {
        acc.push({ ...item })
      }
      return acc
    }, [])

    // In a real app, you would save the transaction to your backend
    alert(
      `${operationType === "in" ? "入库" : "出库"}操作已完成，共 ${mergedItems.length} 种产品，${scannedItems.length} 次扫描`,
    )
    setScannedItems([])
    router.push("/transactions")
  }

  // Update the removeItem function to use scanId
  const removeItem = (scanId: string) => {
    setScannedItems(scannedItems.filter((item) => item.scanId !== scanId))
  }

  // Update the updateItemQuantity function to use scanId
  const updateItemQuantity = (scanId: string, quantity: number) => {
    setScannedItems(
      scannedItems.map((item) => {
        if (item.scanId === scanId) {
          return { ...item, scanQuantity: quantity }
        }
        return item
      }),
    )
  }

  if (!isClient) {
    return null // Prevent hydration errors
  }

  return (
    <DashboardLayout>
      <div className="p-4 md:p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">扫码操作</h1>
          <p className="text-muted-foreground">使用USB扫码枪进行库存操作</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>扫描条码/二维码</CardTitle>
              <CardDescription>使用USB扫码枪或手动输入条码</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="scan">扫码</TabsTrigger>
                  <TabsTrigger value="manual">手动输入</TabsTrigger>
                </TabsList>
                <TabsContent value="scan" className="space-y-4">
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
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">将光标放在输入框内，使用扫码枪扫描条码</p>
                    </div>
                  </form>

                  {scanError && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{scanError}</AlertDescription>
                    </Alert>
                  )}
                </TabsContent>
                <TabsContent value="manual">
                  <form onSubmit={handleScanSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="manual-code">条码/二维码</Label>
                      <div className="flex gap-2">
                        <Input
                          id="manual-code"
                          placeholder="输入条码或二维码"
                          value={scanCode}
                          onChange={(e) => setScanCode(e.target.value)}
                        />
                        <Button type="submit">查询</Button>
                      </div>
                    </div>
                  </form>
                </TabsContent>
              </Tabs>

              <div className="mt-4 space-y-2">
                <Label htmlFor="operation-type">操作类型</Label>
                <Select value={operationType} onValueChange={setOperationType}>
                  <SelectTrigger id="operation-type">
                    <SelectValue placeholder="选择操作类型" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="in">入库操作</SelectItem>
                    <SelectItem value="out">出库操作</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>扫描结果</CardTitle>
              <CardDescription>已扫描的产品列表</CardDescription>
            </CardHeader>
            <CardContent>
              {scannedItems.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>SKU</TableHead>
                        <TableHead>产品名称</TableHead>
                        <TableHead>数量</TableHead>
                        <TableHead>库位</TableHead>
                        <TableHead>扫描时间</TableHead>
                        <TableHead>操作</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {scannedItems.length > 0 ? (
                        scannedItems.map((item) => (
                          <TableRow key={item.scanId}>
                            <TableCell className="font-medium">{item.sku}</TableCell>
                            <TableCell>{item.name}</TableCell>
                            <TableCell>
                              <div className="flex items-center w-24">
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="h-8 w-8 rounded-r-none"
                                  onClick={() => updateItemQuantity(item.scanId, Math.max(1, item.scanQuantity - 1))}
                                >
                                  <span className="sr-only">减少</span>
                                  <span>-</span>
                                </Button>
                                <Input
                                  type="number"
                                  value={item.scanQuantity}
                                  onChange={(e) =>
                                    updateItemQuantity(item.scanId, Number.parseInt(e.target.value) || 1)
                                  }
                                  className="h-8 w-12 rounded-none text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                  min="1"
                                />
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="h-8 w-8 rounded-l-none"
                                  onClick={() => updateItemQuantity(item.scanId, item.scanQuantity + 1)}
                                >
                                  <span className="sr-only">增加</span>
                                  <span>+</span>
                                </Button>
                              </div>
                            </TableCell>
                            <TableCell>{item.location}</TableCell>
                            <TableCell>{item.scanTime}</TableCell>
                            <TableCell>
                              <Button variant="ghost" size="sm" onClick={() => removeItem(item.scanId)}>
                                <Trash className="h-4 w-4 text-red-500" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-4">
                            扫描条码或二维码以添加产品
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-64">
                  <div className="text-center">
                    <QrCode className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-muted-foreground">扫描条码或二维码以添加产品</p>
                  </div>
                </div>
              )}
            </CardContent>
            {scannedItems.length > 0 && (
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={() => setScannedItems([])}>
                  清空列表
                </Button>
                <Button onClick={handleSubmitOperation}>
                  {operationType === "in" ? "完成入库" : "完成出库"}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            )}
          </Card>
        </div>

        {scanResult && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>最近扫描</CardTitle>
              <CardDescription>最近扫描的产品信息</CardDescription>
            </CardHeader>
            <CardContent>
              {scanResult.found ? (
                <div className="p-4 border rounded-md">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">SKU</p>
                      <p>{scanResult.item.sku}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">产品名称</p>
                      <p>{scanResult.item.name}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">库存数量</p>
                      <p>{scanResult.item.quantity}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">库位</p>
                      <p>{scanResult.item.location}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center p-4 border rounded-md">
                  <div className="text-center">
                    <p className="text-lg font-medium mb-2">未找到产品</p>
                    <p className="text-muted-foreground">没有找到与此条码匹配的产品</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}

