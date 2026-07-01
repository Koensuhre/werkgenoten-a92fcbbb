/**
 * ============================================================================
 * TEMPLATE-VOORBEELD — Voorbeeldpagina op basis van de homepage
 * ============================================================================
 *
 * ⚠️  Deze file staat BEWUST buiten `src/routes/` zodat TanStack Router hem
 *     NIET registreert. Er ontstaat dus geen URL en de template is niet
 *     zichtbaar op de website.
 *
 * Gebruik:
 *   1. Maak een nieuwe route aan in `src/routes/`, bv. `over-ons.tsx`.
 *   2. Kopieer de secties hieronder die je nodig hebt naar die route.
 *   3. Vervang de teksten door je eigen content en pas kleuren aan via de
 *      semantische Tailwind-tokens (bg-brand, text-muted-foreground, etc.)
 *      — NOOIT hardcoded hex-kleuren gebruiken.
 *
 * Zie `README.md` in deze map voor volledige uitleg.
 * ============================================================================
 */

import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Shield,
  Clock,
  Star,
  Zap,
} from "lucide-react";

/* -------------------------------------------------------------------------- */
/*  HOOFDCOMPONENT                                                            */
/*  Combineer/verwijder secties naar wens.                                    */
/* -------------------------------------------------------------------------- */

export function PageTemplate() {
  return (
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
  );
}

/* -------------------------------------------------------------------------- */
/*  HERO SECTIE                                                               */
/*  - Grid-achtergrond met radiaal masker                                     */
/*  - Glow-blur achter de titel                                               */
/*  - Gradient-heading + twee CTA-knoppen                                     */
/*  - Floating "preview card" voor social proof                               */
/* -------------------------------------------------------------------------- */

