# TanStack Start → Vercel deploy fix (geen framework-migratie)

Doel: het bestaande TanStack Start + Nitro project 1-op-1 behouden, en alleen de **deploy-laag** richting Vercel correct configureren. Geen routes, geen businesslogica, geen SSR-verwijdering, geen SPA-rewrite.

## Waarom Vercel nu 404 geeft

1. `vercel.json` zegt `"framework": "vite"` → Vercel verwacht een **statische** `dist/` met `index.html` en behandelt de deploy als plain Vite SPA. TanStack Start produceert die `index.html` niet.
2. De Nitro-build target in `vite.config.ts` is via `@lovable.dev/vite-tanstack-config` momenteel **Cloudflare Workers** (de template-default). De build emit is dus een Worker-bundle, geen Vercel Build Output.
3. `api/index.ts` doet `import "../dist/server/server.js"` — dat is een handmatige Vercel Serverless Function uit een eerdere poging. Het pad bestaat in de Cloudflare-build niet en deze file conflicteert met elke andere preset.

Combinatie van 1+2+3 → Vercel routet alles naar een lege static output → 404 op elke URL.

## Wijzigingen

### 1. `vite.config.ts` — Nitro preset op `vercel`
Nitro accepteert een `preset` optie via de TanStack Start config. We zetten 'm expliciet op `vercel`, naast de bestaande `server.entry: "server"` (de SSR error-wrapper in `src/server.ts` blijft staan en blijft werken — Nitro injecteert hem in de Vercel function).

```ts
export default defineConfig({
  tanstackStart: {
    server: { entry: "server", preset: "vercel" },
  },
});
```

Resultaat van `npm run build`: `.vercel/output/` met `config.json`, `functions/` en `static/` volgens de officiële Vercel Build Output API v3. Vercel pakt dit automatisch op, inclusief SSR routing, server functions en server routes (`/api/public/payments/webhook` etc.).

### 2. `vercel.json` — minimaliseren
Vervangen door:

```json
{
  "buildCommand": "npm run build",
  "installCommand": "npm install",
  "framework": null
}
```

Geen `rewrites`, geen `outputDirectory`, geen `functions`-blok. Nitro's `.vercel/output/config.json` regelt alle routing zelf.

### 3. `api/index.ts` — verwijderen
Restant van eerdere handmatige Serverless-Function-poging. Met de Nitro vercel-preset zou deze file botsen met de gegenereerde functions. Wordt verwijderd.

### 4. Lockfile-keuze
Repo bevat zowel `bun.lock` (Lovable-default) als `package-lock.json` (npm). Op Vercel met `installCommand: "npm install"` wordt `package-lock.json` autoritair → `bun.lock` verwijderen. Lovable's sandbox draait ook fijn met `package-lock.json`; `bunfig.toml` (supply-chain guard) blijft staan voor wanneer iemand alsnog bun gebruikt, maar de waarheid wordt npm.

### 5. `.env.example`
Nieuw bestand, alleen publieke / client-exposed waarden:

```
VITE_SUPABASE_URL=
VITE_SUPABASE_PUBLISHABLE_KEY=
VITE_SUPABASE_PROJECT_ID=
VITE_WP_GRAPHQL_URL=
VITE_PAYMENTS_CLIENT_TOKEN=
```

Server-secrets (Stripe secret key, Stripe webhook secret, eventuele WP application password) staan **niet** in `.env.example` — die horen exclusief in Vercel → Settings → Environment Variables (Production + Preview). README documenteert welke namen verwacht worden. Audit bevestigt: geen `VITE_`-prefix op server secrets (controle in `src/lib/stripe.server.ts`, `payments.functions.ts`, `wp.functions.ts`).

### 6. `README.md`
Korte sectie per onderwerp:
- Stack (TanStack Start + Nitro + Supabase + Stripe + WPGraphQL + Lovable).
- Lokaal draaien: `npm install` → `npm run dev` → `http://localhost:8080`.
- GitHub workflow: Lovable ↔ GitHub two-way sync, push naar `main` triggert Vercel.
- Vercel deploy: Framework = Other, Build = `npm run build`, Install = `npm install`, Output = leeg laten, Node 20.
- Env vars: publiek (`.env.example`) vs server-only (Vercel dashboard).
- WordPress headless via `VITE_WP_GRAPHQL_URL`.
- Troubleshooting: 404, FUNCTION_INVOCATION_FAILED, env-var-issues.

### 7. `.nvmrc`
`20` — Node 20 LTS, zodat lokaal/Vercel/Lovable dezelfde Node-major draaien.

## Bestanden samenvatting

| Bestand | Actie |
|---|---|
| `vite.config.ts` | preset `vercel` toevoegen |
| `vercel.json` | vervangen door minimale config |
| `api/index.ts` | verwijderen |
| `bun.lock` | verwijderen |
| `.env.example` | nieuw |
| `.nvmrc` | nieuw |
| `README.md` | nieuw / vervangen |

Niets onder `src/` wijzigt. Geen route, geen server function, geen component, geen styles.

## Validatie

1. `npm install` lokaal → groen.
2. `npm run build` lokaal → `.vercel/output/` verschijnt, geen errors.
3. Lovable preview opnieuw checken (`/`, `/opdrachten`, `/cms/$slug`, `/admin`, `/dashboard`) — moet identiek werken want alleen build-config wijzigt.
4. Na push naar `main` op Vercel: bevestigen dat home, deep-link refresh, `/api/public/payments/webhook` (POST), Supabase auth-flow en WPGraphQL-fetch allemaal werken.

## Handmatige stappen voor jou

1. **Vercel project** → Settings → Git → koppel aan GitHub repo, branch `main`.
2. **Vercel** → Settings → General → **Framework Preset = Other**, **Node.js Version = 20.x**. Build/Install/Output velden mogen leeg blijven (worden uit `vercel.json` gelezen).
3. **Vercel** → Settings → Environment Variables → toevoegen voor Production én Preview:
   - alle `VITE_*` uit `.env.example`
   - server-secrets: `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, eventuele WP credentials (`WP_APPLICATION_PASSWORD` o.i.d. — bevestig de exacte naam die `wp.functions.ts` leest).
4. **Vercel** → Deployments → Redeploy (eerste keer; daarna gaat elke `main`-push automatisch).
5. **Stripe Dashboard** → Webhook endpoint URL updaten naar `https://<je-vercel-domain>/api/public/payments/webhook`.

## Vraag voordat ik bouw

`src/lib/wp.functions.ts` gebruikt waarschijnlijk een WordPress Application Password als server-secret. Hoe heet die env-var nu in Lovable (zodat ik 'm correct in README/`.env.example`-doc opneem en jij 'm 1-op-1 in Vercel kunt zetten)?
