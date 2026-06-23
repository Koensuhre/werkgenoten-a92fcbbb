import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

type AdminCtx = { supabase: any; userId: string };

async function ensureAdmin(ctx: AdminCtx) {
  const { data, error } = await ctx.supabase.rpc("has_role", {
    _user_id: ctx.userId,
    _role: "admin",
  });
  if (error) throw new Error(error.message);
  if (!data) throw new Error("Forbidden: admin only");
}

// ---------- JOBS ----------
export const approveJob = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { id: string }) => d)
  .handler(async ({ data, context }) => {
    await ensureAdmin(context as AdminCtx);
    const { error } = await (context as AdminCtx).supabase
      .from("jobs")
      .update({
        review_status: "approved",
        status: "open",
        reviewed_by: (context as AdminCtx).userId,
        reviewed_at: new Date().toISOString(),
        review_notes: null,
      })
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const rejectJob = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { id: string; reason: string }) => d)
  .handler(async ({ data, context }) => {
    await ensureAdmin(context as AdminCtx);
    const { error } = await (context as AdminCtx).supabase
      .from("jobs")
      .update({
        review_status: "rejected",
        status: "cancelled",
        reviewed_by: (context as AdminCtx).userId,
        reviewed_at: new Date().toISOString(),
        review_notes: data.reason,
      })
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

// ---------- PROFESSIONALS ----------
export const approvePro = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { id: string }) => d)
  .handler(async ({ data, context }) => {
    await ensureAdmin(context as AdminCtx);
    const { error } = await (context as AdminCtx).supabase
      .from("profiles")
      .update({
        review_status: "approved",
        reviewed_by: (context as AdminCtx).userId,
        reviewed_at: new Date().toISOString(),
        review_notes: null,
      })
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const rejectPro = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { id: string; reason: string }) => d)
  .handler(async ({ data, context }) => {
    await ensureAdmin(context as AdminCtx);
    const { error } = await (context as AdminCtx).supabase
      .from("profiles")
      .update({
        review_status: "rejected",
        reviewed_by: (context as AdminCtx).userId,
        reviewed_at: new Date().toISOString(),
        review_notes: data.reason,
      })
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

// ---------- CONTACT: ophalen e-mail (vereist admin) ----------
export const getUserContact = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { id: string }) => d)
  .handler(async ({ data, context }) => {
    await ensureAdmin(context as AdminCtx);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: u, error } = await supabaseAdmin.auth.admin.getUserById(data.id);
    if (error) throw new Error(error.message);
    return {
      email: u.user?.email ?? null,
      phone: u.user?.phone ?? null,
    };
  });