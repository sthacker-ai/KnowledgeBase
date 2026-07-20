import { NextResponse } from "next/server";
import { getRunsData } from "../../lib/runs-tokens-data";

export const dynamic = "force-dynamic";

export async function GET() {
  const runs = await getRunsData();
  return NextResponse.json({ runs });
}
