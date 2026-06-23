## Doel
Fase 1 met simpele block-editor: WordPress wordt de bron voor **content-pagina's** (contact, over-ons, faq, etc.) en het hoofdmenu. App-routes (`/dashboard`, `/opdrachten`, `/plaats-opdracht`, `/admin`, `/auth`) blijven hardcoded React-routes. Admins beheren WP-pagina's vanaf `/admin/paginas` met een blokken-formulier en live preview, en kunnen vanuit daar doorklikken naar Gutenberg voor rich editing.

## Wat ik ga bouwen

### 1. Bugfix: `/cms/contact` flashed dan leeg
- `src/routes/cms.$slug.tsx`: render content uit `useSuspenseQuery` blijft, maar:
  - Loader gooit `notFound()` als WP `null` teruggeeft (nu doet hij dat al, maar de catch in `getPage` slikt errors waardoor cache `null` wordt → leeg).
  - Onderscheid maken tussen "pagina bestaat niet" (404) en "WP onbereikbaar" (errorComponent met retry). De huidige `try/catch → null` maakt beide gevallen identiek; ik vervang door doorgooien van netwerk-/GraphQL-errors en alleen `null` bij echt 404.
- `BlockRenderer` defensief maken tegen lege `blocks`-array.

### 2. `/admin/paginas` — WP-pagina-overzicht
Nieuwe route `src/routes/_authenticated/_admin/admin.paginas.tsx`:
- Lijst van alle WP-pagina's via nieuwe `cmsClient.listPages()` (WPGraphQL `pages { nodes { slug title modified uri } }`).
- Per rij: titel, slug, "laatst gewijzigd", knoppen "Bewerken" (→ `/admin/paginas/$slug`) en "Open in WP" (→ `wp-admin/post.php?post=ID&action=edit` in nieuw tabblad).
- Knop "Nieuwe pagina" → opent dialog met titel + slug → POST naar WP REST (`/wp-json/wp/v2/pages`) met Application Password (zie sectie 5).

### 3. `/admin/paginas/$slug` — simpele block-editor
Nieuwe route `src/routes/_authenticated/_admin/admin.paginas.$slug.tsx`:
- Laadt pagina via `cmsClient.getPage(slug)`.
- Linkerkant: lijst van blokken (hero/richtext/features/cta/faq/image/...), met per blok:
  - Drag-handle om volgorde te wijzigen (`@dnd-kit/sortable` — al niet aanwezig, wel `cmdk` etc.; installeer `@dnd-kit/core @dnd-kit/sortable`).
  - Verwijder, dupliceer.
  - Veld-formulier op basis van block-type (Zod-schema per block-type → React Hook Form).
- "Blok toevoegen" knop → picker met blok-types.
- Rechterkant: live preview via bestaande `BlockRenderer` op de huidige draft.
- "Opslaan" → POST `blocksJson` naar WP REST custom endpoint (sectie 5).
- "Open in Gutenberg" knop voor wie liever de WP-editor gebruikt.

### 4. WP-menu sync in `site-header`
- `cmsClient.getMenu("PRIMARY")` bestaat al; nieuwe hook `useCmsMenu()` met fallback naar de hardcoded `nav` array bij `null`.
- `site-header.tsx` rendert WP-menu als beschikbaar, anders huidige hardcoded items.
- App-routes (Plaats opdracht, Dashboard, Admin) blijven los — die zitten niet in het WP-menu.

### 5. WordPress-kant (door jou uit te voeren in WP)
Ik kan dit niet voor je deployen — jij moet in WP:
- **Application Password** aanmaken voor je admin-user (Users → Profile → Application Passwords) en als secret `WP_APP_PASSWORD` + `WP_APP_USER` opslaan via de Cloud-secrets-knop.
- Snippet (lever ik aan) in `functions.php` / mu-plugin die:
  - `blocksJson` registreert als REST-/GraphQL-veld op `page` (read+write).
  - Optioneel: een `vakwerk/v1/pages/:slug` endpoint dat blocksJson in één POST update.
- CORS toestaan voor de Lovable preview/published origin.

De frontend-code roept WP aan via een **server function** `updatePage.functions.ts` met `requireSupabaseAuth + admin-role check`, die met de Application Password naar WP REST schrijft. Geen WP-credentials in de browser.

### 6. Documentatie
Update `.lovable/plan.md` met:
- Lijst app-routes (niet WP-beheerd).
- Lijst content-routes (WP-beheerd via `/cms/$slug`).
- Korte instructie voor admins: "WP-pagina maken via `/admin/paginas` of WP-admin".

## Wat ik **niet** doe in deze fase
- Drag-and-drop op een visueel canvas (Elementor-stijl). De editor is een formulier met live preview, niet een WYSIWYG-canvas. Dit is bewuste scope.
- Inline editen op de live site (frontend overlay-editor).
- Bidirectionele realtime sync — WP is de bron; wijzigingen via de frontend gaan via REST naar WP, wijzigingen in WP zijn meteen zichtbaar (cache `staleTime: 60s`).
- Migratie van bestaande hardcoded marketing-content (`/prijzen`, `/hoe-werkt-het`) naar WP. Doen we per pagina als jij dat wilt.

## Volgorde van uitvoering
1. Bugfix `/cms/contact` + `BlockRenderer` defensief.
2. `cmsClient.listPages()` + `updatePage` server function.
3. `/admin/paginas` overzicht.
4. `/admin/paginas/$slug` block-editor met dnd-kit.
5. `useCmsMenu()` + `site-header` integratie.
6. Plan-doc bijwerken + WP-snippet aanleveren in chat.

## Vraag voordat ik begin
Heb je al een **WordPress Application Password** aangemaakt en wil je die nu als secret `WP_APP_USER` + `WP_APP_PASSWORD` opslaan? Zonder die credentials kan de "opslaan naar WP" knop niet werken — dan bouw ik de editor wel maar laat opslaan disabled met een duidelijke melding totdat jij de secret toevoegt.
