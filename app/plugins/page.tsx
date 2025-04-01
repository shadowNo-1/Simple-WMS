"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { Icons } from "@/components/icons"
import { useToast } from "@/components/ui/use-toast"

// Mock data for plugins
const mockPlugins = [
  {
    id: "1",
    name: "高级报表",
    description: "提供更详细的库存报表和图表分析",
    author: "WMS 团队",
    version: "1.0.0",
    enabled: true,
  },
  {
    id: "2",
    name: "数据导出",
    description: "支持将库存数据导出为 Excel, CSV 或 PDF 格式",
    author: "数据工具组",
    version: "2.1.3",
    enabled: false,
  },
  {
    id: "3",
    name: "供应商管理",
    description: "添加供应商管理功能及与库存关联",
    author: "供应链解决方案",
    version: "0.9.5",
    enabled: false,
  },
  {
    id: "4",
    name: "移动端扫描",
    description: "优化移动设备上的条码/二维码扫描体验",
    author: "移动开发团队",
    version: "1.2.0",
    enabled: true,
  },
]

export default function PluginsPage() {
  const { toast } = useToast()
  const [plugins, setPlugins] = useState(mockPlugins)
  const [isInstalling, setIsInstalling] = useState(false)

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
      }

      setPlugins([...plugins, newPlugin])
      setIsInstalling(false)

      toast({
        title: "插件已安装",
        description: `${newPlugin.name} 已成功安装`,
      })
    }, 2000)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">插件管理</h1>
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

      <div className="grid gap-6 md:grid-cols-2">
        {plugins.map((plugin) => (
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
              <p className="text-sm text-muted-foreground">{plugin.description}</p>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" size="sm">
                配置
              </Button>
              <Button variant="ghost" size="sm" className="text-destructive">
                卸载
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}

