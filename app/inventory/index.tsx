"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function InventoryIndexPage() {
  const router = useRouter()

  useEffect(() => {
    router.push("/inventory/page")
  }, [router])

  return null
}

