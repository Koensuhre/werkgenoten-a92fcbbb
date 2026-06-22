## Doel
Jij (koensuhre@gmail.com) kunt inloggen als beheerder en krijgt een basis admin-paneel op `/admin`.

## Stappen

### 1. Auto-promotie tot admin
Migratie met een trigger op `auth.users`: bij signup met e-mail `koensuhre@gmail.com` wordt naast de standaard `client`-rol ook de `admin`-rol toegekend in `public.user_roles`. Bestaat het account al, dan wordt het in dezelfde migratie meteen geüpgraded.

### 2. Hook in de frontend
- `useCurrentUserRoles` bestaat al — daar leunen we op.
- Helper `useIsAdmin()` toevoegen.
- In `SiteHeader` een "Admin"-link tonen wanneer ingelogde gebruiker admin is.

### 3. Admin-route gating
- Nieuwe pathless layout `src/routes/_authenticated/_admin/route.tsx` die client-side checkt of de user admin is via `has_role`; zo niet → redirect naar `/dashboard`.
- Server-side blijft RLS de echte gate (policies gebruiken al `has_role(..., 'admin')`).

### 4. Admin-paneel (basis CRUD)
Onder `/admin`:
- **`/admin`** — overzicht met tellingen (users, opdrachten open/afgerond, categorieën, reviews).
- **`/admin/gebruikers`** — lijst profielen + rollen; rol toekennen/intrekken (admin/professional/client) via insert/delete in `user_roles`.
- **`/admin/opdrachten`** — lijst alle jobs, status wijzigen, verwijderen.
- **`/admin/categorieen`** — CRUD op `categories` (admin write policy bestaat al).
- **`/admin/reviews`** — lijst + verwijderen (modereren).

Alle data via `supabase` client + bestaande RLS (admin-policies). Tabel-UI met bestaande shadcn `Table`-componenten.

### 5. Inlogflow voor jou
Geen wachtwoord vooraf. Stappen voor jou na deploy:
1. Ga naar `/auth` → "Maak een account" → vul `koensuhre@gmail.com` + wachtwoord.
2. Trigger geeft je direct de admin-rol.
3. Header toont "Admin" → klikken → `/admin`.

## Technisch
- Migratie: `CREATE OR REPLACE FUNCTION public.grant_admin_if_owner()` (SECURITY DEFINER) + `AFTER INSERT` trigger op `auth.users`; plus eenmalige `INSERT ... ON CONFLICT DO NOTHING` voor het geval het account al bestaat.
- Geen wijziging aan bestaande `handle_new_user` trigger; we voegen een tweede AFTER INSERT trigger toe.
- Routes onder `_authenticated/_admin/` erven al de auth-gate van `_authenticated`.

## Buiten scope
- E-mailbevestiging uitschakelen (laat staan zoals nu).
- Wachtwoord-reset pagina.
- Audit log van admin-acties.
