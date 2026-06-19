import { createFileRoute } from "@tanstack/react-router";
import { categories } from "@/lib/mock-data";
import { Upload } from "lucide-react";

export const Route = createFileRoute("/plaats-opdracht")({
  head: () => ({
    meta: [
      { title: "Plaats opdracht — Vakwerk" },
      { name: "description", content: "Plaats gratis een opdracht en ontvang binnen 24 uur offertes." },
      { property: "og:title", content: "Plaats opdracht — Vakwerk" },
      { property: "og:url", content: "/plaats-opdracht" },
    ],
    links: [{ rel: "canonical", href: "/plaats-opdracht" }],
  }),
  component: PostJob,
});

function PostJob() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
      <h1 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">Plaats jouw opdracht</h1>
      <p className="mt-2 text-muted-foreground">Het kost 2 minuten en je betaalt niets.</p>

      <form className="bg-card-gradient shadow-card mt-8 space-y-5 rounded-2xl border border-border/60 p-6">
        <Field label="Wat is de klus?" id="title">
          <input id="title" placeholder="bv. Woonkamer schilderen 35m²" className="vk-input" />
        </Field>
        <Field label="Categorie" id="cat">
          <select id="cat" className="vk-input">
            {categories.map((c) => <option key={c.slug}>{c.name}</option>)}
          </select>
        </Field>
        <Field label="Postcode" id="zip">
          <input id="zip" placeholder="1012 AB" className="vk-input" />
        </Field>
        <Field label="Beschrijving" id="desc">
          <textarea id="desc" rows={5} placeholder="Beschrijf de klus, materiaal en wanneer het moet gebeuren..." className="vk-input min-h-[140px]" />
        </Field>
        <Field label="Richtbudget" id="budget">
          <select id="budget" className="vk-input">
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
        <button type="submit" className="mt-2 w-full rounded-lg bg-brand-gradient px-4 py-3 text-sm font-medium text-brand-foreground shadow-glow">
          Verstuur opdracht
        </button>
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