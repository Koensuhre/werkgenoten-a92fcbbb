import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { Database } from "@/integrations/supabase/types";

type JobStatus = Database["public"]["Enums"]["job_status"];
const STATUSES: JobStatus[] = ["open", "in_progress", "completed", "cancelled"];

export const Route = createFileRoute("/_authenticated/_admin/admin/opdrachten")({
  component: AdminJobs,
});

function AdminJobs() {
  const qc = useQueryClient();

  const { data: jobs = [], isLoading } = useQuery({
    queryKey: ["admin-jobs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("jobs")
        .select("id, slug, title, status, city, created_at")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  const setStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: JobStatus }) => {
      const { error } = await supabase.from("jobs").update({ status }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-jobs"] });
      toast.success("Status bijgewerkt");
    },
    onError: (e: unknown) => toast.error(e instanceof Error ? e.message : "Mislukt"),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("jobs").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-jobs"] });
      toast.success("Verwijderd");
    },
    onError: (e: unknown) => toast.error(e instanceof Error ? e.message : "Mislukt"),
  });

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold tracking-tight">Opdrachten</h1>
      <div className="overflow-hidden rounded-xl border border-border/60 bg-card">
        <table className="w-full text-sm">
          <thead className="bg-surface-2 text-left text-xs uppercase text-muted-foreground">
            <tr>
              <th className="px-4 py-3">Titel</th>
              <th className="px-4 py-3">Stad</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actie</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr><td colSpan={4} className="px-4 py-6 text-muted-foreground">Laden…</td></tr>
            )}
            {jobs.map((j) => (
              <tr key={j.id} className="border-t border-border/60">
                <td className="px-4 py-3">
                  <Link to="/opdrachten/$slug" params={{ slug: j.slug }} className="hover:underline">
                    {j.title}
                  </Link>
                </td>
                <td className="px-4 py-3 text-muted-foreground">{j.city ?? "—"}</td>
                <td className="px-4 py-3">
                  <select
                    value={j.status}
                    onChange={(e) => setStatus.mutate({ id: j.id, status: e.target.value as JobStatus })}
                    className="rounded-md border border-border bg-background px-2 py-1 text-xs"
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => { if (confirm("Verwijderen?")) remove.mutate(j.id); }}
                    className="text-xs text-destructive hover:underline"
                  >
                    Verwijderen
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}