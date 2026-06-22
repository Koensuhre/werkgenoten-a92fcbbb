import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/dashboard/instellingen")({
  component: () => (
    <div>
      <h1 className="text-2xl font-semibold">Instellingen</h1>
      <form className="bg-card-gradient shadow-card mt-6 space-y-4 rounded-xl border border-border/60 p-6">
        {[["Naam", "Sanne K."], ["E-mail", "sanne@example.nl"], ["Bedrijf", "Van Dijk Schilders"], ["Postcode", "1012 AB"]].map(([l, v]) => (
          <div key={l}>
            <label className="mb-1.5 block text-sm font-medium">{l}</label>
            <input defaultValue={v} className="w-full rounded-lg border border-border bg-input/40 px-3 py-2 text-sm focus:border-brand focus:outline-none" />
          </div>
        ))}
        <button className="rounded-lg bg-brand-gradient px-4 py-2 text-sm font-medium text-brand-foreground">Opslaan</button>
      </form>
    </div>
  ),
});