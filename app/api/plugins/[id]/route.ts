import { NextResponse } from "next/server"
import prisma from "@/lib/db"
import { pluginRegistry } from "@/lib/plugin-system"

// 获取单个插件
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id

    // 从数据库获取插件信息
    const dbPlugin = await prisma.plugin.findUnique({
      where: { id },
    })

    // 从插件注册表获取插件
    const plugin = pluginRegistry.getPlugin(id)

    if (!plugin) {
      return NextResponse.json({ error: "Plugin not found" }, { status: 404 })
    }

    return NextResponse.json({
      id: plugin.id,
      name: plugin.name,
      description: plugin.description || "",
      version: plugin.version,
      enabled: dbPlugin?.enabled ?? true,
      dependencies: plugin.dependencies,
      isCore: plugin.id.startsWith("core."),
    })
  } catch (error) {
    console.error("Error fetching plugin:", error)
    return NextResponse.json({ error: "Failed to fetch plugin" }, { status: 500 })
  }
}

// 更新插件
export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const body = await request.json()

    // 检查插件是否存在
    const plugin = pluginRegistry.getPlugin(id)

    if (!plugin) {
      return NextResponse.json({ error: "Plugin not found" }, { status: 404 })
    }

    // 检查是否是核心插件
    if (id.startsWith("core.") && body.enabled === false) {
      return NextResponse.json({ error: "Cannot disable core plugin" }, { status: 400 })
    }

    // 如果要启用插件，检查依赖
    if (body.enabled) {
      for (const depId of plugin.dependencies) {
        const depPlugin = await prisma.plugin.findUnique({
          where: { id: depId },
        })

        if (!depPlugin?.enabled) {
          return NextResponse.json({ error: `Dependency ${depId} is not enabled` }, { status: 400 })
        }
      }
    }

    // 如果要禁用插件，检查是否有其他插件依赖它
    if (body.enabled === false) {
      const dependentPlugins = await prisma.plugin.findMany({
        where: {
          dependencies: {
            has: id,
          },
          enabled: true,
        },
      })

      if (dependentPlugins.length > 0) {
        return NextResponse.json({ error: `Cannot disable plugin, it is required by other plugins` }, { status: 400 })
      }
    }

    // 更新插件状态
    const updatedPlugin = await prisma.plugin.upsert({
      where: { id },
      update: { enabled: body.enabled },
      create: {
        id,
        name: plugin.name,
        description: plugin.description || "",
        version: plugin.version,
        enabled: body.enabled,
        dependencies: plugin.dependencies,
      },
    })

    // 调用插件的生命周期方法
    if (body.enabled && plugin.onEnable) {
      await plugin.onEnable()
    } else if (body.enabled === false && plugin.onDisable) {
      await plugin.onDisable()
    }

    return NextResponse.json(updatedPlugin)
  } catch (error) {
    console.error("Error updating plugin:", error)
    return NextResponse.json({ error: "Failed to update plugin" }, { status: 500 })
  }
}

// 删除插件
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id

    // 检查是否是核心插件
    if (id.startsWith("core.")) {
      return NextResponse.json({ error: "Cannot delete core plugin" }, { status: 400 })
    }

    // 检查是否有其他插件依赖它
    const dependentPlugins = await prisma.plugin.findMany({
      where: {
        dependencies: {
          has: id,
        },
      },
    })

    if (dependentPlugins.length > 0) {
      return NextResponse.json({ error: `Cannot delete plugin, it is required by other plugins` }, { status: 400 })
    }

    // 获取插件
    const plugin = pluginRegistry.getPlugin(id)

    // 调用插件的卸载方法
    if (plugin?.onUninstall) {
      await plugin.onUninstall()
    }

    // 从数据库删除插件
    await prisma.plugin.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting plugin:", error)
    return NextResponse.json({ error: "Failed to delete plugin" }, { status: 500 })
  }
}

