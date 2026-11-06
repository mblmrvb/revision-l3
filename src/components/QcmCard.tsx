import { useState } from "react";
import type { Qcm } from "../lib/types";
import { gainXp, logErreur, update } from "../lib/store";
import { today } from "../lib/store";
import { Md } from "./Md";
import { Badge, Source } from "./Badge";
import { AskClaude } from "./AskClaude";
import { matiere, chapitre } from "../lib/content";

export function QcmCard({ q, onNext }: { q: Qcm & { matiere: string }; onNext?: () => void }) {
  const [sel, setSel] = useState<number[]>([]);
  const [barres, setBarres] = useState<number[]>([]);
  const [hint, setHint] = useState(false);
  const [done, setDone] = useState(false);
  const multi = q.bonnes.length > 1;
  const correct = done && sel.length === q.bonnes.length && sel.every((s) => q.bonnes.includes(s));

  function toggle(i: number) {
    if (done) return;
    setSel((s) => (multi ? (s.includes(i) ? s.filter((x) => x !== i) : [...s, i]) : [i]));
  }
  function barrer(i: number) {
    if (done) return;
    setBarres((b) => (b.includes(i) ? b.filter((x) => x !== i) : [...b, i]));
    setSel((s) => s.filter((x) => x !== i));
  }
  function valider() {
    const ok = sel.length === q.bonnes.length && sel.every((s) => q.bonnes.includes(s));
    setDone(true);
    update((p) => {
      const s = p.qcm[q.id] ?? { ok: 0, ko: 0, last: false, date: today() };
      ok ? s.ok++ : s.ko++;
      s.last = ok;
      s.date = today();
      p.qcm[q.id] = s;
      gainXp(p, ok ? (hint ? 6 : 10) : 2);
      if (!ok)
        logErreur(p, {
          matiere: q.matiere,
          chapitre: q.chapitre,
          ref: `QCM ${q.id}`,
          texte: `${q.question.slice(0, 120)} — choisi : ${sel.map((i) => q.choix[i]).join(" ; ").slice(0, 120)}`,
        });
    });
  }

  return (
    <div className="card qcm">
      <div className="row-between">
        <span className="muted small">{multi ? "Plusieurs réponses possibles" : "Une seule réponse"}</span>
        {q.badge && <Badge kind={q.badge} />}
      </div>
      <div className="question">
        <Md text={q.question} />
      </div>
      <ul className="choices">
        {q.choix.map((c, i) => {
          const state = done ? (q.bonnes.includes(i) ? "good" : sel.includes(i) ? "bad" : "") : sel.includes(i) ? "sel" : "";
          return (
            <li key={i} className={`choice ${state} ${barres.includes(i) && !done ? "barre" : ""}`}>
              <button className="choice-main" onClick={() => toggle(i)} disabled={barres.includes(i) && !done}>
                <span className="letter">{String.fromCharCode(65 + i)}</span>
                <Md text={c} inline />
              </button>
              {!done && (
                <button className="choice-strike" onClick={() => barrer(i)} title="Barrer (élimination)" aria-label="Barrer cette réponse">
                  {barres.includes(i) ? "↺" : "✕"}
                </button>
              )}
            </li>
          );
        })}
      </ul>
      {!done && q.indice && !hint && (
        <button className="btn btn-ghost btn-sm" onClick={() => setHint(true)}>
          💡 Indice
        </button>
      )}
      {hint && !done && (
        <div className="callout callout-methode">
          <div className="callout-title">Indice</div>
          <Md text={q.indice!} />
        </div>
      )}
      {!done ? (
        <button className="btn btn-primary" disabled={sel.length === 0} onClick={valider}>
          Valider
        </button>
      ) : (
        <div className={`feedback ${correct ? "ok" : "ko"}`}>
          <strong>{correct ? "✅ Bonne réponse !" : "❌ Pas tout à fait."}</strong>
          <Md text={q.explication} />
          <Source text={q.source} />
          <div className="row gap">
            {onNext && (
              <button className="btn btn-primary" onClick={onNext}>
                Question suivante →
              </button>
            )}
            <AskClaude
              compact
              ctx={{
                matiere: matiere(q.matiere)?.nom ?? q.matiere,
                chapitre: chapitre(q.chapitre)?.titre,
                type: "QCM",
                enonce: `${q.question}\nChoix : ${q.choix.map((c, i) => `${String.fromCharCode(65 + i)}) ${c}`).join(" | ")}`,
                maReponse: sel.map((i) => String.fromCharCode(65 + i)).join(", "),
                correction: `Bonne(s) réponse(s) : ${q.bonnes.map((i) => String.fromCharCode(65 + i)).join(", ")}. ${q.explication}`,
                source: q.source,
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
