import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/checkout/return")({
  head: () => ({
    meta: [
      { title: "Bedankt voor je aanmelding — Werkgenoten" },
      { name: "robots", content: "noindex" },
    ],
  }),
  validateSearch: (search: Record<string, unknown>): { session_id?: string } => ({
    session_id: typeof search.session_id === "string" ? search.session_id : undefined,
  }),
  component: CheckoutReturn,
});

function CheckoutReturn() {
  const { session_id } = Route.useSearch();
  return (
    <div className="mx-auto max-w-xl px-4 py-24 text-center sm:px-6">
      <div className="grid h-14 w-14 mx-auto place-items-center rounded-full bg-brand-gradient text-brand-foreground">
        <CheckCircle2 className="h-7 w-7" />
      </div>
      <h1 className="mt-6 text-3xl font-semibold tracking-tight">Bedankt! Je abonnement is actief.</h1>
      <p className="mt-3 text-muted-foreground">
        Je betaling is verwerkt. Je hebt nu volledige toegang tot je dashboard en alle Professional-functies.
      </p>
      {session_id && (
        <p className="mt-3 text-xs text-muted-foreground">Referentie: {session_id}</p>
      )}
      <div className="mt-8 flex justify-center gap-3">
        <Link to="/dashboard" className="rounded-lg bg-brand-gradient px-6 py-3 text-sm font-medium text-brand-foreground shadow-glow">
          Naar mijn dashboard
        </Link>
        <Link to="/" className="rounded-lg border border-border bg-surface px-6 py-3 text-sm font-medium">
          Terug naar home
        </Link>
      </div>
    </div>
  );
}