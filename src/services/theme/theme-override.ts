import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { ThemeTokens } from "@/types/cms";

export const THEME_OVERRIDE_KEY = ["theme-override"] as const;

export const themeOverrideQuery = () =>
  queryOptions({
    queryKey: THEME_OVERRIDE_KEY,
    queryFn: async (): Promise<ThemeTokens | null> => {
      const { data, error } = await supabase
        .from("theme_settings")
        .select("tokens")
        .eq("id", "global")
        .maybeSingle();
      if (error) throw error;
      return (data?.tokens as ThemeTokens | undefined) ?? null;
    },
    staleTime: 60_000,
  });

export async function saveThemeOverride(tokens: ThemeTokens) {
  const { error } = await supabase
    .from("theme_settings")
    // ThemeTokens is a structured object stored as jsonb — cast to satisfy generated Json type.
    .upsert({ id: "global", tokens: tokens as unknown as never });
  if (error) throw error;
}

export async function clearThemeOverride() {
  const { error } = await supabase.from("theme_settings").delete().eq("id", "global");
  if (error) throw error;
}