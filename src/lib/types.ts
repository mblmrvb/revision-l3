// Types du contenu. Le format est documenté dans le README (section « Format du contenu »).

export type BadgeKind = "ajout" | "officiel" | "propose" | "hors-programme" | "autre-formation";

export interface Examen {
  nom: string;
  date: string | null; // AAAA-MM-JJ, ou null si inconnue
  dureeMin: number;
}

export interface MatiereConfig {
  id: string;
  nom: string;
  court: string;
  emoji: string;
  couleur: string;
  examens: Examen[];
  disponible: boolean;
}

export interface Chapitre {
  id: string; // ex. "micro-ch1"
  matiere: string;
  ordre: number;
  titre: string;
  seances?: string;
  sources: string[];
  sections: {
    flash: string;
    cours: string;
    pieges: string;
    memo: string;
  };
}

export interface Qcm {
  id: string;
  chapitre: string;
  question: string;
  choix: string[];
  bonnes: number[]; // index des bonnes réponses
  indice?: string;
  explication: string;
  source: string;
  badge?: BadgeKind;
}

export interface Flashcard {
  id: string;
  chapitre: string;
  recto: string;
  verso: string;
  source: string;
  badge?: BadgeKind;
}

export type StepType = "nombre" | "choix" | "auto";

export interface Etape {
  id: string;
  consigne: string;
  type: StepType;
  // nombre
  reponse?: number;
  unite?: string;
  tolerance?: number; // tolérance relative (0.01 = 1 %) ; sinon réglage global
  // choix
  choix?: string[];
  bonne?: number;
  // indices progressifs
  indices: string[]; // indice 1, indice 2
  reexplication: string; // 3e niveau d'aide
  correction: string; // affichée après réponse ou abandon
  points?: number; // barème (annales)
  notion?: string; // id de chapitre travaillé par cette étape
}

export interface Exercice {
  id: string;
  matiere: string;
  chapitre: string;
  titre: string;
  enonce: string;
  source: string;
  quoi?: string; // ce qu'on cherche / pourquoi / comment
  etapes: Etape[];
  badge?: BadgeKind;
}

export interface AnnaleExercice {
  titre: string;
  points?: number;
  enonce: string;
  chapitres: string[];
  etapes: Etape[];
}

export interface Annale {
  id: string;
  matiere: string;
  annee: string; // "2018-2019"
  type: "CC" | "CT" | "Partiel" | "Rattrapage" | "Entraînement";
  titre: string;
  dureeMin: number;
  corrige: "officiel" | "propose" | "aucun";
  horsProgramme: boolean;
  statut: "pret" | "a-traiter";
  chapitres: string[];
  sources: string[];
  incertitudes?: string[];
  exercices: AnnaleExercice[];
}
