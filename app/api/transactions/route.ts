import { NextResponse } from "next/server"
import prisma from "@/lib/db"

// 获取所有交易
export async function GET() {
  try {
    const transactions = await prisma.transaction.findMany({
      include: {
        items: {
          include: {
            product: true,
          },
        },
        user: {
          select: {
            name: true,
            username: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json(transactions)
  } catch (error) {
    console.error("Error fetching transactions:", error)
    return NextResponse.json({ error: "Failed to fetch transactions" }, { status: 500 })
  }
}

// 创建新交易（入库/出库）
export async function POST(request: Request) {
  try {
    const body = await request.json()

    // 开始事务，确保数据一致性
    const result = await prisma.$transaction(async (tx) => {
      // 1. 创建交易记录
      const transaction = await tx.transaction.create({
        data: {
          type: body.type, // "in" 或 "out"
          reference: body.reference,
          source: body.source,
          notes: body.notes,
          documentId: body.documentId,
          createdBy: body.userId || null,
        },
      })

      // 2. 创建交易项目并更新库存
      for (const item of body.items) {
        // 创建交易项目
        await tx.transactionItem.create({
          data: {
            transactionId: transaction.id,
            productId: item.id,
            quantity: item.quantity,
            location: item.location,
            productionDate: item.productionDate ? new Date(item.productionDate) : null,
            expiryDate: item.expiryDate ? new Date(item.expiryDate) : null,
          },
        })

        // 查找现有库存
        const inventoryItem = await tx.inventoryItem.findFirst({
          where: {
            productId: item.id,
            location: item.location,
            warehouseId: 1, // 默认仓库ID
          },
        })

        if (inventoryItem) {
          // 更新现有库存
          const newQuantity =
            body.type === "in" ? inventoryItem.quantity + item.quantity : inventoryItem.quantity - item.quantity

          // 确保出库不会导致负库存
          if (body.type === "out" && newQuantity < 0) {
            throw new Error(`库存不足: ${item.name}`)
          }

          // 更新库存数量和状态
          await tx.inventoryItem.update({
            where: { id: inventoryItem.id },
            data: {
              quantity: newQuantity,
              status: await getInventoryStatus(tx, item.id, newQuantity),
            },
          })
        } else if (body.type === "in") {
          // 如果是入库且库存不存在，创建新库存记录
          await tx.inventoryItem.create({
            data: {
              productId: item.id,
              warehouseId: 1, // 默认仓库ID
              location: item.location,
              quantity: item.quantity,
              status: await getInventoryStatus(tx, item.id, item.quantity),
            },
          })
        } else {
          // 如果是出库且库存不存在，抛出错误
          throw new Error(`库存不存在: ${item.name}`)
        }
      }

      return transaction
    })

    return NextResponse.json(result, { status: 201 })
  } catch (error) {
    console.error("Error creating transaction:", error)
    return NextResponse.json({ error: error.message || "Failed to create transaction" }, { status: 500 })
  }
}

// 辅助函数：根据产品ID和数量确定库存状态
async function getInventoryStatus(tx, productId, quantity) {
  const product = await tx.product.findUnique({
    where: { id: productId },
  })

  if (!product) return "normal"

  if (quantity <= 0) return "out_of_stock"
  if (quantity <= product.minQuantity) return "low"
  return "normal"
}

