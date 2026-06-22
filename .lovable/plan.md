## Doel
De Vakwerk-frontend laten lezen uit jouw tijdelijke WordPress op `https://xenodochial-mclean.45-82-188-50.plesk.page` via WPGraphQL, zodat pagina's, menu's, theme-tokens en footer vanuit WordPress komen in plaats van de mock-data.

## Vereiste actie aan jouw kant (WordPress)
De site heeft nu géén actieve GraphQL-/REST-laag. Voordat de koppeling werkt moet je in WP-admin het volgende doen:

1. **Plugin installeren & activeren**: `WPGraphQL` (gratis, via Plugins → Nieuwe toevoegen).
2. Aanbevolen extra plugins (alleen nodig als je ACF/Gutenberg-blokken via GraphQL wilt blootleggen):
   - `WPGraphQL for ACF` (alleen als je ACF gebruikt)
   - `WPGraphQL Smart Cache` (optioneel, voor performance)
3. **Permalinks** op iets anders dan "Plain" zetten (Instellingen → Permalinks → bv. "Berichtnaam" → Opslaan). Anders blijft `/graphql` 404 geven.
4. Controleer daarna in je browser:
   `https://xenodochial-mclean.45-82-188-50.plesk.page/graphql?query={__typename}` → moet JSON teruggeven, geen HTML/404.

Laat me weten wanneer dit klaar is — dan kan ik de koppeling daadwerkelijk activeren.

## Wat ik daarna doe in de code

1. **Endpoint configureren** in `.env`:
   ```
   VITE_WP_GRAPHQL_URL=https://xenodochial-mclean.45-82-188-50.plesk.page/graphql
   ```
   De bestaande client in `src/services/wpgraphql/client.ts` schakelt automatisch over van mock naar de echte WordPress zodra deze variabele gezet is — geen verdere codewijziging nodig.

2. **Verbinding testen** vanaf de server: een korte GraphQL-call (`{__schema{queryType{name}}}`) om te bevestigen dat WPGraphQL antwoordt en CORS goed staat.

3. **Schema-afstemming controleren**. De frontend verwacht een schema met o.a.:
   - `page(slug: String!) { slug title seo{...} blocksJson }`
   - `themeSettings { tokensJson }`
   - `menu(location: String!) { ... }`
   - `footer { ... }`
   
   Vanilla WPGraphQL levert dit **niet** standaard — `blocksJson`, `themeSettings` en `footer` zijn custom velden die op WP-zijde toegevoegd moeten worden (via een klein plugin-bestand of een snippet in `functions.php`). Als die er nog niet zijn, val ik per query terug op een veilige `null` zodat de site niet breekt, en lever ik je de PHP-snippet aan die je in WordPress moet plaatsen.

4. **CORS**: indien de browser blokkeert op CORS, voeg ik de instructie toe om in WordPress (via plugin of `.htaccess`) `Access-Control-Allow-Origin` toe te staan voor je Lovable preview/published URL.

## Buiten scope (nu nog niet)
- Authenticated previews / JWT-token (`VITE_WP_GRAPHQL_TOKEN`) — alleen nodig als je niet-gepubliceerde concepten wil zien.
- Migratie van bestaande hardcoded routes (`/`, `/prijzen`, etc.) naar volledig CMS-gestuurd. Eerst koppelen, daarna kunnen we per pagina beslissen of WP de bron wordt.

## Vraag
Wil je dat ik nu alvast stap 1 (endpoint in `.env`) doe zodat de schakelaar omgaat zodra jij WPGraphQL hebt geïnstalleerd? Of wachten we tot WordPress klaar is en doen we het in één keer met test erbij?
