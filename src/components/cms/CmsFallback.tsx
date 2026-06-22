import { useQuery } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { cmsPageQuery } from "@/services/wpgraphql";
import { BlockRenderer } from "@/components/blocks/BlockRenderer";

// Renders CMS blocks for `slug` when present; otherwise renders the
// hardcoded fallback. Keeps marketing pages working before WP is wired
// up while letting WP take over the moment a page is published.
export function CmsFallback({ slug, fallback }: { slug: string; fallback: ReactNode }) {
  const { data, isLoading } = useQuery(cmsPageQuery(slug));
  if (isLoading) return <>{fallback}</>;
  if (data?.blocks?.length) return <BlockRenderer blocks={data.blocks} />;
  return <>{fallback}</>;
}