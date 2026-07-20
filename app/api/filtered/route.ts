import { NextResponse } from "next/server";
import { getFilteredTweetsData } from "../../lib/runs-tokens-data";

export async function GET() {
  try {
    return NextResponse.json(getFilteredTweetsData());
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
