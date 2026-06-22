import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useState } from "react";

export const Route = createFileRoute("/_authenticated/_admin/admin/categorieen")({
  component: AdminCategories,
});

function slugify(s: string) {
  return s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function AdminCategories() {
  const qc = useQueryClient();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const { data: cats = [] } = useQuery({
    queryKey: ["admin-categories"],
    queryFn: async () => {
      const { data, error } = await supabase.from("categories").select("*").order("name");
      if (error) throw error;
      return data ?? [];
    },
  });

  const create = useMutation({
    mutationFn: async () => {
      const slug = slugify(name);
      const { error } = await supabase.from("categories").insert({ name, slug, description: description || null });
      if (error) throw error;
    },
    onSuccess: () => {
      setName(""); setDescription("");
      qc.invalidateQueries({ queryKey: ["admin-categories"] });
      toast.success("Categorie toegevoegd");
    },
    onError: (e: unknown) => toast.error(e instanceof Error ? e.message : "Mislukt"),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("categories").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-categories"] });
      toast.success("Verwijderd");
    },
    onError: (e: unknown) => toast.error(e instanceof Error ? e.message : "Mislukt"),
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight">Categorieën</h1>

      <form
        onSubmit={(e) => { e.preventDefault(); if (name.trim()) create.mutate(); }}
        className="flex flex-wrap items-end gap-2 rounded-xl border border-border/60 bg-card p-4"
      >
        <div className="min-w-[200px] flex-1">
          <label className="mb-1 block text-xs text-muted-foreground">Naam</label>
          <input
            value={name} onChange={(e) => setName(e.target.value)} required
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
          />
        </div>
        <div className="min-w-[200px] flex-1">
          <label className="mb-1 block text-xs text-muted-foreground">Omschrijving</label>
          <input
            value={description} onChange={(e) => setDescription(e.target.value)}
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
          />
        </div>
        <button className="rounded-md bg-brand-gradient px-4 py-2 text-sm font-medium text-brand-foreground shadow-glow">
          Toevoegen
        </button>
      </form>

      <div className="overflow-hidden rounded-xl border border-border/60 bg-card">
        <table className="w-full text-sm">
          <thead className="bg-surface-2 text-left text-xs uppercase text-muted-foreground">
            <tr>
              <th className="px-4 py-3">Naam</th>
              <th className="px-4 py-3">Slug</th>
              <th className="px-4 py-3">Omschrijving</th>
              <th className="px-4 py-3 text-right">Actie</th>
            </tr>
          </thead>
          <tbody>
            {cats.map((c) => (
              <tr key={c.id} className="border-t border-border/60">
                <td className="px-4 py-3">{c.name}</td>
                <td className="px-4 py-3 text-muted-foreground">{c.slug}</td>
                <td className="px-4 py-3 text-muted-foreground">{c.description ?? "—"}</td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => { if (confirm("Verwijderen?")) remove.mutate(c.id); }}
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