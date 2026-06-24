import { createFileRoute, notFound } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { cmsPageQuery } from "@/services/wpgraphql";
import { BlockRenderer } from "@/components/blocks/BlockRenderer";

// Catch-all WordPress page route. Any URL not matched by a more specific
// route falls through to here, and the splat is used as the WP page slug
// (or URI for nested pages). New pages published in WordPress are
// instantly reachable without any code changes.
export const Route = createFileRoute("/$")({
  loader: async ({ context, params }) => {
    const slug = (params._splat ?? "").replace(/^\/+|\/+$/g, "");
    if (!slug) throw notFound();
    const page = await context.queryClient.ensureQueryData(cmsPageQuery(slug));
    if (!page) throw notFound();
    return { page };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.page?.title ?? "Pagina"} — Werkgenoten` },
      ...(loaderData?.page?.seo?.description
        ? [{ name: "description", content: loaderData.page.seo.description }]
        : []),
    ],
  }),
  component: WpCatchAllPage,
  errorComponent: ({ error }) => (
    <div className="mx-auto max-w-2xl px-4 py-24 text-center">
      <h1 className="text-2xl font-semibold">Pagina kon niet laden</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        De WordPress-backend is op dit moment onbereikbaar.
      </p>
      <p className="mt-1 text-xs text-muted-foreground">{error.message}</p>
    </div>
  ),
  notFoundComponent: () => (
    <div className="mx-auto max-w-2xl px-4 py-24 text-center">
      <h1 className="text-2xl font-semibold">Pagina niet gevonden</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Deze pagina bestaat (nog) niet in WordPress.
      </p>
    </div>
  ),
});

function WpCatchAllPage() {
  const { page } = Route.useLoaderData();
  const { data } = useSuspenseQuery(cmsPageQuery(page.slug));
  const current = data ?? page;
  if (!current.blocks?.length) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center">
        <h1 className="text-2xl font-semibold">{current.title}</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Deze pagina heeft nog geen content.
        </p>
      </div>
    );
  }
  return <BlockRenderer blocks={current.blocks} />;
}