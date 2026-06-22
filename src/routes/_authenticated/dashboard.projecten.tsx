import { createFileRoute } from "@tanstack/react-router";
import { jobs } from "@/lib/mock-data";

export const Route = createFileRoute("/_authenticated/dashboard/projecten")({
  component: () => (
    <div>
      <h1 className="text-2xl font-semibold">Projecten</h1>
      <div className="mt-6 space-y-2">
        {jobs.map((j) => (
          <div key={j.slug} className="bg-card-gradient shadow-card flex items-center justify-between rounded-lg border border-border/60 p-4">
            <div>
              <div className="font-medium">{j.title}</div>
              <div className="text-xs text-muted-foreground">{j.category} · {j.city}</div>
            </div>
            <span className="rounded-full bg-brand/15 px-3 py-1 text-xs text-brand">{j.offers} offertes</span>
          </div>
        ))}
      </div>
    </div>
  ),
});