import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/dashboard/berichten")({
  component: Berichten,
});

function Berichten() {
  const conversations = [
    { name: "Van Dijk Schilders", last: "Top, dan kom ik dinsdag om 09:00 langs.", time: "2m", unread: true },
    { name: "Elektra B.V.", last: "Ik stuur vandaag de offerte door.", time: "1u", unread: true },
    { name: "24/7 Loodgieter", last: "Klus afgerond, fijn je geholpen te hebben!", time: "Gisteren", unread: false },
  ];
  return (
    <div className="grid gap-4 lg:grid-cols-[280px_1fr]">
      <div className="bg-card-gradient shadow-card rounded-xl border border-border/60 p-2">
        {conversations.map((c) => (
          <button key={c.name} className="flex w-full items-center gap-3 rounded-lg p-3 text-left hover:bg-surface-2">
            <div className="grid h-10 w-10 place-items-center rounded-lg bg-brand-gradient text-xs font-bold text-brand-foreground">{c.name[0]}</div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between">
                <div className="truncate text-sm font-medium">{c.name}</div>
                <div className="text-[10px] text-muted-foreground">{c.time}</div>
              </div>
              <div className="truncate text-xs text-muted-foreground">{c.last}</div>
            </div>
            {c.unread && <span className="h-2 w-2 rounded-full bg-brand" />}
          </button>
        ))}
      </div>
      <div className="bg-card-gradient shadow-card flex min-h-[400px] flex-col rounded-xl border border-border/60">
        <div className="border-b border-border/60 p-4">
          <div className="font-semibold">Van Dijk Schilders</div>
          <div className="text-xs text-muted-foreground">Reageert binnen 1 uur</div>
        </div>
        <div className="flex-1 space-y-3 p-4 text-sm">
          <div className="max-w-xs rounded-2xl rounded-tl-sm bg-surface-2 px-3 py-2">Hoi Sanne, ik kan dinsdag of donderdag langskomen voor opname.</div>
          <div className="ml-auto max-w-xs rounded-2xl rounded-tr-sm bg-brand-gradient px-3 py-2 text-brand-foreground">Dinsdag werkt goed. Hoe laat schikt?</div>
          <div className="max-w-xs rounded-2xl rounded-tl-sm bg-surface-2 px-3 py-2">Top, dan kom ik dinsdag om 09:00 langs.</div>
        </div>
        <div className="border-t border-border/60 p-3">
          <div className="flex gap-2">
            <input className="flex-1 rounded-lg border border-border bg-input/40 px-3 py-2 text-sm focus:border-brand focus:outline-none" placeholder="Typ een bericht..." />
            <button className="rounded-lg bg-brand-gradient px-4 py-2 text-sm font-medium text-brand-foreground">Verstuur</button>
          </div>
        </div>
      </div>
    </div>
  );
}