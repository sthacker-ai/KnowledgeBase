import { NextResponse } from "next/server";
import { getTokensData } from "../../lib/runs-tokens-data";

export const dynamic = "force-dynamic";

export async function GET() {
  const data = await getTokensData();
  return NextResponse.json(data);
}
