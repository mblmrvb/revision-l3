// Exercice guidé : l'étudiante répond étape par étape, avec indices progressifs
// (indice 1 → indice 2 → réexplication) avant de pouvoir afficher la correction.
import { useState } from "react";
import type { Etape } from "../lib/types";
import { gainXp, logErreur, today, update, useProgress } from "../lib/store";
import { parseNombre, proche } from "../lib/numeric";
import { Md } from "./Md";
import { AskClaude } from "./AskClaude";
import type { ContexteQuestion } from "../lib/claude";

export type Resultat = "ok" | "partiel" | "ko";

interface Props {
  cle: string; // préfixe de stockage, ex. "micro-ex-s2"
  etapes: Etape[];
  matiere: string;
  chapitre?: string;
  ctx: Omit<ContexteQuestion, "type">;
  onFini?: (res: Record<string, Resultat>) => void;
}

export function StepRunner({ cle, etapes, matiere, chapitre, ctx, onFini }: Props) {
  const [idx, setIdx] = useState(0);
  const [res, setRes] = useState<Record<string, Resultat>>({});
  const fini = idx >= etapes.length;

  function next(id: string, r: Resultat) {
    const nres = { ...res, [id]: r };
    setRes(nres);
    if (idx + 1 >= etapes.length) onFini?.(nres);
    setIdx((i) => i + 1);
  }

  return (
    <div className="steps">
      {etapes.slice(0, idx + 1).map((et, i) =>
        i < idx ? (
          <EtapeResolue key={et.id} n={i + 1} et={et} r={res[et.id]} />
        ) : (
          !fini && <EtapeActive key={et.id} n={i + 1} total={etapes.length} et={et} cle={`${cle}/${et.id}`} matiere={matiere} chapitre={chapitre} ctx={ctx} onDone={(r) => next(et.id, r)} />
        ),
      )}
      {fini && (
        <div className="card fini">
          <h3>🎉 Exercice terminé</h3>
          <p>
            {Object.values(res).filter((r) => r === "ok").length} / {etapes.length} étapes réussies.
          </p>
          <button className="btn btn-ghost" onClick={() => { setIdx(0); setRes({}); }}>
            Recommencer
          </button>
        </div>
      )}
    </div>
  );
}

function EtapeResolue({ n, et, r }: { n: number; et: Etape; r: Resultat }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`card step done-${r}`}>
      <button className="step-head" onClick={() => setOpen(!open)}>
        <span>{r === "ok" ? "✅" : r === "partiel" ? "🟡" : "❌"} Étape {n}</span>
        <span className="muted small">{open ? "masquer" : "revoir"}</span>
      </button>
      {open && (
        <>
          <Md text={et.consigne} />
          <div className="callout callout-correction">
            <div className="callout-title">Correction</div>
            <Md text={et.correction} />
          </div>
        </>
      )}
    </div>
  );
}

