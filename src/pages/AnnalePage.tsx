import { useEffect, useMemo, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { annales, chapitre, matiere } from "../lib/content";
import { gainXp, logErreur, today, update, useProgress } from "../lib/store";
import { parseNombre, proche } from "../lib/numeric";
import type { Annale, Etape } from "../lib/types";
import { Md } from "../components/Md";
import { Badge } from "../components/Badge";
import { StepRunner } from "../components/StepRunner";

export function AnnalePage() {
  const { id = "" } = useParams();
  const [sp, setSp] = useSearchParams();
  const mode = sp.get("mode") === "examen" ? "examen" : "guide";
  const a = annales.find((x) => x.id === id);
  if (!a) return <p>Annale introuvable.</p>;
  const mat = matiere(a.matiere)!;

  return (
    <div className="stack">
      <Link to={`/annales?matiere=${a.matiere}`} className="muted small">
        ← Annales {mat.nom}
      </Link>
      <h1>{a.titre}</h1>
      <div className="badges">
        {a.corrige === "officiel" && <Badge kind="officiel" />}
        {a.corrige === "propose" && <Badge kind="propose" />}
        {a.horsProgramme && <Badge kind="hors-programme" />}
      </div>
      <div className="muted small">Sources : {a.sources.join(" ; ")}</div>
      {a.chapitres.length > 0 && (
        <div className="small">
          Chapitres du cours :{" "}
          {a.chapitres.map((c) => (
            <Link key={c} to={`/m/${a.matiere}/c/${c}`} className="chip">
              {chapitre(c)?.titre ?? c}
            </Link>
          ))}
        </div>
      )}
      {a.incertitudes && a.incertitudes.length > 0 && (
        <div className="callout callout-attention">
          <div className="callout-title">Points d'incertitude (transcription / corrigé)</div>
          <ul>
            {a.incertitudes.map((t, i) => (
              <li key={i}>
                <Md text={t} inline />
              </li>
            ))}
          </ul>
        </div>
      )}
      <div className="tabs">
        <button className={`tab ${mode === "guide" ? "on" : ""}`} onClick={() => setSp({ mode: "guide" })}>
          Mode guidé
        </button>
        <button className={`tab ${mode === "examen" ? "on" : ""}`} onClick={() => setSp({ mode: "examen" })}>
          ⏱️ Mode examen ({a.dureeMin} min)
        </button>
      </div>
      {a.statut !== "pret" ? <p>Cette annale n'est pas encore transcrite.</p> : mode === "guide" ? <Guide a={a} /> : <Examen a={a} />}
    </div>
  );
}

function Guide({ a }: { a: Annale }) {
  const mat = matiere(a.matiere)!;
  return (
    <>
      {a.exercices.map((ex, i) => (
        <section key={i} className="stack">
          <h2>
            {ex.titre} {ex.points ? <span className="muted small">({ex.points} pts)</span> : null}
          </h2>
          <div className="card">
            <Md text={ex.enonce} />
          </div>
          <StepRunner cle={`${a.id}/ex${i}`} etapes={ex.etapes} matiere={a.matiere} chapitre={ex.chapitres[0]} ctx={{ matiere: mat.nom, chapitre: chapitre(ex.chapitres[0])?.titre, enonce: `${a.titre} — ${ex.titre}\n${ex.enonce.slice(0, 1500)}`, source: a.sources.join(" ; ") }} />
        </section>
      ))}
    </>
  );
}

type Note = "ok" | "partiel" | "ko";
const KEY = (id: string) => `exam-start-${id}`;

function Examen({ a }: { a: Annale }) {
  const p = useProgress();
  const etapes = useMemo(() => a.exercices.flatMap((ex, i) => ex.etapes.map((et) => ({ et, exo: i, notion: et.notion ?? ex.chapitres[0] }))), [a]);
  const [debut, setDebut] = useState<number | null>(() => {
    try {
      const v = sessionStorage.getItem(KEY(a.id));
      return v ? Number(v) : null;
    } catch {
      return null;
    }
  });
  const [now, setNow] = useState(Date.now());
  const [rep, setRep] = useState<Record<string, string>>({});
  const [rendu, setRendu] = useState(false);
  const [auto, setAuto] = useState<Record<string, Note>>({});
  const [enregistre, setEnregistre] = useState(false);

  useEffect(() => {
    if (!debut || rendu) return;
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, [debut, rendu]);

  const restant = debut ? a.dureeMin * 60 - Math.floor((now - debut) / 1000) : a.dureeMin * 60;
  useEffect(() => {
    if (debut && restant <= 0 && !rendu) setRendu(true);
  }, [restant, debut, rendu]);

  function demarrer() {
    const t = Date.now();
    setDebut(t);
    try {
      sessionStorage.setItem(KEY(a.id), String(t));
    } catch {
      /* ignore */
    }
  }
  function rendre() {
    setRendu(true);
    try {
      sessionStorage.removeItem(KEY(a.id));
    } catch {
      /* ignore */
    }
  }

  const keyOf = (x: { exo: number; et: Etape }) => `${x.exo}/${x.et.id}`;
  function noteAuto(x: { exo: number; et: Etape }): Note | null {
    const r = rep[keyOf(x)] ?? "";
    if (x.et.type === "nombre") {
      const v = parseNombre(r);
      return v !== null && proche(v, x.et.reponse!, x.et.tolerance ?? p.reglages.tolerance) ? "ok" : "ko";
    }
    if (x.et.type === "choix") return r !== "" && Number(r) === x.et.bonne ? "ok" : "ko";
    return auto[keyOf(x)] ?? null;
  }
  const notes = etapes.map((x) => ({ x, n: noteAuto(x) }));
  const enAttente = notes.filter((n) => n.n === null).length;
  const totalPts = etapes.reduce((s, x) => s + (x.et.points ?? 1), 0);
  const obtenu = notes.reduce((s, { x, n }) => s + (x.et.points ?? 1) * (n === "ok" ? 1 : n === "partiel" ? 0.5 : 0), 0);
  const sur20 = totalPts ? (obtenu / totalPts) * 20 : 0;

  function enregistrer() {
    if (enregistre) return;
    setEnregistre(true);
    update((pp) => {
      const prev = pp.annales[a.id];
      pp.annales[a.id] = { tentatives: (prev?.tentatives ?? 0) + 1, meilleure: Math.max(prev?.meilleure ?? 0, sur20), derniere: sur20, date: today() };
      gainXp(pp, Math.round(20 + sur20 * 5));
      for (const { x, n } of notes) if (n !== "ok") logErreur(pp, { matiere: a.matiere, chapitre: x.notion, ref: `${a.id} (examen)`, texte: x.et.consigne.replace(/\s+/g, " ").slice(0, 140) });
    });
  }

  if (!debut)
    return (
      <div className="card">
        <p>
          Conditions réelles : <strong>{a.dureeMin} minutes</strong>, pas d'indice, pas de correction avant la fin. Pour les questions rédigées, écris ta réponse : tu t'auto-évalueras avec le corrigé à la fin.
        </p>
        <button className="btn btn-primary" onClick={demarrer}>
          Lancer le chrono
        </button>
      </div>
    );

  const mm = Math.max(0, Math.floor(restant / 60));
  const ss = Math.max(0, restant % 60);

  if (!rendu)
    return (
      <>
        <div className={`timer ${restant < 600 ? "urgent" : ""}`}>
          ⏱️ {mm}:{String(ss).padStart(2, "0")}
          <button className="btn btn-primary btn-sm" onClick={() => confirm("Rendre ta copie maintenant ?") && rendre()}>
            Rendre ma copie
          </button>
        </div>
        {a.exercices.map((ex, i) => (
          <section key={i} className="stack">
            <h2>
              {ex.titre} {ex.points ? <span className="muted small">({ex.points} pts)</span> : null}
            </h2>
            <div className="card">
              <Md text={ex.enonce} />
            </div>
            {ex.etapes.map((et) => {
              const k = `${i}/${et.id}`;
              return (
                <div key={k} className="card step">
                  <Md text={et.consigne} />
                  {et.type === "nombre" && <input inputMode="decimal" value={rep[k] ?? ""} onChange={(e) => setRep((prev) => ({ ...prev, [k]: e.target.value }))} placeholder="Ta réponse" />}
                  {et.type === "choix" && (
                    <select value={rep[k] ?? ""} onChange={(e) => setRep((prev) => ({ ...prev, [k]: e.target.value }))}>
                      <option value="">— choisir —</option>
                      {et.choix!.map((c, j) => (
                        <option key={j} value={j}>
                          {String.fromCharCode(65 + j)}. {c.replace(/\$/g, "")}
                        </option>
                      ))}
                    </select>
                  )}
                  {et.type === "auto" && <textarea rows={4} value={rep[k] ?? ""} onChange={(e) => setRep((prev) => ({ ...prev, [k]: e.target.value }))} placeholder="Rédige ta réponse" />}
                </div>
              );
            })}
          </section>
        ))}
      </>
    );

  // Correction + bilan
  const parNotion = new Map<string, { ok: number; tot: number }>();
  for (const { x, n } of notes) {
    const s = parNotion.get(x.notion) ?? { ok: 0, tot: 0 };
    s.tot += x.et.points ?? 1;
    s.ok += (x.et.points ?? 1) * (n === "ok" ? 1 : n === "partiel" ? 0.5 : 0);
    parNotion.set(x.notion, s);
  }
  const forts = [...parNotion].filter(([, s]) => s.ok / s.tot >= 0.7);
  const revoir = [...parNotion].filter(([, s]) => s.ok / s.tot < 0.5);

  return (
    <>
      {enAttente > 0 && <div className="callout callout-attention"><div className="callout-title">Auto-évaluation</div>Note les {enAttente} réponse(s) rédigée(s) ci-dessous pour obtenir ta note.</div>}
      {enAttente === 0 && (
        <div className="card bilan">
          <h2>Note estimée : {sur20.toFixed(1)} / 20</h2>
          <p className="muted small">Estimation à partir du barème indicatif ; une réponse « en partie » compte pour moitié.</p>
          <h3>💪 Points forts</h3>
          {forts.length ? forts.map(([c]) => <div key={c}>{chapitre(c)?.titre ?? c}</div>) : <p className="muted">—</p>}
          <h3>🔁 À revoir</h3>
          {revoir.length ? (
            revoir.map(([c]) => (
              <div key={c}>
                <Link to={`/m/${a.matiere}/c/${c}`}>{chapitre(c)?.titre ?? c}</Link> ·{" "}
                <Link to={`/qcm/${a.matiere}?chapitre=${c}`}>QCM</Link>
              </div>
            ))
          ) : (
            <p className="muted">Rien d'alarmant 🎉</p>
          )}
          {!enregistre ? (
            <button className="btn btn-primary" onClick={enregistrer}>
              Enregistrer ce résultat
            </button>
          ) : (
            <p className="ok-text">Résultat enregistré dans ta progression.</p>
          )}
        </div>
      )}
      {notes.map(({ x, n }) => {
        const k = keyOf(x);
        return (
          <div key={k} className={`card step done-${n ?? "wait"}`}>
            <Md text={x.et.consigne} />
            <p className="small">
              <strong>Ta réponse :</strong> {x.et.type === "choix" ? (rep[k] ? x.et.choix![Number(rep[k])] : "—") : rep[k] || "—"}
            </p>
            <div className="callout callout-correction">
              <div className="callout-title">Correction</div>
              <Md text={x.et.correction} />
            </div>
            {x.et.type === "auto" ? (
              <div className="row gap wrap">
                {(["ok", "partiel", "ko"] as Note[]).map((v) => (
                  <button key={v} className={`btn btn-sm ${auto[k] === v ? "btn-primary" : "btn-ghost"}`} onClick={() => setAuto((prev) => ({ ...prev, [k]: v }))}>
                    {v === "ok" ? "✅ Juste" : v === "partiel" ? "🟡 En partie" : "❌ Faux"}
                  </button>
                ))}
              </div>
            ) : (
              <p>{n === "ok" ? "✅ Juste" : "❌ Faux"}</p>
            )}
          </div>
        );
      })}
    </>
  );
}
