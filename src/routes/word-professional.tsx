import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { CheckCircle2, TrendingUp, Users, Star } from "lucide-react";
import { useState } from "react";
import { useSession } from "@/hooks/use-session";
import { useCurrentProfile } from "@/hooks/use-current-profile";
import { supabase } from "@/integrations/supabase/client";
import { useCategories } from "@/lib/queries";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

export const Route = createFileRoute("/word-professional")({
  head: () => ({
    meta: [
      { title: "Word professional — Werkgenoten" },
      { name: "description", content: "Groei je bedrijf met leads van Werkgenoten." },
      { property: "og:title", content: "Word professional — Werkgenoten" },
      { property: "og:url", content: "/word-professional" },
    ],
    links: [{ rel: "canonical", href: "/word-professional" }],
  }),
  component: BecomePro,
});

function BecomePro() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { user, loading } = useSession();
  const { data: profile } = useCurrentProfile();
  const { data: cats = [] } = useCategories();
  const [submitting, setSubmitting] = useState(false);

  const alreadyPro = profile?.primary_type === "professional";
  const reviewStatus = profile?.review_status as string | undefined;

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!user) {
      toast.error("Log eerst in om je als professional aan te melden");
      navigate({ to: "/auth" });
      return;
    }
    const fd = new FormData(e.currentTarget);
    const company = String(fd.get("bedrijf") ?? "").trim();
    const naam = String(fd.get("naam") ?? "").trim();
    const city = String(fd.get("zip") ?? "").trim();
    const categorySlug = String(fd.get("cat") ?? "");
    const yearsRaw = String(fd.get("jaren") ?? "");
    const bio = String(fd.get("bio") ?? "").trim();
    if (!company || !naam) {
      toast.error("Bedrijfsnaam en naam zijn verplicht");
      return;
    }
    const category = cats.find((c) => c.slug === categorySlug);
    setSubmitting(true);
    const { error } = await supabase
      .from("profiles")
      .update({
        primary_type: "professional",
        display_name: naam,
        company,
        city: city || null,
        category_id: category?.id ?? null,
        years_experience: yearsRaw ? Number(yearsRaw) : null,
        bio: bio || null,
        slug: company
          .toLowerCase()
          .normalize("NFKD")
          .replace(/[^\w\s-]/g, "")
          .trim()
          .replace(/\s+/g, "-") + "-" + Math.random().toString(36).slice(2, 6),
      })
      .eq("id", user.id);
    setSubmitting(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Aanmelding ingediend voor review");
    qc.invalidateQueries({ queryKey: ["profile"] });
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-20 sm:px-6">
      <div className="text-center">
        <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl">Groei jouw bedrijf met Werkgenoten</h1>
        <p className="mx-auto mt-4 max-w-xl text-muted-foreground">Krijg direct leads in jouw regio, bouw aan reviews en laat marketing aan ons over.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link to="/prijzen" className="rounded-lg bg-brand-gradient px-6 py-3 text-sm font-medium text-brand-foreground shadow-glow">Bekijk abonnementen</Link>
          <a href="#aanmelden" className="rounded-lg border border-border bg-surface/60 px-6 py-3 text-sm font-medium">Direct aanmelden</a>
        </div>
      </div>

      <div className="mt-16 grid gap-4 md:grid-cols-3">
        {[
          { icon: <TrendingUp className="h-5 w-5" />, t: "60% nieuwe omzet", d: "Gemiddeld percentage nieuwe klanten dat onze pro's via Werkgenoten haalt." },
          { icon: <Users className="h-5 w-5" />, t: "12.480+ collega's", d: "Sluit je aan bij de grootste community van vakmensen in Nederland." },
          { icon: <Star className="h-5 w-5" />, t: "Reviews die converteren", d: "Authentieke beoordelingen na elke afgeronde klus." },
        ].map((b) => (
          <div key={b.t} className="bg-card-gradient shadow-card rounded-2xl border border-border/60 p-6">
            <div className="grid h-10 w-10 place-items-center rounded-lg bg-brand-gradient text-brand-foreground">{b.icon}</div>
            <h3 className="mt-4 font-semibold">{b.t}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{b.d}</p>
          </div>
        ))}
      </div>

      <section id="aanmelden" className="bg-card-gradient shadow-card mt-16 rounded-2xl border border-border/60 p-8">
        <h2 className="text-2xl font-semibold">Aanmelden als professional</h2>
        {alreadyPro && reviewStatus === "pending_review" && (
          <div className="mt-4 rounded-lg bg-amber-500/15 p-4 text-sm text-amber-500">
            Je aanmelding is in review. Je hoort zo snel mogelijk van een admin.
          </div>
        )}
        {alreadyPro && reviewStatus === "approved" && (
          <div className="mt-4 rounded-lg bg-brand/15 p-4 text-sm text-brand">
            Je bent al een goedgekeurde professional. Ga naar je <Link to="/dashboard" className="underline">dashboard</Link>.
          </div>
        )}
        {alreadyPro && reviewStatus === "rejected" && (
          <div className="mt-4 rounded-lg bg-destructive/15 p-4 text-sm text-destructive">
            Je aanmelding is afgewezen{profile?.review_notes ? `: ${profile.review_notes}` : ""}.
          </div>
        )}
        {!alreadyPro && (
          <form onSubmit={onSubmit} className="mt-6 grid gap-4 sm:grid-cols-2">
            <Field label="Bedrijfsnaam" id="bedrijf" />
            <Field label="KvK nummer" id="kvk" />
            <Field label="Naam contactpersoon" id="naam" required />
            <Field label="Telefoon" id="tel" />
            <Field label="Stad" id="zip" />
            <div>
              <label htmlFor="cat" className="mb-1.5 block text-sm font-medium">Categorie</label>
              <select id="cat" name="cat" className="w-full rounded-lg border border-border bg-input/40 px-3 py-2 text-sm focus:border-brand focus:outline-none">
                <option value="">— Kies —</option>
                {cats.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
              </select>
            </div>
            <Field label="Jaren ervaring" id="jaren" type="number" />
            <div className="sm:col-span-2">
              <label htmlFor="bio" className="mb-1.5 block text-sm font-medium">Korte bio</label>
              <textarea id="bio" name="bio" rows={4} className="w-full rounded-lg border border-border bg-input/40 px-3 py-2 text-sm focus:border-brand focus:outline-none" />
            </div>
            <div className="sm:col-span-2 mt-2 flex items-start gap-2 text-sm">
              <CheckCircle2 className="mt-0.5 h-4 w-4 text-brand" />
              <span className="text-muted-foreground">Je aanmelding wordt eerst door een admin gecontroleerd voordat je profiel zichtbaar wordt en je opdrachten kunt aannemen.</span>
            </div>
            <button type="submit" disabled={submitting || loading} className="sm:col-span-2 mt-2 rounded-lg bg-brand-gradient px-4 py-3 text-sm font-medium text-brand-foreground shadow-glow disabled:opacity-60">
              {submitting ? "Versturen…" : "Verstuur aanmelding"}
            </button>
            {!user && !loading && (
              <p className="sm:col-span-2 text-center text-xs text-muted-foreground">
                <Link to="/auth" className="text-brand hover:underline">Log eerst in of registreer</Link>.
              </p>
            )}
          </form>
        )}
      </section>
    </div>
  );
}

function Field({ label, id, type = "text", required }: { label: string; id: string; type?: string; required?: boolean }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium">{label}{required && " *"}</label>
      <input id={id} name={id} type={type} required={required} className="w-full rounded-lg border border-border bg-input/40 px-3 py-2 text-sm focus:border-brand focus:outline-none" />
    </div>
  );
}