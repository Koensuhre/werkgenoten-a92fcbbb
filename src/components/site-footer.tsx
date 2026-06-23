import { Link } from "@tanstack/react-router";

export function SiteFooter() {
  return (
    <footer className="mt-32 border-t border-border/60">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="grid gap-12 md:grid-cols-5">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 font-semibold">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand-gradient text-brand-foreground">W</span>
              Werkgenoten
            </div>
            <p className="mt-4 max-w-sm text-sm text-muted-foreground">
              Het premium marktplatform voor opdrachtgevers en gecontroleerde vakmensen in Nederland.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-medium">Platform</h4>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              <li><Link to="/opdrachten" className="hover:text-foreground">Opdrachten</Link></li>
              <li><Link to="/vakmensen" className="hover:text-foreground">Vakmensen</Link></li>
              <li><Link to="/prijzen" className="hover:text-foreground">Prijzen</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-medium">Bedrijf</h4>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              <li><Link to="/hoe-werkt-het" className="hover:text-foreground">Hoe het werkt</Link></li>
              <li><Link to="/word-professional" className="hover:text-foreground">Word professional</Link></li>
              <li><a className="hover:text-foreground" href="#">Over ons</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-medium">Support</h4>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              <li><a className="hover:text-foreground" href="#">Helpcentrum</a></li>
              <li><a className="hover:text-foreground" href="#">Contact</a></li>
              <li><a className="hover:text-foreground" href="#">Privacy</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 flex flex-col items-start justify-between gap-3 border-t border-border/60 pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center">
          <p>© {new Date().getFullYear()} Werkgenoten B.V. Alle rechten voorbehouden.</p>
          <p>Gemaakt in Amsterdam · KvK 00000000</p>
        </div>
      </div>
    </footer>
  );
}