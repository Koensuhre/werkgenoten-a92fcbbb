// GraphQL query documents. Mirror these in WordPress via WPGraphQL +
// custom ACF/Gutenberg block resolvers. The fragment names map 1:1 to
// the `__typename` discriminants in src/types/cms.ts.

export const PAGE_FIELDS = /* GraphQL */ `
  fragment PageFields on Page {
    slug
    title
    seo { title description ogImage }
    blocksJson
  }
`;

export const GET_PAGE_BY_SLUG = /* GraphQL */ `
  query GetPageBySlug($slug: String!) {
    page(slug: $slug) { ...PageFields }
  }
  ${PAGE_FIELDS}
`;

export const GET_THEME = /* GraphQL */ `
  query GetTheme { themeSettings { tokensJson } }
`;

export const GET_MENU = /* GraphQL */ `
  query GetMenu($location: String!) {
    menu(location: $location) {
      location
      items { label href children { label href } }
    }
  }
`;

export const GET_FOOTER = /* GraphQL */ `
  query GetFooter {
    footer {
      columns { title links { label href } }
      copyright
    }
  }
`;