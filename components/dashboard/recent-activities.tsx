"use client"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useDb } from "@/lib/db"
import { formatDistanceToNow } from "date-fns"
import { zhCN, enUS } from "date-fns/locale"
import { useLanguage } from "@/lib/i18n"

export function RecentActivities() {
  const { getRecentActivities } = useDb()
  const { language } = useLanguage()
  const activities = getRecentActivities(5)

  const getLocale = () => {
    return language === "zh" ? zhCN : enUS
  }

  const formatTime = (date: Date) => {
    return formatDistanceToNow(date, { addSuffix: true, locale: getLocale() })
  }

  return (
    <div className="space-y-4">
      {activities.length === 0 ? (
        <div className="text-center py-4 text-muted-foreground">暂无活动记录</div>
      ) : (
        activities.map((activity) => (
          <div key={activity.id} className="flex items-center gap-4">
            <Avatar className="h-9 w-9">
              <AvatarFallback className="bg-primary/10 text-primary">{activity.userName.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium leading-none">{activity.userName}</p>
                <Badge
                  variant={
                    activity.type === "入库" ? "default" : activity.type === "出库" ? "destructive" : "secondary"
                  }
                  className="rounded-sm px-1 py-0 text-xs"
                >
                  {activity.type}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                {activity.productName} × {activity.quantity}
              </p>
            </div>
            <div className="text-xs text-muted-foreground">{formatTime(activity.createdAt)}</div>
          </div>
        ))
      )}
    </div>
  )
}

