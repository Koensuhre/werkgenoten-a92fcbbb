# WPGraphQL service

Frontend interface to a Headless WordPress backend.

## Switching to a real endpoint

1. Install WordPress + WPGraphQL (+ WPGraphQL for ACF / Gutenberg if you use ACF blocks).
2. Expose:
   - `page(slug: String!)` returning `slug`, `title`, `seo`, `blocksJson` (stringified `Block[]`)
   - `themeSettings { tokensJson }` (stringified `ThemeTokens`)
   - `menu(location: String!)`
   - `footer`
3. Add to `.env`:
   ```
   VITE_WP_GRAPHQL_URL=https://cms.example.com/graphql
   # optional JWT for previews
   VITE_WP_GRAPHQL_TOKEN=...
   ```
4. Restart dev server. The mock provider is bypassed automatically.

## Contract

- `Block` discriminants live in `src/types/cms.ts`. Adding a new block: extend
  the union, add a renderer in `src/components/blocks/`, register it in
  `BlockRenderer`.
- Theme tokens are applied at runtime by `ThemeProvider` (see
  `src/services/theme`). No CSS rebuild needed.