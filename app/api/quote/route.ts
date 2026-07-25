import { NextRequest, NextResponse } from "next/server";
import { classifyRequest } from "@/lib/classify";
import { computeQuote } from "@/lib/pricing-engine";
import { resolveRegionFromRequest } from "@/lib/geo";

export async function POST(req: NextRequest) {
  let body: { promptText?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Request body must be JSON." }, { status: 400 });
  }

  const promptText = typeof body.promptText === "string" ? body.promptText.trim() : "";
  if (!promptText || promptText.length < 10) {
    return NextResponse.json(
      { error: "promptText is required and must describe the agent in at least 10 characters." },
      { status: 400 }
    );
  }

  const geoRegion = resolveRegionFromRequest(req);
  const classified = classifyRequest(promptText);
  const quote = computeQuote(classified, geoRegion);

  return NextResponse.json(quote);
}
