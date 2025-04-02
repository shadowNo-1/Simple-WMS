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
import { useDb } from "@/lib/db"

export default function InventoryCountPage() {
  const { t } = useTranslation()
  const { toast } = useToast()
  const { getAllProducts } = useDb()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [currentCount, setCurrentCount] = useState<{
    id: string
    count: string
  }>({ id: "", count: "" })
  const [countItems, setCountItems] = useState(
    getAllProducts().map((product) => ({
      ...product,
      expected: product.quantity,
      actual: 0,
      status: "pending" as "pending" | "matched" | "shortage" | "surplus",
    })),
  )
  const [searchTerm, setSearchTerm] = useState("")
  const [isGeneratingReport, setIsGeneratingReport] = useState(false)
  const [reportUrl, setReportUrl] = useState<string | null>(null)
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false)

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
      // 在实际应用中，这里会生成一个真实的报表
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // 创建CSV内容
      const headers = ["产品代码", "产品名称", "类别", "系统数量", "实际数量", "差异", "状态"]
      const rows = countItems.map((item) => [
        item.code,
        item.name,
        item.category,
        item.expected,
        item.status === "pending" ? "-" : item.actual,
        item.status === "pending" ? "-" : item.actual - item.expected,
        item.status === "matched"
          ? "匹配"
          : item.status === "shortage"
            ? "缺少"
            : item.status === "surplus"
              ? "盈余"
              : "待盘点",
      ])

      const csvContent = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n")

      // 创建Blob并生成下载链接
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
      const url = URL.createObjectURL(blob)
      setReportUrl(url)

      // 显示报表对话框
      setIsReportDialogOpen(true)

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

  const downloadReport = () => {
    if (!reportUrl) return

    // 创建一个临时链接并触发下载
    const link = document.createElement("a")
    link.href = reportUrl
    link.setAttribute("download", `inventory-count-report-${new Date().toISOString().slice(0, 10)}.csv`)
    document.body.appendChild(link)
    link.click()

    // 清理
    setTimeout(() => {
      document.body.removeChild(link)
      URL.revokeObjectURL(reportUrl)
    }, 100)

    setIsReportDialogOpen(false)
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">{t("inventoryCount")}</h1>
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

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>{t("inventoryCount")}</CardTitle>
              <CardDescription>盘点仓库中的物品并生成报表</CardDescription>
            </div>
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

      {/* 报表下载对话框 */}
      <Dialog open={isReportDialogOpen} onOpenChange={setIsReportDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>报表已生成</DialogTitle>
            <DialogDescription>您的盘点报表已准备好下载</DialogDescription>
          </DialogHeader>
          <div className="py-4 text-center">
            <Icons.clipboard className="h-16 w-16 mx-auto text-primary mb-4" />
            <p>报表包含所有盘点数据，包括产品信息、系统数量、实际数量和差异。</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsReportDialogOpen(false)}>
              取消
            </Button>
            <Button onClick={downloadReport}>
              <Icons.arrowDown className="mr-2 h-4 w-4" />
              下载报表
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

