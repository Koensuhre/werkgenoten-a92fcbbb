import { createFileRoute, Link } from "@tanstack/react-router";
import { Shield, MessageCircle, Star, Sparkles } from "lucide-react";

export const Route = createFileRoute("/hoe-werkt-het")({
  head: () => ({
    meta: [
      { title: "Hoe het werkt — Werkgenoten" },
      { name: "description", content: "In drie stappen van klus naar oplevering. Zo werkt Werkgenoten." },
      { property: "og:title", content: "Hoe het werkt — Werkgenoten" },
      { property: "og:description", content: "Zo werkt Werkgenoten: plaatsen, offertes, kiezen." },
      { property: "og:url", content: "/hoe-werkt-het" },
    ],
    links: [{ rel: "canonical", href: "/hoe-werkt-het" }],
  }),
  component: HowItWorks,
});

function HowItWorks() {
  const steps = [
    { n: "01", t: "Plaats je opdracht", d: "Vertel in 2 minuten wat er moet gebeuren. Voeg foto's toe en geef een richtbudget op.", icon: <Sparkles className="h-5 w-5" /> },
    { n: "02", t: "Ontvang passende offertes", d: "Gecontroleerde professionals reageren binnen 24 uur met een transparante offerte.", icon: <Shield className="h-5 w-5" /> },
    { n: "03", t: "Chat en vergelijk", d: "Stel vragen, vergelijk reviews en planning. Jij beslist wanneer je er klaar voor bent.", icon: <MessageCircle className="h-5 w-5" /> },
    { n: "04", t: "Laat de klus uitvoeren", d: "De vakman start volgens afspraak. Na oplevering deel jij jouw ervaring.", icon: <Star className="h-5 w-5" /> },
  ];
  return (
    <div className="mx-auto max-w-5xl px-4 py-20 sm:px-6">
      <div className="text-center">
        <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl">Zo werkt Werkgenoten</h1>
        <p className="mx-auto mt-4 max-w-xl text-muted-foreground">Drie stappen om jouw klus aan de juiste vakman te koppelen.</p>
      </div>

      <div className="mt-16 space-y-6">
        {steps.map((s) => (
          <div key={s.n} className="bg-card-gradient shadow-card flex gap-5 rounded-2xl border border-border/60 p-6">
            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-brand-gradient text-brand-foreground shadow-glow">
              {s.icon}
            </div>
            <div>
              <div className="font-mono text-xs text-brand">{s.n}</div>
              <h2 className="mt-1 text-xl font-semibold">{s.t}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{s.d}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-16 text-center">
        <Link to="/plaats-opdracht" className="inline-flex rounded-lg bg-brand-gradient px-6 py-3 text-sm font-medium text-brand-foreground shadow-glow">
          Plaats jouw opdracht
        </Link>
      </div>
    </div>
  );
}