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

export default function DashboardPage() {
  const router = useRouter()
  const [isClient, setIsClient] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")

  useEffect(() => {
    setIsClient(true)
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true"
    if (!isLoggedIn) {
      router.push("/login")
    }
  }, [router])

  if (!isClient) {
    return null // Prevent hydration errors
  }

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
                  <div className="text-2xl font-bold">1,245</div>
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
                  <div className="text-2xl font-bold">245</div>
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
                  <div className="text-2xl font-bold">189</div>
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
                  <div className="text-2xl font-bold">12</div>
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
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                            <span className="text-sm">电子产品</span>
                          </div>
                          <span className="text-sm font-medium">45%</span>
                        </div>
                        <Progress value={45} className="h-2" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="h-3 w-3 rounded-full bg-green-500"></div>
                            <span className="text-sm">办公用品</span>
                          </div>
                          <span className="text-sm font-medium">30%</span>
                        </div>
                        <Progress value={30} className="h-2" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                            <span className="text-sm">家具</span>
                          </div>
                          <span className="text-sm font-medium">15%</span>
                        </div>
                        <Progress value={15} className="h-2" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="h-3 w-3 rounded-full bg-purple-500"></div>
                            <span className="text-sm">其他</span>
                          </div>
                          <span className="text-sm font-medium">10%</span>
                        </div>
                        <Progress value={10} className="h-2" />
                      </div>
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
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="h-3 w-3 rounded-full bg-green-500"></div>
                            <span className="text-sm">正常库存</span>
                          </div>
                          <span className="text-sm font-medium">75%</span>
                        </div>
                        <Progress value={75} className="h-2" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                            <span className="text-sm">低库存</span>
                          </div>
                          <span className="text-sm font-medium">15%</span>
                        </div>
                        <Progress value={15} className="h-2" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="h-3 w-3 rounded-full bg-red-500"></div>
                            <span className="text-sm">缺货</span>
                          </div>
                          <span className="text-sm font-medium">10%</span>
                        </div>
                        <Progress value={10} className="h-2" />
                      </div>
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
                    <div className="flex items-start gap-4">
                      <div className="rounded-full p-2 bg-blue-100">
                        <Package className="h-4 w-4 text-blue-500" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium">产品A入库</p>
                        <p className="text-xs text-muted-foreground">50件产品已入库</p>
                        <p className="text-xs text-muted-foreground">2025-04-15 14:30</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="rounded-full p-2 bg-green-100">
                        <ArrowDownUp className="h-4 w-4 text-green-500" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium">产品B出库</p>
                        <p className="text-xs text-muted-foreground">10件产品已出库</p>
                        <p className="text-xs text-muted-foreground">2025-04-14 10:15</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="rounded-full p-2 bg-yellow-100">
                        <ClipboardList className="h-4 w-4 text-yellow-500" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium">库存盘点完成</p>
                        <p className="text-xs text-muted-foreground">月度盘点已完成</p>
                        <p className="text-xs text-muted-foreground">2025-04-15 09:00</p>
                      </div>
                    </div>
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
                    <div className="flex items-start gap-4">
                      <div className="rounded-full p-2 bg-red-100">
                        <AlertTriangle className="h-4 w-4 text-red-500" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium">产品C库存不足</p>
                        <p className="text-xs text-muted-foreground">当前库存: 5 (低于最小库存: 20)</p>
                        <Button variant="outline" size="sm" className="mt-2">
                          补充库存
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="rounded-full p-2 bg-red-100">
                        <AlertTriangle className="h-4 w-4 text-red-500" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium">产品F缺货</p>
                        <p className="text-xs text-muted-foreground">当前库存: 0</p>
                        <Button variant="outline" size="sm" className="mt-2">
                          补充库存
                        </Button>
                      </div>
                    </div>
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

