import { useQuery } from "@tanstack/react-query";
import { useEffect, type ReactNode } from "react";
import { cmsThemeQuery } from "@/services/wpgraphql";
import { themeOverrideQuery } from "./theme-override";
import { applyTheme } from "./apply-theme";

export function ThemeProvider({ children }: { children: ReactNode }) {
  // WP is the baseline; Supabase override (set in /admin/thema) wins when present.
  const { data: wpTheme } = useQuery(cmsThemeQuery());
  const { data: override } = useQuery(themeOverrideQuery());

  useEffect(() => {
    const tokens = override ?? wpTheme;
    if (tokens) applyTheme(tokens);
  }, [wpTheme, override]);

  return <>{children}</>;
}