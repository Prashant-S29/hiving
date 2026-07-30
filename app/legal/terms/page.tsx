import type { Metadata } from "next";

export const metadata: Metadata = { title: "Terms of Use" };

export default function TermsPage() {
  return (
    <section className="pt-32 pb-24 px-6 md:px-12 max-w-[700px] mx-auto">
      <h1 className="font-serif text-[36px] font-bold tracking-tight mb-3">Terms of Use</h1>
      <p className="font-mono text-[12px] text-muted mb-8">
        Last updated: <strong className="text-ink">[insert date on publish]</strong>
      </p>

      <p className="mt-6 mb-10 border border-amber/40 bg-amber/10 p-4 font-body text-[15px] leading-[1.8] text-ink/85">
        <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-amber block mb-2">
          Working draft
        </span>
        This is a working draft prepared to guide implementation. It must be reviewed by
        qualified counsel before Hivig goes live in production.
      </p>

      <div className="prose-hivig">
        <p>
          These Terms of Use (&ldquo;Terms&rdquo;) govern your access to and use of hivig.com
          (the &ldquo;Site&rdquo;), operated by Naganarai Media Tech Private Limited
          (&ldquo;Hivig,&rdquo; &ldquo;we,&rdquo; &ldquo;us,&rdquo; &ldquo;our&rdquo;). By using
          the Site, you agree to these Terms. If you do not agree, please do not use the Site.
        </p>

        <h2>1. What Hivig is</h2>
        <p>
          Hivig publishes independent editorial analysis, benchmarks, and scoring (&ldquo;the
          Vigilance Standard,&rdquo; &ldquo;Hivig Score&rdquo;) on AI models, agents, and
          vendors, and separately offers paid consulting services. Editorial content and the
          Hivig Score are produced independently; no vendor payment is accepted for ranking,
          placement, or a favorable score, ever.
        </p>

        <h2>2. Not professional advice</h2>
        <p>
          Content on the Site, including the Hivig Score, benchmarks, comparisons, the ROI
          Calculator, AI Readiness Assessment, Model Selector, and all editorial analysis, is
          provided for general informational purposes only. It does not constitute legal,
          financial, security, or professional advice, and should not be relied upon as the sole
          basis for a business, technical, or investment decision. Paid consulting engagements
          are governed by a separate, signed statement of work, not by these Terms.
        </p>

        <h2>3. Accuracy and no warranty</h2>
        <p>
          We test guides before publishing and apply a documented methodology to every score,
          but the agentic AI landscape changes quickly, and vendor platforms change without
          notice. Content may become outdated between reviews. The Site and its content are
          provided &ldquo;as is&rdquo; and &ldquo;as available,&rdquo; without warranties of any
          kind, express or implied, including accuracy, completeness, or fitness for a
          particular purpose.
        </p>

        <h2>4. Vendor-submitted and contributor content</h2>
        <p>Some content on the Site is submitted by third parties:</p>
        <ul>
          <li>
            <strong>Vendor-Submitted Profiles</strong> contain factual listing data claimed and
            updated directly by the vendor. This data is clearly labeled as vendor-submitted and
            is not independently verified in the same way as a Hivig Score. The Hivig Score on
            the same page is always produced independently and is never editable by the vendor.
          </li>
          <li>
            <strong>Verified Expert Contributors</strong> submit verdicts and case studies under
            their own name and credentials, subject to Hivig editorial review before publishing.
          </li>
          <li>
            <strong>Community Signals</strong> (ratings and reviews) reflect the views of
            individual practitioners, not Hivig&rsquo;s own verdict.
          </li>
        </ul>
        <p>
          We reserve the right to review, edit, decline, or remove any third-party submission at
          our discretion, and are not responsible for the accuracy of vendor-submitted or
          community-submitted content.
        </p>

        <h2>5. Acceptable use</h2>
        <p>
          You agree not to: misrepresent your identity or affiliation when submitting content
          (including vendor or contributor profiles); scrape, systematically extract, or
          republish Site content without permission; attempt to manipulate the Vigilance
          Standard, benchmarks, or Community Signals; or use the Site for any unlawful purpose.
        </p>

        <h2>6. Intellectual property</h2>
        <p>
          The Hivig name, logo, &ldquo;the Vigilance Standard,&rdquo; the Hivig Score
          methodology, and all editorial content are the property of Naganarai Media Tech
          Private Limited, except where explicitly attributed to a third-party contributor. You
          may share links to and quote brief excerpts of Site content with attribution; you may
          not republish substantial portions without our written permission.
        </p>

        <h2>7. Third-party links</h2>
        <p>
          The Site links to third-party vendor websites, tools, and platforms for reference. We
          do not control and are not responsible for the content, policies, or practices of any
          third-party site.
        </p>

        <h2>8. Limitation of liability</h2>
        <p>
          To the maximum extent permitted by applicable law, Naganarai Media Tech Private
          Limited and its officers, employees, and contributors are not liable for any indirect,
          incidental, consequential, or special damages arising from your use of, or reliance
          on, the Site or its content. Nothing in these Terms limits liability where such
          limitation is not permitted by applicable law, including certain consumer-protection
          provisions that may apply in your jurisdiction.
        </p>

        <h2>9. Changes to the Site and these Terms</h2>
        <p>
          We may modify, suspend, or discontinue any part of the Site, and may update these
          Terms from time to time. Continued use of the Site after changes take effect
          constitutes acceptance of the updated Terms.
        </p>

        <h2>10. Governing law</h2>
        <p>
          These Terms are governed by the laws of India, without regard to conflict-of-law
          principles, and any dispute will be subject to the exclusive jurisdiction of the
          courts of Jaipur, Rajasthan, India, except where mandatory local consumer-protection
          law provides otherwise for users located elsewhere.
        </p>

        <h2>11. Contact</h2>
        <p>
          Naganarai Media Tech Private Limited
          <br />
          <strong>[insert registered address]</strong>
          <br />
          <strong>[insert contact email]</strong>
        </p>
      </div>
    </section>
  );
}
