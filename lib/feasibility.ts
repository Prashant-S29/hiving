// lib/feasibility.ts
// Real Claude API call: given a plain-language agent request, produce an honest
// feasibility verdict plus the same estimate shape lib/pricing-engine.ts needs
// (estimatedTokens, estimatedHumanHours, expertiseTier). This is the "GPT AI"
// piece behind /agents/discover — replaces lib/classify.ts's heuristic for that
// flow with a real model call.

import { getAnthropicClient, FEASIBILITY_MODEL } from "./anthropic";
import type { AgentRequest, ExpertiseTier } from "./pricing-engine";

export type FeasibilityVerdict = "feasible" | "feasible_with_caveats" | "not_feasible";

export interface FeasibilityStudy {
  agentName: string;
  feasibility: FeasibilityVerdict;
  verdictSummary: string;
  capabilities: string[];
  risks: string[];
  assumptions: string[];
  request: AgentRequest;
}

const SYSTEM_PROMPT = `You are the feasibility analyst for Hivig's Agent Store, a marketplace where users describe an AI agent and get it built. Given a user's plain-language request, assess it honestly — do not always say it's feasible. Flag real risks (unclear scope, integrations that may not exist, data you'd need but the user hasn't provided, legal/compliance concerns) and state assumptions you had to make. Estimate build effort conservatively: estimatedHumanHours must be between 10 and 180. Call the submit_feasibility_study tool with your assessment — do not respond in plain text.`;

const TOOL_NAME = "submit_feasibility_study";

const TOOL_SCHEMA = {
  name: TOOL_NAME,
  description: "Submit a structured feasibility study for a requested AI agent build.",
  input_schema: {
    type: "object" as const,
    properties: {
      agentName: { type: "string", description: "A short, concrete product name for this agent, e.g. 'Support Triage Agent'." },
      feasibility: { type: "string", enum: ["feasible", "feasible_with_caveats", "not_feasible"] },
      verdictSummary: { type: "string", description: "1-2 sentence plain-language verdict." },
      capabilities: { type: "array", items: { type: "string" }, description: "3-6 concrete things this agent would do." },
      risks: { type: "array", items: { type: "string" }, description: "Real risks or open questions, can be empty." },
      assumptions: { type: "array", items: { type: "string" }, description: "Assumptions made to scope this, can be empty." },
      estimatedTokens: { type: "integer", minimum: 500 },
      estimatedHumanHours: { type: "integer", minimum: 10, maximum: 180 },
      expertiseTier: { type: "string", enum: ["junior", "mid", "senior"] },
    },
    required: [
      "agentName", "feasibility", "verdictSummary", "capabilities", "risks",
      "assumptions", "estimatedTokens", "estimatedHumanHours", "expertiseTier",
    ],
  },
};

interface ToolResult {
  agentName: string;
  feasibility: FeasibilityVerdict;
  verdictSummary: string;
  capabilities: string[];
  risks: string[];
  assumptions: string[];
  estimatedTokens: number;
  estimatedHumanHours: number;
  expertiseTier: ExpertiseTier;
}

export async function generateFeasibilityStudy(promptText: string): Promise<FeasibilityStudy> {
  const client = getAnthropicClient();

  const message = await client.messages.create({
    model: FEASIBILITY_MODEL,
    max_tokens: 1024,
    temperature: 0.3,
    system: SYSTEM_PROMPT,
    tools: [TOOL_SCHEMA],
    tool_choice: { type: "tool", name: TOOL_NAME },
    messages: [{ role: "user", content: promptText }],
  });

  const toolUse = message.content.find(
    (block): block is Extract<typeof block, { type: "tool_use" }> => block.type === "tool_use"
  );

  if (!toolUse) {
    throw new Error("The model did not return a structured feasibility study.");
  }

  const result = toolUse.input as ToolResult;

  return {
    agentName: result.agentName,
    feasibility: result.feasibility,
    verdictSummary: result.verdictSummary,
    capabilities: result.capabilities,
    risks: result.risks,
    assumptions: result.assumptions,
    request: {
      promptText,
      estimatedTokens: result.estimatedTokens,
      estimatedHumanHours: result.estimatedHumanHours,
      expertiseTier: result.expertiseTier,
      modelUsed: FEASIBILITY_MODEL,
    },
  };
}
