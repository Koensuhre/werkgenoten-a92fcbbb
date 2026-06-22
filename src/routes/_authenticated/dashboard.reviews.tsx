import { createFileRoute } from "@tanstack/react-router";
import { Star } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@/hooks/use-session";

export const Route = createFileRoute("/_authenticated/dashboard/reviews")({
  component: Reviews,
});

function Reviews() {
  const { user } = useSession();
  const { data: reviews = [], isLoading } = useQuery({
    queryKey: ["my-reviews", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("reviews")
        .select("id, rating, body, created_at, client_id")
        .eq("pro_id", user!.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  return (
    <div>
      <h1 className="text-2xl font-semibold">Reviews</h1>
      <p className="text-sm text-muted-foreground">Beoordelingen die klanten over jou achterlieten.</p>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {isLoading && <div className="text-sm text-muted-foreground">Laden…</div>}
        {!isLoading && reviews.length === 0 && (
          <div className="rounded-xl border border-dashed border-border/60 p-8 text-center text-sm text-muted-foreground md:col-span-2">
            Nog geen reviews. Reviews verschijnen hier zodra klanten een afgeronde klus beoordelen.
          </div>
        )}
        {reviews.map((r) => (
          <div key={r.id} className="bg-card-gradient shadow-card rounded-xl border border-border/60 p-5">
            <div className="flex items-center justify-between">
              <div className="text-xs text-muted-foreground">{new Date(r.created_at).toLocaleDateString("nl-NL")}</div>
              <div className="flex gap-0.5">
                {Array.from({ length: r.rating }).map((_, i) => (
                  <Star key={i} className="h-3.5 w-3.5 fill-brand text-brand" />
                ))}
              </div>
            </div>
            {r.body && <p className="mt-2 text-sm text-muted-foreground">{r.body}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}