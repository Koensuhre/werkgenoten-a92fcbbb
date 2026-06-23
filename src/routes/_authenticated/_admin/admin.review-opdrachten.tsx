import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { toast } from "sonner";
import { approveJob, rejectJob, getUserContact } from "@/lib/admin-review.functions";
import { formatBudget, timeAgo } from "@/lib/queries";

export const Route = createFileRoute("/_authenticated/_admin/admin/review-opdrachten")({
  component: ReviewJobs,
});

function ReviewJobs() {
  const qc = useQueryClient();
  const approveFn = useServerFn(approveJob);
  const rejectFn = useServerFn(rejectJob);
  const contactFn = useServerFn(getUserContact);

  const { data: jobs = [], isLoading } = useQuery({
    queryKey: ["admin-pending-jobs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("jobs")
        .select("id, slug, title, description, city, budget_min, budget_max, created_at, client_id, category:categories(name)")
        .eq("review_status", "pending_review")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  const approve = useMutation({
    mutationFn: (id: string) => approveFn({ data: { id } }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-pending-jobs"] });
      qc.invalidateQueries({ queryKey: ["admin-stats"] });
      qc.invalidateQueries({ queryKey: ["jobs"] });
      toast.success("Opdracht goedgekeurd en gepubliceerd");
    },
    onError: (e: unknown) => toast.error(e instanceof Error ? e.message : "Mislukt"),
  });

  const reject = useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) => rejectFn({ data: { id, reason } }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-pending-jobs"] });
      qc.invalidateQueries({ queryKey: ["admin-stats"] });
      toast.success("Opdracht afgewezen");
    },
    onError: (e: unknown) => toast.error(e instanceof Error ? e.message : "Mislukt"),
  });

  const [contactFor, setContactFor] = useState<string | null>(null);
  const [contactData, setContactData] = useState<{ email: string | null; phone: string | null } | null>(null);

  async function showContact(clientId: string) {
    setContactFor(clientId);
    setContactData(null);
    try {
      const c = await contactFn({ data: { id: clientId } });
      setContactData(c);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Kon contact niet ophalen");
      setContactFor(null);
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Te reviewen opdrachten</h1>
        <p className="text-sm text-muted-foreground">Nieuwe opdrachten wachten op goedkeuring voor ze publiek zichtbaar worden.</p>
      </div>

      {isLoading && <div className="text-sm text-muted-foreground">Laden…</div>}
      {!isLoading && jobs.length === 0 && (
        <div className="rounded-xl border border-dashed border-border/60 p-8 text-center text-sm text-muted-foreground">
          Geen opdrachten in review.
        </div>
      )}

      <div className="space-y-3">
        {jobs.map((j) => (
          <div key={j.id} className="bg-card-gradient shadow-card rounded-xl border border-border/60 p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                  <span className="rounded-md bg-surface-2 px-2 py-0.5">{j.category?.name ?? "—"}</span>
                  <span>· {j.city ?? "—"}</span>
                  <span>· {timeAgo(j.created_at)}</span>
                  <span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-amber-500">In review</span>
                </div>
                <h3 className="mt-2 text-lg font-semibold">{j.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground line-clamp-3">{j.description}</p>
                <div className="mt-2 text-xs text-muted-foreground">Budget: {formatBudget(j.budget_min, j.budget_max)}</div>
              </div>
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => approve.mutate(j.id)}
                  disabled={approve.isPending}
                  className="rounded-lg bg-brand-gradient px-3 py-1.5 text-xs font-medium text-brand-foreground"
                >
                  Goedkeuren
                </button>
                <button
                  onClick={() => {
                    const reason = prompt("Reden van afwijzing:");
                    if (reason) reject.mutate({ id: j.id, reason });
                  }}
                  className="rounded-lg border border-destructive/40 px-3 py-1.5 text-xs text-destructive hover:bg-destructive/10"
                >
                  Afwijzen
                </button>
                <button
                  onClick={() => showContact(j.client_id)}
                  className="rounded-lg border border-border px-3 py-1.5 text-xs hover:bg-surface-2"
                >
                  Contact
                </button>
              </div>
            </div>
            {contactFor === j.client_id && (
              <div className="mt-4 rounded-lg border border-border/60 bg-surface-2 p-3 text-sm">
                {!contactData ? (
                  <span className="text-muted-foreground">Ophalen…</span>
                ) : (
                  <div className="space-y-1">
                    <div>
                      E-mail:{" "}
                      {contactData.email ? (
                        <a className="text-brand hover:underline" href={`mailto:${contactData.email}?subject=Je opdracht op Vakwerk: ${encodeURIComponent(j.title)}`}>
                          {contactData.email}
                        </a>
                      ) : "—"}
                    </div>
                    <div>Telefoon: {contactData.phone ?? "—"}</div>
                    <button onClick={() => { setContactFor(null); setContactData(null); }} className="mt-2 text-xs text-muted-foreground hover:underline">Sluiten</button>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}