import type { IPlugin } from "@/lib/plugin-system"
import PluginManagerPage from "./page"
import { Puzzle } from "lucide-react"

const pluginManagerPlugin: IPlugin = {
  id: "core.plugin-manager",
  name: "插件管理",
  description: "管理系统插件，启用或禁用功能模块",
  version: "1.0.0",
  dependencies: [],

  // 获取导航项
  getNavItems() {
    return [
      {
        name: "插件管理",
        href: "/plugins",
        icon: Puzzle,
        order: 100, // 排序权重，放在最后
      },
    ]
  },

  // 获取路由
  getRoutes() {
    return [
      {
        path: "/plugins",
        component: PluginManagerPage,
      },
    ]
  },

  // 获取组件
  getComponents() {
    return {
      PluginManagerPage,
    }
  },

  // 插件生命周期方法
  async onInstall() {
    console.log("Plugin Manager plugin installed")
  },

  async onEnable() {
    console.log("Plugin Manager plugin enabled")
  },

  async onDisable() {
    console.log("Plugin Manager plugin disabled")
  },

  async onUninstall() {
    console.log("Plugin Manager plugin uninstalled")
  },
}

export default pluginManagerPlugin

