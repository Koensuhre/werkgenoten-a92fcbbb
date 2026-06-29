# Werkgenoten

TanStack Start (SSR) + Nitro + Supabase + Stripe + WPGraphQL, gebouwd met
Lovable en gedeployed naar Vercel. GitHub is de bron van waarheid; Lovable
en VS Code synchroniseren beide via dezelfde repo.

## Stack

- **Frontend / SSR:** TanStack Start v1 (React 19) + Vite 7
- **Server runtime:** Nitro met preset `vercel` → `.vercel/output/`
- **Auth + DB:** Supabase (Lovable Cloud)
- **Payments:** Stripe (Lovable managed)
- **CMS:** Headless WordPress via WPGraphQL (lezen) + WP REST (schrijven)

## Lokaal draaien (VS Code)

Vereist Node 20 (zie `.nvmrc`) en npm.

```bash
npm install
npm run dev      # http://localhost:8080
npm run build    # produceert .vercel/output/
```

Kopieer `.env.example` naar `.env` en vul de publieke waarden in (zelfde
waarden als Lovable). Server-secrets hoeven lokaal alleen aanwezig te zijn
als je de bijbehorende server functions wil testen — anders werkt de app
met de live Supabase / WP backends gewoon.

## GitHub workflow

- Lovable ↔ GitHub two-way sync staat aan; elke Lovable-edit wordt naar
  `main` gepusht en elke `git push` naar `main` verschijnt in Lovable.
- Vanuit VS Code: gewoon `git pull` / `git push` op `main`.
- Vercel is op `main` aangesloten → elke push triggert automatisch een
  nieuwe production deploy. PR's krijgen automatisch een preview-deploy.

## Vercel deploy

Eénmalige setup in Vercel:

1. **Settings → Git** → koppel de GitHub-repo aan branch `main`.
2. **Settings → General**
   - Framework Preset: **Other**
   - Node.js Version: **20.x**
   - Build / Install / Output velden: leeg laten (worden uit `vercel.json`
     gelezen; Nitro genereert zelf `.vercel/output/`).
3. **Settings → Environment Variables** (Production + Preview):
   - **Public (`VITE_*`)** — uit `.env.example`:
     `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`,
     `VITE_SUPABASE_PROJECT_ID`, `VITE_WP_GRAPHQL_URL`,
     `VITE_PAYMENTS_CLIENT_TOKEN`
   - **Server-only** (geen `VITE_` prefix):
     - Stripe: `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`
     - WordPress: `WP_BASE_URL`, `WP_APP_USER`, `WP_APP_PASSWORD`
       (Application Password uit WP → Users → Profile)
     - Supabase server-side: `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY`
       (en `SUPABASE_SERVICE_ROLE_KEY` indien gebruikt door admin server
       functions)
4. **Deployments → Redeploy** voor de eerste run. Daarna gaat alles via
   `git push`.
5. **Stripe Dashboard** → werk de webhook-endpoint URL bij naar
   `https://<je-vercel-domain>/api/public/payments/webhook`.

## WordPress koppeling

- Lezen: WPGraphQL via `VITE_WP_GRAPHQL_URL` (publiek, client + SSR).
- Schrijven: `src/lib/wp.functions.ts` (admin-gated server functions) via
  WP REST met Application Password. De Application Password staat alleen
  server-side in `WP_APP_*` env vars; nooit in de client.
- Nieuwe WP-pagina's verschijnen automatisch via de catch-all route
  `src/routes/$.tsx` op basis van de slug.

## Troubleshooting

- **404 op Vercel na een deploy** — check dat `vite.config.ts` nog
  `preset: "vercel"` heeft en dat `vercel.json` `"framework": null`
  gebruikt. Een handmatige `api/index.ts` of `outputDirectory` mag NIET
  bestaan.
- **`FUNCTION_INVOCATION_FAILED`** — meestal een ontbrekende server-env
  var. Check Vercel → Deployments → Logs en vergelijk met de lijst
  hierboven.
- **WP-content flasht en verdwijnt** — opgelost; loader + `useQuery`
  delen nu dezelfde key (`src/routes/$.tsx`, `src/routes/cms.$slug.tsx`).
- **Build faalt lokaal maar slaagt op Vercel (of andersom)** — controleer
  dat je Node 20 draait (`node -v`) en dat `package-lock.json` up-to-date
  is. Er is bewust géén `bun.lock` om dependency drift te voorkomen.