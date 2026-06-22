import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Save, RotateCcw, Eraser } from "lucide-react";
import { cmsThemeQuery } from "@/services/wpgraphql";
import {
  themeOverrideQuery,
  THEME_OVERRIDE_KEY,
  saveThemeOverride,
  clearThemeOverride,
} from "@/services/theme/theme-override";
import { applyTheme } from "@/services/theme/apply-theme";
import type { ThemeTokens } from "@/types/cms";

export const Route = createFileRoute("/_authenticated/_admin/admin/thema")({
  component: ThemeAdmin,
});

type Field = { key: string; label: string; path: (t: ThemeTokens) => string; set: (t: ThemeTokens, v: string) => void };

const colorFields: Field[] = [
  ["background", "Achtergrond"],
  ["foreground", "Tekst"],
  ["primary", "Primair"],
  ["primaryForeground", "Primair (tekst)"],
  ["secondary", "Secundair"],
  ["secondaryForeground", "Secundair (tekst)"],
  ["accent", "Accent"],
  ["accentForeground", "Accent (tekst)"],
  ["muted", "Gedempt"],
  ["mutedForeground", "Gedempt (tekst)"],
  ["border", "Rand"],
  ["card", "Kaart"],
  ["cardForeground", "Kaart (tekst)"],
  ["brand", "Merk"],
  ["brandForeground", "Merk (tekst)"],
  ["destructive", "Gevaar"],
].map(([k, label]) => ({
  key: `colors.${k}`,
  label,
  path: (t) => (t.colors as Record<string, string>)[k],
  set: (t, v) => {
    (t.colors as Record<string, string>)[k] = v;
  },
}));

const typoFields: Field[] = [
  ["fontSans", "Font (sans)"],
  ["fontDisplay", "Font (display)"],
  ["fontMono", "Font (mono)"],
].map(([k, label]) => ({
  key: `typography.${k}`,
  label,
  path: (t) => (t.typography as Record<string, string>)[k],
  set: (t, v) => {
    (t.typography as Record<string, string>)[k] = v;
  },
}));

const layoutFields: Field[] = [
  ["radius", "Hoekafronding"],
  ["containerMax", "Max breedte"],
  ["sectionSpacing", "Sectie ruimte"],
  ["shadowGlow", "Schaduw (gloed)"],
  ["shadowElegant", "Schaduw (elegant)"],
  ["shadowCard", "Schaduw (kaart)"],
].map(([k, label]) => ({
  key: `layout.${k}`,
  label,
  path: (t) => (t.layout as Record<string, string>)[k],
  set: (t, v) => {
    (t.layout as Record<string, string>)[k] = v;
  },
}));

function clone<T>(v: T): T {
  return JSON.parse(JSON.stringify(v)) as T;
}

