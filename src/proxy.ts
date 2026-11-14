// "/" → /az or /en from the browser's first language. Everything else passes through.
import { NextResponse, type NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const first = (request.headers.get("accept-language") ?? "").split(",")[0].trim().toLowerCase();
  return NextResponse.redirect(new URL(first.startsWith("az") ? "/az" : "/en", request.url));
}

export const config = { matcher: ["/"] };