function EtapeActive({ n, total, et, cle, matiere, chapitre, ctx, onDone }: { n: number; total: number; et: Etape; cle: string; matiere: string; chapitre?: string; ctx: Omit<ContexteQuestion, "type">; onDone: (r: Resultat) => void }) {
  const p = useProgress();
  const [val, setVal] = useState("");
  const [choix, setChoix] = useState<number | null>(null);
  const [tries, setTries] = useState(0);
  const [hints, setHints] = useState(0); // 0..3 (3 = réexplication)
  const [msg, setMsg] = useState<string>("");
  const [corr, setCorr] = useState(false);
  const [okFinal, setOkFinal] = useState<boolean | null>(null);
  const aides = [...et.indices, et.reexplication].filter(Boolean);
  const peutVoirCorrection = tries > 0 || hints >= aides.length;

  function enregistrer(r: Resultat) {
    update((pp) => {
      pp.steps[cle] = { ok: r === "ok", hints, tries: tries + 1, date: today() };
      gainXp(pp, r === "ok" ? Math.max(5, 20 - hints * 5) : r === "partiel" ? 5 : 1);
      if (r !== "ok" && (et.type === "auto" || tries === 0))
        logErreur(pp, { matiere, chapitre: et.notion ?? chapitre, ref: cle, texte: `${et.consigne.replace(/\s+/g, " ").slice(0, 140)}${val ? ` — ma réponse : ${val.slice(0, 80)}` : " — correction consultée sans réponse"}` });
    });
  }

  function verifier() {
    if (et.type === "nombre") {
      const v = parseNombre(val);
      if (v === null) return setMsg("Je n'arrive pas à lire ce nombre (exemples acceptés : 0,25 · 1/4 · -19/20 · 10 %).");
      const ok = proche(v, et.reponse!, et.tolerance ?? p.reglages.tolerance);
      setTries((t) => t + 1);
      if (ok) {
        setOkFinal(true);
        setCorr(true);
        enregistrer("ok");
      } else {
        setMsg(tries === 0 ? "Pas encore. Relis la consigne ou prends un indice." : "Toujours pas : un indice t'aiderait peut-être ?");
        logOnce();
      }
    } else if (et.type === "choix") {
      if (choix === null) return;
      setTries((t) => t + 1);
      if (choix === et.bonne) {
        setOkFinal(true);
        setCorr(true);
        enregistrer("ok");
      } else {
        setMsg("Ce n'est pas ce choix. Tu peux réessayer ou demander un indice.");
        logOnce();
      }
    } else {
      setTries((t) => t + 1);
      setCorr(true);
    }
  }

  // Une erreur est consignée dans le journal à la première mauvaise tentative de l'étape.
  function logOnce() {
    if (tries > 0) return;
    update((pp) =>
      logErreur(pp, { matiere, chapitre: et.notion ?? chapitre, ref: cle, texte: `${et.consigne.replace(/\s+/g, " ").slice(0, 140)} — ma réponse : ${(et.type === "choix" && choix !== null ? et.choix?.[choix] : val)?.slice(0, 80)}` }),
    );
  }

  function abandon() {
    setCorr(true);
    setOkFinal(false);
    enregistrer("ko");
  }

  return (
    <div className="card step active">
      <div className="muted small">
        Étape {n} / {total}
        {et.points ? ` · ${et.points} pt` : ""}
      </div>
      <Md text={et.consigne} />

      {!corr && (
        <>
          {et.type === "nombre" && (
            <div className="answer-row">
              <input inputMode="decimal" value={val} onChange={(e) => setVal(e.target.value)} onKeyDown={(e) => e.key === "Enter" && verifier()} placeholder="Ta réponse" />
              {et.unite && <span className="muted">{et.unite}</span>}
            </div>
          )}
          {et.type === "choix" && (
            <ul className="choices">
              {et.choix!.map((c, i) => (
                <li key={i} className={`choice ${choix === i ? "sel" : ""}`}>
                  <button className="choice-main" onClick={() => setChoix(i)}>
                    <span className="letter">{String.fromCharCode(65 + i)}</span>
                    <Md text={c} inline />
                  </button>
                </li>
              ))}
            </ul>
          )}
          {et.type === "auto" && <textarea rows={4} value={val} onChange={(e) => setVal(e.target.value)} placeholder="Rédige ta réponse (formules en texte, ex. TMS = 1/(1+r)) puis compare avec la correction." />}
          {msg && <p className="warn">{msg}</p>}
          {aides.slice(0, hints).map((h, i) => (
            <div key={i} className="callout callout-methode">
              <div className="callout-title">{i < et.indices.length ? `Indice ${i + 1}` : "Réexplication"}</div>
              <Md text={h} />
            </div>
          ))}
          <div className="row gap wrap">
            <button className="btn btn-primary" onClick={verifier} disabled={et.type === "choix" ? choix === null : et.type === "nombre" ? !val.trim() : !val.trim() && hints < aides.length}>
              {et.type === "auto" ? "Comparer avec la correction" : "Vérifier"}
            </button>
            {hints < aides.length && (
              <button className="btn btn-ghost" onClick={() => setHints((h) => h + 1)}>
                💡 {hints < et.indices.length ? `Indice ${hints + 1}` : "Réexplique-moi"}
              </button>
            )}
            {peutVoirCorrection && et.type !== "auto" && (
              <button className="btn btn-ghost" onClick={abandon}>
                Voir la correction
              </button>
            )}
          </div>
        </>
      )}

      {corr && (
        <>
          {okFinal === true && <p className="ok-text">✅ Juste !</p>}
          <div className="callout callout-correction">
            <div className="callout-title">Correction</div>
            <Md text={et.correction} />
          </div>
          {et.type === "auto" && okFinal === null ? (
            <div>
              <p className="small">Compare honnêtement avec ta réponse :</p>
              <div className="row gap wrap">
                <button className="btn btn-ok" onClick={() => { enregistrer("ok"); onDone("ok"); }}>✅ J'avais juste</button>
                <button className="btn btn-mid" onClick={() => { enregistrer("partiel"); onDone("partiel"); }}>🟡 En partie</button>
                <button className="btn btn-ko" onClick={() => { enregistrer("ko"); onDone("ko"); }}>❌ Faux</button>
              </div>
            </div>
          ) : (
            <button className="btn btn-primary" onClick={() => onDone(okFinal ? "ok" : "ko")}>
              Étape suivante →
            </button>
          )}
          <AskClaude compact ctx={{ ...ctx, type: "exercice guidé", enonce: `${ctx.enonce ?? ""}\nÉtape : ${et.consigne}`, maReponse: val || (choix !== null ? et.choix?.[choix] : undefined), correction: et.correction }} />
        </>
      )}
      {!corr && <AskClaude compact ctx={{ ...ctx, type: "exercice guidé (sans la correction)", enonce: `${ctx.enonce ?? ""}\nÉtape : ${et.consigne}`, maReponse: val || undefined }} />}
    </div>
  );
}
