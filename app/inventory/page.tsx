"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import DashboardLayout from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Package, Plus, Search, QrCode, ArrowDownUp, Download } from "lucide-react"
import Link from "next/link"

// Mock data for inventory items (will be replaced with localStorage data)
const mockInventoryItems = [
  { id: 1, sku: "SKU001", name: "产品A", category: "电子产品", quantity: 120, location: "A-01-01", status: "正常" },
  { id: 2, sku: "SKU002", name: "产品B", category: "办公用品", quantity: 85, location: "B-02-03", status: "正常" },
  { id: 3, sku: "SKU003", name: "产品C", category: "电子产品", quantity: 32, location: "A-03-02", status: "低库存" },
  { id: 4, sku: "SKU004", name: "产品D", category: "家具", quantity: 15, location: "C-01-04", status: "低库存" },
  { id: 5, sku: "SKU005", name: "产品E", category: "办公用品", quantity: 200, location: "B-04-01", status: "正常" },
  { id: 6, sku: "SKU006", name: "产品F", category: "电子产品", quantity: 0, location: "A-02-03", status: "缺货" },
  { id: 7, sku: "SKU007", name: "产品G", category: "家具", quantity: 45, location: "C-03-02", status: "正常" },
  { id: 8, sku: "SKU008", name: "产品H", category: "办公用品", quantity: 78, location: "B-01-05", status: "正常" },
]

