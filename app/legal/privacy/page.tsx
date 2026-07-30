import type { Metadata } from "next";

export const metadata: Metadata = { title: "Privacy Policy" };

export default function PrivacyPage() {
  return (
    <section className="pt-32 pb-24 px-6 md:px-12 max-w-[700px] mx-auto">
      <h1 className="font-serif text-[36px] font-bold tracking-tight mb-3">Privacy Policy</h1>
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
          Hivig (&ldquo;Hivig,&rdquo; &ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;)
          is operated by Naganarai Media Tech Private Limited. This policy explains what
          personal data we collect through hivig.com, why, how it is used and protected, and the
          rights available to you, wherever you are located. It is written to address
          obligations under India&rsquo;s Digital Personal Data Protection Act, 2023 (DPDP Act),
          the EU/UK General Data Protection Regulation (GDPR), and the California Consumer
          Privacy Act as amended by the CPRA (CCPA/CPRA).
        </p>

        <h2>1. Who we are</h2>
        <p>
          Naganarai Media Tech Private Limited, operating Hivig, is the data fiduciary (under
          DPDP), data controller (under GDPR), and business (under CCPA/CPRA) responsible for
          the personal data described in this policy.
        </p>
        <p>
          Contact for privacy matters:{" "}
          <strong>[insert grievance officer / privacy contact email — required under the DPDP Act]</strong>
        </p>

        <h2>2. What we collect</h2>
        <table>
          <thead>
            <tr>
              <th>Data</th>
              <th>Collected when</th>
              <th>Purpose</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Email address</td>
              <td>Subscribing to the Hivig brief / waitlist</td>
              <td>Sending the newsletter and product updates</td>
            </tr>
            <tr>
              <td>Name, email, company, message</td>
              <td>Submitting a consultancy enquiry</td>
              <td>Responding to your enquiry, scoping engagements</td>
            </tr>
            <tr>
              <td>Name, credentials, professional affiliation</td>
              <td>Applying as a Verified Expert Contributor</td>
              <td>Editorial vetting, attribution on published content</td>
            </tr>
            <tr>
              <td>Company and listing details</td>
              <td>Submitting or claiming a Vendor Profile</td>
              <td>
                Displaying vendor-submitted factual data, distinct from the independent Hivig
                Score
              </td>
            </tr>
            <tr>
              <td>Usage data (pages viewed, device, browser, approximate location, referrer)</td>
              <td>Automatically, via cookies and analytics</td>
              <td>Understanding site usage, improving content and performance</td>
            </tr>
            <tr>
              <td>Cookies and similar technologies</td>
              <td>Automatically, per your cookie preferences</td>
              <td>See Section 6</td>
            </tr>
          </tbody>
        </table>
        <p>
          We do not knowingly collect any special category / sensitive personal data (health,
          biometric, financial account details, etc.) through this site.
        </p>

        <h2>3. Legal basis for processing</h2>
        <ul>
          <li>
            <strong>Under GDPR</strong>, we rely on: your consent (newsletter sign-up,
            non-essential cookies), legitimate interest (basic site analytics, responding to
            enquiries you initiate), and contractual necessity (delivering a consultancy
            engagement you request).
          </li>
          <li>
            <strong>Under the DPDP Act</strong>, we process personal data on the basis of your
            consent, given freely, specifically, and through clear affirmative action, or where
            processing falls under a legitimate use recognized by the Act (for example, you
            voluntarily providing data to receive a service you requested).
          </li>
          <li>
            <strong>Under CCPA/CPRA</strong>, we disclose the categories above and your rights in
            Section 5; we do not sell or share personal data for cross-context behavioral
            advertising.
          </li>
        </ul>

        <h2>4. How we share data</h2>
        <p>We do not sell personal data. We share data only with:</p>
        <ul>
          <li>
            <strong>Service providers</strong> who process data on our behalf under contract
            (e.g., email delivery platform, hosting and analytics providers such as Vercel),
            strictly to provide the service.
          </li>
          <li>
            <strong>Legal or regulatory authorities</strong>, where required by law.
          </li>
          <li>
            <strong>A successor entity</strong>, in the event of a merger, acquisition, or asset
            sale, subject to the same protections described here.
          </li>
        </ul>
        <p>
          Where any service provider processes data outside your country of residence (including
          transfers from the EU/UK/India to the United States or elsewhere), we rely on
          appropriate safeguards such as standard contractual clauses or equivalent mechanisms
          recognized under applicable law.
        </p>

        <h2>5. Your rights</h2>
        <p>
          <strong>If you are in the EU/UK (GDPR):</strong> you have the right to access, rectify,
          erase, restrict, or port your data, to object to processing based on legitimate
          interest, to withdraw consent at any time without affecting prior processing, and to
          lodge a complaint with your local supervisory authority.
        </p>
        <p>
          <strong>If you are in India (DPDP Act):</strong> you have the right to access a summary
          of your personal data and its processing, to correction and erasure, to grievance
          redressal directly with us, and to nominate another individual to exercise your rights
          in the event of death or incapacity. You may withdraw consent at any time, as easily as
          it was given.
        </p>
        <p>
          <strong>If you are a California resident (CCPA/CPRA):</strong> you have the right to
          know what personal data is collected, to request deletion, to correct inaccurate data,
          to opt out of sale or sharing (we do not sell or share, per Section 4), to limit use of
          sensitive personal information, and to not be discriminated against for exercising
          these rights.
        </p>
        <p>
          To exercise any of these rights, contact{" "}
          <strong>[insert privacy contact email]</strong>. We will respond within the timeframe
          required by applicable law.
        </p>

        <h2>6. Cookies</h2>
        <p>We use the following categories of cookies:</p>
        <ul>
          <li>
            <strong>Strictly necessary</strong> — required for the site to function (e.g.,
            remembering your cookie preferences). Always active.
          </li>
          <li>
            <strong>Analytics</strong> — helps us understand aggregate site usage. Active only
            with your consent.
          </li>
          <li>
            <strong>Functional</strong> — remembers preferences (e.g., saved filters on Intel or
            the Race). Active only with your consent.
          </li>
          <li>
            <strong>Marketing</strong> — not currently used. If introduced, this policy will be
            updated and fresh consent requested.
          </li>
        </ul>
        <p>
          You can accept, reject, or customize non-essential cookies when you first visit the
          site, and change your choice at any time via <strong>Cookie Preferences</strong> in the
          site footer. See Section 8 for how consent choices are recorded.
        </p>

        <h2>7. Data retention</h2>
        <p>
          We retain personal data only as long as necessary for the purpose it was collected:
          newsletter contact data until you unsubscribe, enquiry-form data for the duration of
          the engagement discussion plus a reasonable follow-up period, and contributor/vendor
          profile data for as long as the profile remains active on the platform. You may
          request earlier deletion at any time (Section 5).
        </p>

        <h2>8. How consent is recorded</h2>
        <p>
          When you make a cookie choice, we store that choice (which categories you accepted)
          together with a timestamp, so we do not re-prompt you on every visit. This choice is
          re-requested if our cookie categories change materially, or after 12 months, whichever
          comes first.
        </p>

        <h2>9. Security</h2>
        <p>
          We apply reasonable technical and organizational measures (encryption in transit,
          access controls, and vendor due diligence) to protect personal data. No system is
          completely secure, and we cannot guarantee absolute security.
        </p>

        <h2>10. Children&rsquo;s privacy</h2>
        <p>
          Hivig is intended for working professionals and is not directed at children. We do not
          knowingly collect personal data from anyone under 16. If you believe a child has
          provided us data, contact us and we will delete it.
        </p>

        <h2>11. Changes to this policy</h2>
        <p>
          We may update this policy as the site and applicable law evolve. Material changes will
          be reflected by an updated &ldquo;Last updated&rdquo; date, and where required, we will
          seek fresh consent.
        </p>

        <h2>12. Contact</h2>
        <p>
          Naganarai Media Tech Private Limited
          <br />
          <strong>[insert registered address]</strong>
          <br />
          <strong>[insert grievance officer / privacy contact email]</strong>
        </p>
        <p>
          If you are in the EU/UK and believe we have not resolved your concern, you may contact
          your local data protection supervisory authority.
        </p>
      </div>
    </section>
  );
}
