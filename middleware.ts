import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * The admin console and every /api/admin/* route are local-only tools — they
 * spawn Playwright/Python pipeline scripts and edit local files that don't
 * exist on a serverless host. `KB_ADMIN_TOKEN` gates the API routes, but the
 * page itself was still publicly browsable, showing internal config (AI
 * prompts, relevance filters) to any visitor.
 *
 * Vercel sets the VERCEL env var on every deployment it runs; a plain
 * `npm run dev`/`npm start` never has it. That's the switch: block the whole
 * admin surface with a 404 when hosted, leave it fully working locally.
 */
export function middleware(request: NextRequest) {
  if (process.env.VERCEL) {
    return new NextResponse("Not Found", { status: 404 });
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/:path*", "/api/admin/:path*"],
};
