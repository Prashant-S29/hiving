"use client";

import { useState } from "react";
import Link from "next/link";

export default function EnquiryForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [message, setMessage] = useState("");
  const [consent, setConsent] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!consent) return;
    setStatus("loading");
    try {
      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, company, message }),
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
        ✓ Thanks — we typically respond within 48 hours.
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-3">
      <input
        type="text"
        required
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
        required
        placeholder="Company"
        value={company}
        onChange={(e) => setCompany(e.target.value)}
        className="bg-white/5 border border-rule-strong px-5 py-4 text-[14px] text-ink placeholder:text-muted focus:border-signal outline-none transition-colors"
      />
      <textarea
        required
        rows={4}
        placeholder="Tell us what you're building"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="bg-white/5 border border-rule-strong px-5 py-4 text-[14px] text-ink placeholder:text-muted focus:border-signal outline-none transition-colors resize-none"
      />

      <label className="flex items-start gap-3 mt-1 text-[12px] leading-[1.6] text-muted cursor-pointer">
        <input
          type="checkbox"
          required
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          className="mt-0.5 w-4 h-4 accent-signal shrink-0 cursor-pointer"
        />
        <span>
          I agree to the processing of my data as described in the{" "}
          <Link href="/legal/privacy" className="text-signal hover:underline">
            Privacy Policy
          </Link>
          .
        </span>
      </label>

      <button
        type="submit"
        disabled={status === "loading" || !consent}
        className="bg-signal hover:bg-signal-dark text-white font-mono text-[12px] tracking-[0.12em] uppercase font-medium px-6 py-[17px] mt-1 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {status === "loading" ? "Submitting…" : "→  Send Enquiry"}
      </button>
      {status === "error" && (
        <p className="font-mono text-[11px] text-signal mt-1">Something went wrong. Please try again.</p>
      )}
    </form>
  );
}
