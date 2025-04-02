"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Icons } from "@/components/icons"
import { useToast } from "@/components/ui/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Mock data for plugins
const mockPlugins = [
  {
    id: "1",
    name: "高级报表",
    description: "提供更详细的库存报表和图表分析",
    author: "WMS 团队",
    version: "1.0.0",
    enabled: true,
    category: "报表",
  },
  {
    id: "2",
    name: "数据导出",
    description: "支持将库存数据导出为 Excel, CSV 或 PDF 格式",
    author: "数据工具组",
    version: "2.1.3",
    enabled: false,
    category: "数据",
  },
  {
    id: "3",
    name: "供应商管理",
    description: "添加供应商管理功能及与库存关联",
    author: "供应链解决方案",
    version: "0.9.5",
    enabled: false,
    category: "管理",
  },
  {
    id: "4",
    name: "移动端扫描",
    description: "优化移动设备上的条码/二维码扫描体验",
    author: "移动开发团队",
    version: "1.2.0",
    enabled: true,
    category: "扫描",
  },
]

export default function PluginsPage() {
  const { toast } = useToast()
  const [plugins, setPlugins] = useState(mockPlugins)
  const [isInstalling, setIsInstalling] = useState(false)
  const [activeTab, setActiveTab] = useState("installed")
  const [searchTerm, setSearchTerm] = useState("")

  const handleTogglePlugin = (id: string) => {
    setPlugins(plugins.map((plugin) => (plugin.id === id ? { ...plugin, enabled: !plugin.enabled } : plugin)))

    const plugin = plugins.find((p) => p.id === id)
    if (plugin) {
      toast({
        title: plugin.enabled ? "插件已禁用" : "插件已启用",
        description: `${plugin.name} 已${plugin.enabled ? "禁用" : "启用"}`,
      })
    }
  }

  const handleInstallPlugin = () => {
    setIsInstalling(true)

    setTimeout(() => {
      const newPlugin = {
        id: String(plugins.length + 1),
        name: "批量库存调整",
        description: "支持批量调整库存数量和位置",
        author: "库存管理系统",
        version: "1.0.0",
        enabled: false,
        category: "库存",
      }

      setPlugins([...plugins, newPlugin])
      setIsInstalling(false)

      toast({
        title: "插件已安装",
        description: `${newPlugin.name} 已成功安装`,
      })
    }, 2000)
  }

  const filteredPlugins = plugins.filter(
    (plugin) =>
      plugin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      plugin.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      plugin.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      plugin.category.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">插件管理</h1>
        <Button onClick={handleInstallPlugin} disabled={isInstalling}>
          {isInstalling ? (
            <>
              <Icons.sun className="mr-2 h-4 w-4 animate-spin" />
              安装中...
            </>
          ) : (
            <>
              <Icons.plugins className="mr-2 h-4 w-4" />
              安装新插件
            </>
          )}
        </Button>
      </div>

      <Tabs defaultValue="installed" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="installed">已安装插件</TabsTrigger>
          <TabsTrigger value="marketplace">插件市场</TabsTrigger>
          <TabsTrigger value="updates">更新</TabsTrigger>
        </TabsList>

        <TabsContent value="installed" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle>已安装插件</CardTitle>
                <div className="flex items-center space-x-2">
                  <Input
                    placeholder="搜索插件..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="max-w-xs"
                  />
                  <Select defaultValue="all">
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="所有类别" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">所有类别</SelectItem>
                      <SelectItem value="report">报表</SelectItem>
                      <SelectItem value="data">数据</SelectItem>
                      <SelectItem value="management">管理</SelectItem>
                      <SelectItem value="scan">扫描</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                {filteredPlugins.length === 0 ? (
                  <div className="col-span-2 flex h-40 items-center justify-center text-muted-foreground">
                    没有找到匹配的插件
                  </div>
                ) : (
                  filteredPlugins.map((plugin) => (
                    <Card key={plugin.id}>
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="flex items-center gap-2">
                              {plugin.name}
                              <Badge variant="outline" className="text-xs font-normal">
                                v{plugin.version}
                              </Badge>
                            </CardTitle>
                            <CardDescription>作者: {plugin.author}</CardDescription>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Switch
                              id={`plugin-${plugin.id}`}
                              checked={plugin.enabled}
                              onCheckedChange={() => handleTogglePlugin(plugin.id)}
                            />
                            <Label htmlFor={`plugin-${plugin.id}`} className="text-sm">
                              {plugin.enabled ? "启用" : "禁用"}
                            </Label>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="flex justify-between items-start">
                          <p className="text-sm text-muted-foreground">{plugin.description}</p>
                          <Badge variant="secondary" className="ml-2">
                            {plugin.category}
                          </Badge>
                        </div>
                        <div className="flex justify-between mt-4">
                          <Button variant="outline" size="sm">
                            配置
                          </Button>
                          <Button variant="ghost" size="sm" className="text-destructive">
                            卸载
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="marketplace" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>插件市场</CardTitle>
              <CardDescription>浏览和安装新插件</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex h-[300px] items-center justify-center text-muted-foreground">
                插件市场功能即将推出
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="updates" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>插件更新</CardTitle>
              <CardDescription>检查和安装插件更新</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex h-[300px] items-center justify-center text-muted-foreground">
                所有插件均为最新版本
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

