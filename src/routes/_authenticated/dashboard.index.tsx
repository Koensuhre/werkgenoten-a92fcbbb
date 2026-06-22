import { createFileRoute } from "@tanstack/react-router";
import { Briefcase, MessageCircle, Star, TrendingUp } from "lucide-react";
import { jobs } from "@/lib/mock-data";

export const Route = createFileRoute("/_authenticated/dashboard/")({
  component: DashboardHome,
});

function DashboardHome() {
  const kpis = [
    { label: "Actieve opdrachten", value: 3, icon: Briefcase, trend: "+1 deze week" },
    { label: "Nieuwe offertes", value: 12, icon: TrendingUp, trend: "+4 vandaag" },
    { label: "Ongelezen berichten", value: 5, icon: MessageCircle, trend: "" },
    { label: "Gemiddelde score", value: "4.9", icon: Star, trend: "37 reviews" },
  ];
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">Goedemiddag, Sanne</h1>
        <p className="text-sm text-muted-foreground">Een snel overzicht van je activiteit.</p>
      </header>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((k) => (
          <div key={k.label} className="bg-card-gradient shadow-card rounded-xl border border-border/60 p-4">
            <div className="flex items-center justify-between">
              <div className="text-xs text-muted-foreground">{k.label}</div>
              <k.icon className="h-4 w-4 text-brand" />
            </div>
            <div className="mt-3 text-2xl font-semibold">{k.value}</div>
            {k.trend && <div className="mt-1 text-xs text-muted-foreground">{k.trend}</div>}
          </div>
        ))}
      </div>

      <section className="bg-card-gradient shadow-card rounded-xl border border-border/60 p-5">
        <h2 className="text-sm font-medium">Recente opdrachten</h2>
        <div className="mt-4 space-y-2">
          {jobs.slice(0, 4).map((j) => (
            <div key={j.slug} className="flex items-center justify-between rounded-lg border border-border/60 bg-surface/60 p-3">
              <div>
                <div className="text-sm font-medium">{j.title}</div>
                <div className="text-xs text-muted-foreground">{j.category} · {j.city} · {j.offers} offertes</div>
              </div>
              <div className="text-sm font-semibold">{j.budget}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}