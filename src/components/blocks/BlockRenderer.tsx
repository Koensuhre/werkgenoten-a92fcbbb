import type { Block, CtaLink } from "@/types/cms";
import DOMPurify from "dompurify";
import { Component, type ReactNode } from "react";

// Per-block error boundary: one broken section must never blank the
// whole page. Logs to the console with the block __typename so the
// developer sees exactly which block failed.
class BlockErrorBoundary extends Component<
  { name: string; children: ReactNode },
  { hasError: boolean; error?: Error }
> {
  state = { hasError: false, error: undefined as Error | undefined };
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }
  componentDidCatch(error: Error) {
    console.error(`[BlockRenderer] block "${this.props.name}" failed to render`, error);
  }
  render() {
    if (!this.state.hasError) return this.props.children;
    if (import.meta.env.DEV) {
      return (
        <section className="mx-auto w-full max-w-7xl px-4 py-6">
          <div className="rounded-md border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive">
            Blok <code>{this.props.name}</code> kon niet worden weergegeven.
          </div>
        </section>
      );
    }
    return null;
  }
}

function Ctas({ ctas }: { ctas?: CtaLink[] }) {
  if (!ctas?.length) return null;
  return (
    <div className="mt-6 flex flex-wrap gap-3">
      {ctas.map((cta) => {
        const base = "inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-transform hover:scale-[1.02]";
        const cls =
          cta.variant === "secondary"
            ? `${base} border border-border bg-secondary text-secondary-foreground`
            : cta.variant === "ghost"
              ? `${base} text-foreground hover:bg-accent`
              : `${base} bg-brand-gradient text-brand-foreground shadow-glow`;
        return (
          <a key={cta.href + cta.label} href={cta.href} className={cls}>
            {cta.label}
          </a>
        );
      })}
    </div>
  );
}

function Section({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <section className={`mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 sm:py-24 ${className}`}>
      {children}
    </section>
  );
}

function Hero({ block }: { block: Extract<Block, { __typename: "HeroBlock" }> }) {
  const align = block.align === "left" ? "text-left" : "text-center mx-auto";
  return (
    <Section className="bg-hero">
      <div className={`max-w-3xl ${align}`}>
        {block.eyebrow && <p className="mb-3 text-sm font-medium text-brand">{block.eyebrow}</p>}
        <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-6xl text-gradient">{block.title}</h1>
        {block.subtitle && <p className="mt-5 text-lg text-muted-foreground">{block.subtitle}</p>}
        <Ctas ctas={block.ctas} />
      </div>
    </Section>
  );
}

function RichText({ block }: { block: Extract<Block, { __typename: "RichTextBlock" }> }) {
  const clean = typeof window !== "undefined" ? DOMPurify.sanitize(block.html) : block.html;
  return (
    <Section>
      <div className="prose prose-invert max-w-3xl mx-auto" dangerouslySetInnerHTML={{ __html: clean }} />
    </Section>
  );
}

