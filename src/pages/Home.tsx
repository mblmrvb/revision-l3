import { Link } from "react-router-dom";
import { matieres } from "../lib/content";
import { useProgress } from "../lib/store";
import { prochainExamen, revisionDuJour, statsMatiere } from "../lib/stats";

export function Home() {
  const p = useProgress();
  const taches = revisionDuJour(p);
  return (
    <div className="stack">
      <section className="card hero">
        <h1>Révision du jour</h1>
        <p className="muted small">Sélection automatique : examens proches, tes points faibles et les notions fréquentes en annales.</p>
        {taches.length === 0 ? (
          <p>Tout est à jour 🎉 Reviens demain pour tes flashcards.</p>
        ) : (
          <ol className="tasks">
            {taches.map((t, i) => (
              <li key={i}>
                <Link to={t.lien} className="task">
                  <strong>{t.titre}</strong>
                  <span className="muted small">{t.detail}</span>
                </Link>
              </li>
            ))}
          </ol>
        )}
      </section>

      <h2>Mes matières</h2>
      <div className="grid">
        {matieres.map((m) => {
          const st = statsMatiere(p, m.id);
          const ex = prochainExamen(p, m.id);
          const inner = (
            <>
              <div className="mat-head">
                <span className="mat-emoji">{m.emoji}</span>
                <strong>{m.nom}</strong>
              </div>
              {m.disponible ? (
                <>
                  <div className="bar">
                    <div style={{ width: `${Math.round(st.pctVu * 100)}%`, background: m.couleur }} />
                  </div>
                  <span className="muted small">{Math.round(st.pctVu * 100)} % du programme travaillé</span>
                </>
              ) : (
                <span className="muted small">Contenu en préparation</span>
              )}
              {ex && (
                <span className="countdown">
                  ⏳ {ex.nom} : {ex.jours === 0 ? "aujourd'hui !" : `J-${ex.jours}`}
                </span>
              )}
            </>
          );
          return m.disponible ? (
            <Link key={m.id} to={`/m/${m.id}`} className="card mat" style={{ borderTopColor: m.couleur }}>
              {inner}
            </Link>
          ) : (
            <div key={m.id} className="card mat disabled" style={{ borderTopColor: m.couleur }}>
              {inner}
            </div>
          );
        })}
      </div>
    </div>
  );
}
