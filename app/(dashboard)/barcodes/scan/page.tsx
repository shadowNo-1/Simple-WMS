"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { Icons } from "@/components/icons"
import { useTranslation } from "@/lib/i18n"
import { useDb } from "@/lib/db"

export default function ScanBarcodePage() {
  const { t } = useTranslation()
  const { toast } = useToast()
  const { getAllProducts } = useDb()
  const [isScanning, setIsScanning] = useState(false)
  const [scannedProduct, setScannedProduct] = useState<any | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const products = getAllProducts()

  // Simulate barcode scanning
  const startScanning = async () => {
    setIsScanning(true)

    try {
      // In a real application, you would use a barcode scanning library like Quagga.js or ZXing
      // For demo purposes, we'll just simulate a scan after a delay
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Pick a random product from the mock data
      const randomProduct = products[Math.floor(Math.random() * products.length)]
      setScannedProduct(randomProduct)

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

  // For demo purposes - in a real app you would integrate with camera and scanning libraries
  useEffect(() => {
    let frameId: number | undefined

    const setupDemo = () => {
      if (canvasRef.current && isScanning) {
        const canvas = canvasRef.current
        const ctx = canvas.getContext("2d")
        if (!ctx) return

        // Draw a simple demo scanning animation
        let y = 0
        let direction = 1

        const animate = () => {
          ctx.clearRect(0, 0, canvas.width, canvas.height)
          ctx.beginPath()
          ctx.strokeStyle = "#ff0000"
          ctx.lineWidth = 2
          ctx.moveTo(0, y)
          ctx.lineTo(canvas.width, y)
          ctx.stroke()

          y += 2 * direction
          if (y >= canvas.height || y <= 0) direction *= -1

          frameId = requestAnimationFrame(animate)
        }

        frameId = requestAnimationFrame(animate)
      }
    }

    setupDemo()

    // Cleanup function
    return () => {
      if (frameId !== undefined) {
        cancelAnimationFrame(frameId)
      }
    }
  }, [isScanning])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">{t("scanBarcode")}</h1>
      </div>

      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>{t("scanBarcode")}</CardTitle>
          <CardDescription>扫描产品条形码或二维码</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="relative border rounded-lg overflow-hidden aspect-video bg-black/5">
              {!isScanning && !scannedProduct && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Button onClick={startScanning}>
                    <Icons.scan className="mr-2 h-4 w-4" />
                    开始扫描
                  </Button>
                </div>
              )}

              {isScanning && (
                <>
                  <video
                    ref={videoRef}
                    className="absolute inset-0 w-full h-full object-cover"
                    autoPlay
                    playsInline
                    muted
                    poster="/placeholder.svg?height=300&width=400&text=扫描中..."
                  />
                  <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" width={400} height={300} />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="px-4 py-2 bg-background/80 rounded-lg text-center">
                      <Icons.sun className="h-6 w-6 animate-spin mx-auto mb-2" />
                      <p>扫描中...请将条码对准摄像头</p>
                    </div>
                  </div>
                </>
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
              <div className="flex gap-2">
                <Button
                  className="flex-1"
                  onClick={() => (window.location.href = `/inventory/in?productId=${scannedProduct.id}`)}
                >
                  <Icons.arrowDown className="mr-2 h-4 w-4" />
                  入库操作
                </Button>
                <Button
                  className="flex-1"
                  onClick={() => (window.location.href = `/inventory/out?productId=${scannedProduct.id}`)}
                >
                  <Icons.arrowUp className="mr-2 h-4 w-4" />
                  出库操作
                </Button>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="ghost" onClick={() => window.history.back()}>
            返回
          </Button>

          {!isScanning && scannedProduct && (
            <Button
              variant="outline"
              onClick={() => {
                setScannedProduct(null)
                startScanning()
              }}
            >
              <Icons.scan className="mr-2 h-4 w-4" />
              重新扫描
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}

