import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import {
  ArrowLeft,
  Copy,
  GripVertical,
  Plus,
  Save,
  Trash2,
  ExternalLink,
} from "lucide-react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { cmsPageQuery, cmsPagesListQuery } from "@/services/wpgraphql";
import { BlockRenderer } from "@/components/blocks/BlockRenderer";
import { updatePageBlocks } from "@/lib/wp.functions";
import type { Block } from "@/types/cms";

export const Route = createFileRoute("/_authenticated/_admin/admin/paginas/$slug")({
  component: PageEditor,
});

const WP_BASE = (import.meta.env.VITE_WP_GRAPHQL_URL as string | undefined)?.replace(/\/graphql\/?$/, "");

type BlockType = Block["__typename"];

const BLOCK_TYPES: { type: BlockType; label: string }[] = [
  { type: "HeroBlock", label: "Hero" },
  { type: "RichTextBlock", label: "Tekst (HTML)" },
  { type: "FeaturesBlock", label: "Features" },
  { type: "CtaBlock", label: "Call-to-action" },
  { type: "FaqBlock", label: "FAQ" },
  { type: "TestimonialsBlock", label: "Testimonials" },
  { type: "StatsBlock", label: "Stats" },
  { type: "ImageBlock", label: "Afbeelding" },
  { type: "GalleryBlock", label: "Galerij" },
  { type: "FormBlock", label: "Formulier" },
  { type: "CustomHtmlBlock", label: "Custom HTML" },
];

function newId() {
  return `b_${Math.random().toString(36).slice(2, 10)}`;
}

function newBlock(type: BlockType): Block {
  const id = newId();
  switch (type) {
    case "HeroBlock":
      return { __typename: "HeroBlock", id, title: "Nieuwe hero", subtitle: "Subtitel", align: "center", ctas: [] };
    case "RichTextBlock":
      return { __typename: "RichTextBlock", id, html: "<p>Begin met typen…</p>" };
    case "FeaturesBlock":
      return { __typename: "FeaturesBlock", id, title: "Features", columns: 3, items: [{ title: "Item", description: "Beschrijving" }] };
    case "CtaBlock":
      return { __typename: "CtaBlock", id, title: "Klaar om te starten?", ctas: [{ label: "Begin nu", href: "/" }] };
    case "FaqBlock":
      return { __typename: "FaqBlock", id, title: "FAQ", items: [{ question: "Vraag?", answer: "Antwoord." }] };
    case "TestimonialsBlock":
      return { __typename: "TestimonialsBlock", id, items: [{ quote: "Geweldig!", name: "Naam" }] };
    case "StatsBlock":
      return { __typename: "StatsBlock", id, items: [{ value: "100+", label: "Klanten" }] };
    case "ImageBlock":
      return { __typename: "ImageBlock", id, src: "" };
    case "GalleryBlock":
      return { __typename: "GalleryBlock", id, images: [] };
    case "FormBlock":
      return { __typename: "FormBlock", id, title: "Contact", fields: [{ name: "email", label: "E-mail", type: "email", required: true }] };
    case "CustomHtmlBlock":
      return { __typename: "CustomHtmlBlock", id, html: "<div></div>" };
    default:
      return { __typename: "RichTextBlock", id, html: "" };
  }
}

