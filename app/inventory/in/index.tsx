"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function InventoryInIndexPage() {
  const router = useRouter()

  useEffect(() => {
    router.push("/inventory/in/page")
  }, [router])

  return null
}

