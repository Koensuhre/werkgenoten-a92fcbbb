import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@/hooks/use-session";
import { formatBudget } from "@/lib/queries";

export const Route = createFileRoute("/_authenticated/dashboard/projecten")({
  component: Projecten,
});

function Projecten() {
  const { user } = useSession();
  const { data: jobs = [], isLoading } = useQuery({
    queryKey: ["my-jobs", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("jobs")
        .select("id, slug, title, city, status, budget_min, budget_max, created_at, category:categories(name)")
        .eq("client_id", user!.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Mijn projecten</h1>
        <Link to="/plaats-opdracht" className="rounded-lg bg-brand-gradient px-3 py-2 text-xs font-medium text-brand-foreground">
          + Nieuwe opdracht
        </Link>
      </div>
      <div className="mt-6 space-y-2">
        {isLoading && <div className="text-sm text-muted-foreground">Laden…</div>}
        {!isLoading && jobs.length === 0 && (
          <div className="rounded-xl border border-dashed border-border/60 p-8 text-center text-sm text-muted-foreground">
            Nog geen projecten. <Link to="/plaats-opdracht" className="text-brand hover:underline">Plaats je eerste opdracht →</Link>
          </div>
        )}
        {jobs.map((j) => (
          <Link
            key={j.id}
            to="/opdrachten/$slug"
            params={{ slug: j.slug }}
            className="bg-card-gradient shadow-card flex items-center justify-between rounded-lg border border-border/60 p-4 hover:border-brand/40"
          >
            <div>
              <div className="font-medium">{j.title}</div>
              <div className="text-xs text-muted-foreground">
                {j.category?.name ?? "—"} · {j.city ?? ""} · {formatBudget(j.budget_min, j.budget_max)}
              </div>
            </div>
            <span className="rounded-full bg-brand/15 px-3 py-1 text-xs text-brand">{j.status}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}