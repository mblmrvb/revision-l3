import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { chapitre, exercices, matiere, qcms, annales } from "../lib/content";
import { gainXp, today, update, useProgress } from "../lib/store";
import { Md } from "../components/Md";
import { AskClaude } from "../components/AskClaude";

const TABS = [
  { id: "flash", label: "⚡ Synthèse flash" },
  { id: "cours", label: "📖 Cours" },
  { id: "pieges", label: "⚠️ Pièges" },
  { id: "memo", label: "🧾 Fiche mémo" },
] as const;

export function ChapitrePage() {
  const { m = "", c = "" } = useParams();
  const ch = chapitre(c);
  const mat = matiere(m);
  const p = useProgress();
  const [tab, setTab] = useState<(typeof TABS)[number]["id"]>("flash");

  useEffect(() => {
    if (ch && !p.vus[ch.id]) {
      update((pp) => {
        pp.vus[ch.id] = today();
        gainXp(pp, 15);
      });
    }
  }, [ch?.id]);

  if (!ch || !mat) return <p>Chapitre introuvable.</p>;
  const exos = exercices.filter((e) => e.chapitre === ch.id);
  const nq = qcms.filter((q) => q.chapitre === ch.id).length;
  const ann = annales.filter((a) => a.chapitres.includes(ch.id) && a.statut === "pret");

  return (
    <div className="stack">
      <div className="no-print">
        <Link to={`/m/${m}`} className="muted small">
          ← {mat.nom}
        </Link>
        <h1>{ch.titre}</h1>
        {ch.seances && <p className="muted small">{ch.seances}</p>}
        <div className="tabs">
          {TABS.map((t) => (
            <button key={t.id} className={`tab ${tab === t.id ? "on" : ""}`} onClick={() => setTab(t.id)}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <article className={`card chapter-body ${tab === "memo" ? "memo" : ""}`}>
        {tab === "memo" && (
          <div className="row-between no-print">
            <span className="muted small">Fiche imprimable (A4)</span>
            <button className="btn btn-ghost btn-sm" onClick={() => window.print()}>
              🖨️ Imprimer
            </button>
          </div>
        )}
        {tab === "memo" && <h2 className="print-only">{mat.nom} — {ch.titre}</h2>}
        <Md text={ch.sections[tab] || "_Section à venir._"} />
        <div className="source no-print">📄 Sources : {ch.sources.join(" ; ")}</div>
      </article>

      <div className="card no-print">
        <h3>S'entraîner sur ce chapitre</h3>
        <div className="row gap wrap">
          {nq > 0 && (
            <Link className="btn btn-primary" to={`/qcm/${m}?chapitre=${ch.id}`}>
              ✅ {nq} QCM
            </Link>
          )}
          <Link className="btn btn-ghost" to={`/flashcards/${m}?chapitre=${ch.id}`}>
            🃏 Flashcards
          </Link>
        </div>
        {exos.length > 0 && (
          <ul className="exo-list">
            {exos.map((e) => (
              <li key={e.id}>
                <Link to={`/exo/${e.id}`}>✏️ {e.titre}</Link>
              </li>
            ))}
          </ul>
        )}
        {ann.length > 0 && (
          <>
            <h4>Tombé en annales</h4>
            <ul className="exo-list">
              {ann.map((a) => (
                <li key={a.id}>
                  <Link to={`/annale/${a.id}`}>📝 {a.titre}</Link>
                </li>
              ))}
            </ul>
          </>
        )}
        <AskClaude ctx={{ matiere: mat.nom, chapitre: ch.titre, type: "notion de cours", enonce: ch.sections.flash.slice(0, 1500), source: ch.sources.join(" ; ") }} />
      </div>
    </div>
  );
}
