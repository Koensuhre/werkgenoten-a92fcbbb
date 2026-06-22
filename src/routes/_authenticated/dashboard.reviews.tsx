import { createFileRoute } from "@tanstack/react-router";
import { Star } from "lucide-react";

export const Route = createFileRoute("/_authenticated/dashboard/reviews")({
  component: () => (
    <div>
      <h1 className="text-2xl font-semibold">Reviews</h1>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {[
          { n: "Sanne K.", t: "Snel en netjes geleverd. Aanrader!", r: 5 },
          { n: "Mark V.", t: "Vakkundig en transparant.", r: 5 },
          { n: "Aisha R.", t: "Goede communicatie.", r: 4 },
          { n: "Pieter B.", t: "Top kwaliteit.", r: 5 },
        ].map((r) => (
          <div key={r.n} className="bg-card-gradient shadow-card rounded-xl border border-border/60 p-5">
            <div className="flex items-center justify-between">
              <div className="font-medium text-sm">{r.n}</div>
              <div className="flex gap-0.5">{Array.from({ length: r.r }).map((_, i) => <Star key={i} className="h-3.5 w-3.5 fill-brand text-brand" />)}</div>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">{r.t}</p>
          </div>
        ))}
      </div>
    </div>
  ),
});