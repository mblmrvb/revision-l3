// Lecture des nombres tapés à la française : "0,25", "1/4", "-19/20", "10 %", "1,5e3".
export function parseNombre(input: string): number | null {
  let s = input.trim().replace(/\s+/g, "").replace(/,/g, ".");
  if (!s) return null;
  let pct = false;
  if (s.endsWith("%")) {
    pct = true;
    s = s.slice(0, -1);
  }
  let v: number;
  const frac = s.match(/^([+-]?\d*\.?\d+)\/([+-]?\d*\.?\d+)$/);
  if (frac) v = Number(frac[1]) / Number(frac[2]);
  else v = Number(s);
  if (!Number.isFinite(v)) return null;
  return pct ? v / 100 : v;
}

/** Vrai si `got` est à `tol` (relatif) de `expected`, avec un plancher absolu pour les valeurs proches de 0. */
export function proche(got: number, expected: number, tol: number) {
  const diff = Math.abs(got - expected);
  return diff <= Math.max(Math.abs(expected) * tol, tol * 0.01, 1e-9);
}
