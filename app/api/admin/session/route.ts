import { NextResponse } from "next/server";
import { getXSessionStatus } from "../../../lib/kb-data";

// X login session health — powers the admin dashboard session widget.
export async function GET() {
  try {
    return NextResponse.json(getXSessionStatus());
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to read X session" },
      { status: 500 }
    );
  }
}
