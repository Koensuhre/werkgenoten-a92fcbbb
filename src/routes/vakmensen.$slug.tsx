import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Star, Shield, Clock, MapPin, Award, MessageCircle } from "lucide-react";
import { usePro, initialsOf } from "@/lib/queries";

export const Route = createFileRoute("/vakmensen/$slug")({
  head: ({ params }) => ({
    meta: [
      { title: "Vakman — Werkgenoten" },
      { name: "description", content: "Bekijk dit professionele profiel op Werkgenoten." },
      { property: "og:url", content: `/vakmensen/${params.slug}` },
    ],
    links: [{ rel: "canonical", href: `/vakmensen/${params.slug}` }],
  }),
  notFoundComponent: () => (
    <div className="mx-auto max-w-2xl px-4 py-24 text-center">
      <h1 className="text-2xl font-semibold">Vakman niet gevonden</h1>
      <Link to="/vakmensen" className="mt-4 inline-block text-brand hover:underline">← Terug</Link>
    </div>
  ),
  component: ProDetail,
});

function ProDetail() {
  const { slug } = Route.useParams();
  const { data: pro, isLoading } = usePro(slug);

  if (isLoading) {
    return <div className="mx-auto max-w-5xl px-4 py-24 text-center text-sm text-muted-foreground">Laden…</div>;
  }
  if (!pro) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center">
        <h1 className="text-2xl font-semibold">Vakman niet gevonden</h1>
        <Link to="/vakmensen" className="mt-4 inline-block text-brand hover:underline">← Terug</Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <Link to="/vakmensen" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Alle vakmensen
      </Link>

      <header className="bg-card-gradient shadow-card mt-6 overflow-hidden rounded-2xl border border-border/60">
        <div className="h-32" style={{ background: "linear-gradient(135deg, oklch(0.72 0.18 155 / 0.4), oklch(0.65 0.22 280 / 0.4))" }} />
        <div className="flex flex-wrap items-end gap-6 px-6 pb-6">
          <div className="-mt-10 grid h-20 w-20 place-items-center rounded-2xl border-4 border-background bg-brand-gradient text-xl font-bold text-brand-foreground shadow-glow">
            {initialsOf(pro.display_name ?? pro.company)}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-semibold tracking-tight">{pro.company ?? pro.display_name}</h1>
              {pro.verified && <span className="inline-flex items-center gap-1 rounded-md bg-brand/10 px-2 py-0.5 text-xs text-brand"><Shield className="h-3 w-3" /> Geverifieerd</span>}
            </div>
            <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
              <span>{pro.display_name}</span>
              {pro.city && <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" /> {pro.city}</span>}
              {pro.rating_avg != null && (
                <span className="inline-flex items-center gap-1">
                  <Star className="h-3 w-3 fill-brand text-brand" /> {pro.rating_avg} ({pro.review_count} reviews)
                </span>
              )}
              {pro.response_time && <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" /> Reageert {pro.response_time}</span>}
              {pro.years_experience != null && <span className="inline-flex items-center gap-1"><Award className="h-3 w-3" /> {pro.years_experience} jaar ervaring</span>}
            </div>
          </div>
          <div className="flex gap-2">
            <button className="rounded-lg border border-border bg-surface/60 px-4 py-2 text-sm font-medium hover:bg-surface-2">
              <MessageCircle className="mr-1 inline h-4 w-4" /> Chat
            </button>
            <button className="rounded-lg bg-brand-gradient px-4 py-2 text-sm font-medium text-brand-foreground shadow-glow">
              Vraag offerte aan
            </button>
          </div>
        </div>
      </header>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_280px]">
        <div className="space-y-4">
          <section className="bg-card-gradient shadow-card rounded-xl border border-border/60 p-6">
            <h2 className="text-sm font-medium">Over {pro.company ?? pro.display_name}</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{pro.bio}</p>
          </section>

          <section className="bg-card-gradient shadow-card rounded-xl border border-border/60 p-6">
            <h2 className="text-sm font-medium">Portfolio</h2>
            <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="aspect-square rounded-lg border border-border/60 bg-surface-2/40" />
              ))}
            </div>
          </section>

          <section className="bg-card-gradient shadow-card rounded-xl border border-border/60 p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-medium">Reviews ({pro.review_count})</h2>
              {pro.rating_avg != null && (
                <div className="flex items-baseline gap-1"><span className="text-2xl font-semibold">{pro.rating_avg}</span><span className="text-xs text-muted-foreground">/ 5</span></div>
              )}
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              Nog geen reviews zichtbaar voor dit profiel.
            </p>
          </section>
        </div>

        <aside className="space-y-4">
          <div className="bg-card-gradient shadow-card rounded-xl border border-border/60 p-5">
            <h3 className="text-sm font-medium">Werkgebied</h3>
            <p className="mt-2 text-sm text-muted-foreground">Hoofdregio {pro.city ?? "—"} en omgeving (30 km).</p>
          </div>
          <div className="bg-card-gradient shadow-card rounded-xl border border-border/60 p-5">
            <h3 className="text-sm font-medium">Certificaten</h3>
            <ul className="mt-3 space-y-1.5 text-sm text-muted-foreground">
              <li>✓ KvK ingeschreven</li>
              <li>✓ Verzekerd voor aansprakelijkheid</li>
              <li>✓ Identiteit geverifieerd</li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}