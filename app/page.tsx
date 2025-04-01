import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Icons } from "@/components/icons"
import Link from "next/link"

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">简易 WMS 系统</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>库存管理</CardTitle>
            <CardDescription>查看和管理仓库中的所有物品</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" variant="outline" asChild>
              <Link href="/inventory">
                <Icons.inventory className="mr-2 h-4 w-4" />
                库存列表
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>出入库操作</CardTitle>
            <CardDescription>处理物品的入库和出库</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col space-y-2">
            <Button className="w-full" variant="outline" asChild>
              <Link href="/inventory/in">
                <Icons.arrowDown className="mr-2 h-4 w-4" />
                入库
              </Link>
            </Button>
            <Button className="w-full" variant="outline" asChild>
              <Link href="/inventory/out">
                <Icons.arrowUp className="mr-2 h-4 w-4" />
                出库
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>条码管理</CardTitle>
            <CardDescription>生成和扫描条形码/二维码</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col space-y-2">
            <Button className="w-full" variant="outline" asChild>
              <Link href="/barcodes/generate">
                <Icons.barcode className="mr-2 h-4 w-4" />
                生成条码
              </Link>
            </Button>
            <Button className="w-full" variant="outline" asChild>
              <Link href="/barcodes/scan">
                <Icons.scan className="mr-2 h-4 w-4" />
                扫描条码
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>库存盘点</CardTitle>
            <CardDescription>进行库存盘点并生成报表</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" variant="outline" asChild>
              <Link href="/inventory/count">
                <Icons.clipboard className="mr-2 h-4 w-4" />
                盘点管理
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>系统设置</CardTitle>
            <CardDescription>配置系统参数</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" variant="outline" asChild>
              <Link href="/settings">
                <Icons.settings className="mr-2 h-4 w-4" />
                设置
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>插件管理</CardTitle>
            <CardDescription>管理系统插件</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" variant="outline" asChild>
              <Link href="/plugins">
                <Icons.plugins className="mr-2 h-4 w-4" />
                插件
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

