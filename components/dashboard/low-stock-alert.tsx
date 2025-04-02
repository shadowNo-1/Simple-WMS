"use client"

import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Icons } from "@/components/icons"
import { useDb } from "@/lib/db"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/lib/auth-context"

export function LowStockAlert() {
  const { getLowStockProducts, stockIn } = useDb()
  const { user } = useAuth()
  const { toast } = useToast()
  const lowStockItems = getLowStockProducts()

  const handleStockIn = (productId: string) => {
    if (!user) return

    // 默认入库数量为 5
    const result = stockIn(productId, 5, user.id, user.name)

    if (result) {
      toast({
        title: "入库成功",
        description: `已为 ${result.productName} 添加 5 个库存`,
      })
    }
  }

  return (
    <div className="space-y-4">
      {lowStockItems.length === 0 ? (
        <div className="text-center py-4 text-muted-foreground">没有低库存产品</div>
      ) : (
        lowStockItems.map((item) => {
          const percentage = item.threshold ? (item.quantity / item.threshold) * 100 : 0

          return (
            <div key={item.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">{item.name}</p>
                  <p className="text-xs text-muted-foreground">{item.code}</p>
                </div>
                <div className="text-sm font-medium">
                  {item.quantity}/{item.threshold}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Progress value={percentage} className="h-2" />
                <Button size="sm" variant="outline" className="h-8 w-8 p-0" onClick={() => handleStockIn(item.id)}>
                  <Icons.arrowDown className="h-4 w-4" />
                  <span className="sr-only">入库</span>
                </Button>
              </div>
            </div>
          )
        })
      )}
    </div>
  )
}

