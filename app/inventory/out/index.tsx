"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function InventoryOutIndexPage() {
  const router = useRouter()

  useEffect(() => {
    router.push("/inventory/out/page")
  }, [router])

  return null
}