function PageEditor() {
  const { slug } = Route.useParams();
  const qc = useQueryClient();
  const { data: page, isLoading } = useQuery(cmsPageQuery(slug));
  const { data: list } = useQuery(cmsPagesListQuery());
  const summary = list?.find((p) => p.slug === slug);

  const save = useServerFn(updatePageBlocks);
  const [draft, setDraft] = useState<Block[] | null>(null);
  const [saving, setSaving] = useState(false);
  const [showPicker, setShowPicker] = useState(false);

  useEffect(() => {
    if (page && !draft) setDraft(page.blocks);
  }, [page, draft]);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 4 } }));

  const dirty = useMemo(() => JSON.stringify(draft) !== JSON.stringify(page?.blocks ?? []), [draft, page]);

  if (isLoading || !draft) {
    return <div className="text-sm text-muted-foreground">Pagina wordt geladen…</div>;
  }
  if (!page) {
    return <div className="text-sm text-muted-foreground">Pagina niet gevonden in WordPress.</div>;
  }

  function update(idx: number, patch: Partial<Block>) {
    setDraft((d) => d!.map((b, i) => (i === idx ? ({ ...b, ...patch } as Block) : b)));
  }
  function remove(idx: number) {
    setDraft((d) => d!.filter((_, i) => i !== idx));
  }
  function duplicate(idx: number) {
    setDraft((d) => {
      const copy = [...d!];
      copy.splice(idx + 1, 0, { ...copy[idx], id: newId() } as Block);
      return copy;
    });
  }
  function add(type: BlockType) {
    setDraft((d) => [...d!, newBlock(type)]);
    setShowPicker(false);
  }
  function onDragEnd(e: DragEndEvent) {
    if (!e.over || e.active.id === e.over.id) return;
    setDraft((d) => {
      const from = d!.findIndex((b) => b.id === e.active.id);
      const to = d!.findIndex((b) => b.id === e.over!.id);
      if (from < 0 || to < 0) return d;
      return arrayMove(d!, from, to);
    });
  }

  async function onSave() {
    if (!summary) {
      toast.error("Pagina-ID niet bekend (lijst nog niet geladen).");
      return;
    }
    setSaving(true);
    try {
      await save({ data: { pageId: summary.id, blocks: draft! } });
      toast.success("Opgeslagen naar WordPress.");
      await qc.invalidateQueries({ queryKey: ["cms", "page", slug] });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Opslaan mislukt");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div>
          <Link to="/admin/paginas" className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-3.5 w-3.5" /> Terug naar pagina's
          </Link>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight" dangerouslySetInnerHTML={{ __html: page.title }} />
          <p className="text-xs text-muted-foreground">
            <code>/{slug}</code> · preview op{" "}
            <Link to="/cms/$slug" params={{ slug }} className="underline">/cms/{slug}</Link>
          </p>
        </div>
        <div className="flex gap-2">
          {summary && WP_BASE && (
            <a
              href={`${WP_BASE}/wp-admin/post.php?post=${summary.id}&action=edit`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-md border border-border bg-secondary px-3 py-2 text-sm"
            >
              <ExternalLink className="h-4 w-4" /> Open in Gutenberg
            </a>
          )}
          <button
            onClick={onSave}
            disabled={saving || !dirty}
            className="inline-flex items-center gap-2 rounded-md bg-brand-gradient px-3 py-2 text-sm font-medium text-brand-foreground disabled:opacity-50"
          >
            <Save className="h-4 w-4" /> {saving ? "Opslaan…" : dirty ? "Opslaan naar WP" : "Opgeslagen"}
          </button>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[420px_1fr]">
        {/* Block list */}
        <div className="space-y-3">
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
            <SortableContext items={draft.map((b) => b.id)} strategy={verticalListSortingStrategy}>
              {draft.map((block, i) => (
                <BlockCard
                  key={block.id}
                  block={block}
                  onChange={(patch) => update(i, patch)}
                  onRemove={() => remove(i)}
                  onDuplicate={() => duplicate(i)}
                />
              ))}
            </SortableContext>
          </DndContext>

          <div className="rounded-xl border border-dashed border-border p-3">
            {!showPicker ? (
              <button
                onClick={() => setShowPicker(true)}
                className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-secondary px-3 py-2 text-sm"
              >
                <Plus className="h-4 w-4" /> Blok toevoegen
              </button>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                {BLOCK_TYPES.map((b) => (
                  <button
                    key={b.type}
                    onClick={() => add(b.type)}
                    className="rounded-md border border-border bg-card px-3 py-2 text-left text-xs hover:bg-surface-2"
                  >
                    {b.label}
                  </button>
                ))}
                <button
                  onClick={() => setShowPicker(false)}
                  className="col-span-2 rounded-md px-3 py-2 text-xs text-muted-foreground"
                >
                  Annuleren
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Live preview */}
        <div className="overflow-hidden rounded-xl border border-border bg-background">
          <div className="border-b border-border bg-surface-2 px-4 py-2 text-xs uppercase tracking-wider text-muted-foreground">
            Live voorbeeld
          </div>
          <div className="max-h-[80vh] overflow-y-auto">
            {draft.length === 0 ? (
              <div className="p-12 text-center text-sm text-muted-foreground">
                Voeg blokken toe om een voorbeeld te zien.
              </div>
            ) : (
              <BlockRenderer blocks={draft} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function BlockCard({
  block,
  onChange,
  onRemove,
  onDuplicate,
}: {
  block: Block;
  onChange: (patch: Partial<Block>) => void;
  onRemove: () => void;
  onDuplicate: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: block.id });
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 };
  return (
    <div ref={setNodeRef} style={style} className="rounded-xl border border-border bg-card">
      <header className="flex items-center justify-between gap-2 border-b border-border/60 px-3 py-2">
        <div className="flex items-center gap-2">
          <button
            {...attributes}
            {...listeners}
            className="cursor-grab touch-none rounded p-1 text-muted-foreground hover:bg-surface-2"
            aria-label="Sleep om volgorde te wijzigen"
          >
            <GripVertical className="h-4 w-4" />
          </button>
          <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{block.__typename.replace("Block", "")}</span>
        </div>
        <div className="flex gap-1">
          <button onClick={onDuplicate} className="rounded p-1.5 text-muted-foreground hover:bg-surface-2" title="Dupliceren">
            <Copy className="h-3.5 w-3.5" />
          </button>
          <button onClick={onRemove} className="rounded p-1.5 text-destructive hover:bg-destructive/10" title="Verwijderen">
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </header>
      <div className="p-3">
        <BlockForm block={block} onChange={onChange} />
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}
const inputCls = "w-full rounded-md border border-border bg-background px-2.5 py-1.5 text-sm";

function BlockForm({ block, onChange }: { block: Block; onChange: (patch: Partial<Block>) => void }) {
  switch (block.__typename) {
    case "HeroBlock":
      return (
        <div className="space-y-2">
          <Field label="Eyebrow"><input className={inputCls} value={block.eyebrow ?? ""} onChange={(e) => onChange({ eyebrow: e.target.value } as any)} /></Field>
          <Field label="Titel"><input className={inputCls} value={block.title} onChange={(e) => onChange({ title: e.target.value } as any)} /></Field>
          <Field label="Subtitel"><textarea className={inputCls} rows={2} value={block.subtitle ?? ""} onChange={(e) => onChange({ subtitle: e.target.value } as any)} /></Field>
          <Field label="Uitlijning">
            <select className={inputCls} value={block.align ?? "center"} onChange={(e) => onChange({ align: e.target.value as "left" | "center" } as any)}>
              <option value="center">Gecentreerd</option>
              <option value="left">Links</option>
            </select>
          </Field>
        </div>
      );
    case "RichTextBlock":
      return <Field label="HTML"><textarea className={`${inputCls} font-mono`} rows={8} value={block.html} onChange={(e) => onChange({ html: e.target.value } as any)} /></Field>;
    case "CustomHtmlBlock":
      return <Field label="Custom HTML"><textarea className={`${inputCls} font-mono`} rows={8} value={block.html} onChange={(e) => onChange({ html: e.target.value } as any)} /></Field>;
    case "CtaBlock":
      return (
        <div className="space-y-2">
          <Field label="Titel"><input className={inputCls} value={block.title} onChange={(e) => onChange({ title: e.target.value } as any)} /></Field>
          <Field label="Subtitel"><input className={inputCls} value={block.subtitle ?? ""} onChange={(e) => onChange({ subtitle: e.target.value } as any)} /></Field>
          <CtasEditor ctas={block.ctas} onChange={(ctas) => onChange({ ctas } as any)} />
        </div>
      );
    case "FaqBlock":
      return (
        <div className="space-y-2">
          <Field label="Titel"><input className={inputCls} value={block.title ?? ""} onChange={(e) => onChange({ title: e.target.value } as any)} /></Field>
          <ItemListEditor
            items={block.items}
            onChange={(items) => onChange({ items } as any)}
            empty={{ question: "", answer: "" }}
            renderItem={(item, set) => (
              <>
                <input className={inputCls} placeholder="Vraag" value={item.question} onChange={(e) => set({ ...item, question: e.target.value })} />
                <textarea className={inputCls} rows={2} placeholder="Antwoord" value={item.answer} onChange={(e) => set({ ...item, answer: e.target.value })} />
              </>
            )}
          />
        </div>
      );
    case "FeaturesBlock":
      return (
        <div className="space-y-2">
          <Field label="Titel"><input className={inputCls} value={block.title ?? ""} onChange={(e) => onChange({ title: e.target.value } as any)} /></Field>
          <Field label="Kolommen">
            <select className={inputCls} value={block.columns} onChange={(e) => onChange({ columns: Number(e.target.value) as 2 | 3 | 4 } as any)}>
              <option value={2}>2</option><option value={3}>3</option><option value={4}>4</option>
            </select>
          </Field>
          <ItemListEditor
            items={block.items}
            onChange={(items) => onChange({ items } as any)}
            empty={{ title: "", description: "" }}
            renderItem={(item, set) => (
              <>
                <input className={inputCls} placeholder="Titel" value={item.title} onChange={(e) => set({ ...item, title: e.target.value })} />
                <textarea className={inputCls} rows={2} placeholder="Beschrijving" value={item.description} onChange={(e) => set({ ...item, description: e.target.value })} />
              </>
            )}
          />
        </div>
      );
    case "ImageBlock":
      return (
        <div className="space-y-2">
          <Field label="Afbeelding URL"><input className={inputCls} value={block.src} onChange={(e) => onChange({ src: e.target.value } as any)} /></Field>
          <Field label="Alt-tekst"><input className={inputCls} value={block.alt ?? ""} onChange={(e) => onChange({ alt: e.target.value } as any)} /></Field>
          <Field label="Bijschrift"><input className={inputCls} value={block.caption ?? ""} onChange={(e) => onChange({ caption: e.target.value } as any)} /></Field>
        </div>
      );
    case "TestimonialsBlock":
      return (
        <ItemListEditor
          items={block.items}
          onChange={(items) => onChange({ items } as any)}
          empty={{ quote: "", name: "" }}
          renderItem={(item, set) => (
            <>
              <textarea className={inputCls} rows={2} placeholder="Quote" value={item.quote} onChange={(e) => set({ ...item, quote: e.target.value })} />
              <input className={inputCls} placeholder="Naam" value={item.name} onChange={(e) => set({ ...item, name: e.target.value })} />
              <input className={inputCls} placeholder="Rol (optioneel)" value={item.role ?? ""} onChange={(e) => set({ ...item, role: e.target.value })} />
            </>
          )}
        />
      );
    case "StatsBlock":
      return (
        <ItemListEditor
          items={block.items}
          onChange={(items) => onChange({ items } as any)}
          empty={{ value: "", label: "" }}
          renderItem={(item, set) => (
            <div className="grid grid-cols-2 gap-2">
              <input className={inputCls} placeholder="Waarde" value={item.value} onChange={(e) => set({ ...item, value: e.target.value })} />
              <input className={inputCls} placeholder="Label" value={item.label} onChange={(e) => set({ ...item, label: e.target.value })} />
            </div>
          )}
        />
      );
    case "GalleryBlock":
      return (
        <ItemListEditor
          items={block.images}
          onChange={(images) => onChange({ images } as any)}
          empty={{ src: "", alt: "" }}
          renderItem={(item, set) => (
            <>
              <input className={inputCls} placeholder="Afbeelding URL" value={item.src} onChange={(e) => set({ ...item, src: e.target.value })} />
              <input className={inputCls} placeholder="Alt" value={item.alt ?? ""} onChange={(e) => set({ ...item, alt: e.target.value })} />
            </>
          )}
        />
      );
    case "FormBlock":
      return (
        <div className="space-y-2">
          <Field label="Titel"><input className={inputCls} value={block.title ?? ""} onChange={(e) => onChange({ title: e.target.value } as any)} /></Field>
          <Field label="Endpoint"><input className={inputCls} value={block.endpoint ?? ""} onChange={(e) => onChange({ endpoint: e.target.value } as any)} /></Field>
          <ItemListEditor
            items={block.fields}
            onChange={(fields) => onChange({ fields } as any)}
            empty={{ name: "veld", label: "Veld", type: "text" as const }}
            renderItem={(item, set) => (
              <div className="grid grid-cols-3 gap-2">
                <input className={inputCls} placeholder="name" value={item.name} onChange={(e) => set({ ...item, name: e.target.value })} />
                <input className={inputCls} placeholder="label" value={item.label} onChange={(e) => set({ ...item, label: e.target.value })} />
                <select className={inputCls} value={item.type} onChange={(e) => set({ ...item, type: e.target.value as any })}>
                  <option value="text">text</option>
                  <option value="email">email</option>
                  <option value="tel">tel</option>
                  <option value="textarea">textarea</option>
                </select>
              </div>
            )}
          />
        </div>
      );
    default:
      return <div className="text-xs text-muted-foreground">Geen editor voor dit blok-type.</div>;
  }
}

function CtasEditor({ ctas, onChange }: { ctas?: Array<{ label: string; href: string; variant?: "primary" | "secondary" | "ghost" }>; onChange: (v: any) => void }) {
  const list = ctas ?? [];
  return (
    <ItemListEditor
      items={list}
      onChange={onChange}
      empty={{ label: "Knop", href: "/" }}
      renderItem={(item, set) => (
        <div className="grid grid-cols-[1fr_1fr_auto] gap-2">
          <input className={inputCls} placeholder="Label" value={item.label} onChange={(e) => set({ ...item, label: e.target.value })} />
          <input className={inputCls} placeholder="Href" value={item.href} onChange={(e) => set({ ...item, href: e.target.value })} />
          <select className={inputCls} value={item.variant ?? "primary"} onChange={(e) => set({ ...item, variant: e.target.value as any })}>
            <option value="primary">primair</option>
            <option value="secondary">secundair</option>
            <option value="ghost">ghost</option>
          </select>
        </div>
      )}
    />
  );
}

function ItemListEditor<T>({
  items,
  onChange,
  empty,
  renderItem,
}: {
  items: T[];
  onChange: (items: T[]) => void;
  empty: T;
  renderItem: (item: T, set: (v: T) => void) => React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      {items.map((item, i) => (
        <div key={i} className="rounded-md border border-border/60 bg-background p-2 space-y-2">
          {renderItem(item, (v) => onChange(items.map((x, j) => (j === i ? v : x))))}
          <button
            onClick={() => onChange(items.filter((_, j) => j !== i))}
            className="text-xs text-destructive hover:underline"
          >
            Verwijderen
          </button>
        </div>
      ))}
      <button
        onClick={() => onChange([...items, { ...(empty as any) }])}
        className="inline-flex items-center gap-1 rounded-md border border-dashed border-border px-2.5 py-1.5 text-xs text-muted-foreground hover:bg-surface-2"
      >
        <Plus className="h-3 w-3" /> Item toevoegen
      </button>
    </div>
  );
}