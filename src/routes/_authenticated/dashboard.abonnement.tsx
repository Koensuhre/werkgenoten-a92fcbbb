import { createFileRoute } from "@tanstack/react-router";
import { CheckCircle2 } from "lucide-react";
import { plans } from "@/lib/mock-data";

export const Route = createFileRoute("/dashboard/abonnement")({
  component: () => (
    <div>
      <h1 className="text-2xl font-semibold">Abonnement</h1>
      <p className="text-sm text-muted-foreground">Je huidige plan: <span className="text-brand">Professional</span></p>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {plans.map((p) => (
          <div key={p.name} className={`rounded-xl border p-5 ${p.highlight ? "border-brand/50 bg-card-gradient shadow-glow" : "border-border/60 bg-card-gradient shadow-card"}`}>
            <div className="text-sm font-medium">{p.name}</div>
            <div className="mt-2 text-3xl font-semibold">€{p.price}<span className="text-sm font-normal text-muted-foreground">/mnd</span></div>
            <ul className="mt-4 space-y-1.5 text-xs">
              {p.features.map((f) => (
                <li key={f} className="flex items-start gap-1.5"><CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand" /> {f}</li>
              ))}
            </ul>
            <button className={`mt-5 w-full rounded-lg px-3 py-2 text-xs font-medium ${p.highlight ? "bg-brand-gradient text-brand-foreground" : "border border-border bg-surface"}`}>
              {p.highlight ? "Huidig plan" : "Upgrade"}
            </button>
          </div>
        ))}
      </div>
    </div>
  ),
});