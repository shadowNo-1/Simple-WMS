"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import DashboardLayout from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { QrCode, Barcode, Camera, X } from "lucide-react"

// Mock function to simulate scanning a code
const mockScanCode = (code: string) => {
  // In a real app, this would validate the code against your database
  return {
    found: true,
    item: {
      id: 1,
      sku: code,
      name: "产品A",
      category: "电子产品",
      quantity: 120,
      location: "A-01-01",
      status: "正常",
    },
  }
}

export default function ScanPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("scan")
  const [manualCode, setManualCode] = useState("")
  const [isScanning, setIsScanning] = useState(false)
  const [scanResult, setScanResult] = useState<any>(null)
  const [isClient, setIsClient] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [items, setItems] = useState<any[]>([])

  useEffect(() => {
    setIsClient(true)
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true"
    if (!isLoggedIn) {
      router.push("/login")
    }
  }, [router])

  // 修改 handleManualSubmit 函数，确保正确累加相同SKU的数量
  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (manualCode) {
      const result = mockScanCode(manualCode)
      setScanResult(result)

      if (result.found) {
        // 检查产品是否已存在于列表中
        const existingItemIndex = items.findIndex((item) => item.sku === result.item.sku)

        if (existingItemIndex >= 0) {
          // 更新已存在产品的数量
          const updatedItems = [...items]
          updatedItems[existingItemIndex].quantity += 1
          setItems(updatedItems)
        } else {
          // 添加新产品
          setItems([...items, { ...result.item, quantity: 1 }])
        }
      }
    }
  }

  const startScanning = async () => {
    setIsScanning(true)
    setScanResult(null)

    try {
      // In a real app, you would use a library like html5-qrcode
      // This is just a mock implementation to show the camera
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })
        if (videoRef.current) {
          videoRef.current.srcObject = stream
        }

        // Mock a successful scan after 3 seconds
        setTimeout(() => {
          const mockCode = "SKU001"
          const result = mockScanCode(mockCode)
          setScanResult(result)
          stopScanning()
        }, 3000)
      }
    } catch (error) {
      console.error("Error accessing camera:", error)
      setIsScanning(false)
    }
  }

  const stopScanning = () => {
    setIsScanning(false)
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks()
      tracks.forEach((track) => track.stop())
      videoRef.current.srcObject = null
    }
  }

  if (!isClient) {
    return null // Prevent hydration errors
  }

  return (
    <DashboardLayout>
      <div className="p-4 md:p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">扫码操作</h1>
          <p className="text-muted-foreground">扫描条形码或二维码进行库存操作</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>扫描条码/二维码</CardTitle>
              <CardDescription>使用摄像头扫描或手动输入条码</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="scan">扫描</TabsTrigger>
                  <TabsTrigger value="manual">手动输入</TabsTrigger>
                </TabsList>
                <TabsContent value="scan" className="space-y-4">
                  <div className="relative">
                    {isScanning ? (
                      <div className="relative">
                        <video
                          ref={videoRef}
                          autoPlay
                          playsInline
                          className="w-full h-64 bg-black rounded-md object-cover"
                        ></video>
                        <Button
                          variant="secondary"
                          size="icon"
                          className="absolute top-2 right-2"
                          onClick={stopScanning}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <div className="w-48 h-48 border-2 border-white rounded-md"></div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-64 bg-gray-100 rounded-md">
                        <Camera className="h-12 w-12 text-gray-400 mb-4" />
                        <p className="text-muted-foreground mb-4">点击下方按钮开始扫描</p>
                        <Button onClick={startScanning}>开始扫描</Button>
                      </div>
                    )}
                  </div>
                </TabsContent>
                <TabsContent value="manual">
                  <form onSubmit={handleManualSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="code">条码/二维码</Label>
                      <div className="flex gap-2">
                        <Input
                          id="code"
                          placeholder="输入条码或二维码"
                          value={manualCode}
                          onChange={(e) => setManualCode(e.target.value)}
                        />
                        <Button type="submit">查询</Button>
                      </div>
                    </div>
                  </form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>扫描结果</CardTitle>
              <CardDescription>显示扫描或查询的产品信息</CardDescription>
            </CardHeader>
            <CardContent>
              {scanResult ? (
                scanResult.found ? (
                  <div className="space-y-4">
                    <div className="p-4 border rounded-md">
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">SKU</p>
                          <p>{scanResult.item.sku}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">产品名称</p>
                          <p>{scanResult.item.name}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">类别</p>
                          <p>{scanResult.item.category}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">库存数量</p>
                          <p>{scanResult.item.quantity}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">库位</p>
                          <p>{scanResult.item.location}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">状态</p>
                          <p>{scanResult.item.status}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button className="flex-1">入库操作</Button>
                      <Button className="flex-1" variant="outline">
                        出库操作
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-64">
                    <div className="text-center">
                      <p className="text-lg font-medium mb-2">未找到产品</p>
                      <p className="text-muted-foreground">没有找到与此条码匹配的产品</p>
                    </div>
                  </div>
                )
              ) : (
                <div className="flex flex-col items-center justify-center h-64">
                  <div className="text-center">
                    <QrCode className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-muted-foreground">扫描条码或二维码以查看产品信息</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>生成条码/二维码</CardTitle>
              <CardDescription>为产品生成条形码或二维码标签</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <div className="mb-4">
                    <Label htmlFor="product-select">选择产品</Label>
                    <Input id="product-select" placeholder="输入产品名称或SKU搜索" />
                  </div>
                  <div className="flex gap-2">
                    <Button className="flex-1">
                      <Barcode className="mr-2 h-4 w-4" />
                      生成条形码
                    </Button>
                    <Button className="flex-1" variant="outline">
                      <QrCode className="mr-2 h-4 w-4" />
                      生成二维码
                    </Button>
                  </div>
                </div>
                <div className="flex items-center justify-center p-4 bg-gray-100 rounded-md">
                  <div className="text-center">
                    <p className="text-muted-foreground">选择产品后将在此处显示生成的条码</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}