function Hero() {
  return (
    <section className="relative overflow-hidden bg-hero">
      <div className="pointer-events-none absolute inset-0 [background-image:linear-gradient(to_right,oklch(1_0_0/0.04)_1px,transparent_1px),linear-gradient(to_bottom,oklch(1_0_0/0.04)_1px,transparent_1px)] [background-size:48px_48px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_30%,black,transparent)]" />
      <div className="pointer-events-none absolute left-1/2 top-0 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-brand/10 blur-[120px] animate-pulse-glow" />
      <div className="relative mx-auto max-w-7xl px-4 pb-24 pt-20 sm:px-6 sm:pt-28 lg:pt-32">
        <div className="mx-auto max-w-3xl text-center">
          <div className="animate-fade-up inline-flex items-center gap-2 rounded-full border border-border/80 bg-surface/60 px-3 py-1 text-xs text-muted-foreground backdrop-blur">
            <Sparkles className="h-3.5 w-3.5 text-brand" />
            Badge · Optionele intro-tekst
          </div>
          <h1 className="animate-fade-up text-balance mt-6 text-5xl font-semibold tracking-tight text-gradient sm:text-6xl md:text-7xl">
            Voorbeeld-heading voor je nieuwe pagina
          </h1>
          <p className="animate-fade-up mx-auto mt-6 max-w-2xl text-balance text-lg text-muted-foreground">
            Korte, wervende ondertitel die uitlegt wat de pagina doet en waarom
            de bezoeker verder moet lezen.
          </p>
          <div className="animate-fade-up mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            {/* Primaire CTA — gebruik altijd bg-brand-gradient */}
            <Link
              to="/"
              className="group inline-flex items-center gap-2 rounded-lg bg-brand-gradient px-6 py-3 text-sm font-medium text-brand-foreground shadow-glow transition-transform hover:scale-[1.02]"
            >
              Primaire actie
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            {/* Secundaire CTA — glass/border variant */}
            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface/60 px-6 py-3 text-sm font-medium backdrop-blur transition-colors hover:bg-surface-2"
            >
              Secundaire actie
            </Link>
          </div>
          {/* Trust-indicators onder de CTA's */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <Shield className="h-3.5 w-3.5 text-brand" /> Trust-indicator 1
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-brand" /> Trust-indicator 2
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Star className="h-3.5 w-3.5 text-brand" /> Trust-indicator 3
            </span>
          </div>
        </div>

        {/* Floating preview card — optioneel, geeft "product-shot" gevoel */}
        <div className="relative mx-auto mt-20 max-w-4xl">
          <div className="absolute -inset-x-20 -inset-y-10 -z-10 rounded-[40px] bg-brand/10 blur-3xl" />
          <div className="glass shadow-elegant overflow-hidden rounded-2xl border border-border/60">
            <div className="flex items-center gap-1.5 border-b border-border/60 px-4 py-3">
              <span className="h-3 w-3 rounded-full bg-destructive/60" />
              <span className="h-3 w-3 rounded-full bg-yellow-500/60" />
              <span className="h-3 w-3 rounded-full bg-brand/60" />
              <span className="ml-3 text-xs text-muted-foreground">
                voorbeeld.werkgenoten.nl/pagina
              </span>
            </div>
            <div className="grid gap-6 p-6 md:grid-cols-2">
              <div>
                <div className="text-xs text-muted-foreground">Categorie · Locatie</div>
                <h3 className="mt-2 text-xl font-semibold">Voorbeeld-item titel</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Korte beschrijving van het item dat je in de card wilt tonen.
                </p>
                <div className="mt-4 flex gap-2 text-xs">
                  <span className="rounded-md bg-surface-2 px-2 py-1">Label A</span>
                  <span className="rounded-md bg-surface-2 px-2 py-1">Label B</span>
                </div>
              </div>
              <div className="space-y-2">
                {[
                  { n: "Item één", p: "€100", r: 4.9 },
                  { n: "Item twee", p: "€120", r: 4.8 },
                  { n: "Item drie", p: "€95", r: 4.7 },
                ].map((o) => (
                  <div
                    key={o.n}
                    className="flex items-center justify-between rounded-lg border border-border/60 bg-surface/60 p-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="grid h-9 w-9 place-items-center rounded-md bg-brand-gradient text-xs font-bold text-brand-foreground">
                        {o.n[0]}
                      </div>
                      <div>
                        <div className="text-sm font-medium">{o.n}</div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Star className="h-3 w-3 fill-brand text-brand" /> {o.r}
                        </div>
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

/* -------------------------------------------------------------------------- */
/*  TRUST SECTIE — logo-strook of "vertrouwd door" balk                       */
/* -------------------------------------------------------------------------- */

function Trust() {
  const names = ["Merk 1", "Merk 2", "Merk 3", "Merk 4", "Merk 5", "Merk 6"];
  return (
    <section className="border-y border-border/60 bg-surface/30 py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <p className="text-center text-xs uppercase tracking-widest text-muted-foreground">
          Vertrouwd door toonaangevende bedrijven
        </p>
        <div className="mt-6 grid grid-cols-2 items-center gap-8 opacity-70 sm:grid-cols-4 md:grid-cols-6">
          {names.map((n) => (
            <div
              key={n}
              className="text-center text-sm font-medium tracking-tight text-muted-foreground"
            >
              {n}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  HOW IT WORKS — 3-staps uitleg in gradient cards                           */
/* -------------------------------------------------------------------------- */

function HowItWorks() {
  const steps = [
    { n: "01", t: "Stap één", d: "Korte uitleg van wat de gebruiker doet in stap 1." },
    { n: "02", t: "Stap twee", d: "Korte uitleg van wat er in stap 2 gebeurt." },
    { n: "03", t: "Stap drie", d: "Afronding of resultaat na stap 3." },
  ];
  return (
    <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
          Sectie-titel in 3 stappen
        </h2>
        <p className="mt-3 text-muted-foreground">Optionele ondertitel voor context.</p>
      </div>
      <div className="mt-14 grid gap-4 md:grid-cols-3">
        {steps.map((s) => (
          <div
            key={s.n}
            className="bg-card-gradient shadow-card relative overflow-hidden rounded-2xl border border-border/60 p-6"
          >
            <div className="text-xs font-mono text-brand">{s.n}</div>
            <h3 className="mt-4 text-lg font-semibold">{s.t}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{s.d}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  CATEGORIES — grid met iconen (statische voorbeelddata)                    */
/*  In productie: vervang door useCategories() uit @/lib/queries.             */
/* -------------------------------------------------------------------------- */

function Categories() {
  const categories = [
    { slug: "cat-1", name: "Categorie 1", icon: "🎨", description: "Korte beschrijving" },
    { slug: "cat-2", name: "Categorie 2", icon: "⚡", description: "Korte beschrijving" },
    { slug: "cat-3", name: "Categorie 3", icon: "🚿", description: "Korte beschrijving" },
    { slug: "cat-4", name: "Categorie 4", icon: "🪚", description: "Korte beschrijving" },
  ];
  return (
    <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Populaire categorieën
          </h2>
          <p className="mt-2 text-muted-foreground">Optionele ondertitel.</p>
        </div>
        <Link to="/" className="text-sm text-brand hover:underline">
          Bekijk alles →
        </Link>
      </div>
      <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
        {categories.map((c) => (
          <Link
            key={c.slug}
            to="/"
            className="group bg-card-gradient shadow-card relative overflow-hidden rounded-xl border border-border/60 p-5 transition-all hover:border-brand/40 hover:shadow-glow"
          >
            <div className="text-3xl">{c.icon}</div>
            <div className="mt-3 font-medium">{c.name}</div>
            <div className="mt-1 text-xs text-muted-foreground line-clamp-1">
              {c.description}
            </div>
            <ArrowRight className="absolute right-4 top-4 h-4 w-4 text-muted-foreground opacity-0 transition-all group-hover:opacity-100 group-hover:translate-x-0.5" />
          </Link>
        ))}
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  FEATURED JOBS — kaartlijst (statische voorbeelddata)                      */
/*  In productie: vervang door useJobs() uit @/lib/queries.                   */
/* -------------------------------------------------------------------------- */

function FeaturedJobs() {
  const jobs = [
    { id: "1", title: "Voorbeeld item 1", category: "Categorie", city: "Amsterdam", time: "2 uur geleden", budget: "€500 – €800", urgent: true, description: "Beschrijving van het item." },
    { id: "2", title: "Voorbeeld item 2", category: "Categorie", city: "Utrecht",   time: "5 uur geleden", budget: "€200 – €400", urgent: false, description: "Beschrijving van het item." },
    { id: "3", title: "Voorbeeld item 3", category: "Categorie", city: "Rotterdam", time: "1 dag geleden", budget: "€900 – €1200", urgent: false, description: "Beschrijving van het item." },
  ];
  return (
    <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Uitgelichte items</h2>
          <p className="mt-2 text-muted-foreground">Optionele ondertitel.</p>
        </div>
        <Link to="/" className="text-sm text-brand hover:underline">Bekijk alles →</Link>
      </div>
      <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {jobs.map((j) => (
          <div
            key={j.id}
            className="bg-card-gradient shadow-card group rounded-xl border border-border/60 p-5 transition-colors hover:border-brand/40"
          >
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span className="rounded-md bg-surface-2 px-2 py-0.5">{j.category}</span>
              {j.urgent && (
                <span className="inline-flex items-center gap-1 text-brand">
                  <Zap className="h-3 w-3" /> Spoed
                </span>
              )}
            </div>
            <h3 className="mt-3 font-semibold leading-snug">{j.title}</h3>
            <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{j.description}</p>
            <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
              <span>{j.city} · {j.time}</span>
              <span className="font-medium text-foreground">{j.budget}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  STATS — grote getallen met gradient-effect                                */
/* -------------------------------------------------------------------------- */

function Stats() {
  const stats = [
    { value: "10.000", suffix: "+", label: "Tevreden klanten" },
    { value: "96",     suffix: "%",  label: "Positieve reviews" },
    { value: "24",     suffix: "u",  label: "Gemiddelde reactietijd" },
    { value: "500",    suffix: "+",  label: "Professionals" },
  ];
  return (
    <section className="border-y border-border/60 bg-surface/30 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid grid-cols-2 gap-8 text-center md:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label}>
              <div className="text-gradient-brand text-4xl font-semibold tracking-tight sm:text-5xl">
                {s.value}
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

/* -------------------------------------------------------------------------- */
/*  TESTIMONIALS — quote-kaarten met sterrenrating                            */
/* -------------------------------------------------------------------------- */

function Testimonials() {
  const testimonials = [
    { name: "Jan de Vries",    role: "Opdrachtgever", rating: 5, quote: "Uitstekende ervaring, snelle service." },
    { name: "Maria Jansen",    role: "Professional",  rating: 5, quote: "Ik vind hier iedere week nieuwe klussen." },
    { name: "Peter Bakker",    role: "Opdrachtgever", rating: 4, quote: "Duidelijk platform, prettig in gebruik." },
    { name: "Lisa van den Berg", role: "Professional", rating: 5, quote: "Top offertesysteem, erg overzichtelijk." },
  ];
  return (
    <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Wat anderen zeggen</h2>
        <p className="mt-2 text-muted-foreground">Optionele ondertitel.</p>
      </div>
      <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {testimonials.map((t) => (
          <figure
            key={t.name}
            className="bg-card-gradient shadow-card rounded-xl border border-border/60 p-5"
          >
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

/* -------------------------------------------------------------------------- */
/*  PRICING — 3-kolom prijstabel met "highlight" middenkolom                  */
/* -------------------------------------------------------------------------- */

function Pricing() {
  const plans = [
    { name: "Starter",      price: 0,  tagline: "Voor kleine projecten.", highlight: false, cta: "Kies Starter", features: ["Feature 1", "Feature 2", "Feature 3"] },
    { name: "Professional", price: 29, tagline: "Voor actieve gebruikers.", highlight: true,  cta: "Kies Professional", features: ["Alles uit Starter", "Feature 4", "Feature 5", "Feature 6"] },
    { name: "Business",     price: 79, tagline: "Voor teams.",              highlight: false, cta: "Kies Business", features: ["Alles uit Professional", "Feature 7", "Feature 8"] },
  ];
  return (
    <section id="pricing" className="mx-auto max-w-7xl px-4 py-24 sm:px-6">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Eenvoudige prijzen</h2>
        <p className="mt-2 text-muted-foreground">Kies het plan dat bij je past.</p>
      </div>
      <div className="mt-12 grid gap-4 md:grid-cols-3">
        {plans.map((p) => (
          <div
            key={p.name}
            className={`relative rounded-2xl border p-6 ${
              p.highlight
                ? "border-brand/50 bg-card-gradient shadow-glow"
                : "border-border/60 bg-card-gradient shadow-card"
            }`}
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
              to="/"
              className={`mt-8 block rounded-lg px-4 py-2.5 text-center text-sm font-medium transition-colors ${
                p.highlight
                  ? "bg-brand-gradient text-brand-foreground"
                  : "border border-border bg-surface hover:bg-surface-2"
              }`}
            >
              {p.cta}
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  CTA — afsluitende call-to-action banner                                   */
/* -------------------------------------------------------------------------- */

function CTA() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6">
      <div className="bg-card-gradient shadow-elegant relative overflow-hidden rounded-3xl border border-border/60 px-8 py-20 text-center">
        <div className="pointer-events-none absolute inset-0 [background-image:radial-gradient(circle_at_50%_50%,oklch(0.72_0.18_155/0.18),transparent_60%)]" />
        <div className="relative">
          <h2 className="text-balance text-3xl font-semibold tracking-tight sm:text-5xl">
            Klaar om te beginnen?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Korte, overtuigende afsluiter waarom de bezoeker nu moet klikken.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              to="/"
              className="rounded-lg bg-brand-gradient px-6 py-3 text-sm font-medium text-brand-foreground shadow-glow"
            >
              Primaire actie
            </Link>
            <Link
              to="/"
              className="rounded-lg border border-border bg-surface/60 px-6 py-3 text-sm font-medium"
            >
              Meer info
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}