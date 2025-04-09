"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BarChart3, Package, QrCode, ArrowDownUp, ClipboardList, TrendingUp, AlertTriangle } from "lucide-react"
import Link from "next/link"
import DashboardLayout from "@/components/dashboard-layout"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"

// 定义仪表盘数据接口
interface DashboardData {
  totalInventory: number
  monthlyInbound: number
  monthlyOutbound: number
  lowStockItems: number
  inventoryByCategory: {
    category: string
    percentage: number
  }[]
  inventoryByStatus: {
    status: string
    percentage: number
  }[]
  recentActivities: {
    type: string
    message: string
    date: string
    icon: string
  }[]
  alerts: {
    product: string
    message: string
    quantity: number
  }[]
}

export default function DashboardPage() {
  const router = useRouter()
  const [isClient, setIsClient] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setIsClient(true)
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true"
    if (!isLoggedIn) {
      router.push("/login")
    }

    // 加载仪表盘数据
    fetchDashboardData()
  }, [router])

  // 获取仪表盘数据
  const fetchDashboardData = async () => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/dashboard")
      const data = await response.json()
      setDashboardData(data)
    } catch (error) {
      console.error("Error fetching dashboard data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  if (!isClient) {
    return null // Prevent hydration errors
  }

  // 如果正在加载，显示加载状态
  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="p-4 md:p-8">
          <div className="flex flex-col gap-4">
            <div className="h-8 w-64 bg-gray-200 animate-pulse rounded"></div>
            <div className="h-4 w-48 bg-gray-200 animate-pulse rounded"></div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {[1, 2, 3, 4].map((i) => (
                <Card key={i}>
                  <CardHeader className="pb-2">
                    <div className="h-4 w-24 bg-gray-200 animate-pulse rounded"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-8 w-16 bg-gray-200 animate-pulse rounded mb-2"></div>
                    <div className="h-4 w-32 bg-gray-200 animate-pulse rounded"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  // 使用模拟数据，实际应用中应该从API获取
  const mockData: DashboardData = {
    totalInventory: 1245,
    monthlyInbound: 245,
    monthlyOutbound: 189,
    lowStockItems: 12,
    inventoryByCategory: [
      { category: "电子产品", percentage: 45 },
      { category: "办公用品", percentage: 30 },
      { category: "家具", percentage: 15 },
      { category: "其他", percentage: 10 },
    ],
    inventoryByStatus: [
      { status: "正常库存", percentage: 75 },
      { status: "低库存", percentage: 15 },
      { status: "缺货", percentage: 10 },
    ],
    recentActivities: [
      {
        type: "入库",
        message: "50件产品A已入库",
        date: "2025-04-15 14:30",
        icon: "package",
      },
      {
        type: "出库",
        message: "10件产品B已出库",
        date: "2025-04-14 10:15",
        icon: "arrowUpDown",
      },
      {
        type: "盘点",
        message: "月度盘点已完成",
        date: "2025-04-15 09:00",
        icon: "clipboardList",
      },
    ],
    alerts: [
      {
        product: "产品C",
        message: "库存不足",
        quantity: 5,
      },
      {
        product: "产品F",
        message: "缺货",
        quantity: 0,
      },
    ],
  }

  // 使用API数据或模拟数据
  const data = dashboardData || mockData

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-4 p-4 md:p-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">仪表盘</h1>
            <p className="text-muted-foreground">欢迎回来，查看您的仓库概览</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                alert("报表已导出到您的下载文件夹")
                // 在实际应用中，这里会调用API生成并下载报表
              }}
            >
              <TrendingUp className="mr-2 h-4 w-4" />
              导出报表
            </Button>
            <Button size="sm" onClick={() => router.push("/inventory/add")}>
              <Package className="mr-2 h-4 w-4" />
              添加产品
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">概览</TabsTrigger>
            <TabsTrigger value="inventory">库存</TabsTrigger>
            <TabsTrigger value="transactions">交易</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">总库存数量</CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{data.totalInventory}</div>
                  <div className="flex items-center pt-1 text-xs text-green-500">
                    <TrendingUp className="mr-1 h-3 w-3" />
                    <span>+20% 较上月</span>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">本月入库</CardTitle>
                  <ArrowDownUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{data.monthlyInbound}</div>
                  <div className="flex items-center pt-1 text-xs text-green-500">
                    <TrendingUp className="mr-1 h-3 w-3" />
                    <span>+12% 较上月</span>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">本月出库</CardTitle>
                  <ArrowDownUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{data.monthlyOutbound}</div>
                  <div className="flex items-center pt-1 text-xs text-green-500">
                    <TrendingUp className="mr-1 h-3 w-3" />
                    <span>+8% 较上月</span>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">库存警告</CardTitle>
                  <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{data.lowStockItems}</div>
                  <div className="flex items-center pt-1 text-xs text-red-500">
                    <TrendingUp className="mr-1 h-3 w-3" />
                    <span>+3 较上周</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="col-span-4">
                <CardHeader>
                  <CardTitle>库存概览</CardTitle>
                  <CardDescription>按类别显示的库存分布</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] flex items-center justify-center bg-gray-50 rounded-md">
                    <div className="w-full max-w-md space-y-4 px-4">
                      {data.inventoryByCategory.map((item) => (
                        <div className="space-y-2" key={item.category}>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div
                                className={`h-3 w-3 rounded-full ${
                                  item.category === "电子产品"
                                    ? "bg-blue-500"
                                    : item.category === "办公用品"
                                      ? "bg-green-500"
                                      : item.category === "家具"
                                        ? "bg-yellow-500"
                                        : "bg-purple-500"
                                }`}
                              ></div>
                              <span className="text-sm">{item.category}</span>
                            </div>
                            <span className="text-sm font-medium">{item.percentage}%</span>
                          </div>
                          <Progress value={item.percentage} className="h-2" />
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="col-span-3">
                <CardHeader>
                  <CardTitle>库存状态</CardTitle>
                  <CardDescription>按状态显示的库存分布</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] flex items-center justify-center bg-gray-50 rounded-md">
                    <div className="w-full max-w-md space-y-4 px-4">
                      {data.inventoryByStatus.map((item) => (
                        <div className="space-y-2" key={item.status}>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div
                                className={`h-3 w-3 rounded-full ${
                                  item.status === "正常库存"
                                    ? "bg-green-500"
                                    : item.status === "低库存"
                                      ? "bg-yellow-500"
                                      : "bg-red-500"
                                }`}
                              ></div>
                              <span className="text-sm">{item.status}</span>
                            </div>
                            <span className="text-sm font-medium">{item.percentage}%</span>
                          </div>
                          <Progress value={item.percentage} className="h-2" />
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle>最近活动</CardTitle>
                  <CardDescription>最近的库存操作记录</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {data.recentActivities.map((activity, index) => (
                      <div className="flex items-start gap-4" key={index}>
                        <div
                          className={`rounded-full p-2 ${
                            activity.icon === "package"
                              ? "bg-blue-100"
                              : activity.icon === "arrowUpDown"
                                ? "bg-green-100"
                                : "bg-yellow-100"
                          }`}
                        >
                          {activity.icon === "package" ? (
                            <Package
                              className={`h-4 w-4 ${
                                activity.icon === "package"
                                  ? "text-blue-500"
                                  : activity.icon === "arrowUpDown"
                                    ? "text-green-500"
                                    : "text-yellow-500"
                              }`}
                            />
                          ) : activity.icon === "arrowUpDown" ? (
                            <ArrowDownUp className="h-4 w-4 text-green-500" />
                          ) : (
                            <ClipboardList className="h-4 w-4 text-yellow-500" />
                          )}
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-medium">{activity.message}</p>
                          <p className="text-xs text-muted-foreground">{activity.date}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>库存警告</CardTitle>
                  <CardDescription>需要关注的库存问题</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {data.alerts.map((alert, index) => (
                      <div className="flex items-start gap-4" key={index}>
                        <div className="rounded-full p-2 bg-red-100">
                          <AlertTriangle className="h-4 w-4 text-red-500" />
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-medium">
                            {alert.product}
                            {alert.message}
                          </p>
                          <p className="text-xs text-muted-foreground">当前库存: {alert.quantity}</p>
                          <Button variant="outline" size="sm" className="mt-2">
                            补充库存
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>快速操作</CardTitle>
                  <CardDescription>常用功能快速访问</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Link href="/inventory/in">
                    <Button className="w-full justify-start" variant="outline">
                      <Package className="mr-2 h-4 w-4" />
                      入库操作
                    </Button>
                  </Link>
                  <Link href="/inventory/out">
                    <Button className="w-full justify-start" variant="outline">
                      <Package className="mr-2 h-4 w-4" />
                      出库操作
                    </Button>
                  </Link>
                  <Link href="/codes/scan">
                    <Button className="w-full justify-start" variant="outline">
                      <QrCode className="mr-2 h-4 w-4" />
                      扫码操作
                    </Button>
                  </Link>
                  <Link href="/check/new">
                    <Button className="w-full justify-start" variant="outline">
                      <BarChart3 className="mr-2 h-4 w-4" />
                      开始盘点
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="inventory" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>库存状态</CardTitle>
                <CardDescription>按仓库显示的库存状态</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">主仓库</span>
                      <span className="text-sm">总库存: 850件</span>
                    </div>
                    <Progress value={85} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">北区仓库</span>
                      <span className="text-sm">总库存: 320件</span>
                    </div>
                    <Progress value={65} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">南区仓库</span>
                      <span className="text-sm">总库存: 75件</span>
                    </div>
                    <Progress value={30} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>热门产品</CardTitle>
                  <CardDescription>最常出库的产品</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
                          <Package className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">产品A</p>
                          <p className="text-xs text-muted-foreground">SKU001</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">120件</p>
                        <p className="text-xs text-green-500">+15%</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
                          <Package className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">产品B</p>
                          <p className="text-xs text-muted-foreground">SKU002</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">85件</p>
                        <p className="text-xs text-green-500">+8%</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
                          <Package className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">产品E</p>
                          <p className="text-xs text-muted-foreground">SKU005</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">65件</p>
                        <p className="text-xs text-red-500">-5%</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>库存预警</CardTitle>
                  <CardDescription>需要补充的产品</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center">
                          <AlertTriangle className="h-4 w-4 text-red-500" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">产品C</p>
                          <p className="text-xs text-muted-foreground">SKU003</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">5件</p>
                        <p className="text-xs text-red-500">低于最小库存</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center">
                          <AlertTriangle className="h-4 w-4 text-red-500" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">产品F</p>
                          <p className="text-xs text-muted-foreground">SKU006</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">0件</p>
                        <p className="text-xs text-red-500">缺货</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-yellow-100 flex items-center justify-center">
                          <AlertTriangle className="h-4 w-4 text-yellow-500" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">产品D</p>
                          <p className="text-xs text-muted-foreground">SKU004</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">15件</p>
                        <p className="text-xs text-yellow-500">接近最小库存</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="transactions" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>最近交易</CardTitle>
                <CardDescription>最近的出入库记录</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                        <ArrowDownUp className="h-4 w-4 text-green-500" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">产品A入库</p>
                        <p className="text-xs text-muted-foreground">2025-04-15 14:30</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">+50件</p>
                      <p className="text-xs text-muted-foreground">PO-2025-001</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                        <ArrowDownUp className="h-4 w-4 text-blue-500" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">产品B出库</p>
                        <p className="text-xs text-muted-foreground">2025-04-14 10:15</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">-10件</p>
                      <p className="text-xs text-muted-foreground">SO-2025-042</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                        <ArrowDownUp className="h-4 w-4 text-green-500" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">产品C入库</p>
                        <p className="text-xs text-muted-foreground">2025-04-12 09:45</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">+25件</p>
                      <p className="text-xs text-muted-foreground">PO-2025-002</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                        <ArrowDownUp className="h-4 w-4 text-blue-500" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">产品A出库</p>
                        <p className="text-xs text-muted-foreground">2025-04-10 16:20</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">-15件</p>
                      <p className="text-xs text-muted-foreground">SO-2025-041</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>入库统计</CardTitle>
                  <CardDescription>按月份统计的入库数量</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[200px] flex items-center justify-center bg-gray-50 rounded-md">
                    <div className="w-full max-w-md space-y-4 px-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">一月</span>
                          <span className="text-sm font-medium">180件</span>
                        </div>
                        <Progress value={60} className="h-2" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">二月</span>
                          <span className="text-sm font-medium">210件</span>
                        </div>
                        <Progress value={70} className="h-2" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">三月</span>
                          <span className="text-sm font-medium">240件</span>
                        </div>
                        <Progress value={80} className="h-2" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">四月</span>
                          <span className="text-sm font-medium">245件</span>
                        </div>
                        <Progress value={82} className="h-2" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>出库统计</CardTitle>
                  <CardDescription>按月份统计的出库数量</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[200px] flex items-center justify-center bg-gray-50 rounded-md">
                    <div className="w-full max-w-md space-y-4 px-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">一月</span>
                          <span className="text-sm font-medium">150件</span>
                        </div>
                        <Progress value={50} className="h-2" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">二月</span>
                          <span className="text-sm font-medium">165件</span>
                        </div>
                        <Progress value={55} className="h-2" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">三月</span>
                          <span className="text-sm font-medium">175件</span>
                        </div>
                        <Progress value={58} className="h-2" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">四月</span>
                          <span className="text-sm font-medium">189件</span>
                        </div>
                        <Progress value={63} className="h-2" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}