function ThemeAdmin() {
  const qc = useQueryClient();
  const { data: baseline } = useQuery(cmsThemeQuery());
  const { data: override } = useQuery(themeOverrideQuery());

  const initial = useMemo<ThemeTokens | null>(() => {
    const src = override ?? baseline;
    return src ? clone(src) : null;
  }, [override, baseline]);

  const [draft, setDraft] = useState<ThemeTokens | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (initial && !draft) setDraft(initial);
  }, [initial, draft]);

  // Live preview: apply draft to the document on every change.
  useEffect(() => {
    if (draft) applyTheme(draft);
  }, [draft]);

  if (!draft) {
    return <div className="text-sm text-muted-foreground">Thema wordt geladen…</div>;
  }

  const update = (field: Field, value: string) => {
    setDraft((d) => {
      if (!d) return d;
      const next = clone(d);
      field.set(next, value);
      return next;
    });
  };

  const onSave = async () => {
    if (!draft) return;
    setSaving(true);
    try {
      await saveThemeOverride(draft);
      await qc.invalidateQueries({ queryKey: THEME_OVERRIDE_KEY });
      toast.success("Thema opgeslagen — live voor alle bezoekers.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Opslaan mislukt");
    } finally {
      setSaving(false);
    }
  };

  const onReset = () => {
    if (baseline) {
      const fresh = clone(baseline);
      setDraft(fresh);
      applyTheme(fresh);
      toast.message("Concept teruggezet naar standaard (nog niet opgeslagen).");
    }
  };

  const onClear = async () => {
    if (!confirm("Overschrijving verwijderen? De site gebruikt dan weer de standaard tokens.")) return;
    setSaving(true);
    try {
      await clearThemeOverride();
      await qc.invalidateQueries({ queryKey: THEME_OVERRIDE_KEY });
      if (baseline) {
        setDraft(clone(baseline));
        applyTheme(baseline);
      }
      toast.success("Overschrijving verwijderd.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Verwijderen mislukt");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Thema-tokens</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Pas kleuren, typografie en layout aan. Wijzigingen zie je meteen in deze pagina; klik op{" "}
            <strong>Opslaan</strong> om ze live te zetten voor alle bezoekers.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onReset}
            className="inline-flex items-center gap-2 rounded-md border border-border bg-secondary px-3 py-2 text-sm"
          >
            <RotateCcw className="h-4 w-4" /> Concept reset
          </button>
          <button
            onClick={onClear}
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm text-destructive hover:bg-destructive/10 disabled:opacity-50"
          >
            <Eraser className="h-4 w-4" /> Overschrijving wissen
          </button>
          <button
            onClick={onSave}
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-md bg-brand-gradient px-3 py-2 text-sm font-medium text-brand-foreground disabled:opacity-50"
          >
            <Save className="h-4 w-4" /> {saving ? "Opslaan…" : "Opslaan"}
          </button>
        </div>
      </div>

      <Section title="Kleuren" hint="Waarden in OKLCH of HSL, zoals `oklch(0.72 0.18 155)` of `222 47% 11%`.">
        <div className="grid gap-3 sm:grid-cols-2">
          {colorFields.map((f) => (
            <ColorRow key={f.key} field={f} value={f.path(draft)} onChange={(v) => update(f, v)} />
          ))}
        </div>
      </Section>

      <Section title="Typografie">
        <div className="grid gap-3 sm:grid-cols-2">
          {typoFields.map((f) => (
            <TextRow key={f.key} field={f} value={f.path(draft)} onChange={(v) => update(f, v)} />
          ))}
        </div>
      </Section>

      <Section title="Layout">
        <div className="grid gap-3 sm:grid-cols-2">
          {layoutFields.map((f) => (
            <TextRow key={f.key} field={f} value={f.path(draft)} onChange={(v) => update(f, v)} />
          ))}
        </div>
      </Section>

      <Section title="Voorbeeld">
        <div className="space-y-4 rounded-xl border border-border bg-card p-6">
          <h2 className="text-2xl font-semibold">Demo titel</h2>
          <p className="text-muted-foreground">Dit blok gebruikt dezelfde tokens als de rest van de site.</p>
          <div className="flex flex-wrap gap-3">
            <button className="rounded-md bg-brand-gradient px-4 py-2 text-sm font-medium text-brand-foreground shadow-glow">
              Primaire knop
            </button>
            <button className="rounded-md border border-border bg-secondary px-4 py-2 text-sm">
              Secundair
            </button>
            <span className="rounded-md bg-destructive px-3 py-1 text-xs text-destructive-foreground">
              Badge
            </span>
          </div>
        </div>
      </Section>
    </div>
  );
}

function Section({ title, hint, children }: { title: string; hint?: string; children: React.ReactNode }) {
  return (
    <section className="rounded-xl border border-border/60 bg-card-gradient p-5 shadow-card">
      <header className="mb-4">
        <h2 className="text-lg font-semibold">{title}</h2>
        {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
      </header>
      {children}
    </section>
  );
}

function TextRow({ field, value, onChange }: { field: Field; value: string; onChange: (v: string) => void }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs text-muted-foreground">{field.label}</span>
      <input
        type="text"
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm font-mono"
      />
    </label>
  );
}

function ColorRow({ field, value, onChange }: { field: Field; value: string; onChange: (v: string) => void }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs text-muted-foreground">{field.label}</span>
      <div className="flex items-center gap-2">
        <span
          aria-hidden
          className="h-9 w-9 shrink-0 rounded-md border border-border"
          style={{ background: wrapColor(value) }}
        />
        <input
          type="text"
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm font-mono"
          placeholder="oklch(...) of 222 47% 11%"
        />
      </div>
    </label>
  );
}

// Tokens may be raw `H S% L%` (shadcn convention) or full color()/oklch() values.
// Wrap bare HSL so the swatch preview still renders.
function wrapColor(v: string | undefined): string {
  if (!v) return "transparent";
  const t = v.trim();
  if (/^(oklch|hsl|rgb|color|#)/i.test(t)) return t;
  return `hsl(${t})`;
}