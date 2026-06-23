// WPGraphQL client. Reads VITE_WP_GRAPHQL_URL at runtime; falls back to
// the in-repo mock provider when unset so the UI keeps working before
// WordPress is live.

import { GraphQLClient } from "graphql-request";
import type { CmsPage, ThemeTokens, CmsMenu, CmsMenuItem, CmsFooter, Block } from "@/types/cms";
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
        // Standard WPGraphQL `page(id, idType:URI)`. `blocksJson` is a custom
        // field added by the Vakwerk snippet; `seo` requires Yoast/RankMath
        // plus the matching WPGraphQL add-on, so we don't request it here to
        // avoid hard schema errors on minimal installs.
        try {
          const data = await client.request<{
            page: { slug: string; title: string; blocksJson?: string | null } | null;
          }>(
            /* GraphQL */ `query($slug:ID!){ page(id:$slug, idType:URI){ slug title blocksJson } }`,
            { slug },
          );
          if (!data.page) return null;
          let blocks: Block[] = [];
          if (data.page.blocksJson) {
            try { blocks = JSON.parse(data.page.blocksJson); } catch { blocks = []; }
          }
          return { slug: data.page.slug, title: data.page.title, seo: {}, blocks };
        } catch (err) {
          if (import.meta.env.DEV) console.warn("[cms] getPage failed", err);
          return null;
        }
      },
      async getTheme() {
        try {
          const data = await client.request<{ themeSettings: { tokensJson: string } | null }>(
            /* GraphQL */ `query{ themeSettings{ tokensJson } }`,
          );
          const raw = data.themeSettings?.tokensJson;
          if (!raw) return null;
          try { return JSON.parse(raw) as ThemeTokens; } catch { return null; }
        } catch (err) {
          if (import.meta.env.DEV) console.warn("[cms] getTheme failed", err);
          return null;
        }
      },
      async getMenu(location) {
        // Standard WPGraphQL exposes `menus(where:{location:$l})` returning
        // a connection of Menu nodes with a `menuItems` connection.
        try {
          const data = await client.request<{
            menus: {
              nodes: Array<{
                locations: string[] | null;
                menuItems: {
                  nodes: Array<{
                    label: string;
                    uri: string | null;
                    parentId: string | null;
                    id: string;
                    childItems?: { nodes: Array<{ label: string; uri: string | null }> };
                  }>;
                };
              }>;
            };
          }>(
            /* GraphQL */ `query($l:MenuLocationEnum!){
              menus(where:{location:$l}){
                nodes{
                  locations
                  menuItems(where:{parentId:"0"}){
                    nodes{
                      id label uri
                      childItems{ nodes{ label uri } }
                    }
                  }
                }
              }
            }`,
            { l: location.toUpperCase() },
          );
          const node = data.menus?.nodes?.[0];
          if (!node) return null;
          const items: CmsMenuItem[] = node.menuItems.nodes.map((m) => ({
            label: m.label,
            href: m.uri ?? "#",
            children: m.childItems?.nodes.map((c) => ({ label: c.label, href: c.uri ?? "#" })),
          }));
          return { location, items };
        } catch (err) {
          if (import.meta.env.DEV) console.warn("[cms] getMenu failed", err);
          return null;
        }
      },
      async getFooter() {
        try {
          const data = await client.request<{ footer: CmsFooter | null }>(
            /* GraphQL */ `query{ footer{ columns{title links{label href}} copyright } }`,
          );
          return data.footer;
        } catch (err) {
          if (import.meta.env.DEV) console.warn("[cms] getFooter failed", err);
          return null;
        }
      },
    }
  : mockProvider;