export default function InventoryPage() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [filteredItems, setFilteredItems] = useState<any[]>([])
  const [isClient, setIsClient] = useState(false)
  const [inventoryItems, setInventoryItems] = useState<any[]>([])

  useEffect(() => {
    setIsClient(true)
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true"
    if (!isLoggedIn) {
      router.push("/login")
    }

    // Load inventory items from localStorage
    try {
      const storedItems = localStorage.getItem("inventoryProducts")
      if (storedItems) {
        const parsedItems = JSON.parse(storedItems)
        setInventoryItems([...mockInventoryItems, ...parsedItems])
      } else {
        setInventoryItems(mockInventoryItems)
      }
    } catch (error) {
      console.error("Error loading inventory items:", error)
      setInventoryItems(mockInventoryItems)
    }
  }, [router])

  useEffect(() => {
    // Filter items based on search term and filters
    let results = inventoryItems

    if (searchTerm) {
      results = results.filter(
        (item) =>
          item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.sku.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (categoryFilter !== "all") {
      results = results.filter((item) => item.category === categoryFilter)
    }

    if (statusFilter !== "all") {
      results = results.filter((item) => item.status === statusFilter)
    }

    setFilteredItems(results)
  }, [searchTerm, categoryFilter, statusFilter, inventoryItems])

  if (!isClient) {
    return null // Prevent hydration errors
  }

  return (
    <DashboardLayout>
      <div className="p-4 md:p-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">库存管理</h1>
            <p className="text-muted-foreground">查看和管理您的库存项目</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 mt-4 md:mt-0">
            <Link href="/inventory/add">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                添加产品
              </Button>
            </Link>
            <Link href="/inventory/in">
              <Button variant="outline">
                <ArrowDownUp className="mr-2 h-4 w-4 rotate-180" />
                入库
              </Button>
            </Link>
            <Link href="/inventory/out">
              <Button variant="outline">
                <ArrowDownUp className="mr-2 h-4 w-4" />
                出库
              </Button>
            </Link>
            <Link href="/inventory/scan">
              <Button variant="outline">
                <QrCode className="mr-2 h-4 w-4" />
                扫码操作
              </Button>
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="p-4 border-b">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="搜索产品名称或SKU..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="选择类别" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">所有类别</SelectItem>
                    <SelectItem value="电子产品">电子产品</SelectItem>
                    <SelectItem value="办公用品">办公用品</SelectItem>
                    <SelectItem value="家具">家具</SelectItem>
                    <SelectItem value="食品">食品</SelectItem>
                    <SelectItem value="服装">服装</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="选择状态" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">所有状态</SelectItem>
                    <SelectItem value="正常">正常</SelectItem>
                    <SelectItem value="低库存">低库存</SelectItem>
                    <SelectItem value="缺货">缺货</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="icon">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>SKU</TableHead>
                  <TableHead>产品名称</TableHead>
                  <TableHead>类别</TableHead>
                  <TableHead>数量</TableHead>
                  <TableHead>库位</TableHead>
                  <TableHead>状态</TableHead>
                  <TableHead>操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredItems.length > 0 ? (
                  filteredItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.sku}</TableCell>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>{item.category}</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>{item.location}</TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            item.status === "正常"
                              ? "bg-green-100 text-green-800"
                              : item.status === "低库存"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                          }`}
                        >
                          {item.status}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            title="查看产品详情"
                            onClick={() => {
                              // 显示产品详情弹窗
                              document.getElementById(`product-details-${item.id}`)?.classList.remove("hidden")
                            }}
                          >
                            <Package className="h-4 w-4" />
                            <span className="sr-only">查看详情</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            title="查看条码/二维码"
                            onClick={() => {
                              // 显示条码/二维码弹窗
                              document.getElementById(`product-barcode-${item.id}`)?.classList.remove("hidden")
                            }}
                          >
                            <QrCode className="h-4 w-4" />
                            <span className="sr-only">查看条码</span>
                          </Button>
                        </div>

                        {/* 产品详情弹窗 */}
                        <div
                          id={`product-details-${item.id}`}
                          className="hidden fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
                        >
                          <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[80vh] overflow-y-auto">
                            <div className="p-6">
                              <div className="flex justify-between items-center mb-4">
                                <h3 className="text-xl font-bold">产品详情</h3>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0"
                                  onClick={() =>
                                    document.getElementById(`product-details-${item.id}`)?.classList.add("hidden")
                                  }
                                >
                                  ✕
                                </Button>
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <p className="text-sm font-medium text-muted-foreground">SKU</p>
                                  <p>{item.sku}</p>
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-muted-foreground">产品名称</p>
                                  <p>{item.name}</p>
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-muted-foreground">类别</p>
                                  <p>{item.category}</p>
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-muted-foreground">库存数量</p>
                                  <p>{item.quantity}</p>
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-muted-foreground">库位</p>
                                  <p>{item.location}</p>
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-muted-foreground">状态</p>
                                  <p>{item.status}</p>
                                </div>
                                <div className="col-span-2">
                                  <p className="text-sm font-medium text-muted-foreground">描述</p>
                                  <p>{item.description || `这是${item.name}的详细描述信息。`}</p>
                                </div>
                              </div>
                              <div className="mt-6 flex justify-end">
                                <Button
                                  variant="outline"
                                  onClick={() =>
                                    document.getElementById(`product-details-${item.id}`)?.classList.add("hidden")
                                  }
                                >
                                  关闭
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* 条码/二维码弹窗 */}
                        <div
                          id={`product-barcode-${item.id}`}
                          className="hidden fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
                        >
                          <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
                            <div className="p-6">
                              <div className="flex justify-between items-center mb-4">
                                <h3 className="text-xl font-bold">条码/二维码</h3>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0"
                                  onClick={() =>
                                    document.getElementById(`product-barcode-${item.id}`)?.classList.add("hidden")
                                  }
                                >
                                  ✕
                                </Button>
                              </div>
                              <div className="flex flex-col items-center justify-center space-y-4">
                                <div className="text-center mb-2">
                                  <p className="font-medium">{item.name}</p>
                                  <p className="text-sm text-muted-foreground">{item.sku}</p>
                                </div>
                                <div className="border p-4 rounded-md">
                                  {/* 条形码示例 */}
                                  <div className="flex flex-col items-center">
                                    <div className="h-16 w-48 bg-gray-800 flex items-end justify-evenly">
                                      {Array.from({ length: 30 }).map((_, i) => (
                                        <div
                                          key={i}
                                          className="bg-white h-14 w-1"
                                          style={{ height: `${Math.random() * 60 + 40}%` }}
                                        ></div>
                                      ))}
                                    </div>
                                    <div className="mt-2 text-sm font-mono">{item.sku}</div>
                                  </div>

                                  {/* 二维码示例 */}
                                  <div className="flex flex-col items-center mt-4">
                                    <div className="h-32 w-32 bg-white border border-gray-300 p-2">
                                      <div className="w-full h-full grid grid-cols-8 grid-rows-8 gap-0.5">
                                        {Array.from({ length: 64 }).map((_, i) => (
                                          <div
                                            key={i}
                                            className={`${Math.random() > 0.5 ? "bg-black" : "bg-white"}`}
                                          ></div>
                                        ))}
                                      </div>
                                    </div>
                                    <div className="mt-2 text-sm font-mono">{item.sku}</div>
                                  </div>
                                </div>
                              </div>
                              <div className="mt-6 flex justify-end">
                                <Button
                                  variant="outline"
                                  onClick={() =>
                                    document.getElementById(`product-barcode-${item.id}`)?.classList.add("hidden")
                                  }
                                >
                                  关闭
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-4">
                      没有找到匹配的库存项目
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

