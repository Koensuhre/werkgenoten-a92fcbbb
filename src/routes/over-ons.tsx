import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { getWpPage } from '../lib/wordpress/pages'

export const Route = createFileRoute("/over-ons")({
  head: () => ({
    meta: [
      { title: "Over ons — Werkgenoten" },
      { name: "description", content: "Korte omschrijving van deze pagina." },
    ],
  }),
  component: OverOnsPage,
})

function OverOnsPage() {
  const [page, setPage] = useState<any>(null)

  useEffect(() => {
    getWpPage("over-ons").then(setPage)
  }, [])

  if (!page) {
    return <div>Laden...</div>
  }

  return (
    <main>
      <h1>{page.title}</h1>

      <div
        dangerouslySetInnerHTML={{
          __html: page.content,
        }}
      />
    </main>
  )
}