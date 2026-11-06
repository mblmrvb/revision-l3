import { useMemo, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { chapitresDe, matiere, qcms } from "../lib/content";
import { useProgress } from "../lib/store";
import { QcmCard } from "../components/QcmCard";

export function QcmPage() {
  const { m = "" } = useParams();
  const [sp, setSp] = useSearchParams();
  const chap = sp.get("chapitre") ?? "";
  const mat = matiere(m);
  const p = useProgress();
  const [i, setI] = useState(0);
  const [seed] = useState(() => Math.random());

  // Ordre : jamais vues et ratées d'abord, puis le reste (mélangé).
  const liste = useMemo(() => {
    const base = qcms.filter((q) => q.matiere === m && (!chap || q.chapitre === chap));
    const rank = (id: string) => {
      const s = p.qcm[id];
      return !s ? 0 : !s.last ? 1 : 2;
    };
    return base
      .map((q, k) => ({ q, r: rank(q.id), h: Math.sin(k * 9301 + seed * 49297) }))
      .sort((a, b) => a.r - b.r || a.h - b.h)
      .map((x) => x.q);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [m, chap, seed]);

  if (!mat) return <p>Matière inconnue.</p>;
  const q = liste[i];
  return (
    <div className="stack">
      <Link to={`/m/${m}`} className="muted small">
        ← {mat.nom}
      </Link>
      <h1>QCM</h1>
      <select value={chap} onChange={(e) => { setI(0); setSp(e.target.value ? { chapitre: e.target.value } : {}); }}>
        <option value="">Tous les chapitres</option>
        {chapitresDe(m).map((c) => (
          <option key={c.id} value={c.id}>
            {c.titre}
          </option>
        ))}
      </select>
      {q ? (
        <>
          <div className="muted small">
            Question {i + 1} / {liste.length}
          </div>
          <QcmCard key={q.id + i} q={q} onNext={i + 1 < liste.length ? () => setI(i + 1) : undefined} />
          {i + 1 >= liste.length && <p className="muted">Fin de la série. <button className="btn btn-ghost btn-sm" onClick={() => setI(0)}>Recommencer</button></p>}
        </>
      ) : (
        <p>Aucune question pour ce filtre.</p>
      )}
    </div>
  );
}
