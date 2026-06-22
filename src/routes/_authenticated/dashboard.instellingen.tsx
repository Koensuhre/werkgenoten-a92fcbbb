import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@/hooks/use-session";
import { useCurrentProfile } from "@/hooks/use-current-profile";
import { useQueryClient } from "@tanstack/react-query";

export const Route = createFileRoute("/_authenticated/dashboard/instellingen")({
  component: Instellingen,
});

function Instellingen() {
  const { user } = useSession();
  const { data: profile, isLoading } = useCurrentProfile();
  const queryClient = useQueryClient();
  const [form, setForm] = useState({ display_name: "", company: "", city: "", bio: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (profile) {
      setForm({
        display_name: profile.display_name ?? "",
        company: profile.company ?? "",
        city: profile.city ?? "",
        bio: profile.bio ?? "",
      });
    }
  }, [profile]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update({
        display_name: form.display_name || null,
        company: form.company || null,
        city: form.city || null,
        bio: form.bio || null,
      })
      .eq("id", user.id);
    setSaving(false);
    if (error) {
      toast.error("Opslaan mislukt: " + error.message);
      return;
    }
    toast.success("Profiel bijgewerkt");
    queryClient.invalidateQueries({ queryKey: ["profile", user.id] });
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold">Instellingen</h1>
      <p className="text-sm text-muted-foreground">Beheer je profielgegevens.</p>
      <form
        onSubmit={onSubmit}
        className="bg-card-gradient shadow-card mt-6 space-y-4 rounded-xl border border-border/60 p-6"
      >
        <Field label="E-mail" value={user?.email ?? ""} readOnly />
        <Field
          label="Naam"
          value={form.display_name}
          onChange={(v) => setForm((f) => ({ ...f, display_name: v }))}
        />
        <Field
          label="Bedrijf (optioneel)"
          value={form.company}
          onChange={(v) => setForm((f) => ({ ...f, company: v }))}
        />
        <Field
          label="Stad"
          value={form.city}
          onChange={(v) => setForm((f) => ({ ...f, city: v }))}
        />
        <div>
          <label className="mb-1.5 block text-sm font-medium">Korte bio</label>
          <textarea
            rows={4}
            value={form.bio}
            onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))}
            className="w-full rounded-lg border border-border bg-input/40 px-3 py-2 text-sm focus:border-brand focus:outline-none"
          />
        </div>
        <button
          type="submit"
          disabled={saving || isLoading}
          className="rounded-lg bg-brand-gradient px-4 py-2 text-sm font-medium text-brand-foreground disabled:opacity-60"
        >
          {saving ? "Bezig…" : "Opslaan"}
        </button>
      </form>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  readOnly,
}: {
  label: string;
  value: string;
  onChange?: (v: string) => void;
  readOnly?: boolean;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium">{label}</label>
      <input
        value={value}
        readOnly={readOnly}
        onChange={(e) => onChange?.(e.target.value)}
        className="w-full rounded-lg border border-border bg-input/40 px-3 py-2 text-sm focus:border-brand focus:outline-none disabled:opacity-60"
      />
    </div>
  );
}