"use client"

import { useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { useToast } from "@/components/ui/use-toast"

export default function ErrorPage() {
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const error = searchParams?.get("error") || "Unknown error"

  // Map error codes to user-friendly messages
  const errorMessages: Record<string, string> = {
    Configuration: "There is a problem with the server configuration.",
    AccessDenied: "You do not have access to this resource.",
    Verification: "The verification link may have been used or is invalid.",
    Default: "An unexpected error occurred.",
    CredentialsSignin: "The username or password you entered is incorrect.",
    SessionRequired: "You need to be signed in to access this page.",
  }

  const errorMessage = errorMessages[error] || errorMessages.Default

  // Show toast notification when the page loads
  useEffect(() => {
    toast({
      title: "Authentication Error",
      description: errorMessage,
      variant: "destructive",
    })
  }, [errorMessage, toast])

  return (
    <div className="flex items-center justify-center min-h-screen px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl text-destructive">Authentication Error</CardTitle>
          <CardDescription>{errorMessage}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground">
            <p>Error code: {error}</p>
            <p className="mt-2">Please try again or contact support if the problem persists.</p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button asChild>
            <Link href="/auth/login">Return to Login</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

