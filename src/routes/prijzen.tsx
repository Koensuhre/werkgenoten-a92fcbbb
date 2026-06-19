import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2 } from "lucide-react";
import { plans } from "@/lib/mock-data";

export const Route = createFileRoute("/prijzen")({
  head: () => ({
    meta: [
      { title: "Prijzen — Vakwerk" },
      { name: "description", content: "Heldere abonnementen voor professionals. Opdrachtgevers gebruiken Vakwerk gratis." },
      { property: "og:title", content: "Prijzen — Vakwerk" },
      { property: "og:description", content: "Abonnementen voor professionals." },
      { property: "og:url", content: "/prijzen" },
    ],
    links: [{ rel: "canonical", href: "/prijzen" }],
  }),
  component: Pricing,
});

function Pricing() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
      <div className="text-center">
        <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl">Eenvoudige prijzen, geen verrassingen</h1>
        <p className="mx-auto mt-4 max-w-xl text-muted-foreground">Opdrachtgevers betalen niets. Professionals kiezen een abonnement dat bij hun bedrijf past.</p>
      </div>
      <div className="mt-14 grid gap-4 md:grid-cols-3">
        {plans.map((p) => (
          <div key={p.name} className={`relative rounded-2xl border p-6 ${p.highlight ? "border-brand/50 bg-card-gradient shadow-glow" : "border-border/60 bg-card-gradient shadow-card"}`}>
            {p.highlight && <span className="absolute -top-3 left-6 rounded-full bg-brand-gradient px-3 py-0.5 text-xs font-medium text-brand-foreground">Aanbevolen</span>}
            <div className="text-sm font-medium">{p.name}</div>
            <div className="mt-4 flex items-baseline gap-1"><span className="text-4xl font-semibold">€{p.price}</span><span className="text-sm text-muted-foreground">/maand</span></div>
            <p className="mt-2 text-sm text-muted-foreground">{p.tagline}</p>
            <ul className="mt-6 space-y-2 text-sm">
              {p.features.map((f) => (
                <li key={f} className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand" /><span>{f}</span>
                </li>
              ))}
            </ul>
            <Link to="/word-professional" className={`mt-8 block rounded-lg px-4 py-2.5 text-center text-sm font-medium ${p.highlight ? "bg-brand-gradient text-brand-foreground" : "border border-border bg-surface hover:bg-surface-2"}`}>
              {p.cta}
            </Link>
          </div>
        ))}
      </div>
      <p className="mt-10 text-center text-xs text-muted-foreground">Alle prijzen zijn exclusief BTW. Maandelijks opzegbaar.</p>
    </div>
  );
}