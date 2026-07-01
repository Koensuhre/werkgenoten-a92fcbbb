# Template-voorbeeld

Deze map is een **kopieer-en-plak voorbeeld** gebaseerd op de homepage (`src/routes/index.tsx`).
Gebruik het als referentie wanneer je een nieuwe pagina aanmaakt, zodat styling,
structuur en design tokens consistent blijven met de rest van Werkgenoten.

> Belangrijk: deze map staat **buiten** `src/routes/`, dus TanStack Router pikt
> hem niet op. De template is dus **niet zichtbaar** op je website. Dat is de
> bedoeling — dit is puur documentatie/voorbeeldcode.

---

## Wat zit erin?

- `PageTemplate.tsx` — een volledige voorbeeldpagina met alle secties uit de
  homepage (Hero, Trust, HowItWorks, Categories, FeaturedJobs, Stats,
  Testimonials, Pricing, CTA). Elke sectie is een losse component met commentaar
  erboven, zodat je makkelijk kunt kiezen welke je overneemt.
- `README.md` — dit bestand met uitleg.

## Hoe gebruik ik dit als ik een nieuwe pagina wil maken?

1. **Nieuwe route aanmaken.** Maak een bestand aan in `src/routes/`, bijvoorbeeld
   `src/routes/over-ons.tsx`. De bestandsnaam bepaalt de URL:
   - `over-ons.tsx` → `/over-ons`
   - `diensten.index.tsx` → `/diensten`
   - `blog.$slug.tsx` → `/blog/:slug`

2. **Skelet kopiëren.** Kopieer bovenaan `src/routes/over-ons.tsx` deze basis:

   ```tsx
   import { createFileRoute } from "@tanstack/react-router";

   export const Route = createFileRoute("/over-ons")({
     head: () => ({
       meta: [
         { title: "Over ons — Werkgenoten" },
         { name: "description", content: "Korte omschrijving van deze pagina." },
         { property: "og:title", content: "Over ons — Werkgenoten" },
         { property: "og:description", content: "Korte omschrijving van deze pagina." },
       ],
       links: [{ rel: "canonical", href: "/over-ons" }],
     }),
     component: OverOnsPage,
   });

   function OverOnsPage() {
     return (
       <>
         {/* Plak hier de secties die je uit PageTemplate.tsx wilt gebruiken */}
       </>
     );
   }
   ```

   > De string in `createFileRoute("/over-ons")` moet exact overeenkomen met de
   > bestandsnaam (zie route-conventie in `src/routes/README.md`).

3. **Secties kopiëren.** Open `PageTemplate.tsx`, kies één of meer secties
   (`<Hero />`, `<HowItWorks />`, etc.) en plak ze in je nieuwe pagina. Kopieer
   ook de bijbehorende sectie-component naar je pagina, of importeer hem
   rechtstreeks uit `@/template-voorbeeld/PageTemplate` (alleen tijdens
   experimenten — voor productie: kopiëren en aanpassen).

4. **Design tokens gebruiken (BELANGRIJK).** Alle kleuren, gradients en
   schaduwen zijn semantische tokens uit `src/styles.css`. Gebruik ze via
   Tailwind-klassen — hardcode nooit hex-kleuren of `text-white` / `bg-black`.

   Meestgebruikte tokens (zie `src/styles.css` voor de volledige set):

   | Doel                    | Klasse                                          |
   | ----------------------- | ----------------------------------------------- |
   | Achtergrond pagina      | `bg-background` / `text-foreground`             |
   | Kaart / paneel          | `bg-card-gradient` `border-border/60` `shadow-card` |
   | Glass-effect            | `glass` `shadow-elegant`                        |
   | Primaire knop (CTA)     | `bg-brand-gradient text-brand-foreground shadow-glow` |
   | Secundaire knop         | `border border-border bg-surface/60 hover:bg-surface-2` |
   | Accentkleur / iconen    | `text-brand` / `fill-brand`                     |
   | Subtiele tekst          | `text-muted-foreground`                         |
   | Gradient heading        | `text-gradient` of `text-gradient-brand`        |
   | Hero achtergrond        | `bg-hero`                                       |
   | Oppervlak (secties)     | `bg-surface/30` `bg-surface-2`                  |

5. **Layout-conventies.**
   - Wrap secties in `<section className="mx-auto max-w-7xl px-4 py-24 sm:px-6">`
     voor consistente breedte en padding.
   - Gebruik `animate-fade-up` op hero-elementen voor de vertrouwde intro-animatie.
   - Gebruik `text-balance` op koppen voor mooiere regeleindes.

6. **Navigatie.** Gebruik altijd `<Link to="/pad">` uit `@tanstack/react-router`
   (nooit `<a href>`), zodat client-side routing en preloading werken.

7. **Data.** Voor data-gedreven secties (zoals `FeaturedJobs`, `Categories`):
   gebruik de hooks uit `@/lib/queries` (`useJobs`, `useCategories`, etc.).

## Wat NIET doen

- Deze map niet verplaatsen naar `src/routes/` — dan wordt hij een echte route
  en verschijnt de template op je site.
- Geen hardcoded kleuren (`#3B82F6`, `text-white`, `bg-black`). Alles via tokens.
- Geen `<a href="/pad">` voor interne links — gebruik `<Link to=...>`.

## Zie ook

- `src/routes/README.md` — verschil tussen app-routes en content-routes
- `src/styles.css` — alle beschikbare design tokens
- `src/routes/index.tsx` — de live homepage die als basis voor deze template diende