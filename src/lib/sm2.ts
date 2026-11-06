// Répétition espacée, algorithme SM-2 simplifié.
import type { CardState } from "./store";
import { today } from "./store";

export type Qualite = 1 | 3 | 4 | 5; // raté, difficile, bien, facile

function addDays(date: string, n: number) {
  const d = new Date(date);
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
}

export function review(prev: CardState | undefined, q: Qualite): CardState {
  const s: CardState = prev ? { ...prev } : { ef: 2.5, interval: 0, reps: 0, due: today() };
  if (q < 3) {
    // raté : la carte revient aujourd'hui puis demain
    s.reps = 0;
    s.interval = 0;
  } else {
    s.reps += 1;
    s.interval = s.reps === 1 ? 1 : s.reps === 2 ? 3 : Math.round(s.interval * s.ef);
  }
  s.ef = Math.max(1.3, s.ef + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02)));
  s.due = addDays(today(), s.interval);
  return s;
}

export const isDue = (s: CardState | undefined) => !s || s.due <= today();
