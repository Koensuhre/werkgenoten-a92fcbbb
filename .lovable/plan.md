
# Headless CMS + Application refactor

Splits the project into two clearly separated layers without breaking the current UI. WP isn't live yet, so the WordPress side is implemented as a typed, swappable mock that mirrors the WPGraphQL contract.

## 1. Folder structure (new)

```text
src/
  services/
    wpgraphql/
      client.ts            # fetcher: env-driven endpoint, ISR-style cache
      queries.ts           # GET_THEME, GET_PAGE_BY_SLUG, GET_MENU, GET_FOOTER
      mock.ts              # MockProvider used when VITE_WP_GRAPHQL_URL is empty
      index.ts             # getPage(slug), getTheme(), getMenu(loc)
    supabase/
      (re-exports of @/integrations/supabase/* after Cloud enable)
    theme/
      apply-theme.ts       # tokens -> CSS variables on :root
      use-theme.ts         # TanStack Query hook
      ThemeProvider.tsx    # mounts at root, injects vars, handles light/dark
  components/
    blocks/
      BlockRenderer.tsx    # switch on __typename
      HeroBlock.tsx
      RichTextBlock.tsx
      FeaturesBlock.tsx
      CtaBlock.tsx
      TestimonialsBlock.tsx
      FaqBlock.tsx
      StatsBlock.tsx
      PricingBlock.tsx
      LogosBlock.tsx
      GalleryBlock.tsx
      VideoBlock.tsx
      FormBlock.tsx
      CustomHtmlBlock.tsx
  types/
    cms.ts                 # Block union, Page, ThemeTokens, Menu types
  routes/
    cms.$slug.tsx          # generic CMS page renderer (fallback 404 -> hardcoded)
```

Existing marketing routes (`index`, `hoe-werkt-het`, `prijzen`, `plaats-opdracht`, `word-professional`, legal/FAQ if added) become **fallback shells**: each route tries `getPage(slug)` first and renders blocks when WP returns content; otherwise renders the current hardcoded JSX. No visual change today, full CMS control the moment WP goes live.

## 2. WPGraphQL service

- `client.ts` reads `import.meta.env.VITE_WP_GRAPHQL_URL`. Empty → mock provider. Set → real `graphql-request` fetcher with TanStack Query caching (`staleTime: 60s`, `gcTime: 30m`).
- All queries strongly typed against `src/types/cms.ts`.
- `mock.ts` ships realistic theme tokens + one page per existing route, so the block renderer can be visually QA'd today.
- A single `useCmsPage(slug)` and `useCmsTheme()` hook power the whole app — easy to swap to real endpoint later by setting one env var, zero code change.

## 3. Theme engine

- `ThemeTokens` type covers colors, typography, radius, spacing, shadows, button/card variants.
- `applyTheme(tokens)` writes them as CSS custom properties on `:root` (and a `.dark` variant), reusing the existing token names in `src/styles.css` so all current components instantly re-style.
- `ThemeProvider` mounts in `__root.tsx`, fetches via TanStack Query, applies on success. Until data arrives, the build-time defaults in `styles.css` are used → no FOUC.

## 4. Block renderer

- `BlockRenderer` takes `blocks: Block[]` and dispatches by `__typename` to the matching component. Unknown blocks render nothing in prod, a dev warning in dev.
- Each block component is presentational, uses existing shadcn primitives + tokens — no new design language.
- `CustomHtmlBlock` sanitizes via `DOMPurify` before injecting.

## 5. Supabase / Lovable Cloud (app layer)

Enable Lovable Cloud, then provision:

- `profiles` (1-1 with `auth.users`, type: `client | professional`)
- `app_role` enum + `user_roles` table + `has_role()` security-definer fn
- `jobs`, `quotes`, `messages`, `reviews`, `favorites`, `saved_searches`, `notifications`
- RLS on every table; public can browse open `jobs`; only owner can mutate; pros can submit `quotes`; participants only on `messages`
- GRANTs for `authenticated` + `service_role`, plus narrow `SELECT TO anon` on the public job listing fields only
- Auth: email/password + Google (via `lovable.auth.signInWithOAuth`, paired with `supabase--configure_social_auth`)
- Move `src/lib/mock-data.ts` callers behind `services/supabase/jobs.ts` etc., but keep mock fallback so marketplace pages keep working before real data is seeded

## 6. Separation of concerns (enforced)

- `services/wpgraphql/*` may NOT import `@/integrations/supabase/*`
- `services/supabase/*` may NOT import `services/wpgraphql/*`
- ESLint rule (`no-restricted-imports`) added to enforce.

## 7. Out of scope this round

- Actual WordPress site / WPGraphQL plugins / ACF setup (you'll wire the endpoint later).
- Stripe / memberships (separate follow-up).
- Real-time messaging (UI exists; can connect after Cloud is on).

## 8. Deliverables this round

1. WPGraphQL service + mock + types + hooks.
2. Theme engine wired into `__root.tsx`, tokens flow into existing CSS vars.
3. Block renderer + 14 block components, all token-driven.
4. `routes/cms.$slug.tsx` + fallback wrappers on existing marketing routes.
5. Lovable Cloud enabled; schema migration (profiles, roles, jobs, quotes, messages, reviews, favorites, notifications) with full RLS + GRANTs.
6. Auth route (`/auth`) with email/password + Google, `_authenticated/` layout via the managed integration.
7. README section in `src/services/wpgraphql/README.md` documenting how to point at a real WP endpoint.

After approval I'll execute in this order: types → WPGraphQL mock + hooks → theme engine → block components → CMS route + fallbacks → enable Cloud → schema/RLS → auth wiring → swap marketplace reads to Supabase with mock fallback.
