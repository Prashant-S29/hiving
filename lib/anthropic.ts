// lib/anthropic.ts
// Thin wrapper around the Anthropic SDK client. Reads ANTHROPIC_API_KEY from the
// environment — set it in .env.local (see .env.local.example), never commit it.

import Anthropic from "@anthropic-ai/sdk";

let client: Anthropic | null = null;

export function getAnthropicClient(): Anthropic {
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error(
      "ANTHROPIC_API_KEY is not configured. Add it to hivig-race/.env.local (see .env.local.example) and restart the dev server."
    );
  }
  if (!client) {
    client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  }
  return client;
}

export const FEASIBILITY_MODEL = "claude-sonnet-5";
