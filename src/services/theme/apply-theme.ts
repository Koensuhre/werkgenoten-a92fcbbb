import type { ThemeTokens } from "@/types/cms";

// Map CMS theme tokens onto the CSS custom properties already used by
// the design system. Any token left out keeps its build-time default
// from src/styles.css.
export function applyTheme(tokens: ThemeTokens, target: HTMLElement = document.documentElement) {
  const set = (key: string, value: string | undefined) => {
    if (!value) return;
    target.style.setProperty(key, value);
  };

  const c = tokens.colors;
  set("--background", c.background);
  set("--foreground", c.foreground);
  set("--primary", c.primary);
  set("--primary-foreground", c.primaryForeground);
  set("--secondary", c.secondary);
  set("--secondary-foreground", c.secondaryForeground);
  set("--accent", c.accent);
  set("--accent-foreground", c.accentForeground);
  set("--muted", c.muted);
  set("--muted-foreground", c.mutedForeground);
  set("--border", c.border);
  set("--card", c.card);
  set("--card-foreground", c.cardForeground);
  set("--brand", c.brand);
  set("--brand-foreground", c.brandForeground);
  set("--destructive", c.destructive);

  set("--font-sans", tokens.typography.fontSans);
  set("--font-display", tokens.typography.fontDisplay);

  set("--radius", tokens.layout.radius);
  set("--shadow-glow", tokens.layout.shadowGlow);
  set("--shadow-elegant", tokens.layout.shadowElegant);
  set("--shadow-card", tokens.layout.shadowCard);
}