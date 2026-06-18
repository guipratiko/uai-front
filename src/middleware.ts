import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/** O site não usa Server Actions — rejeita POSTs de probe (bots / deploy antigo). */
export function middleware(request: NextRequest) {
  if (request.method === "POST" && request.headers.has("next-action")) {
    return new NextResponse(null, { status: 404 });
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|img/|health).*)"],
};
