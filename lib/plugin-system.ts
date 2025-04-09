import type React from "react"
import prisma from "./db"

// 插件接口定义
export interface IPlugin {
  id: string
  name: string
  description?: string
  version: string
  dependencies: string[]

  // 插件生命周期方法
  onInstall?: () => Promise<void>
  onEnable?: () => Promise<void>
  onDisable?: () => Promise<void>
  onUninstall?: () => Promise<void>

  // 插件功能方法
  getRoutes?: () => any[]
  getNavItems?: () => any[]
  getComponents?: () => Record<string, React.ComponentType<any>>
}

// 插件注册表
class PluginRegistry {
  private plugins: Map<string, IPlugin> = new Map()
  private enabledPlugins: Set<string> = new Set()

  // 初始化插件系统
  async initialize() {
    try {
      // 从数据库加载插件信息
      const dbPlugins = await prisma.plugin.findMany()

      // 注册核心插件
      this.registerCorePlugins()

      // 启用数据库中标记为启用的插件
      for (const plugin of dbPlugins) {
        if (plugin.enabled && this.plugins.has(plugin.id)) {
          await this.enablePlugin(plugin.id)
        }
      }

      console.log("Plugin system initialized successfully")
    } catch (error) {
      console.error("Failed to initialize plugin system:", error)
    }
  }

  // 注册核心插件
  private registerCorePlugins() {
    // 这里会注册系统核心插件
    // 例如：产品管理、库存管理、交易管理等
    const corePlugins = [
      require("../plugins/core/dashboard").default,
      require("../plugins/core/products").default,
      require("../plugins/core/inventory").default,
      require("../plugins/core/transactions").default,
      require("../plugins/core/warehouses").default,
      require("../plugins/core/users").default,
      require("../plugins/core/settings").default,
      require("../plugins/core/check").default,
      require("../plugins/core/codes").default,
    ]

    for (const plugin of corePlugins) {
      this.registerPlugin(plugin)
    }
  }

  // 注册插件
  registerPlugin(plugin: IPlugin) {
    if (this.plugins.has(plugin.id)) {
      console.warn(`Plugin ${plugin.id} is already registered`)
      return false
    }

    this.plugins.set(plugin.id, plugin)
    return true
  }

  // 启用插件
  async enablePlugin(pluginId: string) {
    const plugin = this.plugins.get(pluginId)
    if (!plugin) {
      throw new Error(`Plugin ${pluginId} not found`)
    }

    // 检查依赖
    for (const depId of plugin.dependencies) {
      if (!this.isPluginEnabled(depId)) {
        throw new Error(`Dependency ${depId} is not enabled for plugin ${pluginId}`)
      }
    }

    // 调用插件的启用方法
    if (plugin.onEnable) {
      await plugin.onEnable()
    }

    // 更新数据库
    await prisma.plugin.upsert({
      where: { id: pluginId },
      update: { enabled: true },
      create: {
        id: pluginId,
        name: plugin.name,
        description: plugin.description || "",
        version: plugin.version,
        enabled: true,
        dependencies: plugin.dependencies,
      },
    })

    this.enabledPlugins.add(pluginId)
    return true
  }

  // 禁用插件
  async disablePlugin(pluginId: string) {
    // 检查是否有其他启用的插件依赖此插件
    for (const [id, plugin] of this.plugins.entries()) {
      if (this.isPluginEnabled(id) && plugin.dependencies.includes(pluginId)) {
        throw new Error(`Cannot disable plugin ${pluginId} because plugin ${id} depends on it`)
      }
    }

    const plugin = this.plugins.get(pluginId)
    if (!plugin) {
      throw new Error(`Plugin ${pluginId} not found`)
    }

    // 调用插件的禁用方法
    if (plugin.onDisable) {
      await plugin.onDisable()
    }

    // 更新数据库
    await prisma.plugin.update({
      where: { id: pluginId },
      data: { enabled: false },
    })

    this.enabledPlugins.delete(pluginId)
    return true
  }

  // 检查插件是否已启用
  isPluginEnabled(pluginId: string) {
    return this.enabledPlugins.has(pluginId)
  }

  // 获取所有插件
  getAllPlugins() {
    return Array.from(this.plugins.values())
  }

  // 获取已启用的插件
  getEnabledPlugins() {
    return Array.from(this.enabledPlugins)
      .map((id) => this.plugins.get(id))
      .filter(Boolean) as IPlugin[]
  }

  // 获取插件
  getPlugin(pluginId: string) {
    return this.plugins.get(pluginId)
  }

  // 获取所有导航项
  getAllNavItems() {
    const navItems: any[] = []

    for (const pluginId of this.enabledPlugins) {
      const plugin = this.plugins.get(pluginId)
      if (plugin?.getNavItems) {
        navItems.push(...plugin.getNavItems())
      }
    }

    return navItems
  }

  // 获取所有路由
  getAllRoutes() {
    const routes: any[] = []

    for (const pluginId of this.enabledPlugins) {
      const plugin = this.plugins.get(pluginId)
      if (plugin?.getRoutes) {
        routes.push(...plugin.getRoutes())
      }
    }

    return routes
  }
}

// 创建插件注册表单例
export const pluginRegistry = new PluginRegistry()

// 初始化插件系统
export const initializePluginSystem = async () => {
  await pluginRegistry.initialize()
}

