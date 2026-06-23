import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { getStripeEnvironment } from "@/lib/stripe";
import { useSession } from "./use-session";

export function useSubscription() {
  const { user } = useSession();
  return useQuery({
    queryKey: ["subscription", user?.id],
    enabled: !!user,
    queryFn: async () => {
      let env: string;
      try {
        env = getStripeEnvironment();
      } catch {
        return null;
      }
      const { data, error } = await (supabase.from("subscriptions") as any)
        .select("*")
        .eq("user_id", user!.id)
        .eq("environment", env)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (error) throw error;
      return data as null | {
        status: string;
        price_id: string;
        current_period_end: string | null;
        cancel_at_period_end: boolean;
      };
    },
  });
}

export function isActiveSubscription(
  sub: { status: string; current_period_end: string | null } | null | undefined,
): boolean {
  if (!sub) return false;
  const end = sub.current_period_end ? new Date(sub.current_period_end).getTime() : null;
  const future = end === null || end > Date.now();
  if (["active", "trialing", "past_due"].includes(sub.status) && future) return true;
  if (sub.status === "canceled" && end !== null && end > Date.now()) return true;
  return false;
}