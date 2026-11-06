// Statistiques de progression et sélection de la « révision du jour ».
import { annales, chapitresDe, exercices, flashcards, frequenceNotions, matieres, qcms } from "./content";
import { isDue } from "./sm2";
import type { Progress } from "./store";
import { today } from "./store";

export interface StatChapitre {
  chapitre: string;
  vu: boolean;
  tentatives: number;
  reussite: number | null; // 0..1
}

export function statsChapitre(p: Progress, chapitreId: string): StatChapitre {
  let ok = 0;
  let ko = 0;
  for (const q of qcms.filter((x) => x.chapitre === chapitreId)) {
    const s = p.qcm[q.id];
    if (s) {
      ok += s.ok;
      ko += s.ko;
    }
  }
  for (const e of exercices.filter((x) => x.chapitre === chapitreId)) {
    for (const et of e.etapes) {
      const s = p.steps[`${e.id}/${et.id}`];
      if (s) s.ok ? ok++ : ko++;
    }
  }
  const n = ok + ko;
  return { chapitre: chapitreId, vu: !!p.vus[chapitreId], tentatives: n, reussite: n ? ok / n : null };
}

export function statsMatiere(p: Progress, m: string) {
  const chs = chapitresDe(m).map((c) => statsChapitre(p, c.id));
  const items =
    qcms.filter((q) => q.matiere === m).length +
    flashcards.filter((c) => c.matiere === m).length +
    exercices.filter((e) => e.matiere === m).reduce((s, e) => s + e.etapes.length, 0);
  const faits =
    qcms.filter((q) => q.matiere === m && p.qcm[q.id]).length +
    flashcards.filter((c) => c.matiere === m && p.cards[c.id]).length +
    exercices.filter((e) => e.matiere === m).reduce((s, e) => s + e.etapes.filter((et) => p.steps[`${e.id}/${et.id}`]).length, 0);
  const chapVus = chs.filter((c) => c.vu).length;
  const pctVu = chs.length ? (chapVus / chs.length) * 0.4 + (items ? faits / items : 0) * 0.6 : 0;
  const faibles = chs.filter((c) => c.reussite !== null && c.reussite < 0.6).map((c) => c.chapitre);
  return { chapitres: chs, pctVu, faibles, items, faits };
}

export function joursAvant(date: string | null | undefined): number | null {
  if (!date) return null;
  const d = Math.ceil((new Date(date).getTime() - new Date(today()).getTime()) / 86400000);
  return d;
}

export function prochainExamen(p: Progress, m: string) {
  const mat = matieres.find((x) => x.id === m);
  if (!mat) return null;
  const list = mat.examens
    .map((e) => ({ ...e, date: p.reglages.examens[`${m}/${e.nom}`] || e.date }))
    .map((e) => ({ ...e, jours: joursAvant(e.date) }))
    .filter((e) => e.jours !== null && e.jours >= 0)
    .sort((a, b) => (a.jours ?? 0) - (b.jours ?? 0));
  return list[0] ?? null;
}

export interface TacheJour {
  kind: "flashcards" | "qcm" | "exercice" | "chapitre" | "annale";
  matiere: string;
  titre: string;
  detail: string;
  lien: string;
  score: number;
}

/** Priorité = examen proche + points faibles + notions fréquentes en annales + éléments jamais vus. */
export function revisionDuJour(p: Progress): TacheJour[] {
  const taches: TacheJour[] = [];
  for (const mat of matieres.filter((m) => m.disponible)) {
    const ex = prochainExamen(p, mat.id);
    const urgence = ex?.jours != null ? Math.max(0.5, 3 - ex.jours / 10) : 1;
    const freq = new Map(frequenceNotions(mat.id).map((f) => [f.chapitre, f.n]));
    const st = statsMatiere(p, mat.id);

    const dues = flashcards.filter((c) => c.matiere === mat.id && p.cards[c.id] && isDue(p.cards[c.id])).length;
    const nouvelles = flashcards.filter((c) => c.matiere === mat.id && !p.cards[c.id]).length;
    if (dues + Math.min(nouvelles, 10) > 0)
      taches.push({
        kind: "flashcards",
        matiere: mat.id,
        titre: `${mat.emoji} Flashcards ${mat.court}`,
        detail: `${dues} à revoir${nouvelles ? ` + ${Math.min(nouvelles, 10)} nouvelles` : ""}`,
        lien: `/flashcards/${mat.id}`,
        score: urgence * (2 + dues / 5),
      });

    for (const c of st.chapitres) {
      const chap = chapitresDe(mat.id).find((x) => x.id === c.chapitre)!;
      const f = freq.get(c.chapitre) ?? 0;
      const faiblesse = c.reussite === null ? 1 : 1.5 - c.reussite;
      if (!c.vu)
        taches.push({ kind: "chapitre", matiere: mat.id, titre: `📖 ${chap.titre}`, detail: "Pas encore lu — commence par la synthèse flash", lien: `/m/${mat.id}/c/${c.chapitre}`, score: urgence * (1.5 + f * 0.3) });
      if (c.reussite === null || c.reussite < 0.75)
        taches.push({
          kind: "qcm",
          matiere: mat.id,
          titre: `✅ QCM — ${chap.titre}`,
          detail: c.reussite === null ? "Jamais testé" : `Réussite ${Math.round(c.reussite * 100)} % : à consolider`,
          lien: `/qcm/${mat.id}?chapitre=${c.chapitre}`,
          score: urgence * faiblesse * (1 + f * 0.3),
        });
      const exo = exercices.find((e) => e.chapitre === c.chapitre && e.etapes.some((et) => !p.steps[`${e.id}/${et.id}`]?.ok));
      if (exo)
        taches.push({ kind: "exercice", matiere: mat.id, titre: `✏️ ${exo.titre}`, detail: f ? `Notion tombée ${f} fois en annales` : "Exercice guidé", lien: `/exo/${exo.id}`, score: urgence * faiblesse * (1.2 + f * 0.4) });
    }
    const annale = annales.find((a) => a.matiere === mat.id && a.statut === "pret" && !a.horsProgramme && !p.annales[a.id]);
    if (annale && ex?.jours != null && ex.jours <= 21)
      taches.push({ kind: "annale", matiere: mat.id, titre: `⏱️ ${annale.titre}`, detail: "Examen proche : entraîne-toi en conditions réelles", lien: `/annale/${annale.id}?mode=examen`, score: urgence * 2.5 });
  }
  return taches.sort((a, b) => b.score - a.score).slice(0, 6);
}
