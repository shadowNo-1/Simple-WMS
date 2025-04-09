import { NextResponse } from "next/server"
import prisma from "@/lib/db"

// 获取所有产品
export async function GET() {
  try {
    const products = await prisma.product.findMany({
      include: {
        inventoryItems: true,
      },
    })

    // 处理产品数据，计算总库存等
    const formattedProducts = products.map((product) => {
      const totalQuantity = product.inventoryItems.reduce((sum, item) => sum + item.quantity, 0)
      const status = totalQuantity <= 0 ? "缺货" : totalQuantity <= product.minQuantity ? "低库存" : "正常"

      return {
        id: product.id,
        sku: product.sku,
        name: product.name,
        category: product.category,
        quantity: totalQuantity,
        location: product.inventoryItems[0]?.location || "",
        status,
        description: product.description,
        price: product.price,
        cost: product.cost,
        minQuantity: product.minQuantity,
        barcode: product.barcode,
        weight: product.weight,
        dimensions: product.dimensions,
        supplier: product.supplier,
        imageUrl: product.imageUrl,
      }
    })

    return NextResponse.json(formattedProducts)
  } catch (error) {
    console.error("Error fetching products:", error)
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 })
  }
}

// 创建新产品
export async function POST(request: Request) {
  try {
    const body = await request.json()

    // 创建产品
    const product = await prisma.product.create({
      data: {
        sku: body.sku,
        name: body.name,
        description: body.description,
        category: body.category,
        price: body.price ? Number.parseFloat(body.price) : null,
        cost: body.cost ? Number.parseFloat(body.cost) : null,
        minQuantity: Number.parseInt(body.minQuantity) || 0,
        barcode: body.barcode,
        weight: body.weight,
        dimensions: body.dimensions,
        supplier: body.supplier,
        imageUrl: body.imageUrl,
      },
    })

    // 如果有初始库存，创建库存记录
    if (body.quantity && body.quantity > 0 && body.location) {
      await prisma.inventoryItem.create({
        data: {
          productId: product.id,
          warehouseId: 1, // 默认仓库ID，实际应用中应该从请求中获取
          location: body.location,
          quantity: Number.parseInt(body.quantity),
          status: Number.parseInt(body.quantity) <= Number.parseInt(body.minQuantity) ? "low" : "normal",
        },
      })
    }

    return NextResponse.json(product, { status: 201 })
  } catch (error) {
    console.error("Error creating product:", error)
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 })
  }
}

