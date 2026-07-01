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

---

## Component-lijst per sectie

Snelle referentie: per sectie in `PageTemplate.tsx` zie je wat je **mag
aanpassen** (content, data) en wat je **intact moet laten** (layout-klassen,
design tokens, structuur). Verander nooit de tokens — anders wijkt je pagina
visueel af van de rest van de site.

### Legenda
- ✅ **Aanpassen** — vrij te wijzigen per pagina.
- 🔒 **Laten staan** — layout/design tokens; verander deze niet.
- 💡 **Tip** — optionele suggestie.

---

### 1. `<Hero />` — Openings-sectie met titel + CTA's

| Element                          | Actie          | Toelichting                                                                 |
| -------------------------------- | -------------- | --------------------------------------------------------------------------- |
| Badge tekst (`Badge · Optionele...`) | ✅ Aanpassen   | Korte context, bv. "Nieuw", "Beta", categorie.                              |
| `<h1>` heading                   | ✅ Aanpassen   | Max ~8 woorden. Houd `text-gradient` klasse voor het gradient-effect.       |
| Ondertitel `<p>`                 | ✅ Aanpassen   | 1-2 zinnen, max ~160 tekens.                                                |
| CTA-knoppen (primair + secundair) | ✅ Aanpassen   | Tekst + `to="/..."` naar juiste route.                                      |
| Trust-indicators (3x)            | ✅ Aanpassen   | Icoon + korte tekst (`Shield`, `Clock`, `Star` uit `lucide-react`).         |
| Floating preview card            | 💡 Optioneel   | Verwijder als de pagina geen "product-shot" nodig heeft.                    |
| `bg-hero`, grid-achtergrond, glow-blur, `animate-fade-up`, `animate-pulse-glow` | 🔒 Laten staan | Bepalen de hero-sfeer.                                                     |
| `bg-brand-gradient`, `shadow-glow`, `text-brand-foreground` (primaire CTA) | 🔒 Laten staan | Brand-consistentie.                                                        |

---

### 2. `<Trust />` — Logo- / merkenstrook

| Element                     | Actie          | Toelichting                                                     |
| --------------------------- | -------------- | --------------------------------------------------------------- |
| `names` array               | ✅ Aanpassen   | Vervang door echte merknamen of `<img>` logo's.                 |
| Kop-tekst (`Vertrouwd door...`) | ✅ Aanpassen   | Optioneel weg te halen.                                         |
| `border-y`, `bg-surface/30`, `opacity-70` | 🔒 Laten staan | Zorgen voor de subtiele "band" tussen secties.                 |
| Grid: `grid-cols-2 sm:grid-cols-4 md:grid-cols-6` | 🔒 Laten staan | Responsive verdeling.                                            |

💡 Skip deze sectie helemaal als je geen social proof hebt.

---

### 3. `<HowItWorks />` — Stappenplan in 3 cards

| Element                | Actie          | Toelichting                                                       |
| ---------------------- | -------------- | ----------------------------------------------------------------- |
| `steps` array          | ✅ Aanpassen   | Wijzig `n` (nummer), `t` (titel), `d` (beschrijving).             |
| Sectie-heading `<h2>`  | ✅ Aanpassen   | Max 8 woorden.                                                    |
| Ondertitel             | ✅ Aanpassen   | Optioneel.                                                        |
| `bg-card-gradient`, `shadow-card`, `border-border/60`, `rounded-2xl` | 🔒 Laten staan | Standaard card-look.                                              |
| `text-brand` op stapnummer | 🔒 Laten staan | Accent-kleur consistent houden.                                   |
| Aantal kolommen `md:grid-cols-3` | 💡 Optioneel   | Mag 2 of 4 worden als je meer/minder stappen hebt.                |

---

### 4. `<Categories />` — Icoon-grid

| Element                | Actie          | Toelichting                                                     |
| ---------------------- | -------------- | --------------------------------------------------------------- |
| `categories` array     | ✅ Aanpassen   | Statisch OF vervang door `useCategories()` uit `@/lib/queries`. |
| Emoji-icoon `c.icon`   | ✅ Aanpassen   | Emoji of `lucide-react` icoon.                                  |
| `<Link to="/...">`     | ✅ Aanpassen   | Bestemming per categorie.                                       |
| "Bekijk alles →" link  | ✅ Aanpassen   | URL + tekst.                                                    |
| Hover: `hover:border-brand/40`, `hover:shadow-glow` | 🔒 Laten staan | Interactie-feedback.                                            |
| Grid: `grid-cols-2 sm:grid-cols-3 md:grid-cols-4` | 🔒 Laten staan | Responsive.                                                      |

---

### 5. `<FeaturedJobs />` — Kaartlijst met items

