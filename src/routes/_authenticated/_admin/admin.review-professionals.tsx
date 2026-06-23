import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { toast } from "sonner";
import { approvePro, rejectPro, getUserContact } from "@/lib/admin-review.functions";

export const Route = createFileRoute("/_authenticated/_admin/admin/review-professionals")({
  component: ReviewPros,
});

function ReviewPros() {
  const qc = useQueryClient();
  const approveFn = useServerFn(approvePro);
  const rejectFn = useServerFn(rejectPro);
  const contactFn = useServerFn(getUserContact);

  const { data: pros = [], isLoading } = useQuery({
    queryKey: ["admin-pending-pros"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, display_name, company, city, bio, years_experience, created_at, category:categories(name)")
        .eq("primary_type", "professional")
        .eq("review_status", "pending_review")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  const approve = useMutation({
    mutationFn: (id: string) => approveFn({ data: { id } }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-pending-pros"] });
      qc.invalidateQueries({ queryKey: ["admin-stats"] });
      qc.invalidateQueries({ queryKey: ["pros"] });
      toast.success("Professional goedgekeurd");
    },
    onError: (e: unknown) => toast.error(e instanceof Error ? e.message : "Mislukt"),
  });

  const reject = useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) => rejectFn({ data: { id, reason } }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-pending-pros"] });
      qc.invalidateQueries({ queryKey: ["admin-stats"] });
      toast.success("Professional afgewezen");
    },
    onError: (e: unknown) => toast.error(e instanceof Error ? e.message : "Mislukt"),
  });

  const [contactFor, setContactFor] = useState<string | null>(null);
  const [contactData, setContactData] = useState<{ email: string | null; phone: string | null } | null>(null);

  async function showContact(id: string) {
    setContactFor(id);
    setContactData(null);
    try {
      setContactData(await contactFn({ data: { id } }));
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Kon contact niet ophalen");
      setContactFor(null);
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Te reviewen professionals</h1>
        <p className="text-sm text-muted-foreground">Nieuwe ZZP'ers/freelancers wachten op goedkeuring voor ze actief worden.</p>
      </div>

      {isLoading && <div className="text-sm text-muted-foreground">Laden…</div>}
      {!isLoading && pros.length === 0 && (
        <div className="rounded-xl border border-dashed border-border/60 p-8 text-center text-sm text-muted-foreground">
          Geen professionals in review.
        </div>
      )}

      <div className="space-y-3">
        {pros.map((p) => (
          <div key={p.id} className="bg-card-gradient shadow-card rounded-xl border border-border/60 p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                  <span className="rounded-md bg-surface-2 px-2 py-0.5">{p.category?.name ?? "—"}</span>
                  <span>· {p.city ?? "—"}</span>
                  <span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-amber-500">In review</span>
                </div>
                <h3 className="mt-2 text-lg font-semibold">{p.display_name ?? p.company ?? "Naamloos"}</h3>
                {p.company && <div className="text-sm text-muted-foreground">{p.company}</div>}
                {p.bio && <p className="mt-1 text-sm text-muted-foreground line-clamp-3">{p.bio}</p>}
                {p.years_experience != null && (
                  <div className="mt-2 text-xs text-muted-foreground">{p.years_experience} jaar ervaring</div>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => approve.mutate(p.id)}
                  disabled={approve.isPending}
                  className="rounded-lg bg-brand-gradient px-3 py-1.5 text-xs font-medium text-brand-foreground"
                >
                  Goedkeuren
                </button>
                <button
                  onClick={() => {
                    const reason = prompt("Reden van afwijzing:");
                    if (reason) reject.mutate({ id: p.id, reason });
                  }}
                  className="rounded-lg border border-destructive/40 px-3 py-1.5 text-xs text-destructive hover:bg-destructive/10"
                >
                  Afwijzen
                </button>
                <button
                  onClick={() => showContact(p.id)}
                  className="rounded-lg border border-border px-3 py-1.5 text-xs hover:bg-surface-2"
                >
                  Contact
                </button>
              </div>
            </div>
            {contactFor === p.id && (
              <div className="mt-4 rounded-lg border border-border/60 bg-surface-2 p-3 text-sm">
                {!contactData ? (
                  <span className="text-muted-foreground">Ophalen…</span>
                ) : (
                  <div className="space-y-1">
                    <div>
                      E-mail:{" "}
                      {contactData.email ? (
                        <a className="text-brand hover:underline" href={`mailto:${contactData.email}?subject=Je aanmelding op Vakwerk`}>
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