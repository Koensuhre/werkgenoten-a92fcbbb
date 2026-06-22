# Wat is er nog nodig om live te gaan

De fundering (CMS-laag, theme engine, block renderer, Supabase schema + RLS, auth route) staat. Voor een echte productie-lancering ontbreken nog de volgende blokken. Ik groepeer ze op urgentie.

## 1. Must-have vóór publicatie

**Data echt aansluiten (nu nog mock)**
- `src/lib/mock-data.ts` vervangen door Supabase-queries via `createServerFn`:
  - `vakmensen` lijst + detail → `profiles` + `user_roles='professional'`
  - `opdrachten` lijst + detail → `jobs` + `categories`
  - Dashboard (`leads`, `projecten`, `berichten`, `reviews`) → `quotes`, `jobs`, `messages`, `reviews`
- Seed migratie met ~20 demo-opdrachten, 10 demo-pro's en categorieën, anders is de site leeg.

**Auth-gating afmaken**
- Dashboard-routes verplaatsen naar `src/routes/_authenticated/dashboard.*` zodat alleen ingelogde users er bij kunnen.
- Header: toon "Inloggen" of "Dashboard/Uitloggen" op basis van sessie (nu statisch).
- `/auth` koppelen aan onboarding (kies rol: opdrachtgever vs. vakman → schrijft in `user_roles`).

**Kernflows werkend maken**
- `Opdracht plaatsen` → echt INSERT in `jobs` (nu form zonder backend).
- `Word professional` → upgrade rol naar `professional` + profielwizard (categorieën, regio, KvK, bio, foto upload naar Storage).
- `Offerte indienen` knop op opdracht-detail → INSERT in `quotes`.
- `Berichten` → realtime via Supabase channels op `messages`.
- `Review achterlaten` na afgeronde job.

**SEO & metadata per route**
- Elke route een eigen `head()` met `title`, `description`, `og:title`, `og:description`, `og:type`, `twitter:card`.
- Dynamische routes (`opdrachten/$slug`, `vakmensen/$slug`) afleiden uit loader-data.
- `robots.txt` + dynamische `sitemap.xml` server-route onder `src/routes/api/public/`.
- Favicon en social share image (1200×630) toevoegen.

**Security check**
- `security--run_security_scan` draaien en findings oplossen (waarschijnlijk: leaked-password protection aanzetten, ontbrekende GRANTs).
- RLS-policies dubbelchecken op `jobs`, `quotes`, `messages`.

## 2. Sterk aanbevolen vóór echte gebruikers

- **Betalingen**: abonnement voor pro's (leads kopen / maandbundel) via Lovable's ingebouwde Stripe Payments. Webhook in `/api/public/stripe-webhook` die `profiles.subscription_status` bijwerkt.
- **E-mailnotificaties** (Lovable Email): nieuwe lead, nieuw bericht, nieuwe review, wachtwoord-reset. `/reset-password` route is er nog niet — die is verplicht.
- **Storage buckets**: `avatars`, `job-photos`, `portfolio` met juiste RLS-policies.
- **Spam/rate-limit**: simpele rate limit op `plaats-opdracht` (IP + user) en honeypot-veld in formulieren.
- **Empty states & loading skeletons** voor lijsten/dashboard.
- **404 / error componenten** op alle routes met loader (nu deels generiek).

## 3. Polish & launch

- Mobiele review van alle pagina's (header, dashboard, opdracht-detail).
- Cookie/consent banner (NL/EU).
- Privacy + Algemene voorwaarden + Cookies pagina's (via CMS-fallback of hardcoded).
- Analytics aanzetten (Lovable analytics is al beschikbaar).
- Custom domein koppelen via Project Settings → Domains.
- Publish-zichtbaarheid op `public` zetten.

## Voorgestelde volgorde van uitvoeren

```text
1. Supabase services + seed data + dashboard/lijsten op echte data
2. Auth-gating + onboarding + header-status
3. Kernflows: opdracht plaatsen, offerte, berichten, review
4. SEO metadata + sitemap + favicon + OG image
5. Storage + e-mails + /reset-password
6. Stripe abonnementen voor pro's
7. Security scan + RLS-review + rate limiting
8. Cookie/legal pagina's + polish
9. Custom domein + publish public
```

## Vraag

Wil je dat ik dit als één grote ronde aanpak, of stap voor stap (bv. eerst blok 1 + 2 zodat de app op echte data draait, dan de rest)? En welke ben je van plan zelf te doen (bv. domein, juridische teksten, social share image)?
