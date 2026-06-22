// Mock WPGraphQL provider. Used when VITE_WP_GRAPHQL_URL is not set so
// the frontend can run the full headless contract before WordPress is
// wired up. Content here is a stand-in; WP becomes authoritative the
// moment the env var points at a real endpoint.

import type { Block, CmsFooter, CmsMenu, CmsPage, ThemeTokens } from "@/types/cms";
import type { CmsClient } from "./client";

const theme: ThemeTokens = {
  colors: {
    background: "oklch(0.16 0.012 270)",
    foreground: "oklch(0.98 0.005 270)",
    primary: "oklch(0.98 0.005 270)",
    primaryForeground: "oklch(0.16 0.012 270)",
    secondary: "oklch(0.26 0.016 270)",
    secondaryForeground: "oklch(0.98 0.005 270)",
    accent: "oklch(0.30 0.02 270)",
    accentForeground: "oklch(0.98 0.005 270)",
    muted: "oklch(0.24 0.014 270)",
    mutedForeground: "oklch(0.68 0.02 270)",
    border: "oklch(0.30 0.014 270 / 60%)",
    card: "oklch(0.20 0.014 270)",
    cardForeground: "oklch(0.98 0.005 270)",
    brand: "oklch(0.72 0.18 155)",
    brandForeground: "oklch(0.16 0.04 160)",
    success: "oklch(0.72 0.18 155)",
    warning: "oklch(0.78 0.15 80)",
    destructive: "oklch(0.62 0.22 27)",
  },
  typography: {
    fontSans: '"Inter", ui-sans-serif, system-ui, sans-serif',
    fontDisplay: '"Inter", ui-sans-serif, system-ui, sans-serif',
    fontMono: 'ui-monospace, SFMono-Regular, Menlo, monospace',
    headingWeight: "600",
    bodyWeight: "400",
    baseSize: "16px",
    lineHeight: "1.6",
    letterSpacing: "-0.01em",
  },
  layout: {
    containerMax: "80rem",
    sectionSpacing: "6rem",
    radius: "0.75rem",
    shadowGlow: "0 0 60px -10px oklch(0.72 0.18 155 / 0.35)",
    shadowElegant: "0 20px 60px -20px oklch(0 0 0 / 0.5)",
    shadowCard: "0 1px 0 0 oklch(1 0 0 / 0.04) inset, 0 0 0 1px oklch(1 0 0 / 0.04)",
  },
  buttons: { radius: "0.5rem", paddingX: "1rem", paddingY: "0.5rem" },
  cards: { radius: "0.75rem", background: "oklch(0.20 0.014 270)", shadow: "0 1px 0 0 oklch(1 0 0 / 0.04) inset" },
};

const homeBlocks: Block[] = [
  {
    __typename: "HeroBlock",
    id: "home-hero",
    eyebrow: "Headless CMS demo",
    title: "Beheer je content vanuit WordPress",
    subtitle: "Deze pagina is een live demo van het CMS-blockrenderer. Wijzig blocks in WordPress, de frontend volgt zonder deploy.",
    align: "center",
    ctas: [
      { label: "Plaats opdracht", href: "/plaats-opdracht", variant: "primary" },
      { label: "Bekijk vakmensen", href: "/vakmensen", variant: "secondary" },
    ],
  },
  {
    __typename: "StatsBlock",
    id: "home-stats",
    items: [
      { value: "184k+", label: "Opdrachten" },
      { value: "12k+", label: "Vakmensen" },
      { value: "96k+", label: "Reviews" },
      { value: "4.8/5", label: "Score" },
    ],
  },
];

const pages: Record<string, CmsPage> = {
  home: {
    slug: "home",
    title: "Vakwerk",
    seo: { title: "Vakwerk — CMS demo", description: "Headless WordPress + Supabase marketplace." },
    blocks: homeBlocks,
  },
  faq: {
    slug: "faq",
    title: "Veelgestelde vragen",
    seo: { title: "FAQ — Vakwerk", description: "Antwoorden op veelgestelde vragen." },
    blocks: [
      {
        __typename: "FaqBlock",
        id: "faq-main",
        title: "Veelgestelde vragen",
        items: [
          { question: "Hoe werkt Vakwerk?", answer: "Plaats een opdracht, ontvang offertes van geverifieerde vakmensen en kies de beste." },
          { question: "Wat kost het?", answer: "Een opdracht plaatsen is gratis. Vakmensen betalen een abonnement." },
          { question: "Hoe controleren jullie vakmensen?", answer: "Wij verifiëren KvK, verzekering en reviews." },
        ],
      },
    ],
  },
  voorwaarden: {
    slug: "voorwaarden",
    title: "Algemene voorwaarden",
    seo: { title: "Voorwaarden — Vakwerk" },
    blocks: [
      { __typename: "RichTextBlock", id: "tos", html: "<h1>Algemene voorwaarden</h1><p>Beheer de inhoud van deze pagina vanuit WordPress.</p>" },
    ],
  },
};

const menu: CmsMenu = {
  location: "primary",
  items: [
    { label: "Opdrachten", href: "/opdrachten" },
    { label: "Vakmensen", href: "/vakmensen" },
    { label: "Hoe het werkt", href: "/hoe-werkt-het" },
    { label: "Prijzen", href: "/prijzen" },
  ],
};

const footer: CmsFooter = {
  columns: [
    { title: "Platform", links: [{ label: "Opdrachten", href: "/opdrachten" }, { label: "Vakmensen", href: "/vakmensen" }] },
    { title: "Bedrijf", links: [{ label: "Over ons", href: "/over-ons" }, { label: "Blog", href: "/blog" }] },
    { title: "Juridisch", links: [{ label: "Voorwaarden", href: "/cms/voorwaarden" }, { label: "Privacy", href: "/cms/privacy" }] },
  ],
  copyright: `© ${new Date().getFullYear()} Vakwerk`,
};

export const mockProvider: CmsClient = {
  async getPage(slug) {
    return pages[slug] ?? null;
  },
  async getTheme() {
    return theme;
  },
  async getMenu() {
    return menu;
  },
  async getFooter() {
    return footer;
  },
};