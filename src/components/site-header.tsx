import { Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X, LayoutDashboard, LogOut, Shield } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import { useSession } from "@/hooks/use-session";
import { useIsAdmin } from "@/hooks/use-current-profile";
import { supabase } from "@/integrations/supabase/client";
import { cmsMenuQuery, cmsPagesListQuery } from "@/services/wpgraphql";

const fallbackNav = [
  { to: "/opdrachten", label: "Opdrachten" },
  { to: "/vakmensen", label: "Vakmensen" },
  { to: "/hoe-werkt-het", label: "Hoe het werkt" },
  { to: "/prijzen", label: "Prijzen" },
];

// Pages we never want to auto-inject into the header, even if they exist in WP.
const HIDDEN_NAV_SLUGS = new Set([
  "home", "homepage", "voorbeeld-pagina", "sample-page",
  "privacy", "voorwaarden", "cookies", "cookie-policy",
]);

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const { user, loading } = useSession();
  const isAdmin = useIsAdmin();
  const navigate = useNavigate();
  const { data: wpMenu } = useQuery(cmsMenuQuery("PRIMARY"));
  const { data: wpPages } = useQuery(cmsPagesListQuery());
  // Base = WP PRIMARY menu when the admin has curated one, otherwise the
  // hardcoded fallback so app-routes always work. Order is preserved.
  const baseNav = wpMenu?.items?.length
    ? wpMenu.items.map((m) => ({ to: m.href, label: m.label }))
    : fallbackNav;
  // Auto-append any published WP page not already covered by baseNav so
  // new pages appear in the menu without a code change. Existing order
  // and items are never reordered or removed.
  const seen = new Set(baseNav.map((n) => n.to.replace(/\/+$/, "")));
  const extras = (wpPages ?? [])
    .filter((p) => !HIDDEN_NAV_SLUGS.has(p.slug))
    .map((p) => ({ to: `/${p.slug}`, label: p.title }))
    .filter((n) => {
      const key = n.to.replace(/\/+$/, "");
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  const nav = [...baseNav, ...extras];

  async function handleSignOut() {
    await supabase.auth.signOut();
    navigate({ to: "/", replace: true });
  }

  return (
    <header className="sticky top-0 z-50 w-full">
      <div className="glass border-b border-border/60">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <Link to="/" className="flex items-center gap-2 font-semibold tracking-tight">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand-gradient text-brand-foreground shadow-glow">
              <span className="text-sm font-bold">W</span>
            </span>
            <span className="text-base">Werkgenoten</span>
          </Link>
          <nav className="hidden items-center gap-1 md:flex">
            {nav.map((n) => (
              <a
                key={n.to + n.label}
                href={n.to}
                className="rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {n.label}
              </a>
            ))}
          </nav>
          <div className="hidden items-center gap-2 md:flex">
            {loading ? null : user ? (
              <>
                {isAdmin && (
                  <Link
                    to="/admin"
                    className="inline-flex items-center gap-1.5 rounded-md px-3 py-2 text-sm text-muted-foreground hover:text-foreground"
                  >
                    <Shield className="h-4 w-4" /> Admin
                  </Link>
                )}
                <Link
                  to="/dashboard"
                  className="inline-flex items-center gap-1.5 rounded-md px-3 py-2 text-sm text-muted-foreground hover:text-foreground"
                >
                  <LayoutDashboard className="h-4 w-4" /> Dashboard
                </Link>
                <button
                  onClick={handleSignOut}
                  className="inline-flex items-center gap-1.5 rounded-md px-3 py-2 text-sm text-muted-foreground hover:text-foreground"
                >
                  <LogOut className="h-4 w-4" /> Uitloggen
                </button>
              </>
            ) : (
              <Link to="/auth" className="rounded-md px-3 py-2 text-sm text-muted-foreground hover:text-foreground">
                Inloggen
              </Link>
            )}
            <Link
              to="/plaats-opdracht"
              className="rounded-md bg-brand-gradient px-4 py-2 text-sm font-medium text-brand-foreground shadow-glow transition-transform hover:scale-[1.02]"
            >
              Plaats opdracht
            </Link>
          </div>
          <button
            onClick={() => setOpen((v) => !v)}
            className="rounded-md p-2 md:hidden"
            aria-label="Menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
        <div className={cn("md:hidden", open ? "block" : "hidden")}>
          <div className="border-t border-border/60 px-4 py-3">
            {nav.map((n) => (
              <a key={n.to + n.label} href={n.to} className="block rounded-md px-3 py-2 text-sm" onClick={() => setOpen(false)}>
                {n.label}
              </a>
            ))}
            <div className="mt-2 flex gap-2">
              {user ? (
                <>
                  <Link to="/dashboard" onClick={() => setOpen(false)} className="flex-1 rounded-md border border-border px-3 py-2 text-center text-sm">
                    Dashboard
                  </Link>
                  <button onClick={handleSignOut} className="flex-1 rounded-md border border-border px-3 py-2 text-center text-sm">
                    Uitloggen
                  </button>
                </>
              ) : (
                <Link to="/auth" onClick={() => setOpen(false)} className="flex-1 rounded-md border border-border px-3 py-2 text-center text-sm">
                  Inloggen
                </Link>
              )}
              <Link to="/plaats-opdracht" className="flex-1 rounded-md bg-brand-gradient px-3 py-2 text-center text-sm font-medium text-brand-foreground">
                Plaats opdracht
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}