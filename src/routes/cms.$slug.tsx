import { createFileRoute, notFound } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { cmsPageQuery } from "@/services/wpgraphql";
import { BlockRenderer } from "@/components/blocks/BlockRenderer";

export const Route = createFileRoute("/cms/$slug")({
  loader: async ({ context, params }) => {
    const page = await context.queryClient.ensureQueryData(cmsPageQuery(params.slug));
    if (!page) throw notFound();
  },
  head: ({ loaderData: _loaderData, params }) => ({
    meta: [
      { title: `${params.slug} — Vakwerk` },
    ],
  }),
  component: CmsPage,
  errorComponent: ({ error }) => (
    <div className="mx-auto max-w-2xl px-4 py-24 text-center">
      <h1 className="text-2xl font-semibold">Pagina kon niet laden</h1>
      <p className="mt-2 text-muted-foreground">{error.message}</p>
    </div>
  ),
  notFoundComponent: () => (
    <div className="mx-auto max-w-2xl px-4 py-24 text-center">
      <h1 className="text-2xl font-semibold">Pagina niet gevonden</h1>
    </div>
  ),
});

function CmsPage() {
  const { slug } = Route.useParams();
  const { data } = useSuspenseQuery(cmsPageQuery(slug));
  if (!data) return null;
  return <BlockRenderer blocks={data.blocks} />;
}