// Chargement de tout le contenu de content/ au moment du build (Vite import.meta.glob).
import type { Annale, Chapitre, Exercice, Flashcard, MatiereConfig, Qcm } from "./types";
import config from "../../content/config.json";

const mdFiles = import.meta.glob("../../content/*/chapitres/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;
const qcmFiles = import.meta.glob("../../content/*/qcm.json", { import: "default", eager: true }) as Record<string, Qcm[]>;
const cardFiles = import.meta.glob("../../content/*/flashcards.json", { import: "default", eager: true }) as Record<string, Flashcard[]>;
const exoFiles = import.meta.glob("../../content/*/exercices*.json", { import: "default", eager: true }) as Record<string, Omit<Exercice, "matiere">[]>;
const annaleFiles = import.meta.glob("../../content/*/annales/*.json", { import: "default", eager: true }) as Record<string, Annale>;

function matiereOf(path: string): string {
  const m = path.match(/content\/([^/]+)\//);
  return m ? m[1] : "?";
}

export function parseChapitre(raw: string, matiere: string): Chapitre {
  const text = raw.replace(/\r\n/g, "\n");
  const fm = text.match(/^---\n([\s\S]*?)\n---\n?/);
  const meta: Record<string, string> = {};
  let body = text;
  if (fm) {
    for (const line of fm[1].split("\n")) {
      const i = line.indexOf(":");
      if (i > 0) meta[line.slice(0, i).trim()] = line.slice(i + 1).trim();
    }
    body = text.slice(fm[0].length);
  }
  const sections: Record<string, string> = {};
  let current = "";
  for (const line of body.split("\n")) {
    const h = line.match(/^# (.+)$/);
    if (h) {
      current = h[1].trim().toLowerCase();
      sections[current] = "";
    } else if (current) {
      sections[current] += line + "\n";
    }
  }
  const pick = (...names: string[]) => names.map((n) => sections[n]).find((s) => s !== undefined)?.trim() ?? "";
  return {
    id: meta.id,
    matiere,
    ordre: Number(meta.ordre ?? 0),
    titre: meta.titre ?? meta.id,
    seances: meta.seances,
    sources: (meta.sources ?? "").split(";").map((s) => s.trim()).filter(Boolean),
    sections: {
      flash: pick("synthèse flash", "synthese flash"),
      cours: pick("cours", "cours détaillé"),
      pieges: pick("pièges classiques", "pieges classiques"),
      memo: pick("fiche mémo", "fiche memo"),
    },
  };
}

export const matieres: MatiereConfig[] = (config as { matieres: MatiereConfig[] }).matieres;

export const chapitres: Chapitre[] = Object.entries(mdFiles)
  .map(([p, raw]) => parseChapitre(raw, matiereOf(p)))
  .sort((a, b) => a.matiere.localeCompare(b.matiere) || a.ordre - b.ordre);

export const qcms: (Qcm & { matiere: string })[] = Object.entries(qcmFiles).flatMap(([p, list]) =>
  list.map((q) => ({ ...q, matiere: matiereOf(p) })),
);

export const flashcards: (Flashcard & { matiere: string })[] = Object.entries(cardFiles).flatMap(([p, list]) =>
  list.map((c) => ({ ...c, matiere: matiereOf(p) })),
);

export const exercices: Exercice[] = Object.entries(exoFiles).flatMap(([p, list]) =>
  list.map((e) => ({ ...e, matiere: matiereOf(p) })),
);

export const annales: Annale[] = Object.values(annaleFiles).sort(
  (a, b) => a.matiere.localeCompare(b.matiere) || b.annee.localeCompare(a.annee),
);

export const matiere = (id: string) => matieres.find((m) => m.id === id);
export const chapitre = (id: string) => chapitres.find((c) => c.id === id);
export const chapitresDe = (m: string) => chapitres.filter((c) => c.matiere === m);

/** Fréquence des chapitres dans les annales prêtes + exercices d'entraînement (pour prioriser). */
export function frequenceNotions(m: string): { chapitre: string; n: number }[] {
  const count = new Map<string, number>();
  for (const a of annales.filter((x) => x.matiere === m && x.statut === "pret" && !x.horsProgramme)) {
    for (const ex of a.exercices) for (const c of ex.chapitres) count.set(c, (count.get(c) ?? 0) + 1);
  }
  return [...count.entries()].map(([chapitre, n]) => ({ chapitre, n })).sort((a, b) => b.n - a.n);
}
