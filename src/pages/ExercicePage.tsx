import { Link, useParams } from "react-router-dom";
import { chapitre, exercices, matiere } from "../lib/content";
import { Md } from "../components/Md";
import { Badge, Source } from "../components/Badge";
import { StepRunner } from "../components/StepRunner";

export function ExercicePage() {
  const { id = "" } = useParams();
  const ex = exercices.find((e) => e.id === id);
  if (!ex) return <p>Exercice introuvable.</p>;
  const mat = matiere(ex.matiere)!;
  const ch = chapitre(ex.chapitre);
  return (
    <div className="stack">
      <Link to={ch ? `/m/${ex.matiere}/c/${ch.id}` : `/m/${ex.matiere}`} className="muted small">
        ← {ch?.titre ?? mat.nom}
      </Link>
      <h1>{ex.titre}</h1>
      {ex.badge && <Badge kind={ex.badge} />}
      <div className="card">
        <Md text={ex.enonce} />
        <Source text={ex.source} />
      </div>
      {ex.quoi && (
        <div className="card quoi">
          <Md text={ex.quoi} />
        </div>
      )}
      <StepRunner
        cle={ex.id}
        etapes={ex.etapes}
        matiere={ex.matiere}
        chapitre={ex.chapitre}
        ctx={{ matiere: mat.nom, chapitre: ch?.titre, enonce: ex.enonce.slice(0, 1800), source: ex.source }}
      />
    </div>
  );
}
