"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import DashboardLayout from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Warehouse, Plus, Edit, Trash, Search } from "lucide-react"

// Mock data for warehouses
const mockWarehouses = [
  {
    id: 1,
    name: "主仓库",
    location: "上海市浦东新区张江高科技园区",
    manager: "张经理",
    contact: "13800138001",
    status: "active",
  },
  {
    id: 2,
    name: "北区仓库",
    location: "北京市朝阳区望京科技园",
    manager: "王经理",
    contact: "13800138002",
    status: "active",
  },
  {
    id: 3,
    name: "南区仓库",
    location: "广州市天河区天河软件园",
    manager: "李经理",
    contact: "13800138003",
    status: "active",
  },
  {
    id: 4,
    name: "西区仓库",
    location: "成都市高新区天府软件园",
    manager: "赵经理",
    contact: "13800138004",
    status: "inactive",
  },
]

export default function WarehousesPage() {
  const router = useRouter()
  const [isClient, setIsClient] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredWarehouses, setFilteredWarehouses] = useState(mockWarehouses)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [newWarehouse, setNewWarehouse] = useState({
    name: "",
    location: "",
    manager: "",
    contact: "",
  })

  useEffect(() => {
    setIsClient(true)
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true"
    if (!isLoggedIn) {
      router.push("/login")
    }
  }, [router])

  useEffect(() => {
    // Filter warehouses based on search term
    if (searchTerm) {
      const results = mockWarehouses.filter(
        (warehouse) =>
          warehouse.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          warehouse.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
          warehouse.manager.toLowerCase().includes(searchTerm.toLowerCase()),
      )
      setFilteredWarehouses(results)
    } else {
      setFilteredWarehouses(mockWarehouses)
    }
  }, [searchTerm])

  const handleAddWarehouse = () => {
    // In a real app, you would save the warehouse to your backend
    alert("仓库已添加")
    setIsAddDialogOpen(false)
    setNewWarehouse({
      name: "",
      location: "",
      manager: "",
      contact: "",
    })
  }

  if (!isClient) {
    return null // Prevent hydration errors
  }

  return (
    <DashboardLayout>
      <div className="p-4 md:p-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">仓库管理</h1>
            <p className="text-muted-foreground">管理和查看所有仓库</p>
          </div>
          <div className="flex gap-2 mt-4 md:mt-0">
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  添加仓库
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>添加新仓库</DialogTitle>
                  <DialogDescription>填写以下信息添加新仓库</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="warehouse-name">仓库名称</Label>
                    <Input
                      id="warehouse-name"
                      placeholder="输入仓库名称"
                      value={newWarehouse.name}
                      onChange={(e) => setNewWarehouse({ ...newWarehouse, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="warehouse-location">仓库地址</Label>
                    <Input
                      id="warehouse-location"
                      placeholder="输入仓库地址"
                      value={newWarehouse.location}
                      onChange={(e) => setNewWarehouse({ ...newWarehouse, location: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="warehouse-manager">仓库管理员</Label>
                    <Input
                      id="warehouse-manager"
                      placeholder="输入仓库管理员姓名"
                      value={newWarehouse.manager}
                      onChange={(e) => setNewWarehouse({ ...newWarehouse, manager: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="warehouse-contact">联系电话</Label>
                    <Input
                      id="warehouse-contact"
                      placeholder="输入联系电话"
                      value={newWarehouse.contact}
                      onChange={(e) => setNewWarehouse({ ...newWarehouse, contact: e.target.value })}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    取消
                  </Button>
                  <Button onClick={handleAddWarehouse}>添加仓库</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>仓库列表</CardTitle>
              <CardDescription>查看和管理所有仓库</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="搜索仓库..."
                  className="pl-8 w-[200px]"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>仓库名称</TableHead>
                  <TableHead>地址</TableHead>
                  <TableHead>管理员</TableHead>
                  <TableHead>联系电话</TableHead>
                  <TableHead>状态</TableHead>
                  <TableHead>操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredWarehouses.length > 0 ? (
                  filteredWarehouses.map((warehouse) => (
                    <TableRow key={warehouse.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <Warehouse className="h-4 w-4 text-muted-foreground" />
                          {warehouse.name}
                        </div>
                      </TableCell>
                      <TableCell>{warehouse.location}</TableCell>
                      <TableCell>{warehouse.manager}</TableCell>
                      <TableCell>{warehouse.contact}</TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            warehouse.status === "active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {warehouse.status === "active" ? "启用" : "禁用"}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Trash className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-4">
                      没有找到匹配的仓库
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}

