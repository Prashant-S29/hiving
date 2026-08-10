"use client";

import { useState } from "react";
import Link from "next/link";
import type { EnquiryFormCopy } from "@/lib/sanity/conversionPages";

export default function EnquiryForm({ copy }: { copy: EnquiryFormCopy }) {
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
        {copy.successMessage}
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-3">
      <input
        type="text"
        required
        placeholder={copy.namePlaceholder}
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="bg-white/5 border border-rule-strong px-5 py-4 text-[14px] text-ink placeholder:text-muted focus:border-signal outline-none transition-colors"
      />
      <input
        type="email"
        required
        placeholder={copy.emailPlaceholder}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="bg-white/5 border border-rule-strong px-5 py-4 text-[14px] text-ink placeholder:text-muted focus:border-signal outline-none transition-colors"
      />
      <input
        type="text"
        required
        placeholder={copy.companyPlaceholder}
        value={company}
        onChange={(e) => setCompany(e.target.value)}
        className="bg-white/5 border border-rule-strong px-5 py-4 text-[14px] text-ink placeholder:text-muted focus:border-signal outline-none transition-colors"
      />
      <textarea
        required
        rows={4}
        placeholder={copy.messagePlaceholder}
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
          {copy.consentPrefix}{" "}
          <Link href="/legal/privacy" className="text-signal hover:underline">
            {copy.privacyLabel}
          </Link>
          {copy.consentSuffix}
        </span>
      </label>

      <button
        type="submit"
        disabled={status === "loading" || !consent}
        className="bg-signal hover:bg-signal-dark text-white font-mono text-[12px] tracking-[0.12em] uppercase font-medium px-6 py-[17px] mt-1 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {status === "loading" ? copy.submittingLabel : copy.submitLabel}
      </button>
      {status === "error" && (
        <p className="font-mono text-[11px] text-signal mt-1">{copy.errorMessage}</p>
      )}
    </form>
  );
}
