import { NextResponse } from "next/server"
import prisma from "@/lib/db"
import { pluginRegistry } from "@/lib/plugin-system"

// 获取所有插件
export async function GET() {
  try {
    // 从数据库获取插件信息
    const dbPlugins = await prisma.plugin.findMany()

    // 从插件注册表获取所有插件
    const allPlugins = pluginRegistry.getAllPlugins().map((plugin) => {
      // 查找数据库中的插件状态
      const dbPlugin = dbPlugins.find((p) => p.id === plugin.id)

      return {
        id: plugin.id,
        name: plugin.name,
        description: plugin.description || "",
        version: plugin.version,
        enabled: dbPlugin?.enabled ?? true,
        dependencies: plugin.dependencies,
        isCore: plugin.id.startsWith("core."),
      }
    })

    return NextResponse.json(allPlugins)
  } catch (error) {
    console.error("Error fetching plugins:", error)
    return NextResponse.json({ error: "Failed to fetch plugins" }, { status: 500 })
  }
}

// 安装新插件
export async function POST(request: Request) {
  try {
    const body = await request.json()

    // 验证插件信息
    if (!body.id || !body.name || !body.version) {
      return NextResponse.json({ error: "Invalid plugin data" }, { status: 400 })
    }

    // 检查插件是否已存在
    const existingPlugin = await prisma.plugin.findUnique({
      where: { id: body.id },
    })

    if (existingPlugin) {
      return NextResponse.json({ error: "Plugin already exists" }, { status: 409 })
    }

    // 创建新插件记录
    const plugin = await prisma.plugin.create({
      data: {
        id: body.id,
        name: body.name,
        description: body.description || "",
        version: body.version,
        enabled: body.enabled ?? true,
        dependencies: body.dependencies || [],
      },
    })

    return NextResponse.json(plugin, { status: 201 })
  } catch (error) {
    console.error("Error creating plugin:", error)
    return NextResponse.json({ error: "Failed to create plugin" }, { status: 500 })
  }
}

