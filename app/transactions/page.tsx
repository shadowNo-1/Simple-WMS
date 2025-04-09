"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import DashboardLayout from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Download, ArrowDown, ArrowUp } from "lucide-react"
import Link from "next/link"

// Mock data for transactions
const mockTransactions = [
  {
    id: 1,
    type: "入库",
    date: "2025-04-15 14:30",
    product: "产品A",
    sku: "SKU001",
    quantity: 50,
    location: "A-01-01",
    user: "管理员",
    reference: "PO-2025-001",
  },
  {
    id: 2,
    type: "出库",
    date: "2025-04-14 10:15",
    product: "产品B",
    sku: "SKU002",
    quantity: 10,
    location: "B-02-03",
    user: "仓库管理员",
    reference: "SO-2025-042",
  },
  {
    id: 3,
    type: "入库",
    date: "2025-04-12 09:45",
    product: "产品C",
    sku: "SKU003",
    quantity: 25,
    location: "A-03-02",
    user: "管理员",
    reference: "PO-2025-002",
  },
  {
    id: 4,
    type: "出库",
    date: "2025-04-10 16:20",
    product: "产品A",
    sku: "SKU001",
    quantity: 15,
    location: "A-01-01",
    user: "仓库管理员",
    reference: "SO-2025-041",
  },
  {
    id: 5,
    type: "入库",
    date: "2025-04-08 11:30",
    product: "产品D",
    sku: "SKU004",
    quantity: 30,
    location: "C-01-04",
    user: "管理员",
    reference: "PO-2025-003",
  },
  {
    id: 6,
    type: "出库",
    date: "2025-04-05 14:45",
    product: "产品E",
    sku: "SKU005",
    quantity: 20,
    location: "B-04-01",
    user: "仓库管理员",
    reference: "SO-2025-040",
  },
  {
    id: 7,
    type: "入库",
    date: "2025-04-03 10:00",
    product: "产品B",
    sku: "SKU002",
    quantity: 40,
    location: "B-02-03",
    user: "管理员",
    reference: "PO-2025-004",
  },
]

export default function TransactionsPage() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [dateFilter, setDateFilter] = useState("all")
  const [filteredTransactions, setFilteredTransactions] = useState(mockTransactions)
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
    // Filter transactions based on search term and filters
    let results = mockTransactions

    if (searchTerm) {
      results = results.filter(
        (transaction) =>
          transaction.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
          transaction.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
          transaction.reference.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (typeFilter !== "all") {
      results = results.filter((transaction) => transaction.type === typeFilter)
    }

    if (dateFilter !== "all") {
      const now = new Date()
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
      const weekAgo = new Date(today)
      weekAgo.setDate(weekAgo.getDate() - 7)
      const monthAgo = new Date(today)
      monthAgo.setMonth(monthAgo.getMonth() - 1)

      results = results.filter((transaction) => {
        const transactionDate = new Date(transaction.date)
        if (dateFilter === "today") {
          return transactionDate >= today
        } else if (dateFilter === "week") {
          return transactionDate >= weekAgo
        } else if (dateFilter === "month") {
          return transactionDate >= monthAgo
        }
        return true
      })
    }

    setFilteredTransactions(results)
  }, [searchTerm, typeFilter, dateFilter])

  if (!isClient) {
    return null // Prevent hydration errors
  }

  return (
    <DashboardLayout>
      <div className="p-4 md:p-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">出入库记录</h1>
            <p className="text-muted-foreground">查看和管理库存出入库操作</p>
          </div>
          <div className="flex gap-2 mt-4 md:mt-0">
            <Link href="/inventory/in">
              <Button>
                <ArrowDown className="mr-2 h-4 w-4" />
                入库
              </Button>
            </Link>
            <Link href="/inventory/out">
              <Button variant="outline">
                <ArrowUp className="mr-2 h-4 w-4" />
                出库
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
                  placeholder="搜索产品、SKU或参考号..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="类型" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">所有类型</SelectItem>
                    <SelectItem value="入库">入库</SelectItem>
                    <SelectItem value="出库">出库</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={dateFilter} onValueChange={setDateFilter}>
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="日期" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">所有时间</SelectItem>
                    <SelectItem value="today">今天</SelectItem>
                    <SelectItem value="week">本周</SelectItem>
                    <SelectItem value="month">本月</SelectItem>
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
                  <TableHead>类型</TableHead>
                  <TableHead>日期</TableHead>
                  <TableHead>产品</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead>数量</TableHead>
                  <TableHead>库位</TableHead>
                  <TableHead>操作人</TableHead>
                  <TableHead>参考号</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions.length > 0 ? (
                  filteredTransactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            transaction.type === "入库" ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {transaction.type === "入库" ? (
                            <ArrowDown className="inline-block h-3 w-3 mr-1" />
                          ) : (
                            <ArrowUp className="inline-block h-3 w-3 mr-1" />
                          )}
                          {transaction.type}
                        </span>
                      </TableCell>
                      <TableCell>{transaction.date}</TableCell>
                      <TableCell>{transaction.product}</TableCell>
                      <TableCell className="font-medium">{transaction.sku}</TableCell>
                      <TableCell>{transaction.quantity}</TableCell>
                      <TableCell>{transaction.location}</TableCell>
                      <TableCell>{transaction.user}</TableCell>
                      <TableCell>{transaction.reference}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-4">
                      没有找到匹配的交易记录
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

