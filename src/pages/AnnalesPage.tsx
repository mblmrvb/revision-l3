import { Link, useSearchParams } from "react-router-dom";
import { annales, chapitre, frequenceNotions, matiere, matieres } from "../lib/content";
import { useProgress } from "../lib/store";
import { Badge } from "../components/Badge";

export function AnnalesPage() {
  const [sp, setSp] = useSearchParams();
  const p = useProgress();
  const f = {
    matiere: sp.get("matiere") ?? "",
    annee: sp.get("annee") ?? "",
    type: sp.get("type") ?? "",
    corrige: sp.get("corrige") ?? "",
  };
  const set = (k: string, v: string) => {
    const n = new URLSearchParams(sp);
    v ? n.set(k, v) : n.delete(k);
    setSp(n);
  };
  const liste = annales.filter(
    (a) =>
      (!f.matiere || a.matiere === f.matiere) &&
      (!f.annee || a.annee === f.annee) &&
      (!f.type || a.type === f.type) &&
      (!f.corrige || (f.corrige === "avec" ? a.corrige !== "aucun" : a.corrige === "aucun")),
  );
  const annees = [...new Set(annales.filter((a) => !f.matiere || a.matiere === f.matiere).map((a) => a.annee))].sort().reverse();
  const types = [...new Set(annales.map((a) => a.type))];

  return (
    <div className="stack">
      <h1>Banque d'annales</h1>
      <div className="filters">
        <select value={f.matiere} onChange={(e) => set("matiere", e.target.value)}>
          <option value="">Toutes les matières</option>
          {matieres.map((m) => (
            <option key={m.id} value={m.id}>
              {m.nom}
            </option>
          ))}
        </select>
        <select value={f.annee} onChange={(e) => set("annee", e.target.value)}>
          <option value="">Toutes les années</option>
          {annees.map((a) => (
            <option key={a}>{a}</option>
          ))}
        </select>
        <select value={f.type} onChange={(e) => set("type", e.target.value)}>
          <option value="">Tous les types</option>
          {types.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>
        <select value={f.corrige} onChange={(e) => set("corrige", e.target.value)}>
          <option value="">Avec ou sans corrigé</option>
          <option value="avec">Avec corrigé</option>
          <option value="sans">Sans corrigé</option>
        </select>
      </div>

      {liste.map((a) => {
        const res = p.annales[a.id];
        const pret = a.statut === "pret";
        return (
          <div key={a.id} className={`card annale ${pret ? "" : "disabled"}`}>
            <div className="row-between">
              <strong>
                {matiere(a.matiere)?.emoji} {a.titre}
              </strong>
              <span className="muted small">{a.dureeMin} min</span>
            </div>
            <div className="badges">
              {a.corrige === "officiel" && <Badge kind="officiel" />}
              {a.corrige === "propose" && <Badge kind="propose" />}
              {a.corrige === "aucun" && <span className="badge">sans corrigé</span>}
              {a.horsProgramme && <Badge kind="hors-programme" />}
              {!pret && <span className="badge">à traiter</span>}
            </div>
            {a.chapitres.length > 0 && <div className="muted small">Chapitres : {a.chapitres.map((c) => chapitre(c)?.titre ?? c).join(" · ")}</div>}
            {res && <div className="small">Dernière note : {res.derniere.toFixed(1)}/20 · meilleure : {res.meilleure.toFixed(1)}/20</div>}
            {pret ? (
              <div className="row gap wrap">
                <Link className="btn btn-primary btn-sm" to={`/annale/${a.id}?mode=guide`}>
                  Mode guidé
                </Link>
                <Link className="btn btn-ghost btn-sm" to={`/annale/${a.id}?mode=examen`}>
                  ⏱️ Mode examen
                </Link>
              </div>
            ) : (
              <p className="muted small">Repérée dans le Drive, pas encore transcrite. Fichiers : {a.sources.join(" ; ")}</p>
            )}
          </div>
        );
      })}
      {liste.length === 0 && <p>Aucune annale pour ces filtres.</p>}

      <h2>Notions les plus tombées</h2>
      {matieres
        .filter((m) => !f.matiere || m.id === f.matiere)
        .map((m) => {
          const fr = frequenceNotions(m.id);
          if (!fr.length) return null;
          return (
            <div key={m.id} className="card">
              <h3>
                {m.emoji} {m.nom}
              </h3>
              {fr.map((x) => (
                <div key={x.chapitre} className="freq-row">
                  <Link to={`/m/${m.id}/c/${x.chapitre}`}>{chapitre(x.chapitre)?.titre ?? x.chapitre}</Link>
                  <div className="bar small-bar">
                    <div style={{ width: `${(x.n / fr[0].n) * 100}%`, background: m.couleur }} />
                  </div>
                  <span className="muted small">{x.n}×</span>
                </div>
              ))}
            </div>
          );
        })}
    </div>
  );
}
