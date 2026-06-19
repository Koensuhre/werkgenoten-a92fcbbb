import { createFileRoute, Outlet, Link } from "@tanstack/react-router";
import { Search, Star, Shield, Clock } from "lucide-react";
import { pros, categories } from "@/lib/mock-data";

export const Route = createFileRoute("/vakmensen")({
  head: () => ({
    meta: [
      { title: "Vakmensen — Vakwerk" },
      { name: "description", content: "Vind gecontroleerde vakmensen in jouw regio. Vergelijk reviews, ervaring en reactietijd." },
      { property: "og:title", content: "Vakmensen — Vakwerk" },
      { property: "og:description", content: "Gecontroleerde vakmensen in heel Nederland." },
      { property: "og:url", content: "/vakmensen" },
    ],
    links: [{ rel: "canonical", href: "/vakmensen" }],
  }),
  component: () => <Outlet />,
});

export function ProsList() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Vakmensen in Nederland</h1>
      <p className="mt-2 text-muted-foreground">{pros.length}+ gecontroleerde professionals klaar voor jouw klus.</p>

      <div className="mt-8 grid gap-3 sm:grid-cols-[1fr_auto_auto]">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            placeholder="Zoek op bedrijf, naam of dienst..."
            className="w-full rounded-lg border border-border bg-input/40 py-2.5 pl-9 pr-3 text-sm placeholder:text-muted-foreground focus:border-brand focus:outline-none"
          />
        </div>
        <select className="rounded-lg border border-border bg-input/40 px-3 text-sm">
          <option>Alle categorieën</option>
          {categories.map((c) => <option key={c.slug}>{c.name}</option>)}
        </select>
        <select className="rounded-lg border border-border bg-input/40 px-3 text-sm">
          <option>Heel Nederland</option>
          {["Amsterdam", "Rotterdam", "Utrecht", "Den Haag", "Eindhoven", "Groningen"].map((c) => <option key={c}>{c}</option>)}
        </select>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {pros.map((p) => (
          <Link
            key={p.slug}
            to="/vakmensen/$slug"
            params={{ slug: p.slug }}
            className="bg-card-gradient shadow-card group rounded-xl border border-border/60 p-5 transition-all hover:border-brand/40 hover:shadow-glow"
          >
            <div className="flex items-start gap-3">
              <div className="grid h-12 w-12 place-items-center rounded-xl bg-brand-gradient text-sm font-bold text-brand-foreground">
                {p.initials}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-1.5">
                  <div className="font-semibold">{p.company}</div>
                  {p.verified && <Shield className="h-3.5 w-3.5 text-brand" />}
                </div>
                <div className="text-xs text-muted-foreground">{p.category} · {p.city}</div>
              </div>
            </div>
            <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">{p.about}</p>
            <div className="mt-4 flex items-center justify-between text-xs">
              <div className="inline-flex items-center gap-1"><Star className="h-3.5 w-3.5 fill-brand text-brand" /> <span className="font-medium text-foreground">{p.rating}</span> <span className="text-muted-foreground">({p.reviews})</span></div>
              <div className="inline-flex items-center gap-1 text-muted-foreground"><Clock className="h-3 w-3" /> {p.responseTime}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}