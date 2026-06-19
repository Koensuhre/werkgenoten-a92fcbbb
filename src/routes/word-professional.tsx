import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, TrendingUp, Users, Star } from "lucide-react";

export const Route = createFileRoute("/word-professional")({
  head: () => ({
    meta: [
      { title: "Word professional — Vakwerk" },
      { name: "description", content: "Groei je bedrijf met leads van Vakwerk." },
      { property: "og:title", content: "Word professional — Vakwerk" },
      { property: "og:url", content: "/word-professional" },
    ],
    links: [{ rel: "canonical", href: "/word-professional" }],
  }),
  component: BecomePro,
});

function BecomePro() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-20 sm:px-6">
      <div className="text-center">
        <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl">Groei jouw bedrijf met Vakwerk</h1>
        <p className="mx-auto mt-4 max-w-xl text-muted-foreground">Krijg direct leads in jouw regio, bouw aan reviews en laat marketing aan ons over.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link to="/prijzen" className="rounded-lg bg-brand-gradient px-6 py-3 text-sm font-medium text-brand-foreground shadow-glow">Bekijk abonnementen</Link>
          <a href="#aanmelden" className="rounded-lg border border-border bg-surface/60 px-6 py-3 text-sm font-medium">Direct aanmelden</a>
        </div>
      </div>

      <div className="mt-16 grid gap-4 md:grid-cols-3">
        {[
          { icon: <TrendingUp className="h-5 w-5" />, t: "60% nieuwe omzet", d: "Gemiddeld percentage nieuwe klanten dat onze pro's via Vakwerk haalt." },
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
        <form className="mt-6 grid gap-4 sm:grid-cols-2">
          {[
            ["Bedrijfsnaam", "bedrijf"],
            ["KvK nummer", "kvk"],
            ["Naam contactpersoon", "naam"],
            ["E-mail", "email"],
            ["Telefoon", "tel"],
            ["Postcode", "zip"],
          ].map(([l, id]) => (
            <div key={id}>
              <label htmlFor={id} className="mb-1.5 block text-sm font-medium">{l}</label>
              <input id={id} className="w-full rounded-lg border border-border bg-input/40 px-3 py-2 text-sm focus:border-brand focus:outline-none" />
            </div>
          ))}
          <div className="sm:col-span-2 mt-2 flex items-start gap-2 text-sm">
            <CheckCircle2 className="mt-0.5 h-4 w-4 text-brand" />
            <span className="text-muted-foreground">Geen kosten tijdens 14 dagen proefperiode. Daarna maandelijks opzegbaar.</span>
          </div>
          <button className="sm:col-span-2 mt-2 rounded-lg bg-brand-gradient px-4 py-3 text-sm font-medium text-brand-foreground shadow-glow">
            Start gratis proefperiode
          </button>
        </form>
      </section>
    </div>
  );
}