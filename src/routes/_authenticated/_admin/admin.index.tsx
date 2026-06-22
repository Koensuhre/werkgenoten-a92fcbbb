import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Users, Briefcase, Tags, Star, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/_authenticated/_admin/admin/")({
  component: AdminHome,
});

function AdminHome() {
  const { data } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const [users, jobsOpen, jobsDone, cats, reviews] = await Promise.all([
        supabase.from("profiles").select("*", { count: "exact", head: true }),
        supabase.from("jobs").select("*", { count: "exact", head: true }).eq("status", "open"),
        supabase.from("jobs").select("*", { count: "exact", head: true }).eq("status", "completed"),
        supabase.from("categories").select("*", { count: "exact", head: true }),
        supabase.from("reviews").select("*", { count: "exact", head: true }),
      ]);
      return {
        users: users.count ?? 0,
        jobsOpen: jobsOpen.count ?? 0,
        jobsDone: jobsDone.count ?? 0,
        cats: cats.count ?? 0,
        reviews: reviews.count ?? 0,
      };
    },
  });

  const cards = [
    { label: "Gebruikers", value: data?.users ?? "—", icon: Users },
    { label: "Open opdrachten", value: data?.jobsOpen ?? "—", icon: Briefcase },
    { label: "Afgeronde opdrachten", value: data?.jobsDone ?? "—", icon: CheckCircle2 },
    { label: "Categorieën", value: data?.cats ?? "—", icon: Tags },
    { label: "Reviews", value: data?.reviews ?? "—", icon: Star },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Admin overzicht</h1>
        <p className="mt-1 text-sm text-muted-foreground">Snel inzicht in het platform.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((c) => (
          <div key={c.label} className="bg-card-gradient shadow-card rounded-xl border border-border/60 p-5">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{c.label}</span>
              <c.icon className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="mt-2 text-3xl font-semibold">{c.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}