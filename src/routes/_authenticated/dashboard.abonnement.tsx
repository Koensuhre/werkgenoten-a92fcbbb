import { createFileRoute } from "@tanstack/react-router";
import { CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { plans } from "@/lib/mock-data";
import { useSession } from "@/hooks/use-session";
import { useSubscription, isActiveSubscription } from "@/hooks/use-subscription";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { StripeEmbeddedCheckout } from "@/components/StripeEmbeddedCheckout";
import { createPortalSession } from "@/lib/payments.functions";
import { getStripeEnvironment } from "@/lib/stripe";

export const Route = createFileRoute("/_authenticated/dashboard/abonnement")({
  component: Abonnement,
});

function Abonnement() {
  const { user } = useSession();
  const { data: sub } = useSubscription();
  const [checkoutPriceId, setCheckoutPriceId] = useState<string | null>(null);
  const [opening, setOpening] = useState(false);

  const active = isActiveSubscription(sub);
  const currentPlan = active ? plans.find((p) => p.priceId === sub?.price_id) : undefined;

  async function openPortal() {
    setOpening(true);
    try {
      const result = await createPortalSession({
        data: { environment: getStripeEnvironment(), returnUrl: window.location.href },
      });
      if ("error" in result) throw new Error(result.error);
      window.open(result.url, "_blank");
    } catch (e: any) {
      toast.error(e.message ?? "Kon klantportaal niet openen");
    } finally {
      setOpening(false);
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold">Abonnement</h1>
      <p className="text-sm text-muted-foreground">
        Je huidige plan:{" "}
        <span className="text-brand">{currentPlan?.name ?? (active ? "Actief" : "Geen actief abonnement")}</span>
        {sub?.cancel_at_period_end && sub.current_period_end && (
          <span className="ml-2 text-amber-500">
            (loopt af op {new Date(sub.current_period_end).toLocaleDateString("nl-NL")})
          </span>
        )}
      </p>
      {active && (
        <button
          onClick={openPortal}
          disabled={opening}
          className="mt-4 rounded-lg border border-border bg-surface px-4 py-2 text-sm font-medium hover:bg-surface-2 disabled:opacity-60"
        >
          {opening ? "Bezig…" : "Beheer abonnement & facturen"}
        </button>
      )}

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {plans.map((p) => {
          const isCurrent = currentPlan?.priceId === p.priceId;
          return (
            <div
              key={p.name}
              className={`rounded-xl border p-5 ${p.highlight ? "border-brand/50 bg-card-gradient shadow-glow" : "border-border/60 bg-card-gradient shadow-card"}`}
            >
              <div className="text-sm font-medium">{p.name}</div>
              <div className="mt-2 text-3xl font-semibold">
                €{p.price}
                <span className="text-sm font-normal text-muted-foreground">/mnd</span>
              </div>
              <ul className="mt-4 space-y-1.5 text-xs">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-1.5">
                    <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand" /> {f}
                  </li>
                ))}
              </ul>
              <button
                disabled={isCurrent}
                onClick={() => setCheckoutPriceId(p.priceId)}
                className={`mt-5 w-full rounded-lg px-3 py-2 text-xs font-medium disabled:opacity-60 ${p.highlight ? "bg-brand-gradient text-brand-foreground" : "border border-border bg-surface"}`}
              >
                {isCurrent ? "Huidig plan" : active ? "Wijzig naar dit plan" : "Kies dit plan"}
              </button>
            </div>
          );
        })}
      </div>

      <Dialog open={!!checkoutPriceId} onOpenChange={(open) => !open && setCheckoutPriceId(null)}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden">
          <DialogHeader className="px-6 pt-6">
            <DialogTitle>Afrekenen</DialogTitle>
          </DialogHeader>
          <div className="p-4">
            {checkoutPriceId && user && (
              <StripeEmbeddedCheckout
                priceId={checkoutPriceId}
                userId={user.id}
                customerEmail={user.email ?? undefined}
                returnUrl={`${window.location.origin}/checkout/return?session_id={CHECKOUT_SESSION_ID}`}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}