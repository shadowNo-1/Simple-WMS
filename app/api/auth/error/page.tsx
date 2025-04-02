"use client"

import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"

export default function ApiErrorPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const error = searchParams?.get("error") || "Unknown error"

  useEffect(() => {
    // Redirect to our custom error page
    router.replace(`/auth/signin/error?error=${encodeURIComponent(error)}`)
  }, [error, router])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p>Redirecting to error page...</p>
    </div>
  )
}

