import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Upload, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { useCategories } from "@/lib/queries";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@/hooks/use-session";
import { toast } from "sonner";

export const Route = createFileRoute("/plaats-opdracht")({
  head: () => ({
    meta: [
      { title: "Plaats opdracht — Werkgenoten" },
      { name: "description", content: "Plaats gratis een opdracht en ontvang binnen 24 uur offertes." },
      { property: "og:title", content: "Plaats opdracht — Werkgenoten" },
      { property: "og:url", content: "/plaats-opdracht" },
    ],
    links: [{ rel: "canonical", href: "/plaats-opdracht" }],
  }),
  component: PostJob,
});

function PostJob() {
  const navigate = useNavigate();
  const { user, loading } = useSession();
  const { data: cats = [] } = useCategories();
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!user) {
      toast.error("Log eerst in om een opdracht te plaatsen");
      navigate({ to: "/auth" });
      return;
    }
    const fd = new FormData(e.currentTarget);
    const title = String(fd.get("title") ?? "").trim();
    const description = String(fd.get("desc") ?? "").trim();
    const categorySlug = String(fd.get("cat") ?? "");
    const postal = String(fd.get("zip") ?? "").trim();
    const budgetRaw = String(fd.get("budget") ?? "");
    if (!title || !description) {
      toast.error("Vul titel en beschrijving in");
      return;
    }
    const budgetMap: Record<string, [number | null, number | null]> = {
      "< €500": [null, 500],
      "€500 – €1.500": [500, 1500],
      "€1.500 – €5.000": [1500, 5000],
      "> €5.000": [5000, null],
    };
    const [budget_min, budget_max] = budgetMap[budgetRaw] ?? [null, null];
    const category = cats.find((c) => c.slug === categorySlug);
    const baseSlug = title
      .toLowerCase()
      .normalize("NFKD")
      .replace(/[^\w\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-")
      .slice(0, 60) || "opdracht";
    const slug = `${baseSlug}-${Math.random().toString(36).slice(2, 7)}`;
    setSubmitting(true);
    const { error } = await supabase.from("jobs").insert({
      client_id: user.id,
      slug,
      title,
      description,
      category_id: category?.id ?? null,
      postal_code: postal || null,
      budget_min,
      budget_max,
      // status default 'open', review_status default 'pending_review'
    });
    setSubmitting(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Opdracht ingediend voor review");
    setDone(true);
  }

  if (done) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 sm:px-6 text-center">
        <CheckCircle2 className="mx-auto h-12 w-12 text-brand" />
        <h1 className="mt-4 text-3xl font-semibold">Opdracht ingediend</h1>
        <p className="mt-3 text-muted-foreground">
          Je opdracht wordt door een admin gecontroleerd voor hij publiek wordt. Je vindt hem terug onder
          <span> </span>
          <a href="/dashboard/projecten" className="text-brand hover:underline">Mijn projecten</a>.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
      <h1 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">Plaats jouw opdracht</h1>
      <p className="mt-2 text-muted-foreground">Het kost 2 minuten en je betaalt niets. Een admin controleert je opdracht voor publicatie.</p>

      <form onSubmit={onSubmit} className="bg-card-gradient shadow-card mt-8 space-y-5 rounded-2xl border border-border/60 p-6">
        <Field label="Wat is de klus?" id="title">
          <input id="title" name="title" required placeholder="bv. Woonkamer schilderen 35m²" className="vk-input" />
        </Field>
        <Field label="Categorie" id="cat">
          <select id="cat" name="cat" className="vk-input">
            <option value="">— Kies categorie —</option>
            {cats.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
          </select>
        </Field>
        <Field label="Postcode" id="zip">
          <input id="zip" name="zip" placeholder="1012 AB" className="vk-input" />
        </Field>
        <Field label="Beschrijving" id="desc">
          <textarea id="desc" name="desc" required rows={5} placeholder="Beschrijf de klus, materiaal en wanneer het moet gebeuren..." className="vk-input min-h-[140px]" />
        </Field>
        <Field label="Richtbudget" id="budget">
          <select id="budget" name="budget" className="vk-input">
            <option>Geen voorkeur</option>
            <option>&lt; €500</option>
            <option>€500 – €1.500</option>
            <option>€1.500 – €5.000</option>
            <option>&gt; €5.000</option>
          </select>
        </Field>
        <Field label="Foto's (optioneel)" id="photos">
          <label htmlFor="photos" className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-border bg-surface/60 px-4 py-8 text-sm text-muted-foreground hover:border-brand/40">
            <Upload className="h-4 w-4" /> Sleep foto's hierheen of klik om te uploaden
          </label>
          <input id="photos" type="file" multiple className="hidden" />
        </Field>
        <button type="submit" disabled={submitting || loading} className="mt-2 w-full rounded-lg bg-brand-gradient px-4 py-3 text-sm font-medium text-brand-foreground shadow-glow disabled:opacity-60">
          {submitting ? "Versturen…" : "Verstuur opdracht ter review"}
        </button>
        {!user && !loading && (
          <p className="text-xs text-muted-foreground text-center">Je moet ingelogd zijn om een opdracht te plaatsen.</p>
        )}
      </form>
      <style>{`.vk-input{width:100%;border-radius:.5rem;border:1px solid var(--color-border);background:oklch(0.28 0.014 270 / .4);padding:.625rem .75rem;font-size:.875rem;color:var(--color-foreground);outline:none}.vk-input:focus{border-color:var(--color-brand)}`}</style>
    </div>
  );
}

function Field({ label, id, children }: { label: string; id: string; children: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium">{label}</label>
      {children}
    </div>
  );
}