import { NextResponse } from "next/server"
import prisma from "@/lib/db"

export async function GET() {
  try {
    // 获取总库存数量
    const totalInventory = await prisma.inventoryItem.aggregate({
      _sum: {
        quantity: true,
      },
    })

    // 获取本月入库数量
    const now = new Date()
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

    const monthlyInbound = await prisma.transaction.findMany({
      where: {
        type: "in",
        createdAt: {
          gte: firstDayOfMonth,
        },
      },
      include: {
        items: true,
      },
    })

    const totalInbound = monthlyInbound.reduce((sum, transaction) => {
      return sum + transaction.items.reduce((itemSum, item) => itemSum + item.quantity, 0)
    }, 0)

    // 获取本月出库数量
    const monthlyOutbound = await prisma.transaction.findMany({
      where: {
        type: "out",
        createdAt: {
          gte: firstDayOfMonth,
        },
      },
      include: {
        items: true,
      },
    })

    const totalOutbound = monthlyOutbound.reduce((sum, transaction) => {
      return sum + transaction.items.reduce((itemSum, item) => itemSum + item.quantity, 0)
    }, 0)

    // 获取低库存产品数量
    const lowStockItems = await prisma.product.count({
      where: {
        inventoryItems: {
          some: {
            quantity: {
              lte: prisma.product.fields.minQuantity,
            },
          },
        },
      },
    })

    // 获取按类别的库存分布
    const productsByCategory = await prisma.product.groupBy({
      by: ["category"],
      _sum: {
        minQuantity: true,
      },
      _count: {
        id: true,
      },
    })

    // 计算每个类别的百分比
    const totalProducts = await prisma.product.count()
    const inventoryByCategory = productsByCategory.map((category) => ({
      category: category.category,
      percentage: Math.round((category._count.id / totalProducts) * 100),
    }))

    // 获取按状态的库存分布
    const itemsByStatus = await prisma.inventoryItem.groupBy({
      by: ["status"],
      _count: {
        id: true,
      },
    })

    // 计算每个状态的百分比
    const totalItems = await prisma.inventoryItem.count()
    const inventoryByStatus = itemsByStatus.map((status) => {
      let statusName = "未知"
      if (status.status === "normal") statusName = "正常库存"
      else if (status.status === "low") statusName = "低库存"
      else if (status.status === "out_of_stock") statusName = "缺货"

      return {
        status: statusName,
        percentage: Math.round((status._count.id / totalItems) * 100),
      }
    })

    // 获取最近活动
    const recentTransactions = await prisma.transaction.findMany({
      take: 3,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    })

    const recentActivities = recentTransactions.map((transaction) => {
      const firstItem = transaction.items[0]
      const productName = firstItem?.product.name || "未知产品"
      const quantity = transaction.items.reduce((sum, item) => sum + item.quantity, 0)

      return {
        type: transaction.type === "in" ? "入库" : "出库",
        message: `${quantity}件${productName}已${transaction.type === "in" ? "入库" : "出库"}`,
        date: transaction.createdAt.toLocaleString(),
        icon: transaction.type === "in" ? "package" : "arrowUpDown",
      }
    })

    // 获取库存警告
    const alertProducts = await prisma.product.findMany({
      where: {
        OR: [
          {
            inventoryItems: {
              some: {
                quantity: {
                  lte: prisma.product.fields.minQuantity,
                },
              },
            },
          },
          {
            inventoryItems: {
              some: {
                quantity: 0,
              },
            },
          },
        ],
      },
      include: {
        inventoryItems: true,
      },
      take: 2,
    })

    const alerts = alertProducts.map((product) => {
      const totalQuantity = product.inventoryItems.reduce((sum, item) => sum + item.quantity, 0)
      const message = totalQuantity <= 0 ? "缺货" : "库存不足"

      return {
        product: product.name,
        message,
        quantity: totalQuantity,
      }
    })

    // 返回仪表盘数据
    return NextResponse.json({
      totalInventory: totalInventory._sum.quantity || 0,
      monthlyInbound: totalInbound,
      monthlyOutbound: totalOutbound,
      lowStockItems,
      inventoryByCategory,
      inventoryByStatus,
      recentActivities,
      alerts,
    })
  } catch (error) {
    console.error("Error fetching dashboard data:", error)
    return NextResponse.json({ error: "Failed to fetch dashboard data" }, { status: 500 })
  }
}

