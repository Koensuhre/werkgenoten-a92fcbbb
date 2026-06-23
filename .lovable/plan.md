
# Marketplace review-workflow

Doel: opdrachten én professionals worden eerst door een admin gereviewd voordat ze publiek zichtbaar zijn.

## 1. Database wijzigingen (één migratie)

**`jobs` tabel — status uitbreiden**
- `job_status` enum uitbreiden met: `pending_review`, `approved`, `rejected`. (Bestaande `open` blijft = goedgekeurd & live; `approved` wordt nieuwe default → opdracht is live. Voor consistentie kies ik: `pending_review` (nieuw, default) → `open` (goedgekeurd, publiek zichtbaar) → `in_progress` → `completed`/`cancelled`/`rejected`.)
- Default van `status` wijzigen naar `pending_review`.
- Nieuwe kolom `review_notes text` (admin-notitie / weigerreden).
- Nieuwe kolom `reviewed_by uuid` + `reviewed_at timestamptz`.
- RLS policy `jobs public read open` aanpassen → publiek ziet alleen `status = 'open'`; admins zien alles (via `has_role(auth.uid(), 'admin')`); client ziet eigen opdrachten ongeacht status.
- Nieuwe RLS policy: admins mogen elke job updaten.

**`profiles` tabel — review status voor professionals**
- Nieuwe kolom `review_status text` met values `pending_review` | `approved` | `rejected`, default `approved` voor `client`, `pending_review` voor `pro`.
- Nieuwe kolom `review_notes text`, `reviewed_by uuid`, `reviewed_at timestamptz`.
- Trigger op insert: wanneer `primary_type='pro'` → `review_status='pending_review'`; `client` → `approved`.
- Publieke select policy aanpassen: publiek ziet alleen `approved` professionals (of admin, of eigen profiel).

**Quotes**
- RLS aanscherpen: pro mag alleen quote indienen als zijn profiel `review_status='approved'`.

## 2. Backend types & queries
- `src/lib/queries.ts` `useJobs`: filter op `status='open'` (al zo via huidige policy, na update werkt het automatisch).
- Plaats-opdracht formulier (`src/routes/plaats-opdracht.tsx`) functioneel maken: insert in `jobs` (was mock). Status default `pending_review`. Toon bevestiging "Je opdracht wordt gereviewd door een admin".
- Word-professional flow controleren (`src/routes/word-professional.tsx`) — bij profielaanmaak `primary_type='pro'` → trigger zet `review_status='pending_review'`.

## 3. Admin dashboard

Nieuwe pagina's onder `_authenticated/_admin/`:
- `admin.review-opdrachten.tsx` — lijst van jobs met status `pending_review`. Per rij: bekijk detail, **Goedkeuren** (→ `open`), **Afwijzen** (modal met reden → `rejected`), **Contact** (toont email/telefoon van client uit `auth.users` via server-fn; mailto-link).
- `admin.review-professionals.tsx` — lijst van profielen met `review_status='pending_review'`. Acties: Goedkeuren, Afwijzen (met reden), Contact (mailto).
- Sidebar (`_admin/route.tsx`): twee nieuwe nav-items met badge (count pending).
- Admin overzicht (`admin.index.tsx`): widgets "X opdrachten te reviewen", "Y professionals te reviewen".

Contactgegevens ophalen vereist `auth.users.email` → server-fn met `requireSupabaseAuth` + admin check + `supabaseAdmin` om email op te halen.

## 4. Klant-zicht
- Dashboard opdrachten: opdrachtgever ziet eigen opdrachten met status-badge (In review / Goedgekeurd / Afgewezen + reden).

## 5. Bestaande publieke opdrachten
- Bestaande opdrachten met `status='open'` blijven `open` (publiek). Migratie raakt alleen default + nieuwe rows.

## Technische details

**Files te wijzigen/maken:**
- migratie: jobs + profiles status, RLS, triggers, admin server-fns
- `src/lib/admin-review.functions.ts` (nieuw): listPendingJobs, approveJob, rejectJob, getClientContact, listPendingPros, approvePro, rejectPro
- `src/routes/_authenticated/_admin/route.tsx`: nav uitbreiden
- `src/routes/_authenticated/_admin/admin.review-opdrachten.tsx` (nieuw)
- `src/routes/_authenticated/_admin/admin.review-professionals.tsx` (nieuw)
- `src/routes/_authenticated/_admin/admin.index.tsx`: pending-counts widgets
- `src/routes/_authenticated/_admin/admin.opdrachten.tsx`: status-dropdown uitbreiden
- `src/routes/plaats-opdracht.tsx`: functioneel insert + bevestiging
- `src/routes/_authenticated/dashboard.projecten.tsx`: status-badges + weigerreden tonen
- `src/lib/queries.ts`: kleine aanpassingen indien nodig

**Status-mapping besluit:** `open` = goedgekeurd & publiek (behoud betekenis); nieuwe enum waarden `pending_review` en `rejected`. Approve-actie zet `pending_review → open`.

## Test-flow na implementatie
1. Opdrachtgever plaatst opdracht → komt in admin review.
2. Admin keurt goed → verschijnt op `/opdrachten`.
3. Nieuwe pro registreert → komt in admin review professionals.
4. Admin keurt goed → pro kan offertes uitbrengen.
5. Geweigerde items niet publiek zichtbaar; aanvrager ziet status + reden.
