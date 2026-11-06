import { useMemo, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { chapitre, flashcards, matiere } from "../lib/content";
import { gainXp, getProgress, logErreur, update, useProgress } from "../lib/store";
import { isDue, review, type Qualite } from "../lib/sm2";
import { Md } from "../components/Md";
import { Source } from "../components/Badge";

export function FlashcardsPage() {
  const { m = "" } = useParams();
  const [sp] = useSearchParams();
  const chap = sp.get("chapitre") ?? "";
  const mat = matiere(m);
  const p = useProgress();
  const [flip, setFlip] = useState(false);
  const [tout, setTout] = useState(false);

  // File de révision calculée au chargement : cartes dues + 10 nouvelles max.
  const [file, setFile] = useState<string[]>(() => {
    const prog = getProgress();
    const base = flashcards.filter((c) => c.matiere === m && (!chap || c.chapitre === chap));
    const dues = base.filter((c) => prog.cards[c.id] && isDue(prog.cards[c.id])).map((c) => c.id);
    const nouvelles = base.filter((c) => !prog.cards[c.id]).slice(0, 10).map((c) => c.id);
    return [...dues, ...nouvelles];
  });
  const total = useMemo(() => flashcards.filter((c) => c.matiere === m && (!chap || c.chapitre === chap)).length, [m, chap]);

  if (!mat) return <p>Matière inconnue.</p>;
  const carte = flashcards.find((c) => c.id === file[0]);

  function noter(q: Qualite) {
    if (!carte) return;
    update((pp) => {
      pp.cards[carte.id] = review(pp.cards[carte.id], q);
      gainXp(pp, q >= 4 ? 4 : 2);
      if (q === 1) logErreur(pp, { matiere: m, chapitre: carte.chapitre, ref: `Flashcard ${carte.id}`, texte: carte.recto.slice(0, 140) });
    });
    setFlip(false);
    // ratée → revient en fin de file pendant la séance
    setFile((f) => (q === 1 ? [...f.slice(1), f[0]] : f.slice(1)));
  }

  function toutReviser() {
    setTout(true);
    setFile(flashcards.filter((c) => c.matiere === m && (!chap || c.chapitre === chap)).map((c) => c.id));
  }

  return (
    <div className="stack">
      <Link to={`/m/${m}`} className="muted small">
        ← {mat.nom}
      </Link>
      <h1>Flashcards {chap && `— ${chapitre(chap)?.titre}`}</h1>
      <p className="muted small">
        Répétition espacée : ce que tu rates revient plus souvent. {file.length} carte(s) dans la séance · {total} au total · {Object.keys(p.cards).filter((id) => flashcards.find((c) => c.id === id && c.matiere === m)).length} déjà vues.
      </p>
      {carte ? (
        <>
          <button className={`card flashcard ${flip ? "flipped" : ""}`} onClick={() => setFlip(!flip)}>
            <span className="muted small">{chapitre(carte.chapitre)?.titre}</span>
            <div className="fc-face">
              <Md text={flip ? carte.verso : carte.recto} />
            </div>
            {!flip && <span className="muted small">Touchez pour retourner</span>}
            {flip && <Source text={carte.source} />}
          </button>
          {flip && (
            <div className="grade">
              <button className="btn btn-ko" onClick={() => noter(1)}>Raté</button>
              <button className="btn btn-mid" onClick={() => noter(3)}>Difficile</button>
              <button className="btn btn-ok" onClick={() => noter(4)}>Bien</button>
              <button className="btn btn-primary" onClick={() => noter(5)}>Facile</button>
            </div>
          )}
        </>
      ) : (
        <div className="card">
          <p>✅ Séance terminée ! Les cartes reviendront quand il faudra les revoir.</p>
          {!tout && (
            <button className="btn btn-ghost" onClick={toutReviser}>
              Réviser quand même toutes les cartes
            </button>
          )}
        </div>
      )}
    </div>
  );
}
