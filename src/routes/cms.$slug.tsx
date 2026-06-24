import { createFileRoute, notFound } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { cmsPageQuery } from "@/services/wpgraphql";
import { BlockRenderer } from "@/components/blocks/BlockRenderer";

export const Route = createFileRoute("/cms/$slug")({
  loader: async ({ context, params }) => {
    const page = await context.queryClient.ensureQueryData(cmsPageQuery(params.slug));
    if (!page) throw notFound();
    return { page };
  },
  head: ({ loaderData: _loaderData, params }) => ({
    meta: [
      { title: `${params.slug} — Werkgenoten` },
    ],
  }),
  component: CmsPage,
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
    </div>
  ),
});

function CmsPage() {
  const { page } = Route.useLoaderData();
  const { slug } = Route.useParams();
  // Reuse loader's exact query key + initialData so background refetches
  // upgrade the UI without ever blanking it, and a transient WP failure
  // doesn't throw past the boundary.
  const { data } = useQuery({ ...cmsPageQuery(slug), initialData: page });
  const current = data ?? page;
  if (!current.blocks?.length) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center">
        <h1 className="text-2xl font-semibold">{current.title}</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Deze pagina heeft nog geen content. Voeg blokken toe via{" "}
          <a href={`/admin/paginas/${current.slug}`} className="underline">/admin/paginas</a>.
        </p>
      </div>
    );
  }
  return <BlockRenderer blocks={current.blocks} />;
}