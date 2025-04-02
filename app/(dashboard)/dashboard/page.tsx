"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { InventoryChart } from "@/components/dashboard/inventory-chart"
import { InventorySummary } from "@/components/dashboard/inventory-summary"
import { RecentActivities } from "@/components/dashboard/recent-activities"
import { LowStockAlert } from "@/components/dashboard/low-stock-alert"
import { useTranslation } from "@/lib/i18n"

export default function DashboardPage() {
  const { t } = useTranslation()
  const [period, setPeriod] = useState("7d")

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">{t("dashboard")}</h1>
        <Select value={period} onValueChange={setPeriod}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="选择时间段" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">最近 7 天</SelectItem>
            <SelectItem value="30d">最近 30 天</SelectItem>
            <SelectItem value="90d">最近 90 天</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">概览</TabsTrigger>
          <TabsTrigger value="analytics">分析</TabsTrigger>
          <TabsTrigger value="reports">报表</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <InventorySummary />
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="lg:col-span-4">
              <CardHeader>
                <CardTitle>库存趋势</CardTitle>
                <CardDescription>显示库存变化趋势</CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <InventoryChart period={period} />
              </CardContent>
            </Card>
            <Card className="lg:col-span-3">
              <CardHeader>
                <CardTitle>库存分布</CardTitle>
                <CardDescription>按类别显示库存分布</CardDescription>
              </CardHeader>
              <CardContent>
                <InventoryChart type="pie" period={period} />
              </CardContent>
            </Card>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="lg:col-span-4">
              <CardHeader>
                <CardTitle>最近活动</CardTitle>
                <CardDescription>显示最近的库存变动</CardDescription>
              </CardHeader>
              <CardContent>
                <RecentActivities />
              </CardContent>
            </Card>
            <Card className="lg:col-span-3">
              <CardHeader>
                <CardTitle>低库存警报</CardTitle>
                <CardDescription>库存低于阈值的产品</CardDescription>
              </CardHeader>
              <CardContent>
                <LowStockAlert />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>详细分析</CardTitle>
              <CardDescription>查看更详细的库存分析数据</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <div className="flex h-full items-center justify-center text-muted-foreground">详细分析功能即将推出</div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>报表生成</CardTitle>
              <CardDescription>生成和下载库存报表</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <div className="flex h-full items-center justify-center text-muted-foreground">报表功能即将推出</div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

