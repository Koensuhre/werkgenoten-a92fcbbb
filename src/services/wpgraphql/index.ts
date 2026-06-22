export { cmsClient, cmsUsesMock } from "./client";
export type { CmsClient } from "./client";

import { queryOptions } from "@tanstack/react-query";
import { cmsClient } from "./client";

export const cmsPageQuery = (slug: string) =>
  queryOptions({
    queryKey: ["cms", "page", slug],
    queryFn: () => cmsClient.getPage(slug),
    staleTime: 60_000,
  });

export const cmsThemeQuery = () =>
  queryOptions({
    queryKey: ["cms", "theme"],
    queryFn: () => cmsClient.getTheme(),
    staleTime: 5 * 60_000,
  });

export const cmsMenuQuery = (location: string) =>
  queryOptions({
    queryKey: ["cms", "menu", location],
    queryFn: () => cmsClient.getMenu(location),
    staleTime: 5 * 60_000,
  });

export const cmsFooterQuery = () =>
  queryOptions({
    queryKey: ["cms", "footer"],
    queryFn: () => cmsClient.getFooter(),
    staleTime: 5 * 60_000,
  });