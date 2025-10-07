import { client, setTokens } from "../../../auth"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  const url = new URL(req.url)

  // Check for auth errors from the provider
  const error = url.searchParams.get("error")
  const errorDescription = url.searchParams.get("error_description")

  if (error) {
    // Redirect to unauthorized page with error message
    const unauthorizedUrl = new URL("/unauthorized", url.origin)
    unauthorizedUrl.searchParams.set("reason", errorDescription || error)
    return NextResponse.redirect(unauthorizedUrl)
  }

  const code = url.searchParams.get("code")

  if (!code) {
    return NextResponse.redirect(`${url.origin}/unauthorized?reason=Missing authorization code`)
  }

  const exchanged = await client.exchange(code, `${url.origin}/api/auth/callback`)

  if (exchanged.err) {
    const unauthorizedUrl = new URL("/unauthorized", url.origin)
    unauthorizedUrl.searchParams.set("reason", exchanged.err.message || "Authentication failed")
    return NextResponse.redirect(unauthorizedUrl)
  }

  await setTokens(exchanged.tokens.access, exchanged.tokens.refresh)

  return NextResponse.redirect(`${url.origin}/`)
}
