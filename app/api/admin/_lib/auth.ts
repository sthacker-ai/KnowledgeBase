import { NextRequest, NextResponse } from "next/server";

export function requireAdmin(req: NextRequest): NextResponse | null {
  const expected = (process.env.KB_ADMIN_TOKEN || process.env.ADMIN_TOKEN || "").trim();
  if (!expected) return null;

  const supplied =
    req.headers.get("x-kb-admin-token") ||
    req.nextUrl.searchParams.get("admin_token") ||
    "";

  if (supplied === expected) return null;

  return NextResponse.json(
    { error: "Unauthorized. Set x-kb-admin-token or admin_token." },
    { status: 401 },
  );
}
