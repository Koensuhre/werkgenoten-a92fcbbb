import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import type { Block } from "@/types/cms";

// WordPress REST writes. The browser must NEVER hold the Application
// Password — all writes go through these admin-gated server functions.
//
// Required env (Lovable Cloud secrets):
//   WP_BASE_URL      e.g. https://xenodochial-mclean.45-82-188-50.plesk.page
//   WP_APP_USER      WP admin username
//   WP_APP_PASSWORD  WP Application Password (Users > Profile > Application Passwords)
//
// Requires a small WP snippet that registers `blocks_json` as REST meta on
// `page` (show_in_rest, single, type:string). Lovable supplies the snippet
// in chat; without it, the meta write is a no-op WP-side.

function getWpConfig() {
  const baseUrl = process.env.WP_BASE_URL;
  const user = process.env.WP_APP_USER;
  const password = process.env.WP_APP_PASSWORD;
  if (!baseUrl || !user || !password) {
    throw new Error(
      "WordPress is nog niet verbonden. Voeg secrets WP_BASE_URL, WP_APP_USER en WP_APP_PASSWORD toe via Backend → Secrets.",
    );
  }
  const auth = "Basic " + Buffer.from(`${user}:${password}`).toString("base64");
  return { baseUrl: baseUrl.replace(/\/$/, ""), auth };
}

async function assertAdmin(supabase: any, userId: string) {
  const { data, error } = await supabase.rpc("has_role", { _user_id: userId, _role: "admin" });
  if (error) throw new Error(error.message);
  if (!data) throw new Error("Alleen administrators mogen WordPress-pagina's beheren.");
}

const updateInput = z.object({
  pageId: z.number().int().positive(),
  blocks: z.array(z.any()),
});

export const updatePageBlocks = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => updateInput.parse(d))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { baseUrl, auth } = getWpConfig();
    const res = await fetch(`${baseUrl}/wp-json/wp/v2/pages/${data.pageId}`, {
      method: "POST",
      headers: { "content-type": "application/json", authorization: auth },
      body: JSON.stringify({ meta: { blocks_json: JSON.stringify(data.blocks as Block[]) } }),
    });
    if (!res.ok) {
      const txt = await res.text();
      throw new Error(`WP afwijzing (${res.status}): ${txt.slice(0, 300)}`);
    }
    return { ok: true };
  });

const createInput = z.object({
  title: z.string().min(1).max(200),
  slug: z.string().min(1).max(200).regex(/^[a-z0-9-]+$/, "Slug mag alleen kleine letters, cijfers en streepjes bevatten"),
});

export const createPage = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => createInput.parse(d))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { baseUrl, auth } = getWpConfig();
    const res = await fetch(`${baseUrl}/wp-json/wp/v2/pages`, {
      method: "POST",
      headers: { "content-type": "application/json", authorization: auth },
      body: JSON.stringify({ title: data.title, slug: data.slug, status: "publish" }),
    });
    if (!res.ok) {
      const txt = await res.text();
      throw new Error(`WP afwijzing (${res.status}): ${txt.slice(0, 300)}`);
    }
    const json = (await res.json()) as { id: number; slug: string };
    return { id: json.id, slug: json.slug };
  });

export const wpConfigStatus = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.supabase, context.userId);
    return {
      configured: !!(process.env.WP_BASE_URL && process.env.WP_APP_USER && process.env.WP_APP_PASSWORD),
    };
  });