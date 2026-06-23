import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, MapPin, Clock, Euro, Star, Shield, MessageCircle } from "lucide-react";
import { useJob, formatBudget, timeAgo } from "@/lib/queries";

export const Route = createFileRoute("/opdrachten/$slug")({
  head: ({ params }) => ({
    meta: [
      { title: "Opdracht — Werkgenoten" },
      { name: "description", content: "Bekijk de opdracht en stuur een offerte." },
      { property: "og:type", content: "article" },
      { property: "og:url", content: `/opdrachten/${params.slug}` },
    ],
    links: [{ rel: "canonical", href: `/opdrachten/${params.slug}` }],
  }),
  notFoundComponent: () => (
    <div className="mx-auto max-w-2xl px-4 py-24 text-center">
      <h1 className="text-2xl font-semibold">Opdracht niet gevonden</h1>
      <Link to="/opdrachten" className="mt-4 inline-block text-brand hover:underline">← Terug naar opdrachten</Link>
    </div>
  ),
  component: JobDetail,
});

function JobDetail() {
  const { slug } = Route.useParams();
  const { data: job, isLoading } = useJob(slug);

  if (isLoading) {
    return <div className="mx-auto max-w-5xl px-4 py-24 text-center text-sm text-muted-foreground">Laden…</div>;
  }
  if (!job) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center">
        <h1 className="text-2xl font-semibold">Opdracht niet gevonden</h1>
        <Link to="/opdrachten" className="mt-4 inline-block text-brand hover:underline">← Terug naar opdrachten</Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <Link to="/opdrachten" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Alle opdrachten
      </Link>
      <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_320px]">
        <article>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="rounded-md bg-surface-2 px-2 py-0.5">{job.category?.name ?? "—"}</span>
            <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" /> {job.city}</span>
            <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" /> {timeAgo(job.created_at)}</span>
          </div>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">{job.title}</h1>

          <div className="bg-card-gradient shadow-card mt-6 rounded-xl border border-border/60 p-6">
            <h2 className="text-sm font-medium">Beschrijving</h2>
            <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-muted-foreground">{job.description}</p>
          </div>

          <div className="bg-card-gradient shadow-card mt-4 rounded-xl border border-border/60 p-6">
            <h2 className="text-sm font-medium">Foto's</h2>
            <div className="mt-3 grid grid-cols-3 gap-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="aspect-square rounded-lg border border-dashed border-border bg-surface-2/40" />
              ))}
            </div>
          </div>

          <div className="bg-card-gradient shadow-card mt-4 rounded-xl border border-border/60 p-6">
            <h2 className="text-sm font-medium">Ontvangen offertes ({job.offers})</h2>
            {job.offers === 0 ? (
              <p className="mt-3 text-sm text-muted-foreground">Nog geen offertes ontvangen.</p>
            ) : (
              <p className="mt-3 text-sm text-muted-foreground">
                {job.offers} {job.offers === 1 ? "offerte" : "offertes"} — log in als opdrachtgever om ze te zien.
              </p>
            )}
          </div>
        </article>

        <aside className="space-y-3">
          <div className="bg-card-gradient shadow-card sticky top-20 rounded-xl border border-border/60 p-5">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Budget</span>
              <Euro className="h-3.5 w-3.5" />
            </div>
            <div className="mt-1 text-2xl font-semibold">{formatBudget(job.budget_min, job.budget_max)}</div>
            <button className="mt-5 w-full rounded-lg bg-brand-gradient px-4 py-2.5 text-sm font-medium text-brand-foreground shadow-glow">
              Offerte versturen
            </button>
            <button className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-lg border border-border bg-surface/60 px-4 py-2.5 text-sm font-medium hover:bg-surface-2">
              <MessageCircle className="h-4 w-4" /> Stel een vraag
            </button>
            <div className="mt-5 border-t border-border/60 pt-4 text-xs">
              <div className="font-medium">Opdrachtgever</div>
              <div className="mt-2 flex items-center gap-2">
                <div className="grid h-8 w-8 place-items-center rounded-full bg-surface-2 text-xs font-medium">
                  {(job.client?.display_name ?? "?")[0]}
                </div>
                <div>
                  <div className="text-sm">{job.client?.display_name ?? "Opdrachtgever"}</div>
                  {job.client?.city && (
                    <div className="text-muted-foreground">{job.client.city}</div>
                  )}
                </div>
              </div>
              <div className="mt-3 inline-flex items-center gap-1 rounded-md bg-brand/10 px-2 py-1 text-brand">
                <Shield className="h-3 w-3" /> Geverifieerd
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}