import type { ReactNode } from "react"
import { Sidebar } from "@/components/dashboard/sidebar"

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-full">
      <Sidebar />
      <div className="flex-1 overflow-auto p-6">{children}</div>
    </div>
  )
}