| Element                | Actie          | Toelichting                                                     |
| ---------------------- | -------------- | --------------------------------------------------------------- |
| `jobs` array           | ✅ Aanpassen   | Statisch OF vervang door `useJobs()` uit `@/lib/queries`.       |
| Alle veld-teksten (`title`, `city`, `budget`, ...) | ✅ Aanpassen | Je eigen data.                                                  |
| `urgent` badge (`Zap`-icoon + `text-brand`) | 💡 Optioneel   | Alleen als "spoed" relevant is.                                  |
| `bg-card-gradient`, `shadow-card`, `hover:border-brand/40` | 🔒 Laten staan | Standaard card-styling.                                          |
| `line-clamp-2` op beschrijving | 🔒 Laten staan | Voorkomt lange tekst-blokken.                                   |

---

### 6. `<Stats />` — Grote getallen met gradient

| Element                | Actie          | Toelichting                                                     |
| ---------------------- | -------------- | --------------------------------------------------------------- |
| `stats` array (value, suffix, label) | ✅ Aanpassen   | Vul je eigen KPI's in.                                          |
| `text-gradient-brand` klasse | 🔒 Laten staan | Bepaalt het gouden gradient-cijfer-effect.                      |
| `border-y`, `bg-surface/30` | 🔒 Laten staan | "Band"-styling tussen secties.                                  |
| Aantal `md:grid-cols-4` | 💡 Optioneel   | Mag 2 of 3 kolommen als je minder stats hebt.                   |

---

### 7. `<Testimonials />` — Quote-kaarten met sterren

| Element                | Actie          | Toelichting                                                     |
| ---------------------- | -------------- | --------------------------------------------------------------- |
| `testimonials` array   | ✅ Aanpassen   | `name`, `role`, `rating` (1-5), `quote`.                        |
| `fill-brand` op `<Star>` | 🔒 Laten staan | Consistente brand-kleur voor rating.                            |
| `bg-card-gradient`, `rounded-xl` | 🔒 Laten staan | Card-look.                                                      |
| Grid: `md:grid-cols-2 lg:grid-cols-4` | 💡 Optioneel   | Pas aan naar aantal quotes.                                     |

---

### 8. `<Pricing />` — 3-koloms prijstabel

| Element                | Actie          | Toelichting                                                     |
| ---------------------- | -------------- | --------------------------------------------------------------- |
| `plans` array          | ✅ Aanpassen   | Naam, prijs, tagline, features, CTA-tekst.                      |
| `highlight: true`      | ✅ Aanpassen   | Zet op de aanbevolen kolom (max 1).                             |
| CTA `<Link to="/...">` | ✅ Aanpassen   | Bestemming per plan.                                            |
| `border-brand/50`, `shadow-glow` op highlight | 🔒 Laten staan | Onderscheidt aanbevolen plan.                                   |
| `CheckCircle2` + `text-brand` | 🔒 Laten staan | Consistente feature-lijst-stijl.                                |
| `id="pricing"`         | 💡 Optioneel   | Handig voor hash-anchors, mag weg.                              |

---

### 9. `<CTA />` — Afsluitende call-to-action banner

| Element                | Actie          | Toelichting                                                     |
| ---------------------- | -------------- | --------------------------------------------------------------- |
| `<h2>` + `<p>`         | ✅ Aanpassen   | Overtuigende afsluitende tekst.                                 |
| Primaire + secundaire CTA | ✅ Aanpassen   | Tekst + `to="/..."`.                                            |
| Radial gradient overlay | 🔒 Laten staan | Geeft de banner z'n glow.                                       |
| `bg-card-gradient`, `shadow-elegant`, `rounded-3xl` | 🔒 Laten staan | Consistente banner-styling.                                     |

---

## Globale "laten staan"-regels (gelden voor alle secties)

- 🔒 Sectie-wrapper: `<section className="mx-auto max-w-7xl px-4 py-24 sm:px-6">` — behoudt consistente pagina-breedte en verticaal ritme.
- 🔒 Alle `bg-*`, `text-*`, `border-*`, `shadow-*` klassen die naar tokens verwijzen (`brand`, `surface`, `card-gradient`, `muted-foreground`, ...). Vervang nooit door hex- of hardcoded kleuren.
- 🔒 `animate-fade-up`, `animate-pulse-glow`, `text-balance`, `text-gradient`, `text-gradient-brand`, `glass` — allemaal utility-klassen uit `styles.css`.
- 🔒 Gebruik altijd `<Link to="/pad">` uit `@tanstack/react-router`, nooit `<a href>`.
- ✅ Teksten, arrays met data, iconen, en welke secties je opneemt zijn volledig vrij.