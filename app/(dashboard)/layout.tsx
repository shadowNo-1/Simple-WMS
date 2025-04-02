import type { ReactNode } from "react"
import { Sidebar } from "@/components/dashboard/sidebar"
import { Header } from "@/components/dashboard/header"
import { DashboardAuthGuard } from "@/components/dashboard/auth-guard"
import { DatabaseProvider } from "@/lib/db"

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <DashboardAuthGuard>
      <DatabaseProvider>
        <div className="flex min-h-screen flex-col">
          <Header />
          <div className="flex flex-1">
            <Sidebar />
            <main className="flex-1 overflow-auto p-6">{children}</main>
          </div>
        </div>
      </DatabaseProvider>
    </DashboardAuthGuard>
  )
}

