import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import { LayoutDashboard, Briefcase, MessageCircle, Star, Settings, CreditCard, TrendingUp } from "lucide-react";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — Vakwerk" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: DashboardLayout,
});

const nav = [
  { to: "/dashboard", label: "Overzicht", icon: LayoutDashboard, exact: true },
  { to: "/dashboard/projecten", label: "Projecten", icon: Briefcase, exact: false },
  { to: "/dashboard/berichten", label: "Berichten", icon: MessageCircle, exact: false },
  { to: "/dashboard/reviews", label: "Reviews", icon: Star, exact: false },
  { to: "/dashboard/leads", label: "Leads", icon: TrendingUp, exact: false },
  { to: "/dashboard/abonnement", label: "Abonnement", icon: CreditCard, exact: false },
  { to: "/dashboard/instellingen", label: "Instellingen", icon: Settings, exact: false },
] as const;

function DashboardLayout() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
        <aside className="bg-card-gradient shadow-card h-fit rounded-xl border border-border/60 p-3">
          <div className="px-3 py-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">Dashboard</div>
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