import type { IPlugin } from "@/lib/plugin-system"
import DashboardPage from "./page"
import { LayoutDashboard } from "lucide-react"

const dashboardPlugin: IPlugin = {
  id: "core.dashboard",
  name: "仪表盘",
  description: "系统仪表盘，显示关键指标和统计数据",
  version: "1.0.0",
  dependencies: [],

  // 获取导航项
  getNavItems() {
    return [
      {
        name: "仪表盘",
        href: "/dashboard",
        icon: LayoutDashboard,
        order: 10, // 排序权重
      },
    ]
  },

  // 获取路由
  getRoutes() {
    return [
      {
        path: "/dashboard",
        component: DashboardPage,
      },
    ]
  },

  // 获取组件
  getComponents() {
    return {
      DashboardPage,
    }
  },

  // 插件生命周期方法
  async onInstall() {
    console.log("Dashboard plugin installed")
  },

  async onEnable() {
    console.log("Dashboard plugin enabled")
  },

  async onDisable() {
    console.log("Dashboard plugin disabled")
  },

  async onUninstall() {
    console.log("Dashboard plugin uninstalled")
  },
}

export default dashboardPlugin

