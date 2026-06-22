// WPGraphQL client. Reads VITE_WP_GRAPHQL_URL at runtime; falls back to
// the in-repo mock provider when unset so the UI keeps working before
// WordPress is live.

import { GraphQLClient } from "graphql-request";
import type { CmsPage, ThemeTokens, CmsMenu, CmsFooter } from "@/types/cms";
import { mockProvider } from "./mock";

const endpoint = import.meta.env.VITE_WP_GRAPHQL_URL as string | undefined;
const client = endpoint
  ? new GraphQLClient(endpoint, {
      headers: import.meta.env.VITE_WP_GRAPHQL_TOKEN
        ? { Authorization: `Bearer ${import.meta.env.VITE_WP_GRAPHQL_TOKEN}` }
        : undefined,
    })
  : null;

export const cmsUsesMock = !client;

export type CmsClient = {
  getPage: (slug: string) => Promise<CmsPage | null>;
  getTheme: () => Promise<ThemeTokens | null>;
  getMenu: (location: string) => Promise<CmsMenu | null>;
  getFooter: () => Promise<CmsFooter | null>;
};

export const cmsClient: CmsClient = client
  ? {
      async getPage(slug) {
        // Real WP path. The expected query returns blocksJson; parse here.
        const data = await client.request<{ page: (CmsPage & { blocksJson: string }) | null }>(
          /* GraphQL */ `query($slug:String!){ page(slug:$slug){ slug title seo{title description ogImage} blocksJson } }`,
          { slug },
        );
        if (!data.page) return null;
        return { ...data.page, blocks: JSON.parse(data.page.blocksJson) };
      },
      async getTheme() {
        const data = await client.request<{ themeSettings: { tokensJson: string } | null }>(
          /* GraphQL */ `query{ themeSettings{ tokensJson } }`,
        );
        return data.themeSettings ? JSON.parse(data.themeSettings.tokensJson) : null;
      },
      async getMenu(location) {
        const data = await client.request<{ menu: CmsMenu | null }>(
          /* GraphQL */ `query($l:String!){ menu(location:$l){ location items{label href children{label href}} } }`,
          { l: location },
        );
        return data.menu;
      },
      async getFooter() {
        const data = await client.request<{ footer: CmsFooter | null }>(
          /* GraphQL */ `query{ footer{ columns{title links{label href}} copyright } }`,
        );
        return data.footer;
      },
    }
  : mockProvider;