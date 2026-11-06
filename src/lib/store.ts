// Progression sauvegardée dans le navigateur (localStorage) + export/import JSON.
import { useSyncExternalStore } from "react";

export interface CardState { ef: number; interval: number; reps: number; due: string }
export interface Erreur { date: string; matiere: string; chapitre?: string; ref: string; texte: string }
export interface StepState { ok: boolean; hints: number; tries: number; date: string }

export interface Progress {
  version: 1;
  xp: number;
  streak: { last: string | null; count: number; best: number };
  days: Record<string, number>; // date -> xp gagnés
  vus: Record<string, string>; // chapitreId -> date de lecture
  qcm: Record<string, { ok: number; ko: number; last: boolean; date: string }>;
  cards: Record<string, CardState>;
  steps: Record<string, StepState>; // "exoId/etapeId"
  annales: Record<string, { tentatives: number; meilleure: number; derniere: number; date: string }>;
  erreurs: Erreur[];
  badges: Record<string, string>; // id -> date
  reglages: { tolerance: number; theme: "auto" | "clair" | "sombre"; examens: Record<string, string> };
}

const KEY = "revision-l3-progress-v1";

export const today = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

function empty(): Progress {
  return {
    version: 1,
    xp: 0,
    streak: { last: null, count: 0, best: 0 },
    days: {},
    vus: {},
    qcm: {},
    cards: {},
    steps: {},
    annales: {},
    erreurs: [],
    badges: {},
    reglages: { tolerance: 0.01, theme: "auto", examens: {} },
  };
}

function load(): Progress {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return empty();
    const p = JSON.parse(raw);
    const base = empty();
    return { ...base, ...p, reglages: { ...base.reglages, ...(p.reglages ?? {}) }, streak: { ...base.streak, ...(p.streak ?? {}) } };
  } catch {
    return empty();
  }
}

let state: Progress = load();
const listeners = new Set<() => void>();

function save() {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    /* stockage indisponible : la progression reste en mémoire */
  }
  listeners.forEach((l) => l());
}

export function update(fn: (p: Progress) => void) {
  const next = structuredClone(state);
  fn(next);
  checkBadges(next);
  state = next;
  save();
}

export function useProgress(): Progress {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    () => state,
  );
}

export const getProgress = () => state;

function dayDiff(a: string, b: string) {
  return Math.round((new Date(b).getTime() - new Date(a).getTime()) / 86400000);
}

/** Ajoute de l'XP et met à jour la série de jours consécutifs. */
export function gainXp(p: Progress, n: number) {
  const t = today();
  p.xp += n;
  p.days[t] = (p.days[t] ?? 0) + n;
  if (p.streak.last !== t) {
    p.streak.count = p.streak.last && dayDiff(p.streak.last, t) === 1 ? p.streak.count + 1 : 1;
    p.streak.last = t;
    p.streak.best = Math.max(p.streak.best, p.streak.count);
  }
}

export function logErreur(p: Progress, e: Omit<Erreur, "date">) {
  p.erreurs.unshift({ ...e, date: today() });
  if (p.erreurs.length > 500) p.erreurs.length = 500;
}

export const BADGES: { id: string; nom: string; desc: string; test: (p: Progress) => boolean }[] = [
  { id: "premier-pas", nom: "Premier pas", desc: "Gagner ses premiers XP", test: (p) => p.xp > 0 },
  { id: "xp-500", nom: "Bosseuse", desc: "500 XP", test: (p) => p.xp >= 500 },
  { id: "xp-2000", nom: "Machine", desc: "2 000 XP", test: (p) => p.xp >= 2000 },
  { id: "serie-3", nom: "Régulière", desc: "3 jours d'affilée", test: (p) => p.streak.best >= 3 },
  { id: "serie-7", nom: "Une semaine !", desc: "7 jours d'affilée", test: (p) => p.streak.best >= 7 },
  { id: "qcm-50", nom: "QCM addict", desc: "50 bonnes réponses en QCM", test: (p) => Object.values(p.qcm).reduce((s, q) => s + q.ok, 0) >= 50 },
  { id: "cartes-30", nom: "Mémoire d'éléphant", desc: "30 flashcards révisées", test: (p) => Object.keys(p.cards).length >= 30 },
  { id: "annale-1", nom: "Baptême du feu", desc: "Finir une annale en mode examen", test: (p) => Object.keys(p.annales).length >= 1 },
  { id: "sans-indice", nom: "Sans filet", desc: "10 étapes réussies sans indice", test: (p) => Object.values(p.steps).filter((s) => s.ok && s.hints === 0).length >= 10 },
];

function checkBadges(p: Progress) {
  for (const b of BADGES) if (!p.badges[b.id] && b.test(p)) p.badges[b.id] = today();
}

export function exportJson(): string {
  return JSON.stringify(state, null, 2);
}

export function importJson(text: string, mode: "remplacer" | "fusionner") {
  const data = JSON.parse(text) as Progress;
  if (data.version !== 1) throw new Error("Fichier non reconnu (version).");
  if (mode === "remplacer") {
    state = { ...empty(), ...data };
  } else {
    const cur = structuredClone(state);
    cur.xp = Math.max(cur.xp, data.xp);
    for (const k of ["days", "vus", "qcm", "cards", "steps", "annales", "badges"] as const) {
      Object.assign(cur[k] as object, { ...(data[k] as object), ...(cur[k] as object) });
    }
    const seen = new Set(cur.erreurs.map((e) => e.date + e.ref + e.texte));
    cur.erreurs.push(...data.erreurs.filter((e) => !seen.has(e.date + e.ref + e.texte)));
    if ((data.streak.last ?? "") > (cur.streak.last ?? "")) cur.streak = data.streak;
    state = cur;
  }
  save();
}

export function resetAll() {
  state = empty();
  save();
}
