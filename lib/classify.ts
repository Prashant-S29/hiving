// lib/classify.ts
// Step 2 of the Agent Store flow (BUILD_BRIEF.md section 5): classify an incoming
// agent request into estimated tokens, human oversight hours, and expertise tier.
//
// PLACEHOLDER: the brief calls for this classification to be done by a real Claude
// API call. That needs an ANTHROPIC_API_KEY this scaffold doesn't have, so this is a
// deterministic heuristic stand-in — same input/output shape, swappable later.
//
// To wire the real version: call the Anthropic Messages API with promptText, ask it
// to return { estimatedTokens, estimatedHumanHours, expertiseTier, modelUsed } as
// structured output (tool use / JSON mode), and replace the body of this function.
// Everything downstream (lib/pricing-engine.ts, app/api/quote/route.ts) is unchanged.

import type { AgentRequest, ExpertiseTier } from "./pricing-engine";

const COMPLEXITY_KEYWORDS: Record<ExpertiseTier, string[]> = {
  senior: ["multi-agent", "compliance", "regulated", "fine-tune", "production", "integration", "security", "audit"],
  mid: ["workflow", "automation", "dashboard", "pipeline", "scrape", "summarize", "classify"],
  junior: ["simple", "basic", "faq", "chatbot", "single"],
};

export function classifyRequest(promptText: string): AgentRequest {
  const text = promptText.toLowerCase();

  let expertiseTier: ExpertiseTier = "mid";
  if (COMPLEXITY_KEYWORDS.senior.some((kw) => text.includes(kw))) {
    expertiseTier = "senior";
  } else if (COMPLEXITY_KEYWORDS.junior.some((kw) => text.includes(kw))) {
    expertiseTier = "junior";
  }

  // Rough proxy: longer, more detailed requests tend to need more tokens and more
  // oversight. Clamped to the brief's 10-180hr band.
  const wordCount = promptText.trim().split(/\s+/).filter(Boolean).length;
  const estimatedTokens = Math.max(2000, Math.min(500000, wordCount * 400));
  const hourEstimate = { junior: 12, mid: 40, senior: 90 }[expertiseTier];
  const estimatedHumanHours = Math.max(10, Math.min(180, hourEstimate + Math.floor(wordCount / 20)));

  return {
    promptText,
    estimatedTokens,
    estimatedHumanHours,
    expertiseTier,
    modelUsed: "claude-sonnet-5",
  };
}
