import { useState } from "react";
import { construirePrompt, demanderAClaude, type ContexteQuestion } from "../lib/claude";

const RAPIDES = [
  "Je ne comprends pas, explique-moi autrement.",
  "Donne-moi seulement un indice.",
  "Pourquoi ma réponse est fausse ?",
  "Montre-moi un exemple concret en finance.",
];

export function AskClaude({ ctx, compact }: { ctx: ContexteQuestion; compact?: boolean }) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [msg, setMsg] = useState("");

  async function go(question: string) {
    if (!question.trim()) return;
    const r = await demanderAClaude(construirePrompt(ctx, question.trim()));
    setMsg(r === "copie" ? "Question copiée : colle-la (Ctrl+V / appui long) dans claude.ai qui vient de s'ouvrir." : "claude.ai s'ouvre avec ta question déjà écrite.");
  }

  if (!open)
    return (
      <button className={`btn btn-ghost ask ${compact ? "btn-sm" : ""}`} onClick={() => setOpen(true)}>
        💬 Demander à Claude
      </button>
    );
  return (
    <div className="ask-box">
      <div className="ask-head">
        <strong>💬 Demander à Claude</strong>
        <button className="btn-x" onClick={() => setOpen(false)} aria-label="Fermer">
          ×
        </button>
      </div>
      <div className="chips">
        {RAPIDES.map((r) => (
          <button key={r} className="chip" onClick={() => go(r)}>
            {r}
          </button>
        ))}
      </div>
      <textarea value={q} onChange={(e) => setQ(e.target.value)} placeholder="Ou écris ta question…" rows={3} />
      <button className="btn btn-primary" onClick={() => go(q)} disabled={!q.trim()}>
        Ouvrir dans claude.ai
      </button>
      {msg && <p className="muted small">{msg}</p>}
      <p className="muted small">Le contexte (énoncé, ta réponse, source) est ajouté automatiquement. Utilise ton compte Claude habituel, sans frais.</p>
    </div>
  );
}
