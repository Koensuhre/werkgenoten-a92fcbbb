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
        .select("id, slug, title, city, status, review_status, review_notes, budget_min, budget_max, created_at, category:categories(name)")
        .eq("client_id", user!.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  function statusBadge(j: { status: string; review_status: string }) {
    if (j.review_status === "pending_review") return { label: "In review", cls: "bg-amber-500/15 text-amber-500" };
    if (j.review_status === "rejected") return { label: "Afgewezen", cls: "bg-destructive/15 text-destructive" };
    return { label: j.status, cls: "bg-brand/15 text-brand" };
  }

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
          (() => {
            const b = statusBadge(j);
            return (
              <Link
                key={j.id}
                to="/opdrachten/$slug"
                params={{ slug: j.slug }}
                className="bg-card-gradient shadow-card block rounded-lg border border-border/60 p-4 hover:border-brand/40"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="font-medium truncate">{j.title}</div>
                    <div className="text-xs text-muted-foreground">
                      {j.category?.name ?? "—"} · {j.city ?? ""} · {formatBudget(j.budget_min, j.budget_max)}
                    </div>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs whitespace-nowrap ${b.cls}`}>{b.label}</span>
                </div>
                {j.review_status === "rejected" && j.review_notes && (
                  <div className="mt-2 rounded-md bg-destructive/10 p-2 text-xs text-destructive">
                    Reden: {j.review_notes}
                  </div>
                )}
              </Link>
            );
          })()
        ))}
      </div>
    </div>
  );
}