import type { ArticleBodyBlock } from "@/lib/types";

// Portable Text body for the "aws-bedrock-multi-agent-orchestration" article.
// Hand-converted from the source markdown (Intel/aws-bedrock-multi-agent-orchestration.md)
// since this repo has no MDX pipeline — articles render via @portabletext/react
// (see lib/portableTextComponents.tsx). Kept in its own file rather than inlined
// into lib/mockArticles.ts purely for readability of that file; not a schema change.
//
// This mock body is a stand-in for what should eventually be entered directly
// into Sanity Studio's rich text editor (see HANDOFF.md Day 2) — at that point
// images get uploaded as real Sanity assets instead of the local `src` shape
// used here, which portableTextComponents.tsx's image renderer supports
// specifically for this local/mock case.

const link = (key: string, href: string) => ({ _key: key, _type: "link", href });

export const awsBedrockMultiAgentOrchestrationBody: ArticleBodyBlock[] = [
  {
    _type: "block",
    _key: "b1",
    style: "blockquote",
    children: [
      { _type: "span", _key: "b1a", text: "In short:", marks: ["strong"] },
      { _type: "span", _key: "b1b", text: " AWS Bedrock's multi-agent orchestration lets one ", marks: [] },
      { _type: "span", _key: "b1c", text: "supervisor agent", marks: ["strong"] },
      { _type: "span", _key: "b1d", text: " classify a request and route it to specialized ", marks: [] },
      { _type: "span", _key: "b1e", text: "sub-agents", marks: ["strong"] },
      {
        _type: "span",
        _key: "b1f",
        text: ", each with its own tools, data access, and model — all inside a single AWS account, under one IAM and compliance boundary. It fits teams that are already on AWS, need SOC 2/HIPAA-eligible infrastructure without building it themselves, and want to run agents built in Bedrock's native tooling ",
        marks: [],
      },
      { _type: "span", _key: "b1g", text: "or", marks: ["em"] },
      {
        _type: "span",
        _key: "b1h",
        text: " in LangGraph, CrewAI, AutoGen, or Strands side by side. It is not the right fit if you're multi-cloud by design, want to avoid per-token vendor pricing entirely, or need capabilities only a specific frontier lab ships first.",
        marks: [],
      },
    ],
    markDefs: [],
  },
  {
    _type: "block",
    _key: "b2",
    style: "normal",
    children: [
      { _type: "span", _key: "b2a", text: "Enterprise interest in agentic AI has moved past demos. What's less discussed is ", marks: [] },
      { _type: "span", _key: "b2b", text: "which platform", marks: ["em"] },
      {
        _type: "span",
        _key: "b2c",
        text: " that shift is consolidating around — and why the answer, for a large and growing share of enterprises, is Bedrock. Not because it's the most novel agent framework (it isn't) but because of something duller and more durable: it's the option that lets a platform team stop rebuilding the same undifferentiated plumbing — session state, guardrails, IAM, observability — for every new agent a business unit asks for.",
        marks: [],
      },
    ],
    markDefs: [],
  },
  {
    _type: "block",
    _key: "b3",
    style: "normal",
    children: [
      {
        _type: "span",
        _key: "b3a",
        text: "This piece covers four things, in order: what the orchestration model actually is, why the timing is forced right now, what it costs, and exactly how to put a working multi-agent system in front of yourself this week — with real repos, real free-tier levers, and a runnable code sample.",
        marks: [],
      },
    ],
    markDefs: [],
  },
  {
    _type: "block",
    _key: "b4",
    style: "h2",
    children: [{ _type: "span", _key: "b4a", text: '1. What "multi-agent orchestration" means on Bedrock', marks: [] }],
    markDefs: [],
  },
  {
    _type: "block",
    _key: "b5",
    style: "normal",
    children: [
      { _type: "span", _key: "b5a", text: "Strip away the marketing and Bedrock's multi-agent collaboration feature is one pattern: a ", marks: [] },
      { _type: "span", _key: "b5b", text: "supervisor agent", marks: ["strong"] },
      {
        _type: "span",
        _key: "b5c",
        text: " sits in front of a request, decides which specialist should handle it, and either delegates to one sub-agent or fans the work out to several running in parallel. Two collaboration modes exist — plain supervisor mode, where the supervisor also does the reasoning between hand-offs, and supervisor-with-routing, where simple requests get routed straight to a sub-agent with no extra hop.",
        marks: [],
      },
    ],
    markDefs: [],
  },
  {
    _type: "block",
    _key: "b6",
    style: "normal",
    children: [
      {
        _type: "span",
        _key: "b6a",
        text: "Each sub-agent keeps its own tools, its own knowledge base connection, and can run on a different model entirely — a cheap model for classification, a capable one for the actual task. Session state persists across the conversation in DynamoDB, guardrails apply centrally, and every hop is traceable through OpenTelemetry-based observability.",
        marks: [],
      },
    ],
    markDefs: [],
  },
  {
    _type: "image",
    _key: "img1",
    src: "/intel/assets/aws-bedrock-multi-agent-orchestration/infographic-1-supervisor-architecture.svg",
    alt: "Diagram of a Bedrock supervisor agent routing a customer request to Order Management, Product Information, and Technical Support sub-agents, each backed by its own data source, with shared memory, guardrails, and observability layers.",
  },
  {
    _type: "block",
    _key: "b7",
    style: "normal",
    children: [
      {
        _type: "span",
        _key: "b7a",
        text: "This is a genuinely different starting point from most open-source agent frameworks, which hand you the orchestration primitives and leave session storage, auth, and monitoring as your problem. Bedrock's pitch is that those are solved once, centrally, and every new agent your organization spins up inherits them for free.",
        marks: [],
      },
    ],
    markDefs: [],
  },
  {
    _type: "block",
    _key: "b8",
    style: "h2",
    children: [{ _type: "span", _key: "b8a", text: "2. Why the timing is forced, not optional", marks: [] }],
    markDefs: [],
  },
  {
    _type: "block",
    _key: "b9",
    style: "normal",
    children: [
      { _type: "span", _key: "b9a", text: 'Here\'s the part most "why AWS Bedrock" content skips, and it\'s the actual news: ', marks: [] },
      {
        _type: "span",
        _key: "b9b",
        text: "Bedrock Agents — the original agent-building service AWS shipped in November 2023 — is closing to new customers on July 30, 2026.",
        marks: ["strong"],
      },
      { _type: "span", _key: "b9c", text: " It's being replaced by ", marks: [] },
      { _type: "span", _key: "b9d", text: "Amazon Bedrock AgentCore", marks: ["strong"] },
      { _type: "span", _key: "b9e", text: ", whose managed harness moved from announcement to public preview in April 2026.", marks: [] },
    ],
    markDefs: [],
  },
  {
    _type: "image",
    _key: "img2",
    src: "/intel/assets/aws-bedrock-multi-agent-orchestration/infographic-2-classic-to-agentcore-timeline.svg",
    alt: "Timeline showing Bedrock Agents launching November 2023, multi-agent collaboration reaching general availability March 2025, AgentCore's managed harness entering preview April 2026, and Bedrock Agents Classic closing to new customers July 30, 2026.",
  },
  {
    _type: "block",
    _key: "b10",
    style: "normal",
    children: [
      {
        _type: "span",
        _key: "b10a",
        text: 'Existing Bedrock Agents customers aren\'t cut off — AWS is calling this "maintenance mode," not a shutdown, and current users can keep running as-is. But any enterprise starting fresh after that date builds on AgentCore, and any enterprise currently on Classic is now on a migration clock, whether it wants to be or not. That\'s a meaningfully different reason to "standardize on Bedrock" than the usual vendor-comparison framing — it\'s less "which platform is best" and more "which platform is where AWS is putting its remaining investment."',
        marks: [],
      },
    ],
    markDefs: [],
  },
  {
    _type: "block",
    _key: "b11",
    style: "normal",
    children: [
      {
        _type: "span",
        _key: "b11a",
        text: 'AgentCore\'s actual pitch is broader than Classic\'s was. It\'s explicitly model-agnostic — you can switch the underlying model mid-session — and explicitly orchestration-agnostic: it\'s built to run agents written in LangGraph, CrewAI, AutoGen, Strands, Google\'s ADK, or the OpenAI Agents SDK, not just Bedrock\'s own agent format. Security posture carries over from Bedrock proper: isolated per-session microVMs, KMS encryption, least-privilege IAM, a sandboxed code interpreter, VPC integration, and inherited SOC 1/2/3, ISO 27001, and HIPAA-eligible compliance. That compliance inheritance — not having to independently certify a bespoke agent stack — is the specific thing regulated-industry platform teams are buying when they say "we standardized on Bedrock."',
        marks: [],
      },
    ],
    markDefs: [],
  },
  {
    _type: "block",
    _key: "b12",
    style: "normal",
    children: [
      {
        _type: "span",
        _key: "b12a",
        text: "One honest caveat worth flagging, because Hivig doesn't do vendor cheerleading: several early AgentCore adopters have reported that poorly architected multi-agent setups can run close to ",
        marks: [],
      },
      { _type: "span", _key: "b12b", text: "3x", marks: ["em"] },
      {
        _type: "span",
        _key: "b12c",
        text: " the cost of an equivalent single-agent Bedrock Agents deployment, because Gateway tool-routing and translation calls are metered per invocation. Orchestration convenience isn't free — budget for it before you fan a request out across five sub-agents that each make three tool calls.",
        marks: [],
      },
    ],
    markDefs: [],
  },
  {
    _type: "block",
    _key: "b13",
    style: "h2",
    children: [{ _type: "span", _key: "b13a", text: '3. The economics: why "one API" is the actual selling point', marks: [] }],
    markDefs: [],
  },
  {
    _type: "block",
    _key: "b14",
    style: "normal",
    children: [
      {
        _type: "span",
        _key: "b14a",
        text: "The other reason Bedrock shows up in procurement conversations that pure-play agent frameworks don't: it puts over 100 foundation models from 18+ providers behind one API, one bill, and one set of IAM policies. That includes Anthropic's Claude line at the same pricing as Anthropic's own API, Amazon's own Nova family, Meta's Llama 4, Mistral, DeepSeek, OpenAI's GPT-5.x and open-weight gpt-oss models, Google's Gemma, Cohere, AI21, and more.",
        marks: [],
      },
    ],
    markDefs: [],
  },
  {
    _type: "image",
    _key: "img3",
    src: "/intel/assets/aws-bedrock-multi-agent-orchestration/infographic-3-model-cost-comparison.svg",
    alt: "Bar chart on a log scale showing input token pricing per million tokens: Amazon Nova Micro at $0.035, Nova Lite at $0.06, Meta Llama 4 8B at $0.18, Mistral Medium 3 at $0.40, Nova Pro at $0.80, Nova Premier at $2.50, and Claude Opus 4.7 at $5.00.",
  },
  {
    _type: "block",
    _key: "b15",
    style: "normal",
    children: [
      {
        _type: "span",
        _key: "b15a",
        text: "The practical consequence for a multi-agent system is model routing: a supervisor agent can run on the cheapest model that can reliably classify intent — Nova Micro, at $0.035 per million input tokens, is priced for exactly that — while only the sub-agent actually doing the hard reasoning calls something in Claude or Nova Premier's range. Teams that implement this kind of routing plus batch inference (a 50% discount for non-real-time workloads) commonly cut Bedrock spend by more than half without touching output quality, because most of what a multi-agent system does — classifying, routing, formatting — doesn't need a frontier model at all.",
        marks: [],
      },
    ],
    markDefs: [],
  },
  {
    _type: "block",
    _key: "b16",
    style: "normal",
    children: [
      { _type: "span", _key: "b16a", text: "One correction to a common assumption:", marks: ["strong"] },
      { _type: "span", _key: "b16b", text: " Bedrock does ", marks: [] },
      { _type: "span", _key: "b16c", text: "not", marks: ["strong"] },
      {
        _type: "span",
        _key: "b16d",
        text: " have a permanent free tier. You're billed from the first token. What it does have is a $200 AWS credit for new accounts and, functionally, near-zero pricing on Nova Micro — the closest thing to a free tier you'll get, and enough to build and load-test a real multi-agent prototype before you spend anything meaningful.",
        marks: [],
      },
    ],
    markDefs: [],
  },
  {
    _type: "block",
    _key: "b17",
    style: "h2",
    children: [{ _type: "span", _key: "b17a", text: "4. Try it this week: a minimal working example", marks: [] }],
    markDefs: [],
  },
  {
    _type: "block",
    _key: "b18",
    style: "normal",
    children: [
      { _type: "span", _key: "b18a", text: "The fastest honest path in isn't Bedrock's own agent-builder console — it's ", marks: [] },
      { _type: "span", _key: "b18b", text: "Strands Agents", marks: ["strong"] },
      {
        _type: "span",
        _key: "b18c",
        text: ", AWS's own open-source, Apache-2.0-licensed SDK, built by the same team and contributed to by Anthropic, Meta, Accenture, and PwC. It defaults to Bedrock as a model provider but also runs against Anthropic's API directly, OpenAI, Gemini, or a local Ollama model, so you can prototype without committing to AWS billing at all.",
        marks: [],
      },
    ],
    markDefs: [],
  },
  {
    _type: "code",
    _key: "code1",
    language: "python",
    code: `# pip install strands-agents strands-agents-tools
from strands import Agent
from strands_tools import calculator

# Defaults to Amazon Bedrock (Claude on Bedrock) —
# swap providers by setting the model_provider kwarg instead.
agent = Agent(tools=[calculator])

response = agent("A customer's order is $214.50 with 8.25% sales tax. What's the total?")
print(response)`,
  },
  {
    _type: "block",
    _key: "b19",
    style: "normal",
    children: [
      {
        _type: "span",
        _key: "b19a",
        text: 'That\'s a single agent. Wiring in the supervisor pattern from Section 1 is a matter of registering sub-agents as tools the supervisor can call — Strands documents this directly as its "Agent-as-Tool" and "Swarm" multi-agent patterns.',
        marks: [],
      },
    ],
    markDefs: [],
  },
  {
    _type: "block",
    _key: "b20",
    style: "normal",
    children: [{ _type: "span", _key: "b20a", text: "Repos worth cloning, all free and open source:", marks: ["strong"] }],
    markDefs: [],
  },
  {
    _type: "block",
    _key: "b21",
    style: "normal",
    listItem: "bullet",
    level: 1,
    children: [
      { _type: "span", _key: "b21a", text: "strands-agents/harness-sdk", marks: ["strong", "l1"] },
      {
        _type: "span",
        _key: "b21b",
        text: " — the SDK itself; Python and TypeScript, MIT-friendly Apache 2.0 license, works against Bedrock, Anthropic, OpenAI, Gemini, or Ollama.",
        marks: [],
      },
    ],
    markDefs: [link("l1", "https://github.com/strands-agents/harness-sdk")],
  },
  {
    _type: "block",
    _key: "b22",
    style: "normal",
    listItem: "bullet",
    level: 1,
    children: [
      { _type: "span", _key: "b22a", text: "2FastLabs/agent-squad", marks: ["strong", "l2"] },
      {
        _type: "span",
        _key: "b22b",
        text: " (formerly AWS Labs' Multi-Agent Orchestrator) — a lightweight, LLM-powered classifier-and-router framework purpose-built for exactly the supervisor pattern this piece describes. Python and TypeScript.",
        marks: [],
      },
    ],
    markDefs: [link("l2", "https://github.com/2FastLabs/agent-squad")],
  },
  {
    _type: "block",
    _key: "b23",
    style: "normal",
    listItem: "bullet",
    level: 1,
    children: [
      { _type: "span", _key: "b23a", text: "aws-samples/sample-multi-agent-orchestration-chat-on-agentcore", marks: ["strong", "l3"] },
      {
        _type: "span",
        _key: "b23b",
        text: " — a full, deployable multi-agent chat platform on AgentCore, TypeScript, serverless, with preset agents for software development, data analysis, and content creation you can fork immediately.",
        marks: [],
      },
    ],
    markDefs: [link("l3", "https://github.com/aws-samples/sample-multi-agent-orchestration-chat-on-agentcore")],
  },
  {
    _type: "block",
    _key: "b24",
    style: "normal",
    listItem: "bullet",
    level: 1,
    children: [
      { _type: "span", _key: "b24a", text: "aws-solutions-library-samples/guidance-for-multi-agent-orchestration-agent-squad-on-aws", marks: ["strong", "l4"] },
      {
        _type: "span",
        _key: "b24b",
        text: " — the reference architecture Infographic 1 is drawn from: a customer-support supervisor routing between Order Management and Product Information sub-agents, complete IaC included.",
        marks: [],
      },
    ],
    markDefs: [link("l4", "https://github.com/aws-solutions-library-samples/guidance-for-multi-agent-orchestration-agent-squad-on-aws")],
  },
  {
    _type: "block",
    _key: "b25",
    style: "normal",
    listItem: "bullet",
    level: 1,
    children: [
      { _type: "span", _key: "b25a", text: "aws-samples/agentic-orchestration", marks: ["strong", "l5"] },
      {
        _type: "span",
        _key: "b25b",
        text: " — if you specifically want to see Bedrock Agents interoperating with LangGraph and CrewAI rather than replacing them, this is the walkthrough.",
        marks: [],
      },
    ],
    markDefs: [link("l5", "https://github.com/aws-samples/agentic-orchestration")],
  },
  {
    _type: "block",
    _key: "b26",
    style: "normal",
    children: [{ _type: "span", _key: "b26a", text: "Lowest-hanging fruit, in order:", marks: ["strong"] }],
    markDefs: [],
  },
  {
    _type: "block",
    _key: "b27",
    style: "normal",
    listItem: "number",
    level: 1,
    children: [
      { _type: "span", _key: "b27a", text: "Claim the $200 AWS credit", marks: ["strong"] },
      { _type: "span", _key: "b27b", text: " on a fresh account and set a $20 budget alarm before you do anything else.", marks: [] },
    ],
    markDefs: [],
  },
  {
    _type: "block",
    _key: "b28",
    style: "normal",
    listItem: "number",
    level: 1,
    children: [
      { _type: "span", _key: "b28a", text: "Run the Strands quickstart above locally against Bedrock", marks: ["strong"] },
      {
        _type: "span",
        _key: "b28b",
        text: ", not the console — you'll understand the orchestration model faster reading code than clicking through a wizard.",
        marks: [],
      },
    ],
    markDefs: [],
  },
  {
    _type: "block",
    _key: "b29",
    style: "normal",
    listItem: "number",
    level: 1,
    children: [
      { _type: "span", _key: "b29a", text: "Fork the Agent Squad customer-support guidance repo", marks: ["strong"] },
      {
        _type: "span",
        _key: "b29b",
        text: " and swap in your own two sub-agents. It's the smallest complete supervisor-pattern example that's actually production-shaped.",
        marks: [],
      },
    ],
    markDefs: [],
  },
  {
    _type: "block",
    _key: "b30",
    style: "normal",
    listItem: "number",
    level: 1,
    children: [
      { _type: "span", _key: "b30a", text: "Route your classifier to Nova Micro", marks: ["strong"] },
      {
        _type: "span",
        _key: "b30b",
        text: " before you touch a frontier model — it costs next to nothing and will show you, immediately, whether cheap-model routing is viable for your use case.",
        marks: [],
      },
    ],
    markDefs: [],
  },
  {
    _type: "block",
    _key: "b31",
    style: "normal",
    listItem: "number",
    level: 1,
    children: [
      { _type: "span", _key: "b31a", text: "Read AgentCore's migration guide before you build on Classic", marks: ["strong"] },
      {
        _type: "span",
        _key: "b31b",
        text: ", even for a prototype — anything you stand up on Bedrock Agents Classic today is on a clock that Bedrock AgentCore isn't.",
        marks: [],
      },
    ],
    markDefs: [],
  },
  {
    _type: "block",
    _key: "b32",
    style: "h3",
    children: [{ _type: "span", _key: "b32a", text: "Sources", marks: [] }],
    markDefs: [],
  },
  {
    _type: "block",
    _key: "b33",
    style: "normal",
    children: [
      {
        _type: "span",
        _key: "b33a",
        text: 'AWS Bedrock multi-agent collaboration documentation and AWS News Blog (GA announcement, March 2025) · AWS "What\'s New" post on AgentCore managed harness (April 2026) · AWS Bedrock Agents Classic maintenance-mode notice · Strands Agents SDK documentation and GitHub organization · AWS Open Source Blog, "Introducing Strands Agents" · ServerGurus, AgentCore cost-optimization analysis (2026) · Bedrock pricing analyses from CloudZero, Voiceflow, Swfte, Tech 42, Seaflux, and Wring (2026) · Flexera 2025 State of the Cloud report, cited via Wring.',
        marks: [],
      },
    ],
    markDefs: [],
  },
  {
    _type: "block",
    _key: "b34",
    style: "normal",
    children: [
      {
        _type: "span",
        _key: "b34a",
        text: "Hivig verifies pricing and platform-status claims against primary sources at time of writing. AWS pricing and preview-to-GA timelines change; confirm current terms on AWS's own pricing and documentation pages before budgeting.",
        marks: ["em"],
      },
    ],
    markDefs: [],
  },
];
