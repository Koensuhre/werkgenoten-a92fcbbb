import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import { Search, MapPin, Euro, Calendar, Zap } from "lucide-react";
import { useState, useMemo } from "react";
import { useJobs, useCategories, formatBudget, timeAgo } from "@/lib/queries";

export const Route = createFileRoute("/opdrachten")({
  head: () => ({
    meta: [
      { title: "Opdrachten — Werkgenoten" },
      { name: "description", content: "Bekijk actuele klussen in heel Nederland en stuur jouw offerte." },
      { property: "og:title", content: "Opdrachten — Werkgenoten" },
      { property: "og:description", content: "Bekijk actuele klussen en stuur een offerte." },
      { property: "og:url", content: "/opdrachten" },
    ],
    links: [{ rel: "canonical", href: "/opdrachten" }],
  }),
  component: () => <Outlet />,
});

export function JobsList() {
  const [search, setSearch] = useState("");
  const [categorySlug, setCategorySlug] = useState<string | undefined>();
  const [city, setCity] = useState<string | undefined>();
  const { data: allJobs = [], isLoading } = useJobs({ categorySlug, city });
  const { data: categories = [] } = useCategories();

  const jobs = useMemo(() => {
    if (!search) return allJobs;
    const s = search.toLowerCase();
    return allJobs.filter(
      (j) =>
        j.title.toLowerCase().includes(s) ||
        j.description.toLowerCase().includes(s) ||
        (j.city ?? "").toLowerCase().includes(s)
    );
  }, [allJobs, search]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Opdrachten</h1>
      <p className="mt-2 text-muted-foreground">
        {isLoading ? "Laden…" : `${jobs.length} klussen openstaand voor offertes.`}
      </p>

      <div className="mt-8 grid gap-6 lg:grid-cols-[280px_1fr]">
        <aside className="bg-card-gradient shadow-card h-fit space-y-5 rounded-xl border border-border/60 p-5">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Zoek opdracht..."
              className="w-full rounded-md border border-border bg-input/40 py-2 pl-9 pr-3 text-sm placeholder:text-muted-foreground focus:border-brand focus:outline-none"
            />
          </div>
          <div>
            <div className="mb-2 flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-muted-foreground">
              <MapPin className="h-4 w-4" /> Locatie
            </div>
            <select
              value={city ?? ""}
              onChange={(e) => setCity(e.target.value || undefined)}
              className="w-full rounded-md border border-border bg-input/40 px-2 py-1.5 text-sm"
            >
              <option value="">Heel Nederland</option>
              {["Amsterdam", "Rotterdam", "Den Haag", "Utrecht", "Eindhoven", "Groningen"].map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <FilterGroup icon={<Euro className="h-4 w-4" />} label="Budget" options={["< €500", "€500 – €1.500", "€1.500 – €5.000", "> €5.000"]} />
          <FilterGroup icon={<Calendar className="h-4 w-4" />} label="Geplaatst" options={["Vandaag", "Deze week", "Deze maand"]} />
          <div>
            <div className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">Categorie</div>
            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() => setCategorySlug(undefined)}
                className={`rounded-full border px-3 py-1 text-xs ${!categorySlug ? "border-brand bg-brand/10 text-brand" : "border-border bg-surface/60 hover:border-brand/40"}`}
              >
                Alles
              </button>
              {categories.map((c) => (
                <button
                  key={c.slug}
                  onClick={() => setCategorySlug(c.slug)}
                  className={`rounded-full border px-3 py-1 text-xs ${categorySlug === c.slug ? "border-brand bg-brand/10 text-brand" : "border-border bg-surface/60 hover:border-brand/40"}`}
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>
        </aside>

        <div className="space-y-3">
          {!isLoading && jobs.length === 0 && (
            <div className="rounded-xl border border-dashed border-border/60 p-8 text-center text-sm text-muted-foreground">
              Geen opdrachten gevonden met deze filters.
            </div>
          )}
          {jobs.map((j) => (
            <Link
              key={j.id}
              to="/opdrachten/$slug"
              params={{ slug: j.slug }}
              className="bg-card-gradient shadow-card group block rounded-xl border border-border/60 p-5 transition-all hover:border-brand/40"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="rounded-md bg-surface-2 px-2 py-0.5">{j.category?.name ?? "—"}</span>
                    <span>· {j.city}</span>
                    <span>· {timeAgo(j.created_at)}</span>
                    {j.urgent && <span className="inline-flex items-center gap-1 text-brand"><Zap className="h-3 w-3" /> Spoed</span>}
                  </div>
                  <h3 className="mt-2 text-lg font-semibold leading-snug">{j.title}</h3>
                  <p className="mt-2 line-clamp-2 max-w-2xl text-sm text-muted-foreground">{j.description}</p>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold">{formatBudget(j.budget_min, j.budget_max)}</div>
                  <div className="mt-1 text-xs text-muted-foreground">{j.offers} offertes</div>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between border-t border-border/60 pt-3 text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <div className="grid h-6 w-6 place-items-center rounded-full bg-surface-2 text-[10px] font-medium">
                    {(j.client?.display_name ?? "?")[0]}
                  </div>
                  <span>{j.client?.display_name ?? "Opdrachtgever"}</span>
                </div>
                <span className="text-brand opacity-0 transition-opacity group-hover:opacity-100">Bekijk →</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

function FilterGroup({ icon, label, options }: { icon: React.ReactNode; label: string; options: string[] }) {
  return (
    <div>
      <div className="mb-2 flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-muted-foreground">
        {icon} {label}
      </div>
      <div className="space-y-1.5">
        {options.map((o) => (
          <label key={o} className="flex items-center gap-2 text-sm">
            <input type="checkbox" className="h-3.5 w-3.5 rounded border-border bg-input accent-brand" />
            {o}
          </label>
        ))}
      </div>
    </div>
  );
}