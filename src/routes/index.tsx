import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, CheckCircle2, Sparkles, Shield, Clock, Star, Zap } from "lucide-react";
import { testimonials, stats, plans } from "@/lib/mock-data";
import { CmsFallback } from "@/components/cms/CmsFallback";
import { useCategories, useJobs, formatBudget, timeAgo } from "@/lib/queries";

const CATEGORY_ICONS: Record<string, string> = {
  schilderwerk: "🎨",
  elektricien: "⚡",
  loodgieter: "🚿",
  timmerman: "🪚",
  dakwerker: "🏠",
  tuinman: "🌿",
  verhuizing: "📦",
  schoonmaak: "✨",
};

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Vakwerk — Vind betrouwbare vakmensen voor elke klus" },
      { name: "description", content: "Plaats gratis een opdracht, ontvang offertes van gecontroleerde professionals en kies de beste match." },
      { property: "og:title", content: "Vakwerk — Vind betrouwbare vakmensen" },
      { property: "og:description", content: "Ontvang offertes van gecontroleerde professionals en kies de beste match." },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Home,
});

function Home() {
  return (
    <CmsFallback
      slug="home"
      fallback={
        <>
          <Hero />
          <Trust />
          <HowItWorks />
          <Categories />
          <FeaturedJobs />
          <Stats />
          <Testimonials />
          <Pricing />
          <CTA />
        </>
      }
    />
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden bg-hero">
      <div className="pointer-events-none absolute inset-0 [background-image:linear-gradient(to_right,oklch(1_0_0/0.04)_1px,transparent_1px),linear-gradient(to_bottom,oklch(1_0_0/0.04)_1px,transparent_1px)] [background-size:48px_48px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_30%,black,transparent)]" />
      <div className="pointer-events-none absolute left-1/2 top-0 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-brand/10 blur-[120px] animate-pulse-glow" />
      <div className="relative mx-auto max-w-7xl px-4 pb-24 pt-20 sm:px-6 sm:pt-28 lg:pt-32">
        <div className="mx-auto max-w-3xl text-center">
          <div className="animate-fade-up inline-flex items-center gap-2 rounded-full border border-border/80 bg-surface/60 px-3 py-1 text-xs text-muted-foreground backdrop-blur">
            <Sparkles className="h-3.5 w-3.5 text-brand" />
            Nieuw · Direct chat met professionals
          </div>
          <h1 className="animate-fade-up text-balance mt-6 text-5xl font-semibold tracking-tight text-gradient sm:text-6xl md:text-7xl">
            Vind betrouwbare vakmensen voor elke klus
          </h1>
          <p className="animate-fade-up mx-auto mt-6 max-w-2xl text-balance text-lg text-muted-foreground">
            Ontvang binnen 24 uur offertes van gecontroleerde professionals in heel Nederland — en kies de beste match.
          </p>
          <div className="animate-fade-up mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              to="/plaats-opdracht"
              className="group inline-flex items-center gap-2 rounded-lg bg-brand-gradient px-6 py-3 text-sm font-medium text-brand-foreground shadow-glow transition-transform hover:scale-[1.02]"
            >
              Plaats opdracht <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              to="/word-professional"
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface/60 px-6 py-3 text-sm font-medium backdrop-blur transition-colors hover:bg-surface-2"
            >
              Word professional
            </Link>
          </div>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1.5"><Shield className="h-3.5 w-3.5 text-brand" /> Gecontroleerde vakmensen</span>
            <span className="inline-flex items-center gap-1.5"><Clock className="h-3.5 w-3.5 text-brand" /> Offertes binnen 24u</span>
            <span className="inline-flex items-center gap-1.5"><Star className="h-3.5 w-3.5 text-brand" /> 96.000+ reviews</span>
          </div>
        </div>

        {/* Floating preview card */}
        <div className="relative mx-auto mt-20 max-w-4xl">
          <div className="absolute -inset-x-20 -inset-y-10 -z-10 rounded-[40px] bg-brand/10 blur-3xl" />
          <div className="glass shadow-elegant overflow-hidden rounded-2xl border border-border/60">
            <div className="flex items-center gap-1.5 border-b border-border/60 px-4 py-3">
              <span className="h-3 w-3 rounded-full bg-destructive/60" />
              <span className="h-3 w-3 rounded-full bg-yellow-500/60" />
              <span className="h-3 w-3 rounded-full bg-brand/60" />
              <span className="ml-3 text-xs text-muted-foreground">vakwerk.app/opdrachten/woonkamer-amsterdam</span>
            </div>
            <div className="grid gap-6 p-6 md:grid-cols-2">
              <div>
                <div className="text-xs text-muted-foreground">Schilderwerk · Amsterdam</div>
                <h3 className="mt-2 text-xl font-semibold">Woonkamer schilderen (35m²)</h3>
                <p className="mt-2 text-sm text-muted-foreground">Witte muren, één accentmuur. Plinten en kozijnen ook lakken.</p>
                <div className="mt-4 flex gap-2 text-xs">
                  <span className="rounded-md bg-surface-2 px-2 py-1">Budget €600 – €900</span>
                  <span className="rounded-md bg-surface-2 px-2 py-1">4 offertes</span>
                </div>
              </div>
              <div className="space-y-2">
                {[
                  { n: "Van Dijk Schilders", p: "€720", r: 4.9 },
                  { n: "PrimaVerf Amsterdam", p: "€780", r: 4.8 },
                  { n: "De Kleurspecialist", p: "€690", r: 4.7 },
                ].map((o) => (
                  <div key={o.n} className="flex items-center justify-between rounded-lg border border-border/60 bg-surface/60 p-3">
                    <div className="flex items-center gap-3">
                      <div className="grid h-9 w-9 place-items-center rounded-md bg-brand-gradient text-xs font-bold text-brand-foreground">{o.n[0]}</div>
                      <div>
                        <div className="text-sm font-medium">{o.n}</div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground"><Star className="h-3 w-3 fill-brand text-brand" /> {o.r}</div>
                      </div>
                    </div>
                    <div className="text-sm font-semibold">{o.p}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Trust() {
  return (
    <section className="border-y border-border/60 bg-surface/30 py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <p className="text-center text-xs uppercase tracking-widest text-muted-foreground">Vertrouwd door professionals en opdrachtgevers in heel Nederland</p>
        <div className="mt-6 grid grid-cols-2 items-center gap-8 opacity-70 sm:grid-cols-4 md:grid-cols-6">
          {["BouwGroep NL", "Klusbedrijf Pro", "TuinExpert", "VakInstallatie", "GildeMeester", "DakKoning"].map((n) => (
            <div key={n} className="text-center text-sm font-medium tracking-tight text-muted-foreground">{n}</div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    { n: "01", t: "Plaats opdracht", d: "Beschrijf jouw klus in 2 minuten. Voeg foto's toe en geef je budget aan." },
    { n: "02", t: "Ontvang offertes", d: "Binnen 24 uur reageren gecontroleerde vakmensen met een passende offerte." },
    { n: "03", t: "Kies professional", d: "Vergelijk reviews, chat met de pro en kies wie de klus uitvoert." },
  ];
  return (
    <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">In 3 stappen naar de juiste vakman</h2>
        <p className="mt-3 text-muted-foreground">Sneller, transparanter en betrouwbaarder dan rondbellen.</p>
      </div>
      <div className="mt-14 grid gap-4 md:grid-cols-3">
        {steps.map((s) => (
          <div key={s.n} className="bg-card-gradient shadow-card relative overflow-hidden rounded-2xl border border-border/60 p-6">
            <div className="text-xs font-mono text-brand">{s.n}</div>
            <h3 className="mt-4 text-lg font-semibold">{s.t}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{s.d}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function Categories() {
  const { data: categories = [] } = useCategories();
  return (
    <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Populaire categorieën</h2>
          <p className="mt-2 text-muted-foreground">Van schilderwerk tot dakwerk — vind de juiste vakman.</p>
        </div>
        <Link to="/vakmensen" className="text-sm text-brand hover:underline">Alle vakmensen →</Link>
      </div>
      <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
        {categories.map((c) => (
          <Link
            key={c.slug}
            to="/vakmensen"
            className="group bg-card-gradient shadow-card relative overflow-hidden rounded-xl border border-border/60 p-5 transition-all hover:border-brand/40 hover:shadow-glow"
          >
            <div className="text-3xl">{CATEGORY_ICONS[c.slug] ?? "🛠️"}</div>
            <div className="mt-3 font-medium">{c.name}</div>
            {c.description && (
              <div className="mt-1 text-xs text-muted-foreground line-clamp-1">{c.description}</div>
            )}
            <ArrowRight className="absolute right-4 top-4 h-4 w-4 text-muted-foreground opacity-0 transition-all group-hover:opacity-100 group-hover:translate-x-0.5" />
          </Link>
        ))}
      </div>
    </section>
  );
}

function FeaturedJobs() {
  const { data: allJobs = [] } = useJobs();
  const jobs = allJobs.slice(0, 6);
  return (
    <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Verse opdrachten</h2>
          <p className="mt-2 text-muted-foreground">Live geplaatste klussen wachten op een offerte.</p>
        </div>
        <Link to="/opdrachten" className="text-sm text-brand hover:underline">Alle opdrachten →</Link>
      </div>
      <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {jobs.map((j) => (
          <Link
            key={j.id}
            to="/opdrachten/$slug"
            params={{ slug: j.slug }}
            className="bg-card-gradient shadow-card group rounded-xl border border-border/60 p-5 transition-colors hover:border-brand/40"
          >
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span className="rounded-md bg-surface-2 px-2 py-0.5">{j.category?.name ?? "—"}</span>
              {j.urgent && <span className="inline-flex items-center gap-1 text-brand"><Zap className="h-3 w-3" /> Spoed</span>}
            </div>
            <h3 className="mt-3 font-semibold leading-snug">{j.title}</h3>
            <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{j.description}</p>
            <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
              <span>{j.city} · {timeAgo(j.created_at)}</span>
              <span className="font-medium text-foreground">{formatBudget(j.budget_min, j.budget_max)}</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

function Stats() {
  return (
    <section className="border-y border-border/60 bg-surface/30 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid grid-cols-2 gap-8 text-center md:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label}>
              <div className="text-gradient-brand text-4xl font-semibold tracking-tight sm:text-5xl">
                {typeof s.value === "number" && s.value > 100 ? s.value.toLocaleString("nl-NL") : s.value}
                <span>{s.suffix}</span>
              </div>
              <div className="mt-2 text-sm text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Wat anderen zeggen</h2>
        <p className="mt-2 text-muted-foreground">Eerlijke reviews, na elke afgeronde klus.</p>
      </div>
      <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {testimonials.map((t) => (
          <figure key={t.name} className="bg-card-gradient shadow-card rounded-xl border border-border/60 p-5">
            <div className="flex gap-0.5 text-brand">
              {Array.from({ length: t.rating }).map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-brand" />
              ))}
            </div>
            <blockquote className="mt-3 text-sm">{t.quote}</blockquote>
            <figcaption className="mt-4 text-xs">
              <div className="font-medium">{t.name}</div>
              <div className="text-muted-foreground">{t.role}</div>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}

function Pricing() {
  return (
    <section id="pricing" className="mx-auto max-w-7xl px-4 py-24 sm:px-6">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Eenvoudige prijzen voor professionals</h2>
        <p className="mt-2 text-muted-foreground">Opdrachtgevers gebruiken Vakwerk gratis. Professionals betalen per maand.</p>
      </div>
      <div className="mt-12 grid gap-4 md:grid-cols-3">
        {plans.map((p) => (
          <div
            key={p.name}
            className={`relative rounded-2xl border p-6 ${p.highlight ? "border-brand/50 bg-card-gradient shadow-glow" : "border-border/60 bg-card-gradient shadow-card"}`}
          >
            {p.highlight && (
              <span className="absolute -top-3 left-6 rounded-full bg-brand-gradient px-3 py-0.5 text-xs font-medium text-brand-foreground">
                Aanbevolen
              </span>
            )}
            <div className="text-sm font-medium">{p.name}</div>
            <div className="mt-4 flex items-baseline gap-1">
              <span className="text-4xl font-semibold tracking-tight">€{p.price}</span>
              <span className="text-sm text-muted-foreground">/maand</span>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">{p.tagline}</p>
            <ul className="mt-6 space-y-2 text-sm">
              {p.features.map((f) => (
                <li key={f} className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            <Link
              to="/word-professional"
              className={`mt-8 block rounded-lg px-4 py-2.5 text-center text-sm font-medium transition-colors ${p.highlight ? "bg-brand-gradient text-brand-foreground" : "border border-border bg-surface hover:bg-surface-2"}`}
            >
              {p.cta}
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6">
      <div className="bg-card-gradient shadow-elegant relative overflow-hidden rounded-3xl border border-border/60 px-8 py-20 text-center">
        <div className="pointer-events-none absolute inset-0 [background-image:radial-gradient(circle_at_50%_50%,oklch(0.72_0.18_155/0.18),transparent_60%)]" />
        <div className="relative">
          <h2 className="text-balance text-3xl font-semibold tracking-tight sm:text-5xl">Klaar voor de juiste vakman?</h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">Plaats gratis een opdracht en ontvang vandaag nog offertes.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link to="/plaats-opdracht" className="rounded-lg bg-brand-gradient px-6 py-3 text-sm font-medium text-brand-foreground shadow-glow">
              Plaats opdracht
            </Link>
            <Link to="/hoe-werkt-het" className="rounded-lg border border-border bg-surface/60 px-6 py-3 text-sm font-medium">
              Bekijk hoe het werkt
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
