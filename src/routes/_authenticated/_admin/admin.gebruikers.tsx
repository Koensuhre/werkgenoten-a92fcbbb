import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { Database } from "@/integrations/supabase/types";

type AppRole = Database["public"]["Enums"]["app_role"];
const ALL_ROLES: AppRole[] = ["admin", "professional", "client"];

export const Route = createFileRoute("/_authenticated/_admin/admin/gebruikers")({
  component: AdminUsers,
});

function AdminUsers() {
  const qc = useQueryClient();

  const { data: users = [], isLoading } = useQuery({
    queryKey: ["admin-users"],
    queryFn: async () => {
      const { data: profiles, error } = await supabase
        .from("profiles")
        .select("id, display_name, company, city, created_at")
        .order("created_at", { ascending: false });
      if (error) throw error;
      const { data: roles, error: rErr } = await supabase.from("user_roles").select("user_id, role");
      if (rErr) throw rErr;
      const byUser = new Map<string, AppRole[]>();
      for (const r of roles ?? []) {
        const arr = byUser.get(r.user_id) ?? [];
        arr.push(r.role);
        byUser.set(r.user_id, arr);
      }
      return (profiles ?? []).map((p) => ({ ...p, roles: byUser.get(p.id) ?? [] }));
    },
  });

  const toggleRole = useMutation({
    mutationFn: async ({ userId, role, has }: { userId: string; role: AppRole; has: boolean }) => {
      if (has) {
        const { error } = await supabase.from("user_roles").delete().eq("user_id", userId).eq("role", role);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("user_roles").insert({ user_id: userId, role });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-users"] });
      toast.success("Rol bijgewerkt");
    },
    onError: (e: unknown) => toast.error(e instanceof Error ? e.message : "Mislukt"),
  });

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold tracking-tight">Gebruikers</h1>
      <div className="overflow-hidden rounded-xl border border-border/60 bg-card">
        <table className="w-full text-sm">
          <thead className="bg-surface-2 text-left text-xs uppercase text-muted-foreground">
            <tr>
              <th className="px-4 py-3">Naam</th>
              <th className="px-4 py-3">Bedrijf</th>
              <th className="px-4 py-3">Stad</th>
              <th className="px-4 py-3">Rollen</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr><td colSpan={4} className="px-4 py-6 text-muted-foreground">Laden…</td></tr>
            )}
            {users.map((u) => (
              <tr key={u.id} className="border-t border-border/60">
                <td className="px-4 py-3">{u.display_name ?? "—"}</td>
                <td className="px-4 py-3 text-muted-foreground">{u.company ?? "—"}</td>
                <td className="px-4 py-3 text-muted-foreground">{u.city ?? "—"}</td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1.5">
                    {ALL_ROLES.map((role) => {
                      const has = u.roles.includes(role);
                      return (
                        <button
                          key={role}
                          onClick={() => toggleRole.mutate({ userId: u.id, role, has })}
                          className={
                            "rounded-md border px-2 py-1 text-xs transition-colors " +
                            (has
                              ? "border-brand bg-brand/10 text-foreground"
                              : "border-border text-muted-foreground hover:text-foreground")
                          }
                        >
                          {role}
                        </button>
                      );
                    })}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-muted-foreground">Klik op een rol om toe te kennen of in te trekken.</p>
    </div>
  );
}