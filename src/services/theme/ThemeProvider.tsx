import { useQuery } from "@tanstack/react-query";
import { useEffect, type ReactNode } from "react";
import { cmsThemeQuery } from "@/services/wpgraphql";
import { applyTheme } from "./apply-theme";

export function ThemeProvider({ children }: { children: ReactNode }) {
  const { data } = useQuery(cmsThemeQuery());

  useEffect(() => {
    if (data) applyTheme(data);
  }, [data]);

  return <>{children}</>;
}