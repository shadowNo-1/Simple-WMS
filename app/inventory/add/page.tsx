"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import DashboardLayout from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Package, ArrowLeft, Save, Upload, Trash } from "lucide-react"
import Link from "next/link"
import { Alert, AlertDescription } from "@/components/ui/alert"

// 模拟产品分类数据
const productCategories = [
  { id: 1, name: "电子产品" },
  { id: 2, name: "办公用品" },
  { id: 3, name: "家具" },
  { id: 4, name: "食品" },
  { id: 5, name: "服装" },
]

// 模拟仓库位置数据
const warehouseLocations = [
  { id: 1, name: "A-01-01", zone: "A区" },
  { id: 2, name: "A-01-02", zone: "A区" },
  { id: 3, name: "A-02-01", zone: "A区" },
  { id: 4, name: "B-01-01", zone: "B区" },
  { id: 5, name: "B-01-02", zone: "B区" },
  { id: 6, name: "C-01-01", zone: "C区" },
]

export default function AddProductPage() {
  const router = useRouter()
  const [isClient, setIsClient] = useState(false)
  const [formData, setFormData] = useState({
    sku: "",
    name: "",
    category: "",
    description: "",
    price: "",
    cost: "",
    quantity: "0",
    minQuantity: "0",
    location: "",
    barcode: "",
    weight: "",
    dimensions: "",
    supplier: "",
  })
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  useEffect(() => {
    setIsClient(true)
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true"
    if (!isLoggedIn) {
      router.push("/login")
    }
  }, [router])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // 清除该字段的错误
    if (formErrors[name]) {
      setFormErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))

    // 清除该字段的错误
    if (formErrors[name]) {
      setFormErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = () => {
    setImagePreview(null)
    // 重置文件输入
    const fileInput = document.getElementById("product-image") as HTMLInputElement
    if (fileInput) {
      fileInput.value = ""
    }
  }

  const validateForm = () => {
    const errors: Record<string, string> = {}

    if (!formData.sku.trim()) {
      errors.sku = "SKU不能为空"
    }

    if (!formData.name.trim()) {
      errors.name = "产品名称不能为空"
    }

    if (!formData.category) {
      errors.category = "请选择产品分类"
    }

    if (formData.price && isNaN(Number(formData.price))) {
      errors.price = "价格必须是数字"
    }

    if (formData.cost && isNaN(Number(formData.cost))) {
      errors.cost = "成本必须是数字"
    }

    if (isNaN(Number(formData.quantity))) {
      errors.quantity = "数量必须是数字"
    }

    if (isNaN(Number(formData.minQuantity))) {
      errors.minQuantity = "最小库存量必须是数字"
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    // 模拟API请求
    setTimeout(() => {
      console.log("提交的产品数据:", formData)
      console.log("产品图片:", imagePreview ? "已上传" : "无")

      // 保存产品数据到本地存储
      try {
        // 获取现有产品列表
        const existingProductsJSON = localStorage.getItem("inventoryProducts")
        const existingProducts = existingProductsJSON ? JSON.parse(existingProductsJSON) : []

        // 添加新产品
        const newProduct = {
          id: Date.now(), // 使用时间戳作为临时ID
          sku: formData.sku,
          name: formData.name,
          category: formData.category,
          quantity: Number.parseInt(formData.quantity) || 0,
          location: formData.location,
          status: Number.parseInt(formData.quantity) > 0 ? "正常" : "缺货",
          description: formData.description,
          price: formData.price,
          cost: formData.cost,
          minQuantity: Number.parseInt(formData.minQuantity) || 0,
          barcode: formData.barcode,
          weight: formData.weight,
          dimensions: formData.dimensions,
          supplier: formData.supplier,
          imageUrl: imagePreview,
        }

        existingProducts.push(newProduct)

        // 保存回本地存储
        localStorage.setItem("inventoryProducts", JSON.stringify(existingProducts))
      } catch (error) {
        console.error("保存产品数据失败:", error)
      }

      // 显示成功消息
      setSubmitSuccess(true)
      setIsSubmitting(false)

      // 3秒后重置表单或跳转
      setTimeout(() => {
        // 可以选择重置表单
        // setFormData({...初始状态});
        // setImagePreview(null);
        // setSubmitSuccess(false);

        // 或者跳转到产品列表
        router.push("/inventory")
      }, 2000)
    }, 1000)
  }

  if (!isClient) {
    return null // Prevent hydration errors
  }

  return (
    <DashboardLayout>
      <div className="p-4 md:p-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">添加新产品</h1>
            <p className="text-muted-foreground">创建新的产品并添加到库存中</p>
          </div>
          <div className="flex gap-2 mt-4 md:mt-0">
            <Link href="/inventory">
              <Button variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                返回库存
              </Button>
            </Link>
          </div>
        </div>

        {submitSuccess && (
          <Alert className="mb-6 bg-green-50 border-green-200">
            <AlertDescription className="text-green-600">产品添加成功！正在返回库存列表...</AlertDescription>
          </Alert>
        )}

        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>产品信息</CardTitle>
                <CardDescription>填写产品的基本信息</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="sku">
                        SKU <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="sku"
                        name="sku"
                        placeholder="输入产品SKU"
                        value={formData.sku}
                        onChange={handleInputChange}
                        className={formErrors.sku ? "border-red-500" : ""}
                      />
                      {formErrors.sku && <p className="text-sm text-red-500">{formErrors.sku}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="name">
                        产品名称 <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="name"
                        name="name"
                        placeholder="输入产品名称"
                        value={formData.name}
                        onChange={handleInputChange}
                        className={formErrors.name ? "border-red-500" : ""}
                      />
                      {formErrors.name && <p className="text-sm text-red-500">{formErrors.name}</p>}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">
                      产品分类 <span className="text-red-500">*</span>
                    </Label>
                    <Select value={formData.category} onValueChange={(value) => handleSelectChange("category", value)}>
                      <SelectTrigger id="category" className={formErrors.category ? "border-red-500" : ""}>
                        <SelectValue placeholder="选择产品分类" />
                      </SelectTrigger>
                      <SelectContent>
                        {productCategories.map((category) => (
                          <SelectItem key={category.id} value={category.name}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {formErrors.category && <p className="text-sm text-red-500">{formErrors.category}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">产品描述</Label>
                    <Textarea
                      id="description"
                      name="description"
                      placeholder="输入产品描述"
                      rows={3}
                      value={formData.description}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="price">销售价格</Label>
                      <Input
                        id="price"
                        name="price"
                        placeholder="输入销售价格"
                        value={formData.price}
                        onChange={handleInputChange}
                        className={formErrors.price ? "border-red-500" : ""}
                      />
                      {formErrors.price && <p className="text-sm text-red-500">{formErrors.price}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="cost">成本价格</Label>
                      <Input
                        id="cost"
                        name="cost"
                        placeholder="输入成本价格"
                        value={formData.cost}
                        onChange={handleInputChange}
                        className={formErrors.cost ? "border-red-500" : ""}
                      />
                      {formErrors.cost && <p className="text-sm text-red-500">{formErrors.cost}</p>}
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="quantity">初始库存数量</Label>
                      <Input
                        id="quantity"
                        name="quantity"
                        type="number"
                        min="0"
                        placeholder="输入初始库存数量"
                        value={formData.quantity}
                        onChange={handleInputChange}
                        className={formErrors.quantity ? "border-red-500" : ""}
                      />
                      {formErrors.quantity && <p className="text-sm text-red-500">{formErrors.quantity}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="minQuantity">最小库存量</Label>
                      <Input
                        id="minQuantity"
                        name="minQuantity"
                        type="number"
                        min="0"
                        placeholder="输入最小库存量"
                        value={formData.minQuantity}
                        onChange={handleInputChange}
                        className={formErrors.minQuantity ? "border-red-500" : ""}
                      />
                      {formErrors.minQuantity && <p className="text-sm text-red-500">{formErrors.minQuantity}</p>}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">库位</Label>
                    <Select value={formData.location} onValueChange={(value) => handleSelectChange("location", value)}>
                      <SelectTrigger id="location">
                        <SelectValue placeholder="选择库位" />
                      </SelectTrigger>
                      <SelectContent>
                        {warehouseLocations.map((location) => (
                          <SelectItem key={location.id} value={location.name}>
                            {location.name} ({location.zone})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="barcode">条形码</Label>
                    <Input
                      id="barcode"
                      name="barcode"
                      placeholder="输入产品条形码"
                      value={formData.barcode}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="weight">重量 (kg)</Label>
                      <Input
                        id="weight"
                        name="weight"
                        placeholder="输入产品重量"
                        value={formData.weight}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="dimensions">尺寸 (长x宽x高)</Label>
                      <Input
                        id="dimensions"
                        name="dimensions"
                        placeholder="例如: 10x5x2 cm"
                        value={formData.dimensions}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="supplier">供应商</Label>
                    <Input
                      id="supplier"
                      name="supplier"
                      placeholder="输入供应商名称"
                      value={formData.supplier}
                      onChange={handleInputChange}
                    />
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>产品图片</CardTitle>
                <CardDescription>上传产品图片</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {imagePreview ? (
                    <div className="relative">
                      <img
                        src={imagePreview || "/placeholder.svg"}
                        alt="产品预览"
                        className="w-full h-48 object-contain border rounded-md"
                      />
                      <Button
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2"
                        onClick={removeImage}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="border border-dashed rounded-md p-6 flex flex-col items-center justify-center h-48">
                      <Package className="h-10 w-10 text-gray-300 mb-2" />
                      <p className="text-sm text-muted-foreground mb-2">点击或拖拽上传产品图片</p>
                      <Input
                        id="product-image"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageChange}
                      />
                      <Label htmlFor="product-image" className="cursor-pointer">
                        <Button variant="outline" type="button">
                          <Upload className="mr-2 h-4 w-4" />
                          选择图片
                        </Button>
                      </Label>
                    </div>
                  )}

                  <div className="text-sm text-muted-foreground">
                    <p>支持的格式: JPG, PNG, GIF</p>
                    <p>最大文件大小: 5MB</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" onClick={handleSubmit} disabled={isSubmitting}>
                  {isSubmitting ? (
                    <span className="flex items-center">
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      保存中...
                    </span>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      保存产品
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

