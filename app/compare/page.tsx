import type { Metadata } from "next";
import "@hivig/design-system/styles.css";
import SignalPageShell from "@/components/signal/SignalPageShell";
import { CompareModelPicker } from "@/components/compare/CompareModelPicker";
import { CompareResults } from "@/components/compare/CompareResults";
import { getCompareModels, getCompareSettings } from "@/lib/sanity/compare";

interface CompareSearchParams {
  models?: string;
  job?: string;
  edit?: string;
}

function parseModelSlugs(models?: string): string[] {
  return (models || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 4);
}

export async function generateMetadata({ searchParams }: { searchParams: CompareSearchParams }): Promise<Metadata> {
  const [settings, allModels] = await Promise.all([getCompareSettings(), getCompareModels()]);
  const slugs = parseModelSlugs(searchParams.models);
  const selected = slugs.map((slug) => allModels.find((m) => m.slug === slug)).filter((m): m is NonNullable<typeof m> => Boolean(m));

  if (selected.length > 0) {
    const title = `${selected.map((m) => m.modelName).join(" vs ")} — Compare`;
    const description = `Hivig's editorial comparison of ${selected.map((m) => m.modelName).join(", ")}: cost, capability, integration risk, and which one actually fits the job.`;
    return { title, description, openGraph: { title, description } };
  }

  return {
    title: settings.seo.metaTitle,
    description: settings.seo.metaDescription,
    alternates: settings.seo.canonicalUrl ? { canonical: settings.seo.canonicalUrl } : undefined,
    robots: settings.seo.noIndex ? { index: false, follow: false } : undefined,
    openGraph: {
      title: settings.seo.openGraphTitle || settings.seo.metaTitle,
      description: settings.seo.openGraphDescription || settings.seo.metaDescription,
      images: settings.seo.openGraphImageUrl ? [{ url: settings.seo.openGraphImageUrl }] : undefined,
    },
  };
}

export default async function ComparePage({ searchParams }: { searchParams: CompareSearchParams }) {
  const [settings, allModels] = await Promise.all([getCompareSettings(), getCompareModels()]);
  const slugs = parseModelSlugs(searchParams.models);
  const selected = slugs.length
    ? slugs.map((slug) => allModels.find((m) => m.slug === slug)).filter((m): m is NonNullable<typeof m> => Boolean(m))
    : [];
  const job = searchParams.job || "";
  const isEditing = searchParams.edit === "1";

  if (selected.length > 0 && !isEditing) {
    const editHref = `/compare?edit=1&models=${slugs.join(",")}${job ? `&job=${job}` : ""}`;
    return (
      <SignalPageShell>
        <CompareResults
          models={selected}
          job={job}
          emptyValueLabel={settings.emptyValueLabel}
          editSelectionLabel={settings.editSelectionLabel}
          editSelectionHref={editHref}
          labels={{
            costGroupLabel: settings.costGroupLabel,
            capabilityGroupLabel: settings.capabilityGroupLabel,
            operationsGroupLabel: settings.operationsGroupLabel,
            integrationGroupLabel: settings.integrationGroupLabel,
            governanceGroupLabel: settings.governanceGroupLabel,
          }}
        />
        <p className="mx-auto mt-8 max-w-[1100px] text-[12px] leading-[1.7]" style={{ color: "var(--hvg-text-dim)" }}>
          {settings.disclaimerText}
        </p>
      </SignalPageShell>
    );
  }

  // Picker view — group real, curated models by provider so the dropdowns
  // never offer a selection with no data behind it (spec's example provider
  // list is illustrative; this is the real, active Sanity dataset).
  const providerMap = new Map<string, { id: string; name: string }>();
  const modelsByProvider: Record<string, { slug: string; name: string }[]> = {};
  for (const m of allModels) {
    providerMap.set(m.organization.id, { id: m.organization.id, name: m.organization.name });
    (modelsByProvider[m.organization.id] ||= []).push({ slug: m.slug, name: m.modelName });
  }
  const providers = Array.from(providerMap.values()).sort((a, b) => a.name.localeCompare(b.name));

  // If the visitor arrived via "Edit selection", pre-fill the picker with
  // the models/job that were in the URL rather than starting from scratch.
  const initialSlots = selected.length
    ? selected.map((m) => ({ providerId: m.organization.id, modelSlug: m.slug }))
    : slugs.length
      ? slugs
          .map((slug) => allModels.find((m) => m.slug === slug))
          .filter((m): m is NonNullable<typeof m> => Boolean(m))
          .map((m) => ({ providerId: m.organization.id, modelSlug: m.slug }))
      : undefined;

  return (
    <SignalPageShell>
      <CompareModelPicker
        providers={providers}
        modelsByProvider={modelsByProvider}
        jobOptions={settings.jobOptions}
        heroEyebrow={settings.heroEyebrow}
        heroHeading={settings.heroHeading}
        heroSubhead={settings.heroSubhead}
        addModelLabel={settings.addModelLabel}
        providerLabel={settings.providerLabel}
        modelLabel={settings.modelLabel}
        jobLabel={settings.jobLabel}
        compareButtonLabel={settings.compareButtonLabel}
        emptyStateLabel={settings.emptyStateLabel}
        initialSlots={initialSlots}
        initialJob={job || undefined}
      />
    </SignalPageShell>
  );
}
