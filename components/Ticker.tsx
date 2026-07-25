const PLATFORMS = [
  "AWS Bedrock Agents", "Salesforce Agentforce", "Microsoft Copilot Studio",
  "Google Gemini 2.0", "LangGraph Orchestration", "MCP Protocol",
  "CrewAI · AutoGen", "Azure AI Foundry", "Anthropic Claude",
];

export default function Ticker() {
  const items = [...PLATFORMS, ...PLATFORMS];
  return (
    <div className="bg-deep border-y border-rule overflow-hidden py-3">
      <div className="flex whitespace-nowrap animate-ticker">
        {items.map((p, i) => (
          <div key={i} className="inline-flex items-center gap-3.5 px-9 font-mono text-[11px] tracking-[0.1em] uppercase text-muted flex-shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-signal" />
            <span className="text-ink">{p}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
