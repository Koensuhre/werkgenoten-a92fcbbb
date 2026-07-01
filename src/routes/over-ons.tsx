import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { getWpPage } from '../lib/wordpress/pages'

export const Route = createFileRoute("/over-ons")({
  head: () => ({
    meta: [
      { title: "Over ons — Werkgenoten" },
      { name: "description", content: "Over ons pagina van Werkgenoten." },
    ],
  }),
  component: OverOnsPage,
})

function OverOnsPage() {
  const [page, setPage] = useState<any>(null)

  useEffect(() => {
    getWpPage("/over-ons").then((data) => {
      console.log("PAGE DATA:", data)
      setPage(data)
    })
  }, [])

  if (!page) {
    return <div>test...</div>
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