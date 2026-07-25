import { NextRequest, NextResponse } from "next/server";
import { generateFeasibilityStudy } from "@/lib/feasibility";
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

  let study;
  try {
    study = await generateFeasibilityStudy(promptText);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    const isConfigError = message.includes("ANTHROPIC_API_KEY");
    return NextResponse.json(
      { error: isConfigError ? message : "The feasibility model call failed. Try again." },
      { status: isConfigError ? 500 : 502 }
    );
  }

  const quote = computeQuote(study.request, geoRegion);

  return NextResponse.json({ study, quote });
}
