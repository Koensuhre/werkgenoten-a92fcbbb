import { createFileRoute } from "@tanstack/react-router";
import { jobs } from "@/lib/mock-data";

export const Route = createFileRoute("/_authenticated/dashboard/leads")({
  component: () => (
    <div>
      <h1 className="text-2xl font-semibold">Leads</h1>
      <p className="text-sm text-muted-foreground">Nieuwe opdrachten die passen bij jouw categorie en regio.</p>
      <div className="mt-6 space-y-2">
        {jobs.map((j) => (
          <div key={j.slug} className="bg-card-gradient shadow-card flex items-center justify-between rounded-lg border border-border/60 p-4">
            <div>
              <div className="font-medium">{j.title}</div>
              <div className="text-xs text-muted-foreground">{j.category} · {j.city} · {j.budget}</div>
            </div>
            <button className="rounded-lg bg-brand-gradient px-3 py-1.5 text-xs font-medium text-brand-foreground">Reageren</button>
          </div>
        ))}
      </div>
    </div>
  ),
});