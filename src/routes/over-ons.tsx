import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { getWpPage } from '../lib/wordpress/pages'


console.log(
  "GRAPHQL URL:",
  import.meta.env.VITE_WP_GRAPHQL_URL
)



   export const Route = createFileRoute("/over-ons")({
     head: () => ({
       meta: [
         { title: "Over ons — Werkgenoten" },
         { name: "description", content: "Korte omschrijving van deze pagina." },
         { property: "og:title", content: "Over ons — Werkgenoten" },
         { property: "og:description", content: "Korte omschrijving van deze pagina." },
       ],
       links: [{ rel: "canonical", href: "/over-ons" }],
     }),
     component: OverOnsPage,
   });

   function OverOnsPage() {
     return (
       <>
         {/* Plak hier de secties die je uit PageTemplate.tsx wilt gebruiken */}
       </>
     );
   }