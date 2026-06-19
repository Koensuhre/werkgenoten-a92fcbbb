import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/inloggen")({
  head: () => ({
    meta: [
      { title: "Inloggen — Vakwerk" },
      { name: "description", content: "Log in op jouw Vakwerk-account." },
      { property: "og:title", content: "Inloggen — Vakwerk" },
      { property: "og:url", content: "/inloggen" },
    ],
    links: [{ rel: "canonical", href: "/inloggen" }],
  }),
  component: Login,
});

function Login() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-16 sm:px-6">
      <div className="bg-card-gradient shadow-elegant rounded-2xl border border-border/60 p-8">
        <h1 className="text-2xl font-semibold tracking-tight">Welkom terug</h1>
        <p className="mt-1 text-sm text-muted-foreground">Log in op je Vakwerk-account.</p>
        <form className="mt-6 space-y-4">
          <div>
            <label htmlFor="email" className="mb-1.5 block text-sm font-medium">E-mail</label>
            <input id="email" type="email" className="w-full rounded-lg border border-border bg-input/40 px-3 py-2 text-sm focus:border-brand focus:outline-none" />
          </div>
          <div>
            <label htmlFor="pw" className="mb-1.5 block text-sm font-medium">Wachtwoord</label>
            <input id="pw" type="password" className="w-full rounded-lg border border-border bg-input/40 px-3 py-2 text-sm focus:border-brand focus:outline-none" />
          </div>
          <button className="w-full rounded-lg bg-brand-gradient px-4 py-2.5 text-sm font-medium text-brand-foreground shadow-glow">Inloggen</button>
        </form>
        <p className="mt-6 text-center text-sm text-muted-foreground">
          Nog geen account? <Link to="/word-professional" className="text-brand hover:underline">Word professional</Link>
        </p>
      </div>
    </div>
  );
}