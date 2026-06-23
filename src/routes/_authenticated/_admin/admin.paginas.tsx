import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { toast } from "sonner";
import { ExternalLink, Pencil, Plus, RefreshCw } from "lucide-react";
import { cmsPagesListQuery } from "@/services/wpgraphql";
import { createPage, wpConfigStatus } from "@/lib/wp.functions";

export const Route = createFileRoute("/_authenticated/_admin/admin/paginas")({
  component: PagesAdmin,
});

const WP_BASE = (import.meta.env.VITE_WP_GRAPHQL_URL as string | undefined)?.replace(/\/graphql\/?$/, "");

function PagesAdmin() {
  const qc = useQueryClient();
  const navigate = useNavigate();
  const { data: pages, isLoading, refetch, isFetching } = useQuery(cmsPagesListQuery());
  const checkConfig = useServerFn(wpConfigStatus);
  const create = useServerFn(createPage);

  const { data: cfg } = useQuery({
    queryKey: ["wp", "config"],
    queryFn: () => checkConfig(),
    staleTime: 60_000,
  });

  const [showNew, setShowNew] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newSlug, setNewSlug] = useState("");
  const [creating, setCreating] = useState(false);

  async function onCreate() {
    if (!newTitle.trim() || !newSlug.trim()) {
      toast.error("Vul titel en slug in.");
      return;
    }
    setCreating(true);
    try {
      const res = await create({ data: { title: newTitle.trim(), slug: newSlug.trim() } });
      toast.success(`Pagina "${newTitle}" aangemaakt.`);
      setShowNew(false);
      setNewTitle("");
      setNewSlug("");
      await qc.invalidateQueries({ queryKey: ["cms", "pages"] });
      navigate({ to: "/admin/paginas/$slug", params: { slug: res.slug } });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Aanmaken mislukt");
    } finally {
      setCreating(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">WordPress-pagina's</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Beheer content-pagina's die de frontend laadt via <code className="rounded bg-muted px-1">/cms/&lt;slug&gt;</code>.
            App-routes (dashboard, opdrachten, plaats-opdracht) staan los van WordPress.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => refetch()}
            disabled={isFetching}
            className="inline-flex items-center gap-2 rounded-md border border-border bg-secondary px-3 py-2 text-sm disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} /> Vernieuwen
          </button>
          <button
            onClick={() => setShowNew((v) => !v)}
            className="inline-flex items-center gap-2 rounded-md bg-brand-gradient px-3 py-2 text-sm font-medium text-brand-foreground"
          >
            <Plus className="h-4 w-4" /> Nieuwe pagina
          </button>
        </div>
      </div>

      {cfg && !cfg.configured && (
        <div className="rounded-md border border-warning/40 bg-warning/10 p-4 text-sm">
          <strong>WordPress is nog niet verbonden voor schrijven.</strong> Voeg de secrets{" "}
          <code>WP_BASE_URL</code>, <code>WP_APP_USER</code> en <code>WP_APP_PASSWORD</code> toe via
          Backend → Secrets. Lezen werkt al via VITE_WP_GRAPHQL_URL; opslaan/aanmaken vereist deze 3 secrets.
        </div>
      )}

      {showNew && (
        <div className="rounded-xl border border-border bg-card p-5 space-y-3">
          <h2 className="font-semibold">Nieuwe pagina aanmaken</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1 block text-xs text-muted-foreground">Titel</span>
              <input
                value={newTitle}
                onChange={(e) => {
                  setNewTitle(e.target.value);
                  if (!newSlug) {
                    setNewSlug(
                      e.target.value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
                    );
                  }
                }}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                placeholder="Over ons"
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-xs text-muted-foreground">Slug (URL)</span>
              <input
                value={newSlug}
                onChange={(e) => setNewSlug(e.target.value)}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm font-mono"
                placeholder="over-ons"
              />
            </label>
          </div>
          <div className="flex justify-end gap-2">
            <button onClick={() => setShowNew(false)} className="rounded-md px-3 py-2 text-sm">Annuleren</button>
            <button
              onClick={onCreate}
              disabled={creating}
              className="rounded-md bg-brand-gradient px-3 py-2 text-sm font-medium text-brand-foreground disabled:opacity-50"
            >
              {creating ? "Aanmaken…" : "Aanmaken"}
            </button>
          </div>
        </div>
      )}

      <div className="overflow-hidden rounded-xl border border-border">
        <table className="w-full text-sm">
          <thead className="bg-surface-2 text-left text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="px-4 py-3">Titel</th>
              <th className="px-4 py-3">Slug</th>
              <th className="px-4 py-3">Laatst gewijzigd</th>
              <th className="px-4 py-3 text-right">Acties</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {isLoading && (
              <tr><td colSpan={4} className="px-4 py-6 text-center text-muted-foreground">Laden…</td></tr>
            )}
            {!isLoading && (pages?.length ?? 0) === 0 && (
              <tr><td colSpan={4} className="px-4 py-6 text-center text-muted-foreground">Geen pagina's gevonden in WordPress.</td></tr>
            )}
            {pages?.map((p) => (
              <tr key={p.id} className="hover:bg-surface-2/40">
                <td className="px-4 py-3 font-medium" dangerouslySetInnerHTML={{ __html: p.title }} />
                <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{p.slug}</td>
                <td className="px-4 py-3 text-xs text-muted-foreground">{new Date(p.modified).toLocaleString("nl-NL")}</td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <Link
                      to="/admin/paginas/$slug"
                      params={{ slug: p.slug }}
                      className="inline-flex items-center gap-1 rounded-md border border-border px-2.5 py-1.5 text-xs hover:bg-surface-2"
                    >
                      <Pencil className="h-3.5 w-3.5" /> Bewerken
                    </Link>
                    {WP_BASE && (
                      <a
                        href={`${WP_BASE}/wp-admin/post.php?post=${p.id}&action=edit`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 rounded-md border border-border px-2.5 py-1.5 text-xs hover:bg-surface-2"
                      >
                        <ExternalLink className="h-3.5 w-3.5" /> Gutenberg
                      </a>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}