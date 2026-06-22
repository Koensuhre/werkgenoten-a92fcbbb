import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@/hooks/use-session";

export const Route = createFileRoute("/_authenticated/dashboard/berichten")({
  component: Berichten,
});

function Berichten() {
  const { user } = useSession();
  const { data: messages = [], isLoading } = useQuery({
    queryKey: ["my-messages", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("messages")
        .select("id, body, created_at, read_at, sender_id, recipient_id, job_id")
        .or(`sender_id.eq.${user!.id},recipient_id.eq.${user!.id}`)
        .order("created_at", { ascending: false })
        .limit(50);
      if (error) throw error;
      return data;
    },
  });

  return (
    <div>
      <h1 className="text-2xl font-semibold">Berichten</h1>
      <p className="text-sm text-muted-foreground">Je inbox met opdrachtgevers en vakmensen.</p>
      {isLoading && <div className="mt-6 text-sm text-muted-foreground">Laden…</div>}
      {!isLoading && messages.length === 0 && (
        <div className="mt-6 rounded-xl border border-dashed border-border/60 p-8 text-center text-sm text-muted-foreground">
          Nog geen berichten. Zodra je iemand aanschrijft of antwoord krijgt, verschijnt het hier.
        </div>
      )}
      <div className="mt-6 space-y-2">
        {messages.map((m) => {
          const incoming = m.recipient_id === user?.id;
          return (
            <div key={m.id} className="bg-card-gradient shadow-card rounded-xl border border-border/60 p-4">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{incoming ? "Ontvangen" : "Verzonden"}</span>
                <span>{new Date(m.created_at).toLocaleString("nl-NL")}</span>
              </div>
              <p className="mt-2 text-sm">{m.body}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}