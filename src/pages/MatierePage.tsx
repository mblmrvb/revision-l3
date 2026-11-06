import { Link, useParams } from "react-router-dom";
import { annales, chapitresDe, exercices, flashcards, frequenceNotions, matiere, qcms, chapitre } from "../lib/content";
import { useProgress } from "../lib/store";
import { isDue } from "../lib/sm2";
import { prochainExamen, statsMatiere } from "../lib/stats";

export function MatierePage() {
  const { m = "" } = useParams();
  const mat = matiere(m);
  const p = useProgress();
  if (!mat) return <p>Matière inconnue.</p>;
  const st = statsMatiere(p, m);
  const ex = prochainExamen(p, m);
  const dues = flashcards.filter((c) => c.matiere === m && isDue(p.cards[c.id])).length;
  const freq = frequenceNotions(m);

  return (
    <div className="stack">
      <div className="card" style={{ borderTop: `4px solid ${mat.couleur}` }}>
        <h1>
          {mat.emoji} {mat.nom}
        </h1>
        {ex && <p className="countdown">⏳ {ex.nom} : J-{ex.jours} (durée {ex.dureeMin} min)</p>}
        <div className="row gap wrap">
          <Link className="btn btn-primary" to={`/qcm/${m}`}>
            ✅ QCM ({qcms.filter((q) => q.matiere === m).length})
          </Link>
          <Link className="btn btn-primary" to={`/flashcards/${m}`}>
            🃏 Flashcards ({dues} à revoir)
          </Link>
          <Link className="btn btn-ghost" to={`/annales?matiere=${m}`}>
            📝 Annales ({annales.filter((a) => a.matiere === m).length})
          </Link>
        </div>
      </div>

      <h2>Chapitres</h2>
      {chapitresDe(m).map((c) => {
        const s = st.chapitres.find((x) => x.chapitre === c.id)!;
        const exos = exercices.filter((e) => e.chapitre === c.id);
        return (
          <div key={c.id} className="card">
            <Link to={`/m/${m}/c/${c.id}`} className="chap-title">
              {s.vu ? "✔️" : "○"} {c.titre}
            </Link>
            {c.seances && <div className="muted small">{c.seances}</div>}
            <div className="muted small">
              {s.reussite === null ? "Pas encore d'exercice fait" : `Réussite : ${Math.round(s.reussite * 100)} % (${s.tentatives} réponses)`}
            </div>
            {exos.length > 0 && (
              <ul className="exo-list">
                {exos.map((e) => {
                  const done = e.etapes.filter((et) => p.steps[`${e.id}/${et.id}`]?.ok).length;
                  return (
                    <li key={e.id}>
                      <Link to={`/exo/${e.id}`}>✏️ {e.titre}</Link> <span className="muted small">{done}/{e.etapes.length}</span>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        );
      })}

      {freq.length > 0 && (
        <div className="card">
          <h3>Notions les plus fréquentes en annales</h3>
          {freq.map((f) => (
            <div key={f.chapitre} className="freq-row">
              <span>{chapitre(f.chapitre)?.titre ?? f.chapitre}</span>
              <div className="bar small-bar">
                <div style={{ width: `${(f.n / freq[0].n) * 100}%`, background: mat.couleur }} />
              </div>
              <span className="muted small">{f.n}×</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
