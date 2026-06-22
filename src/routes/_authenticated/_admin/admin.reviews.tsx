import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Star } from "lucide-react";

export const Route = createFileRoute("/_authenticated/_admin/admin/reviews")({
  component: AdminReviews,
});

function AdminReviews() {
  const qc = useQueryClient();

  const { data: reviews = [], isLoading } = useQuery({
    queryKey: ["admin-reviews"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("reviews")
        .select("id, rating, body, created_at, job_id, client_id, pro_id")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("reviews").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-reviews"] });
      toast.success("Review verwijderd");
    },
    onError: (e: unknown) => toast.error(e instanceof Error ? e.message : "Mislukt"),
  });

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold tracking-tight">Reviews</h1>
      <div className="space-y-3">
        {isLoading && <p className="text-sm text-muted-foreground">Laden…</p>}
        {!isLoading && reviews.length === 0 && (
          <p className="text-sm text-muted-foreground">Nog geen reviews.</p>
        )}
        {reviews.map((r) => (
          <div key={r.id} className="rounded-xl border border-border/60 bg-card p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1 text-amber-500">
                {Array.from({ length: r.rating }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <button
                onClick={() => { if (confirm("Verwijderen?")) remove.mutate(r.id); }}
                className="text-xs text-destructive hover:underline"
              >
                Verwijderen
              </button>
            </div>
            <p className="mt-2 text-sm">{r.body ?? <span className="text-muted-foreground">Geen tekst.</span>}</p>
            <p className="mt-2 text-xs text-muted-foreground">{new Date(r.created_at).toLocaleString("nl-NL")}</p>
          </div>
        ))}
      </div>
    </div>
  );
}