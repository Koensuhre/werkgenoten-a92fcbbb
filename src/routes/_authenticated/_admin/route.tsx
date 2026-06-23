import { createFileRoute, Link, Outlet, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { LayoutDashboard, Users, Briefcase, Tags, Star, Palette, FileText, ClipboardCheck, UserCheck } from "lucide-react";
import { useCurrentUserRoles } from "@/hooks/use-current-profile";
import { useSession } from "@/hooks/use-session";

export const Route = createFileRoute("/_authenticated/_admin")({
  head: () => ({
    meta: [
      { title: "Admin — Werkgenoten" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminLayout,
});

const nav = [
  { to: "/admin", label: "Overzicht", icon: LayoutDashboard, exact: true },
  { to: "/admin/review-opdrachten", label: "Te reviewen opdrachten", icon: ClipboardCheck, exact: false },
  { to: "/admin/review-professionals", label: "Te reviewen professionals", icon: UserCheck, exact: false },
  { to: "/admin/gebruikers", label: "Gebruikers", icon: Users, exact: false },
  { to: "/admin/opdrachten", label: "Opdrachten", icon: Briefcase, exact: false },
  { to: "/admin/categorieen", label: "Categorieën", icon: Tags, exact: false },
  { to: "/admin/reviews", label: "Reviews", icon: Star, exact: false },
  { to: "/admin/paginas", label: "Pagina's", icon: FileText, exact: false },
  { to: "/admin/thema", label: "Thema", icon: Palette, exact: false },
] as const;

function AdminLayout() {
  const { user, loading: sessionLoading } = useSession();
  const { data: roles, isLoading: rolesLoading, isFetching } = useCurrentUserRoles();
  const navigate = useNavigate();
  const isAdmin = (roles ?? []).includes("admin");
  const stillResolving = sessionLoading || !user || rolesLoading || isFetching || roles === undefined;

  useEffect(() => {
    if (!stillResolving && !isAdmin) navigate({ to: "/dashboard", replace: true });
  }, [stillResolving, isAdmin, navigate]);

  if (stillResolving || !isAdmin) {
    return <div className="mx-auto max-w-7xl px-4 py-10 text-sm text-muted-foreground">Bezig met laden…</div>;
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
        <aside className="bg-card-gradient shadow-card h-fit rounded-xl border border-border/60 p-3">
          <div className="px-3 py-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">Admin</div>
          <nav className="space-y-0.5">
            {nav.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                activeOptions={{ exact: n.exact }}
                className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-surface-2 hover:text-foreground"
                activeProps={{ className: "bg-surface-2 text-foreground" }}
              >
                <n.icon className="h-4 w-4" />
                {n.label}
              </Link>
            ))}
          </nav>
        </aside>
        <div>
          <Outlet />
        </div>
      </div>
    </div>
  );
}