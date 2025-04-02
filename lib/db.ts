"use client"

// 模拟数据库连接和操作
// 在实际应用中，这里会使用真实的数据库连接，如 Prisma, Supabase, MongoDB 等

import { useState, useEffect } from "react"

// 模拟产品数据
export type Product = {
  id: string
  code: string
  name: string
  category: string
  quantity: number
  threshold?: number
  createdAt: Date
  updatedAt: Date
}

// 模拟活动记录
export type Activity = {
  id: string
  type: "入库" | "出库" | "盘点"
  productId: string
  productName: string
  quantity: number
  userId: string
  userName: string
  createdAt: Date
}

// 初始产品数据
const initialProducts: Product[] = [
  {
    id: "1",
    code: "P001",
    name: "笔记本电脑",
    category: "电子产品",
    quantity: 25,
    threshold: 10,
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(),
  },
  {
    id: "2",
    code: "P002",
    name: "办公桌",
    category: "家具",
    quantity: 10,
    threshold: 5,
    createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(),
  },
  {
    id: "3",
    code: "P003",
    name: "打印机",
    category: "办公设备",
    quantity: 5,
    threshold: 3,
    createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(),
  },
  {
    id: "4",
    code: "P004",
    name: "手机",
    category: "电子产品",
    quantity: 50,
    threshold: 15,
    createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(),
  },
  {
    id: "5",
    code: "P005",
    name: "键盘",
    category: "电子产品",
    quantity: 30,
    threshold: 10,
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(),
  },
]

// 初始活动数据
const initialActivities: Activity[] = [
  {
    id: "1",
    type: "入库",
    productId: "1",
    productName: "笔记本电脑",
    quantity: 5,
    userId: "1",
    userName: "张三",
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
  },
  {
    id: "2",
    type: "出库",
    productId: "2",
    productName: "办公桌",
    quantity: 2,
    userId: "2",
    userName: "李四",
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
  },
  {
    id: "3",
    type: "盘点",
    productId: "3",
    productName: "打印机",
    quantity: 3,
    userId: "3",
    userName: "王五",
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
  },
  {
    id: "4",
    type: "入库",
    productId: "4",
    productName: "手机",
    quantity: 10,
    userId: "4",
    userName: "赵六",
    createdAt: new Date(Date.now() - 36 * 60 * 60 * 1000),
  },
  {
    id: "5",
    type: "出库",
    productId: "5",
    productName: "键盘",
    quantity: 8,
    userId: "1",
    userName: "张三",
    createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000),
  },
]

// 模拟本地存储
const localStorageKey = "wms_data"

// 保存数据到本地存储
const saveToLocalStorage = (products: Product[], activities: Activity[]) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(localStorageKey, JSON.stringify({ products, activities }))
  }
}

// 从本地存储加载数据
const loadFromLocalStorage = (): { products: Product[]; activities: Activity[] } => {
  if (typeof window !== "undefined") {
    const data = localStorage.getItem(localStorageKey)
    if (data) {
      try {
        const parsed = JSON.parse(data)
        // 转换日期字符串为 Date 对象
        const products = parsed.products.map((p: any) => ({
          ...p,
          createdAt: new Date(p.createdAt),
          updatedAt: new Date(p.updatedAt),
        }))
        const activities = parsed.activities.map((a: any) => ({
          ...a,
          createdAt: new Date(a.createdAt),
        }))
        return { products, activities }
      } catch (error) {
        console.error("Failed to parse stored data:", error)
      }
    }
  }
  return { products: initialProducts, activities: initialActivities }
}

// 使用本地存储的数据库钩子
export const useDatabase = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [activities, setActivities] = useState<Activity[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // 初始化数据
  useEffect(() => {
    const { products, activities } = loadFromLocalStorage()
    setProducts(products)
    setActivities(activities)
    setIsLoading(false)
  }, [])

  // 当数据变化时保存到本地存储
  useEffect(() => {
    if (!isLoading) {
      saveToLocalStorage(products, activities)
    }
  }, [products, activities, isLoading])

  // 获取所有产品
  const getAllProducts = () => products

  // 获取单个产品
  const getProductById = (id: string) => products.find((p) => p.id === id)

  // 添加产品
  const addProduct = (product: Omit<Product, "id" | "createdAt" | "updatedAt">) => {
    const newProduct: Product = {
      ...product,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    setProducts([...products, newProduct])
    return newProduct
  }

  // 更新产品
  const updateProduct = (id: string, data: Partial<Omit<Product, "id" | "createdAt" | "updatedAt">>) => {
    const updatedProducts = products.map((p) =>
      p.id === id
        ? {
            ...p,
            ...data,
            updatedAt: new Date(),
          }
        : p,
    )
    setProducts(updatedProducts)
    return updatedProducts.find((p) => p.id === id)
  }

  // 删除产品
  const deleteProduct = (id: string) => {
    setProducts(products.filter((p) => p.id !== id))
  }

  // 入库操作
  const stockIn = (productId: string, quantity: number, userId: string, userName: string) => {
    const product = products.find((p) => p.id === productId)
    if (!product) return null

    // 更新产品数量
    updateProduct(productId, { quantity: product.quantity + quantity })

    // 添加活动记录
    const activity: Activity = {
      id: Date.now().toString(),
      type: "入库",
      productId,
      productName: product.name,
      quantity,
      userId,
      userName,
      createdAt: new Date(),
    }
    setActivities([activity, ...activities])
    return activity
  }

  // 出库操作
  const stockOut = (productId: string, quantity: number, userId: string, userName: string) => {
    const product = products.find((p) => p.id === productId)
    if (!product) return null

    // 更新产品数量
    updateProduct(productId, { quantity: Math.max(0, product.quantity - quantity) })

    // 添加活动记录
    const activity: Activity = {
      id: Date.now().toString(),
      type: "出库",
      productId,
      productName: product.name,
      quantity,
      userId,
      userName,
      createdAt: new Date(),
    }
    setActivities([activity, ...activities])
    return activity
  }

  // 获取所有活动
  const getAllActivities = () => activities

  // 获取最近的活动
  const getRecentActivities = (limit = 5) => activities.slice(0, limit)

  // 获取低库存产品
  const getLowStockProducts = () => products.filter((p) => p.threshold && p.quantity <= p.threshold)

  return {
    isLoading,
    products,
    activities,
    getAllProducts,
    getProductById,
    addProduct,
    updateProduct,
    deleteProduct,
    stockIn,
    stockOut,
    getAllActivities,
    getRecentActivities,
    getLowStockProducts,
  }
}

// 创建数据库上下文
import { createContext, useContext, type ReactNode } from "react"

type DatabaseContextType = ReturnType<typeof useDatabase>

const DatabaseContext = createContext<DatabaseContextType | null>(null)

export const DatabaseProvider = ({ children }: { children: ReactNode }) => {
  const db = useDatabase()
  return <DatabaseContext.Provider value={db}>{children}</DatabaseContext.Provider>
}

export const useDb = () => {
  const context = useContext(DatabaseContext)
  if (!context) {
    throw new Error("useDb must be used within a DatabaseProvider")
  }
  return context
}

