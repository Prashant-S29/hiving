"use client";

import { useState } from "react";

export default function SubscribeForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, role }),
      });
      if (!res.ok) throw new Error();
      setStatus("done");
    } catch {
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <div className="bg-verify/10 border border-verify text-verify font-mono text-[13px] px-6 py-5">
        ✓ You&rsquo;re in — welcome to Hivig. Watch your inbox.
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-3">
      <input
        type="text"
        placeholder="Your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="bg-white/5 border border-rule-strong px-5 py-4 text-[14px] text-ink placeholder:text-muted focus:border-signal outline-none transition-colors"
      />
      <input
        type="email"
        required
        placeholder="your@email.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="bg-white/5 border border-rule-strong px-5 py-4 text-[14px] text-ink placeholder:text-muted focus:border-signal outline-none transition-colors"
      />
      <input
        type="text"
        placeholder="Your role (optional)"
        value={role}
        onChange={(e) => setRole(e.target.value)}
        className="bg-white/5 border border-rule-strong px-5 py-4 text-[14px] text-ink placeholder:text-muted focus:border-signal outline-none transition-colors"
      />
      <button
        type="submit"
        disabled={status === "loading"}
        className="bg-signal hover:bg-signal-dark text-white font-mono text-[12px] tracking-[0.12em] uppercase font-medium px-6 py-[17px] mt-1 transition-colors disabled:opacity-60"
      >
        {status === "loading" ? "Submitting…" : "→  Join the Waitlist"}
      </button>
      {status === "error" && (
        <p className="font-mono text-[11px] text-signal mt-1">Something went wrong. Please try again.</p>
      )}
    </form>
  );
}
