import { useState } from "react";
import { Link } from "react-router-dom";
import { chapitre, matieres } from "../lib/content";
import { BADGES, useProgress } from "../lib/store";
import { statsMatiere } from "../lib/stats";
import { Md } from "../components/Md";

export function ProgressionPage() {
  const p = useProgress();
  const [filtre, setFiltre] = useState("");
  const jours = Object.entries(p.days).sort().slice(-14);
  const maxXp = Math.max(1, ...jours.map(([, v]) => v));
  const erreurs = p.erreurs.filter((e) => !filtre || e.matiere === filtre);

  // erreurs récurrentes : regroupées par chapitre
  const recur = new Map<string, number>();
  for (const e of erreurs) if (e.chapitre) recur.set(e.chapitre, (recur.get(e.chapitre) ?? 0) + 1);

  return (
    <div className="stack">
      <h1>Ma progression</h1>
      <div className="card row-between">
        <div>
          <div className="big">⭐ {p.xp} XP</div>
          <div className="muted small">
            🔥 Série : {p.streak.count} jour(s) · record {p.streak.best}
          </div>
        </div>
      </div>

      {jours.length > 0 && (
        <div className="card">
          <h3>XP des 14 derniers jours actifs</h3>
          <div className="spark">
            {jours.map(([d, v]) => (
              <div key={d} title={`${d} : ${v} XP`} style={{ height: `${(v / maxXp) * 100}%` }} />
            ))}
          </div>
        </div>
      )}

      {matieres
        .filter((m) => m.disponible)
        .map((m) => {
          const st = statsMatiere(p, m.id);
          return (
            <div key={m.id} className="card">
              <h3>
                {m.emoji} {m.nom} — {Math.round(st.pctVu * 100)} % du programme travaillé
              </h3>
              {st.chapitres.map((c) => (
                <div key={c.chapitre} className="freq-row">
                  <Link to={`/m/${m.id}/c/${c.chapitre}`}>{chapitre(c.chapitre)?.titre}</Link>
                  <div className="bar small-bar">
                    <div style={{ width: `${(c.reussite ?? 0) * 100}%`, background: c.reussite === null ? "transparent" : c.reussite < 0.6 ? "var(--ko)" : "var(--ok)" }} />
                  </div>
                  <span className="muted small">{c.reussite === null ? "—" : `${Math.round(c.reussite * 100)} %`}</span>
                </div>
              ))}
              {st.faibles.length > 0 && (
                <p className="small">
                  ⚠️ Notions faibles : {st.faibles.map((f) => chapitre(f)?.titre).join(" · ")}
                </p>
              )}
            </div>
          );
        })}

      <div className="card">
        <h3>🏅 Badges</h3>
        <div className="badge-grid">
          {BADGES.map((b) => (
            <div key={b.id} className={`trophy ${p.badges[b.id] ? "on" : ""}`} title={b.desc}>
              <strong>{p.badges[b.id] ? "🏅" : "🔒"} {b.nom}</strong>
              <span className="muted small">{b.desc}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <div className="row-between">
          <h3>📓 Journal de mes erreurs</h3>
          <select value={filtre} onChange={(e) => setFiltre(e.target.value)}>
            <option value="">Toutes matières</option>
            {matieres.map((m) => (
              <option key={m.id} value={m.id}>
                {m.court}
              </option>
            ))}
          </select>
        </div>
        {recur.size > 0 && (
          <p className="small">
            Erreurs récurrentes :{" "}
            {[...recur.entries()]
              .sort((a, b) => b[1] - a[1])
              .map(([c, n]) => `${chapitre(c)?.titre ?? c} (${n})`)
              .join(" · ")}
          </p>
        )}
        {erreurs.length === 0 ? (
          <p className="muted">Aucune erreur enregistrée pour l'instant.</p>
        ) : (
          <ul className="errlist">
            {erreurs.slice(0, 80).map((e, i) => (
              <li key={i}>
                <span className="muted small">
                  {e.date} · {e.chapitre ? chapitre(e.chapitre)?.titre ?? e.chapitre : e.matiere}
                </span>
                <div className="small"><Md text={e.texte} inline /></div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
