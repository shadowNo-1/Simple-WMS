import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const error = searchParams.get("error") || "Unknown error"

  // Return a proper JSON response instead of redirecting
  return NextResponse.json(
    {
      error: error,
      message: getErrorMessage(error),
      status: 401,
    },
    { status: 401 },
  )
}

// Helper function to get user-friendly error messages
function getErrorMessage(errorCode: string): string {
  const errorMessages: Record<string, string> = {
    Configuration: "There is a problem with the server configuration.",
    AccessDenied: "You do not have access to this resource.",
    Verification: "The verification link may have been used or is invalid.",
    CredentialsSignin: "The username or password you entered is incorrect.",
    SessionRequired: "You need to be signed in to access this page.",
    Default: "An unexpected error occurred.",
  }

  return errorMessages[errorCode] || errorMessages.Default
}

