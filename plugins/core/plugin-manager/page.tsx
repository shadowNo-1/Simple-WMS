"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import DashboardLayout from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Puzzle, Info, AlertTriangle, Check, X, Download, Upload } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function PluginManagerPage() {
  const router = useRouter()
  const [isClient, setIsClient] = useState(false)
  const [plugins, setPlugins] = useState<any[]>([])
  const [selectedPlugin, setSelectedPlugin] = useState<any>(null)
  const [showDetails, setShowDetails] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [actionInProgress, setActionInProgress] = useState(false)
  const [actionResult, setActionResult] = useState<{ success: boolean; message: string } | null>(null)

  useEffect(() => {
    setIsClient(true)
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true"
    if (!isLoggedIn) {
      router.push("/login")
    }

    // 加载插件数据
    fetchPlugins()
  }, [router])

  // 获取插件列表
  const fetchPlugins = async () => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/plugins")
      const data = await response.json()
      setPlugins(data)
    } catch (error) {
      console.error("Error fetching plugins:", error)
      // 使用模拟数据
      setPlugins([
        {
          id: "core.dashboard",
          name: "仪表盘",
          description: "系统仪表盘，显示关键指标和统计数据",
          version: "1.0.0",
          enabled: true,
          dependencies: [],
          isCore: true,
        },
        {
          id: "core.products",
          name: "产品管理",
          description: "管理产品信息和属性",
          version: "1.0.0",
          enabled: true,
          dependencies: [],
          isCore: true,
        },
        {
          id: "core.inventory",
          name: "库存管理",
          description: "管理产品库存和库位",
          version: "1.0.0",
          enabled: true,
          dependencies: ["core.products"],
          isCore: true,
        },
        {
          id: "core.transactions",
          name: "交易管理",
          description: "管理入库和出库操作",
          version: "1.0.0",
          enabled: true,
          dependencies: ["core.products", "core.inventory"],
          isCore: true,
        },
        {
          id: "core.warehouses",
          name: "仓库管理",
          description: "管理仓库和库位信息",
          version: "1.0.0",
          enabled: true,
          dependencies: [],
          isCore: true,
        },
        {
          id: "core.check",
          name: "库存盘点",
          description: "执行库存盘点和差异分析",
          version: "1.0.0",
          enabled: true,
          dependencies: ["core.products", "core.inventory"],
          isCore: true,
        },
        {
          id: "core.codes",
          name: "条码管理",
          description: "生成和扫描产品条码",
          version: "1.0.0",
          enabled: true,
          dependencies: ["core.products"],
          isCore: true,
        },
        {
          id: "core.users",
          name: "用户管理",
          description: "管理系统用户和权限",
          version: "1.0.0",
          enabled: true,
          dependencies: [],
          isCore: true,
        },
        {
          id: "core.settings",
          name: "系统设置",
          description: "配置系统参数和选项",
          version: "1.0.0",
          enabled: true,
          dependencies: [],
          isCore: true,
        },
        {
          id: "core.plugin-manager",
          name: "插件管理",
          description: "管理系统插件，启用或禁用功能模块",
          version: "1.0.0",
          enabled: true,
          dependencies: [],
          isCore: true,
        },
        {
          id: "extension.reports",
          name: "报表模块",
          description: "生成各类库存和交易报表",
          version: "1.0.0",
          enabled: false,
          dependencies: ["core.products", "core.inventory", "core.transactions"],
          isCore: false,
        },
        {
          id: "extension.supplier",
          name: "供应商管理",
          description: "管理供应商信息和采购",
          version: "1.0.0",
          enabled: false,
          dependencies: ["core.products"],
          isCore: false,
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  // 切换插件启用状态
  const togglePluginStatus = async (pluginId: string, currentStatus: boolean) => {
    try {
      setActionInProgress(true)

      // 在实际应用中，这里会调用API
      const response = await fetch(`/api/plugins/${pluginId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ enabled: !currentStatus }),
      })

      if (!response.ok) {
        throw new Error("Failed to update plugin status")
      }

      // 更新本地状态
      setPlugins(plugins.map((plugin) => (plugin.id === pluginId ? { ...plugin, enabled: !currentStatus } : plugin)))

      setActionResult({
        success: true,
        message: `插件 "${plugins.find((p) => p.id === pluginId)?.name}" 已${!currentStatus ? "启用" : "禁用"}`,
      })
    } catch (error) {
      console.error("Error toggling plugin status:", error)

      // 模拟API响应
      // 检查是否有依赖关系阻止操作
      const plugin = plugins.find((p) => p.id === pluginId)

      if (!currentStatus) {
        // 启用插件，检查依赖
        const missingDependencies = plugin?.dependencies.filter(
          (depId) => !plugins.find((p) => p.id === depId)?.enabled,
        )

        if (missingDependencies && missingDependencies.length > 0) {
          const missingNames = missingDependencies
            .map((depId) => plugins.find((p) => p.id === depId)?.name || depId)
            .join(", ")

          setActionResult({
            success: false,
            message: `无法启用插件，缺少依赖: ${missingNames}`,
          })
          return
        }
      } else {
        // 禁用插件，检查是否有其他插件依赖它
        const dependentPlugins = plugins.filter((p) => p.enabled && p.dependencies.includes(pluginId))

        if (dependentPlugins.length > 0) {
          const dependentNames = dependentPlugins.map((p) => p.name).join(", ")

          setActionResult({
            success: false,
            message: `无法禁用插件，以下插件依赖它: ${dependentNames}`,
          })
          return
        }
      }

      // 模拟成功
      setPlugins(plugins.map((p) => (p.id === pluginId ? { ...p, enabled: !currentStatus } : p)))

      setActionResult({
        success: true,
        message: `插件 "${plugin?.name}" 已${!currentStatus ? "启用" : "禁用"}`,
      })
    } finally {
      setActionInProgress(false)

      // 3秒后清除结果消息
      setTimeout(() => {
        setActionResult(null)
      }, 3000)
    }
  }

  // 查看插件详情
  const viewPluginDetails = (plugin: any) => {
    setSelectedPlugin(plugin)
    setShowDetails(true)
  }

  // 渲染插件依赖项
  const renderDependencies = (dependencies: string[]) => {
    if (!dependencies || dependencies.length === 0) {
      return <span className="text-gray-500">无</span>
    }

    return dependencies.map((depId) => {
      const dep = plugins.find((p) => p.id === depId)
      return (
        <Badge key={depId} variant={dep?.enabled ? "default" : "outline"} className="mr-1">
          {dep?.name || depId}
        </Badge>
      )
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
            <h1 className="text-2xl font-bold">插件管理</h1>
            <p className="text-muted-foreground">管理系统功能模块，启用或禁用插件</p>
          </div>
          <div className="flex gap-2 mt-4 md:mt-0">
            <Button variant="outline">
              <Upload className="mr-2 h-4 w-4" />
              上传插件
            </Button>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              下载插件
            </Button>
          </div>
        </div>

        {actionResult && (
          <Alert
            className={`mb-4 ${actionResult.success ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}
          >
            <AlertDescription className={actionResult.success ? "text-green-600" : "text-red-600"}>
              {actionResult.message}
            </AlertDescription>
          </Alert>
        )}

        <Card>
          <CardHeader>
            <CardTitle>已安装插件</CardTitle>
            <CardDescription>管理系统中已安装的插件和功能模块</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-8">
                <div className="h-8 w-8 border-2 border-gray-200 border-t-primary rounded-full animate-spin mb-4"></div>
                <p className="text-muted-foreground">加载插件列表...</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>插件名称</TableHead>
                    <TableHead>版本</TableHead>
                    <TableHead>描述</TableHead>
                    <TableHead>依赖</TableHead>
                    <TableHead>状态</TableHead>
                    <TableHead>操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {plugins.map((plugin) => (
                    <TableRow key={plugin.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <Puzzle className="h-4 w-4 text-muted-foreground" />
                          {plugin.name}
                          {plugin.isCore && (
                            <Badge variant="secondary" className="ml-2">
                              核心
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{plugin.version}</TableCell>
                      <TableCell className="max-w-xs truncate">{plugin.description}</TableCell>
                      <TableCell>{renderDependencies(plugin.dependencies)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={plugin.enabled}
                            onCheckedChange={() => togglePluginStatus(plugin.id, plugin.enabled)}
                            disabled={actionInProgress || plugin.isCore} // 核心插件不能禁用
                          />
                          <span className={plugin.enabled ? "text-green-600" : "text-gray-500"}>
                            {plugin.enabled ? "已启用" : "已禁用"}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm" onClick={() => viewPluginDetails(plugin)}>
                          <Info className="h-4 w-4" />
                          <span className="sr-only">查看详情</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>

      {/* 插件详情对话框 */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>插件详情</DialogTitle>
            <DialogDescription>查看插件的详细信息</DialogDescription>
          </DialogHeader>

          {selectedPlugin && (
            <div className="space-y-4 py-4">
              <div className="flex items-center gap-2">
                <Puzzle className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-medium">{selectedPlugin.name}</h3>
                {selectedPlugin.isCore && <Badge variant="secondary">核心</Badge>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">ID</p>
                  <p className="text-sm font-mono">{selectedPlugin.id}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">版本</p>
                  <p>{selectedPlugin.version}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm font-medium text-muted-foreground">描述</p>
                  <p>{selectedPlugin.description}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm font-medium text-muted-foreground">状态</p>
                  <div className="flex items-center gap-2 mt-1">
                    {selectedPlugin.enabled ? (
                      <>
                        <Check className="h-4 w-4 text-green-500" />
                        <span className="text-green-600">已启用</span>
                      </>
                    ) : (
                      <>
                        <X className="h-4 w-4 text-gray-500" />
                        <span className="text-gray-500">已禁用</span>
                      </>
                    )}
                  </div>
                </div>
                <div className="col-span-2">
                  <p className="text-sm font-medium text-muted-foreground">依赖项</p>
                  <div className="mt-1">
                    {selectedPlugin.dependencies && selectedPlugin.dependencies.length > 0 ? (
                      <div className="flex flex-wrap gap-1">{renderDependencies(selectedPlugin.dependencies)}</div>
                    ) : (
                      <span className="text-gray-500">无</span>
                    )}
                  </div>
                </div>
              </div>

              {selectedPlugin.isCore && (
                <Alert className="bg-yellow-50 border-yellow-200">
                  <AlertTriangle className="h-4 w-4 text-yellow-600" />
                  <AlertDescription className="text-yellow-600">这是核心插件，无法禁用或卸载。</AlertDescription>
                </Alert>
              )}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDetails(false)}>
              关闭
            </Button>
            {selectedPlugin && !selectedPlugin.isCore && (
              <Button
                variant={selectedPlugin.enabled ? "destructive" : "default"}
                onClick={() => {
                  togglePluginStatus(selectedPlugin.id, selectedPlugin.enabled)
                  setShowDetails(false)
                }}
              >
                {selectedPlugin.enabled ? "禁用" : "启用"}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  )
}

