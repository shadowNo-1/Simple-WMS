"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import DashboardLayout from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Save, QrCode, ArrowLeft, Plus, Minus, Check } from "lucide-react"
import Link from "next/link"

// Mock data for inventory items
const mockInventoryItems = [
  { id: 1, sku: "SKU001", name: "产品A", category: "电子产品", expectedQuantity: 120, location: "A-01-01" },
  { id: 2, sku: "SKU002", name: "产品B", category: "办公用品", expectedQuantity: 85, location: "B-02-03" },
  { id: 3, sku: "SKU003", name: "产品C", category: "电子产品", expectedQuantity: 32, location: "A-03-02" },
  { id: 4, sku: "SKU004", name: "产品D", category: "家具", expectedQuantity: 15, location: "C-01-04" },
  { id: 5, sku: "SKU005", name: "产品E", category: "办公用品", expectedQuantity: 200, location: "B-04-01" },
]

export default function NewInventoryCheckPage() {
  const router = useRouter()
  const [checkName, setCheckName] = useState("")
  const [checkType, setCheckType] = useState("full")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedItems, setSelectedItems] = useState<number[]>([])
  const [checkItems, setCheckItems] = useState<any[]>([])
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true"
    if (!isLoggedIn) {
      router.push("/login")
    }
  }, [router])

  useEffect(() => {
    // Filter items based on selected category
    let filteredItems = mockInventoryItems

    if (selectedCategory !== "all") {
      filteredItems = mockInventoryItems.filter((item) => item.category === selectedCategory)
    }

    // Initialize check items with expected quantities
    const initialCheckItems = filteredItems.map((item) => ({
      ...item,
      actualQuantity: item.expectedQuantity,
      checked: false,
      discrepancy: 0,
    }))

    setCheckItems(initialCheckItems)
  }, [selectedCategory])

  const toggleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedItems(checkItems.map((item) => item.id))
    } else {
      setSelectedItems([])
    }
  }

  const toggleSelectItem = (itemId: number, checked: boolean) => {
    if (checked) {
      setSelectedItems([...selectedItems, itemId])
    } else {
      setSelectedItems(selectedItems.filter((id) => id !== itemId))
    }
  }

  // 修改 updateActualQuantity 函数，确保数量不能为负数
  const updateActualQuantity = (itemId: number, quantity: number) => {
    setCheckItems(
      checkItems.map((item) => {
        if (item.id === itemId) {
          const actualQuantity = Math.max(0, quantity)
          return {
            ...item,
            actualQuantity,
            discrepancy: item.expectedQuantity - actualQuantity,
          }
        }
        return item
      }),
    )
  }

  const markAsChecked = (itemId: number, checked: boolean) => {
    setCheckItems(
      checkItems.map((item) => {
        if (item.id === itemId) {
          return { ...item, checked }
        }
        return item
      }),
    )
  }

  const handleSaveCheck = () => {
    // In a real app, you would save the check to your backend
    alert("盘点已保存")
    router.push("/check")
  }

  if (!isClient) {
    return null // Prevent hydration errors
  }

  return (
    <DashboardLayout>
      <div className="p-4 md:p-8">
        <div className="flex items-center gap-2 mb-6">
          <Link href="/check">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">新建库存盘点</h1>
            <p className="text-muted-foreground">创建新的库存盘点任务</p>
          </div>
        </div>

        <div className="grid gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle>盘点信息</CardTitle>
              <CardDescription>设置盘点的基本信息</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="check-name">盘点名称</Label>
                  <Input
                    id="check-name"
                    placeholder="输入盘点名称"
                    value={checkName}
                    onChange={(e) => setCheckName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="check-type">盘点类型</Label>
                  <Select value={checkType} onValueChange={setCheckType}>
                    <SelectTrigger id="check-type">
                      <SelectValue placeholder="选择盘点类型" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="full">全面盘点</SelectItem>
                      <SelectItem value="partial">部分盘点</SelectItem>
                      <SelectItem value="cycle">周期盘点</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">产品类别</Label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger id="category">
                      <SelectValue placeholder="选择类别" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">所有类别</SelectItem>
                      <SelectItem value="电子产品">电子产品</SelectItem>
                      <SelectItem value="办公用品">办公用品</SelectItem>
                      <SelectItem value="家具">家具</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="check-date">盘点日期</Label>
                  <Input id="check-date" type="date" defaultValue={new Date().toISOString().split("T")[0]} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>盘点项目</CardTitle>
              <CardDescription>记录实际库存数量</CardDescription>
            </div>
            <Button variant="outline" size="sm">
              <QrCode className="mr-2 h-4 w-4" />
              扫码盘点
            </Button>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <Checkbox
                        checked={selectedItems.length === checkItems.length && checkItems.length > 0}
                        onCheckedChange={toggleSelectAll}
                      />
                    </TableHead>
                    <TableHead>SKU</TableHead>
                    <TableHead>产品名称</TableHead>
                    <TableHead>库位</TableHead>
                    <TableHead>系统数量</TableHead>
                    <TableHead>实际数量</TableHead>
                    <TableHead>差异</TableHead>
                    <TableHead>状态</TableHead>
                    <TableHead>操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {checkItems.length > 0 ? (
                    checkItems.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <Checkbox
                            checked={selectedItems.includes(item.id)}
                            onCheckedChange={(checked) => toggleSelectItem(item.id, checked as boolean)}
                          />
                        </TableCell>
                        <TableCell className="font-medium">{item.sku}</TableCell>
                        <TableCell>{item.name}</TableCell>
                        <TableCell>{item.location}</TableCell>
                        <TableCell>{item.expectedQuantity}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8 rounded-r-none"
                              onClick={() => updateActualQuantity(item.id, item.actualQuantity - 1)}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <Input
                              type="number"
                              value={item.actualQuantity}
                              onChange={(e) => updateActualQuantity(item.id, Number.parseInt(e.target.value) || 0)}
                              className="h-8 w-16 rounded-none text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            />
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8 rounded-l-none"
                              onClick={() => updateActualQuantity(item.id, item.actualQuantity + 1)}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell className={item.discrepancy !== 0 ? "text-red-500 font-medium" : ""}>
                          {item.discrepancy}
                        </TableCell>
                        <TableCell>
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              item.checked ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {item.checked ? "已盘点" : "未盘点"}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant={item.checked ? "ghost" : "outline"}
                            size="sm"
                            onClick={() => markAsChecked(item.id, !item.checked)}
                          >
                            {item.checked ? "取消" : <Check className="h-4 w-4" />}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center py-4">
                        没有找到匹配的库存项目
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline">取消</Button>
            <Button onClick={handleSaveCheck}>
              <Save className="mr-2 h-4 w-4" />
              保存盘点
            </Button>
          </CardFooter>
        </Card>
      </div>
    </DashboardLayout>
  )
}

