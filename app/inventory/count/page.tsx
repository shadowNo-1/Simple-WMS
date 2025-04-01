"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { Icons } from "@/components/icons"
import { useTranslation } from "@/lib/i18n/client"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"

// Mock data - in a real app you would fetch this from an API
const mockProducts = [
  { id: "1", code: "P001", name: "笔记本电脑", category: "电子产品", expected: 25, actual: 0, status: "pending" },
  { id: "2", code: "P002", name: "办公桌", category: "家具", expected: 10, actual: 0, status: "pending" },
  { id: "3", code: "P003", name: "打印机", category: "办公设备", expected: 5, actual: 0, status: "pending" },
  { id: "4", code: "P004", name: "手机", category: "电子产品", expected: 50, actual: 0, status: "pending" },
  { id: "5", code: "P005", name: "键盘", category: "电子产品", expected: 30, actual: 0, status: "pending" },
]

export default function InventoryCountPage() {
  const { t } = useTranslation()
  const { toast } = useToast()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [currentCount, setCurrentCount] = useState<{
    id: string
    count: string
  }>({ id: "", count: "" })
  const [countItems, setCountItems] = useState(
    mockProducts.map((product) => ({
      ...product,
      actual: 0,
      status: "pending",
    })),
  )
  const [searchTerm, setSearchTerm] = useState("")
  const [isGeneratingReport, setIsGeneratingReport] = useState(false)

  const handleUpdateCount = (id: string, count: string) => {
    setCurrentCount({ id, count })
    setIsDialogOpen(true)
  }

  const handleSaveCount = () => {
    if (!currentCount.id || !currentCount.count) return

    setCountItems((prev) =>
      prev.map((item) => {
        if (item.id === currentCount.id) {
          const actual = Number.parseInt(currentCount.count)
          const diff = actual - item.expected
          let status = "matched"

          if (diff < 0) status = "shortage"
          else if (diff > 0) status = "surplus"

          return {
            ...item,
            actual,
            status,
          }
        }
        return item
      }),
    )

    setIsDialogOpen(false)
    setCurrentCount({ id: "", count: "" })

    toast({
      title: "数量已更新",
      description: "盘点数据已保存",
    })
  }

  const handleGenerateReport = async () => {
    setIsGeneratingReport(true)

    try {
      // In a real application, you would generate and download a report
      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast({
        title: "报表已生成",
        description: "盘点报表已准备好下载",
      })
    } catch (error) {
      toast({
        title: t("error"),
        description: String(error),
        variant: "destructive",
      })
    } finally {
      setIsGeneratingReport(false)
    }
  }

  const filteredItems = countItems.filter((item) =>
    Object.values(item).some(
      (value) => typeof value === "string" && value.toLowerCase().includes(searchTerm.toLowerCase()),
    ),
  )

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "matched":
        return <Badge className="bg-green-500">匹配</Badge>
      case "shortage":
        return <Badge variant="destructive">缺少</Badge>
      case "surplus":
        return <Badge className="bg-blue-500">盈余</Badge>
      default:
        return <Badge variant="outline">待盘点</Badge>
    }
  }

  const countComplete = countItems.every((item) => item.status !== "pending")

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>{t("inventoryCount")}</CardTitle>
              <CardDescription>盘点仓库中的物品并生成报表</CardDescription>
            </div>
            <Button onClick={handleGenerateReport} disabled={!countComplete || isGeneratingReport}>
              {isGeneratingReport ? (
                <>
                  <Icons.sun className="mr-2 h-4 w-4 animate-spin" />
                  正在生成...
                </>
              ) : (
                <>
                  <Icons.clipboard className="mr-2 h-4 w-4" />
                  生成盘点报表
                </>
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center mb-4">
            <Input
              placeholder={t("search")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-xs"
            />
          </div>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("productCode")}</TableHead>
                  <TableHead>{t("productName")}</TableHead>
                  <TableHead className="text-right">系统数量</TableHead>
                  <TableHead className="text-right">实际数量</TableHead>
                  <TableHead className="text-right">差异</TableHead>
                  <TableHead>状态</TableHead>
                  <TableHead className="text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredItems.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      No results.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.code}</TableCell>
                      <TableCell>{item.name}</TableCell>
                      <TableCell className="text-right">{item.expected}</TableCell>
                      <TableCell className="text-right font-medium">
                        {item.status === "pending" ? "-" : item.actual}
                      </TableCell>
                      <TableCell className="text-right">
                        {item.status === "pending" ? "-" : item.actual - item.expected}
                      </TableCell>
                      <TableCell>{getStatusBadge(item.status)}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" onClick={() => handleUpdateCount(item.id, item.actual.toString())}>
                          {item.status === "pending" ? "盘点" : "编辑"}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
        <CardFooter>
          <div className="text-sm text-muted-foreground">
            总计: {countItems.length} 项, 已盘点: {countItems.filter((item) => item.status !== "pending").length} 项
          </div>
        </CardFooter>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>更新盘点数量</DialogTitle>
            <DialogDescription>
              输入 {countItems.find((item) => item.id === currentCount.id)?.name} 的实际数量
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>系统数量</Label>
                  <div className="mt-1 text-lg font-medium">
                    {countItems.find((item) => item.id === currentCount.id)?.expected}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="count">实际数量</Label>
                  <Input
                    id="count"
                    type="number"
                    min="0"
                    value={currentCount.count}
                    onChange={(e) => setCurrentCount((prev) => ({ ...prev, count: e.target.value }))}
                  />
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              取消
            </Button>
            <Button onClick={handleSaveCount}>保存</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