function Features({ block }: { block: Extract<Block, { __typename: "FeaturesBlock" }> }) {
  const cols = block.columns === 4 ? "md:grid-cols-4" : block.columns === 2 ? "md:grid-cols-2" : "md:grid-cols-3";
  return (
    <Section>
      {block.title && <h2 className="text-3xl font-semibold tracking-tight text-center">{block.title}</h2>}
      {block.subtitle && <p className="mt-3 text-center text-muted-foreground">{block.subtitle}</p>}
      <div className={`mt-12 grid gap-6 ${cols}`}>
        {block.items.map((item, i) => (
          <div key={i} className="rounded-xl border border-border bg-card p-6 shadow-card">
            {item.icon && <div className="mb-3 text-2xl">{item.icon}</div>}
            <h3 className="font-semibold">{item.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{item.description}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}

function Cta({ block }: { block: Extract<Block, { __typename: "CtaBlock" }> }) {
  return (
    <Section>
      <div className="glass rounded-2xl p-10 text-center">
        <h2 className="text-3xl font-semibold tracking-tight">{block.title}</h2>
        {block.subtitle && <p className="mt-3 text-muted-foreground">{block.subtitle}</p>}
        <div className="mt-6 flex justify-center"><Ctas ctas={block.ctas} /></div>
      </div>
    </Section>
  );
}

function Testimonials({ block }: { block: Extract<Block, { __typename: "TestimonialsBlock" }> }) {
  return (
    <Section>
      {block.title && <h2 className="text-3xl font-semibold tracking-tight text-center">{block.title}</h2>}
      <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {block.items.map((t, i) => (
          <figure key={i} className="rounded-xl border border-border bg-card p-6">
            <blockquote className="text-foreground">“{t.quote}”</blockquote>
            <figcaption className="mt-4 text-sm text-muted-foreground">{t.name}{t.role ? ` · ${t.role}` : ""}</figcaption>
          </figure>
        ))}
      </div>
    </Section>
  );
}

function Faq({ block }: { block: Extract<Block, { __typename: "FaqBlock" }> }) {
  return (
    <Section>
      {block.title && <h2 className="text-3xl font-semibold tracking-tight text-center">{block.title}</h2>}
      <dl className="mx-auto mt-10 max-w-3xl divide-y divide-border">
        {block.items.map((q, i) => (
          <div key={i} className="py-5">
            <dt className="font-medium">{q.question}</dt>
            <dd className="mt-2 text-muted-foreground">{q.answer}</dd>
          </div>
        ))}
      </dl>
    </Section>
  );
}

function Stats({ block }: { block: Extract<Block, { __typename: "StatsBlock" }> }) {
  return (
    <Section>
      <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
        {block.items.map((s, i) => (
          <div key={i} className="rounded-xl border border-border bg-card p-6 text-center">
            <div className="text-3xl font-semibold text-gradient-brand">{s.value}</div>
            <div className="mt-1 text-sm text-muted-foreground">{s.label}</div>
          </div>
        ))}
      </div>
    </Section>
  );
}

function Pricing({ block }: { block: Extract<Block, { __typename: "PricingBlock" }> }) {
  return (
    <Section>
      {block.title && <h2 className="text-3xl font-semibold tracking-tight text-center">{block.title}</h2>}
      {block.subtitle && <p className="mt-3 text-center text-muted-foreground">{block.subtitle}</p>}
      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {block.plans.map((p) => (
          <div key={p.name} className={`rounded-xl border p-6 ${p.highlight ? "border-brand shadow-glow" : "border-border"} bg-card`}>
            <h3 className="font-semibold">{p.name}</h3>
            <div className="mt-3 text-3xl font-semibold">{p.price}</div>
            {p.tagline && <p className="mt-1 text-sm text-muted-foreground">{p.tagline}</p>}
            <ul className="mt-4 space-y-2 text-sm">
              {p.features.map((f) => <li key={f}>· {f}</li>)}
            </ul>
            <a href={p.cta.href} className="mt-6 inline-flex w-full justify-center rounded-md bg-brand-gradient px-4 py-2 text-sm font-medium text-brand-foreground">{p.cta.label}</a>
          </div>
        ))}
      </div>
    </Section>
  );
}

function Logos({ block }: { block: Extract<Block, { __typename: "LogosBlock" }> }) {
  return (
    <Section>
      {block.title && <p className="text-center text-sm text-muted-foreground">{block.title}</p>}
      <div className="mt-6 flex flex-wrap items-center justify-center gap-x-10 gap-y-4 opacity-70">
        {block.logos.map((l) => l.src
          ? <img key={l.name} src={l.src} alt={l.name} className="h-7" loading="lazy" />
          : <span key={l.name} className="text-sm font-medium tracking-wide">{l.name}</span>)}
      </div>
    </Section>
  );
}

function Gallery({ block }: { block: Extract<Block, { __typename: "GalleryBlock" }> }) {
  return (
    <Section>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
        {block.images.map((img, i) => (
          <img key={i} src={img.src} alt={img.alt ?? ""} className="aspect-square w-full rounded-lg object-cover" loading="lazy" />
        ))}
      </div>
    </Section>
  );
}

function Image({ block }: { block: Extract<Block, { __typename: "ImageBlock" }> }) {
  return (
    <Section>
      <figure className="mx-auto max-w-4xl">
        <img src={block.src} alt={block.alt ?? ""} className="w-full rounded-xl" loading="lazy" />
        {block.caption && <figcaption className="mt-2 text-center text-sm text-muted-foreground">{block.caption}</figcaption>}
      </figure>
    </Section>
  );
}

function Video({ block }: { block: Extract<Block, { __typename: "VideoBlock" }> }) {
  return (
    <Section>
      <video src={block.src} poster={block.poster} controls className="mx-auto w-full max-w-4xl rounded-xl" />
    </Section>
  );
}

function FormBlk({ block }: { block: Extract<Block, { __typename: "FormBlock" }> }) {
  return (
    <Section>
      <form
        action={block.endpoint}
        method="POST"
        className="mx-auto max-w-xl space-y-4 rounded-xl border border-border bg-card p-6"
      >
        {block.title && <h2 className="text-2xl font-semibold">{block.title}</h2>}
        {block.fields.map((f) => (
          <div key={f.name}>
            <label htmlFor={f.name} className="mb-1 block text-sm">{f.label}</label>
            {f.type === "textarea" ? (
              <textarea id={f.name} name={f.name} required={f.required} className="w-full rounded-md border border-border bg-background p-2" rows={4} />
            ) : (
              <input id={f.name} name={f.name} type={f.type} required={f.required} className="w-full rounded-md border border-border bg-background p-2" />
            )}
          </div>
        ))}
        <button type="submit" className="rounded-md bg-brand-gradient px-4 py-2 text-sm font-medium text-brand-foreground">
          {block.submitLabel ?? "Verstuur"}
        </button>
      </form>
    </Section>
  );
}

function CustomHtml({ block }: { block: Extract<Block, { __typename: "CustomHtmlBlock" }> }) {
  const clean = typeof window !== "undefined" ? DOMPurify.sanitize(block.html) : "";
  return <Section><div dangerouslySetInnerHTML={{ __html: clean }} /></Section>;
}

function Team({ block }: { block: Extract<Block, { __typename: "TeamBlock" }> }) {
  return (
    <Section>
      {block.title && <h2 className="text-3xl font-semibold tracking-tight text-center">{block.title}</h2>}
      <div className="mt-10 grid gap-6 md:grid-cols-3 lg:grid-cols-4">
        {block.members.map((m) => (
          <div key={m.name} className="rounded-xl border border-border bg-card p-6 text-center">
            {m.avatar && <img src={m.avatar} alt={m.name} className="mx-auto h-20 w-20 rounded-full object-cover" />}
            <div className="mt-3 font-medium">{m.name}</div>
            <div className="text-sm text-muted-foreground">{m.role}</div>
            {m.bio && <p className="mt-2 text-sm text-muted-foreground">{m.bio}</p>}
          </div>
        ))}
      </div>
    </Section>
  );
}

export function BlockRenderer({ blocks }: { blocks: Block[] }) {
  return (
    <>
      {blocks.map((b) => {
        let node: ReactNode = null;
        switch (b.__typename) {
          case "HeroBlock": node = <Hero block={b} />; break;
          case "RichTextBlock": node = <RichText block={b} />; break;
          case "FeaturesBlock": node = <Features block={b} />; break;
          case "CtaBlock": node = <Cta block={b} />; break;
          case "TestimonialsBlock": node = <Testimonials block={b} />; break;
          case "FaqBlock": node = <Faq block={b} />; break;
          case "StatsBlock": node = <Stats block={b} />; break;
          case "PricingBlock": node = <Pricing block={b} />; break;
          case "LogosBlock": node = <Logos block={b} />; break;
          case "GalleryBlock": node = <Gallery block={b} />; break;
          case "ImageBlock": node = <Image block={b} />; break;
          case "VideoBlock": node = <Video block={b} />; break;
          case "FormBlock": node = <FormBlk block={b} />; break;
          case "CustomHtmlBlock": node = <CustomHtml block={b} />; break;
          case "TeamBlock": node = <Team block={b} />; break;
          default: {
            const unknown = b as { __typename?: string; id?: string };
            console.warn(`[BlockRenderer] unknown block type "${unknown.__typename}"`, b);
            return null;
          }
        }
        return (
          <BlockErrorBoundary key={b.id} name={b.__typename}>
            {node}
          </BlockErrorBoundary>
        );
      })}
    </>
  );
}