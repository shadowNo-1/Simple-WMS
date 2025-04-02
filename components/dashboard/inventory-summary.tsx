"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Icons } from "@/components/icons"
import { useDb } from "@/lib/db"
import { useMemo } from "react"

export function InventorySummary() {
  const { products, activities } = useDb()

  const summaryData = useMemo(() => {
    // 计算总库存数量
    const totalQuantity = products.reduce((sum, product) => sum + product.quantity, 0)

    // 获取当前月份
    const now = new Date()
    const currentMonth = now.getMonth()
    const currentYear = now.getFullYear()

    // 计算本月入库和出库数量
    const monthlyActivities = activities.filter((activity) => {
      const activityDate = new Date(activity.createdAt)
      return activityDate.getMonth() === currentMonth && activityDate.getFullYear() === currentYear
    })

    const monthlyStockIn = monthlyActivities.filter((a) => a.type === "入库").reduce((sum, a) => sum + a.quantity, 0)

    const monthlyStockOut = monthlyActivities.filter((a) => a.type === "出库").reduce((sum, a) => sum + a.quantity, 0)

    // 计算低库存产品数量
    const lowStockCount = products.filter((p) => p.threshold && p.quantity <= p.threshold).length

    return [
      {
        title: "总库存数量",
        value: totalQuantity.toString(),
        change: "+12.5%",
        icon: "inventory",
        trend: "up",
      },
      {
        title: "本月入库",
        value: monthlyStockIn.toString(),
        change: "+23.1%",
        icon: "arrowDown",
        trend: "up",
      },
      {
        title: "本月出库",
        value: monthlyStockOut.toString(),
        change: "-5.4%",
        icon: "arrowUp",
        trend: "down",
      },
      {
        title: "低库存产品",
        value: lowStockCount.toString(),
        change: lowStockCount > 0 ? `+${lowStockCount}` : "0",
        icon: "clipboard",
        trend: lowStockCount > 0 ? "up" : "neutral",
      },
    ]
  }, [products, activities])

  return (
    <>
      {summaryData.map((item, index) => {
        const Icon = Icons[item.icon as keyof typeof Icons]
        return (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{item.title}</CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{item.value}</div>
              <p
                className={`text-xs ${
                  item.trend === "up" ? "text-rose-500" : item.trend === "down" ? "text-emerald-500" : ""
                }`}
              >
                {item.change} 相比上月
              </p>
            </CardContent>
          </Card>
        )
      })}
    </>
  )
}

