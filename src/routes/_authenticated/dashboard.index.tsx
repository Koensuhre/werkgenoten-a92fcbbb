import { createFileRoute, Link } from "@tanstack/react-router";
import { Briefcase, MessageCircle, Star, TrendingUp } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@/hooks/use-session";
import { useCurrentProfile } from "@/hooks/use-current-profile";
import { formatBudget } from "@/lib/queries";

export const Route = createFileRoute("/_authenticated/dashboard/")({
  component: DashboardHome,
});

function DashboardHome() {
  const { user } = useSession();
  const { data: profile } = useCurrentProfile();

  const { data: stats } = useQuery({
    queryKey: ["dashboard-stats", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const [openJobs, allJobs, quotes, unreadMsgs] = await Promise.all([
        supabase.from("jobs").select("*", { count: "exact", head: true }).eq("client_id", user!.id).eq("status", "open"),
        supabase.from("jobs").select("*", { count: "exact", head: true }).eq("client_id", user!.id),
        supabase.from("quotes").select("id, job_id, jobs!inner(client_id)").eq("jobs.client_id", user!.id),
        supabase.from("messages").select("*", { count: "exact", head: true }).eq("recipient_id", user!.id).is("read_at", null),
      ]);
      return {
        openJobs: openJobs.count ?? 0,
        allJobs: allJobs.count ?? 0,
        quotes: quotes.data?.length ?? 0,
        unreadMsgs: unreadMsgs.count ?? 0,
      };
    },
  });

  const { data: recentJobs = [] } = useQuery({
    queryKey: ["dashboard-recent", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("jobs")
        .select("id, slug, title, city, budget_min, budget_max, status, category:categories(name)")
        .eq("client_id", user!.id)
        .order("created_at", { ascending: false })
        .limit(5);
      if (error) throw error;
      return data;
    },
  });

  const kpis = [
    { label: "Actieve opdrachten", value: stats?.openJobs ?? 0, icon: Briefcase, trend: `${stats?.allJobs ?? 0} totaal` },
    { label: "Ontvangen offertes", value: stats?.quotes ?? 0, icon: TrendingUp, trend: "" },
    { label: "Ongelezen berichten", value: stats?.unreadMsgs ?? 0, icon: MessageCircle, trend: "" },
    { label: "Gemiddelde score", value: profile?.rating_avg ?? "—", icon: Star, trend: `${profile?.review_count ?? 0} reviews` },
  ];

  const greeting = profile?.display_name ? `Hoi, ${profile.display_name.split(" ")[0]}` : "Welkom";

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">{greeting}</h1>
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
        <h2 className="text-sm font-medium">Mijn recente opdrachten</h2>
        {recentJobs.length === 0 ? (
          <p className="mt-4 text-sm text-muted-foreground">
            Je hebt nog geen opdrachten geplaatst.{" "}
            <Link to="/plaats-opdracht" className="text-brand hover:underline">Plaats er nu een →</Link>
          </p>
        ) : (
          <div className="mt-4 space-y-2">
            {recentJobs.map((j) => (
              <Link
                key={j.id}
                to="/opdrachten/$slug"
                params={{ slug: j.slug }}
                className="flex items-center justify-between rounded-lg border border-border/60 bg-surface/60 p-3 hover:border-brand/40"
              >
                <div>
                  <div className="text-sm font-medium">{j.title}</div>
                  <div className="text-xs text-muted-foreground">
                    {j.category?.name ?? "—"} · {j.city ?? ""} · {j.status}
                  </div>
                </div>
                <div className="text-sm font-semibold">{formatBudget(j.budget_min, j.budget_max)}</div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}