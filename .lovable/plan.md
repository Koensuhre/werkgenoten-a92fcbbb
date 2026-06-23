## Doel
Nu de PHP-snippet en de 3 secrets (`WP_BASE_URL`, `WP_APP_USER`, `WP_APP_PASSWORD`) actief zijn, controleren of zowel **lezen** als **schrijven** richting WordPress werkt en de block-editor end-to-end functioneert.

## Stappen

1. **Smoke-test lezen (GraphQL)**
   - Open `/admin/paginas`. Verwacht: lijst met WP-pagina's (titel, slug, laatst gewijzigd).
   - Als leeg of error: controleer `VITE_WP_GRAPHQL_URL` in `.env` en of WPGraphQL plugin actief is op WP.

2. **Smoke-test schrijven (REST + Application Password)**
   - Klik in `/admin/paginas` op **"Nieuwe pagina"**, vul bv. titel `Test sync` + slug `test-sync` in → Aanmaken.
   - Verwacht: redirect naar `/admin/paginas/test-sync` (de block-editor).
   - Als foutmelding "WP afwijzing (401/403)": Application Password of username klopt niet.
   - Als "WordPress is nog niet verbonden": secrets zijn nog niet beschikbaar in de runtime → opnieuw deployen of secret-naam check.

3. **Block-editor test**
   - Voeg een **Hero**-blok toe, vul titel/subtitel, klik **Opslaan**.
   - Open in een nieuw tabblad `/cms/test-sync` → verwacht dat de Hero rendert.
   - Als de pagina leeg blijft: de `blocks_json` meta is niet via REST geschreven → snippet niet (juist) geladen of `register_post_meta` mist `auth_callback` die `true` returnt voor admins.

4. **Bestaande pagina koppelen aan editor**
   - Vanuit `/admin/paginas` op een bestaande WP-pagina **Bewerken** klikken.
   - Bevestigen dat de huidige `blocksJson` geladen wordt (of leeg start als die meta nog niet bestaat).

5. **Menu sync verifiëren**
   - Hard refresh op `/`. De site-header haalt het `PRIMARY` menu uit WP (anders fallback). Controleer of de items uit het WP-menu verschijnen.

## Wat ik nodig heb van jou

Voer stap 1 en 2 uit en laat me weten wat je ziet:
- Verschijnt de paginalijst op `/admin/paginas`?
- Lukt het aanmaken van `test-sync` zonder foutmelding?
- Als er een foutmelding komt: plak de exacte tekst (incl. status zoals 401/403/500).

Op basis daarvan fix ik gerichte problemen (CORS, auth, meta-registratie) in de volgende ronde.
