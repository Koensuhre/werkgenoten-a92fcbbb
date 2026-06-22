// CMS contract — mirrors WPGraphQL response shape so the frontend stays
// identical when we swap the mock provider for the real endpoint.

export type ThemeTokens = {
  colors: {
    background: string;
    foreground: string;
    primary: string;
    primaryForeground: string;
    secondary: string;
    secondaryForeground: string;
    accent: string;
    accentForeground: string;
    muted: string;
    mutedForeground: string;
    border: string;
    card: string;
    cardForeground: string;
    brand: string;
    brandForeground: string;
    success: string;
    warning: string;
    destructive: string;
  };
  typography: {
    fontSans: string;
    fontDisplay: string;
    fontMono: string;
    headingWeight: string;
    bodyWeight: string;
    baseSize: string;
    lineHeight: string;
    letterSpacing: string;
  };
  layout: {
    containerMax: string;
    sectionSpacing: string;
    radius: string;
    shadowGlow: string;
    shadowElegant: string;
    shadowCard: string;
  };
  buttons: {
    radius: string;
    paddingX: string;
    paddingY: string;
  };
  cards: {
    radius: string;
    background: string;
    shadow: string;
  };
};

export type CtaLink = { label: string; href: string; variant?: "primary" | "secondary" | "ghost" };

export type Block =
  | { __typename: "HeroBlock"; id: string; eyebrow?: string; title: string; subtitle?: string; image?: string; ctas?: CtaLink[]; align?: "left" | "center" }
  | { __typename: "RichTextBlock"; id: string; html: string }
  | { __typename: "FeaturesBlock"; id: string; title?: string; subtitle?: string; columns: 2 | 3 | 4; items: { icon?: string; title: string; description: string }[] }
  | { __typename: "CtaBlock"; id: string; title: string; subtitle?: string; ctas: CtaLink[] }
  | { __typename: "TestimonialsBlock"; id: string; title?: string; items: { quote: string; name: string; role?: string; avatar?: string; rating?: number }[] }
  | { __typename: "FaqBlock"; id: string; title?: string; items: { question: string; answer: string }[] }
  | { __typename: "StatsBlock"; id: string; items: { value: string; label: string }[] }
  | { __typename: "PricingBlock"; id: string; title?: string; subtitle?: string; plans: { name: string; price: string; tagline?: string; features: string[]; cta: CtaLink; highlight?: boolean }[] }
  | { __typename: "LogosBlock"; id: string; title?: string; logos: { name: string; src?: string }[] }
  | { __typename: "GalleryBlock"; id: string; images: { src: string; alt?: string }[] }
  | { __typename: "ImageBlock"; id: string; src: string; alt?: string; caption?: string }
  | { __typename: "VideoBlock"; id: string; src: string; poster?: string; title?: string }
  | { __typename: "FormBlock"; id: string; title?: string; endpoint?: string; fields: { name: string; label: string; type: "text" | "email" | "textarea" | "tel"; required?: boolean }[]; submitLabel?: string }
  | { __typename: "CustomHtmlBlock"; id: string; html: string }
  | { __typename: "TeamBlock"; id: string; title?: string; members: { name: string; role: string; avatar?: string; bio?: string }[] };

export type CmsPage = {
  slug: string;
  title: string;
  seo: {
    title?: string;
    description?: string;
    ogImage?: string;
  };
  blocks: Block[];
};

export type CmsMenuItem = { label: string; href: string; children?: CmsMenuItem[] };
export type CmsMenu = { location: string; items: CmsMenuItem[] };
export type CmsFooter = { columns: { title: string; links: { label: string; href: string }[] }[]; copyright: string };