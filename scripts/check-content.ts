// Vérifie le contenu avant chaque build : JSON valide, champs obligatoires, identifiants uniques,
// chapitres référencés existants, bonnes réponses dans les bornes. Bloque le build en cas d'erreur.
import { readdirSync, readFileSync, existsSync, statSync } from "node:fs";
import { join } from "node:path";

const ROOT = join(import.meta.dirname, "..", "content");
const errors: string[] = [];
const warn: string[] = [];
const ids = new Set<string>();
const chapitres = new Set<string>();

function uniq(id: unknown, where: string) {
  if (typeof id !== "string" || !id) return errors.push(`${where} : identifiant manquant`);
  if (ids.has(id)) errors.push(`${where} : identifiant en double « ${id} »`);
  ids.add(id);
}
function readJson(path: string): any {
  try {
    return JSON.parse(readFileSync(path, "utf8"));
  } catch (e) {
    errors.push(`${path} : JSON invalide (${(e as Error).message})`);
    return null;
  }
}
function checkEtapes(etapes: any[], where: string) {
  if (!Array.isArray(etapes) || etapes.length === 0) return errors.push(`${where} : aucune étape`);
  const local = new Set<string>();
  for (const et of etapes) {
    const w = `${where} › étape ${et.id}`;
    if (!et.id || local.has(et.id)) errors.push(`${w} : id manquant ou en double`);
    local.add(et.id);
    if (!et.consigne || !et.correction) errors.push(`${w} : consigne ou correction manquante`);
    if (!["nombre", "choix", "auto"].includes(et.type)) errors.push(`${w} : type inconnu « ${et.type} »`);
    if (et.type === "nombre" && typeof et.reponse !== "number") errors.push(`${w} : réponse numérique manquante`);
    if (et.type === "choix" && (!Array.isArray(et.choix) || typeof et.bonne !== "number" || et.bonne >= et.choix.length))
      errors.push(`${w} : choix / bonne réponse incohérents`);
    if (!Array.isArray(et.indices)) errors.push(`${w} : « indices » doit être une liste`);
    if (!et.reexplication) warn.push(`${w} : pas de réexplication`);
    if (et.notion && !chapitres.has(et.notion)) errors.push(`${w} : notion inconnue « ${et.notion} »`);
  }
}

const config = readJson(join(ROOT, "config.json"));
const matieres: string[] = config?.matieres?.map((m: any) => m.id) ?? [];

for (const m of matieres) {
  const dir = join(ROOT, m);
  if (!existsSync(dir)) continue;
  const chapDir = join(dir, "chapitres");
  if (existsSync(chapDir))
    for (const f of readdirSync(chapDir).filter((x) => x.endsWith(".md"))) {
      const txt = readFileSync(join(chapDir, f), "utf8").replace(/\r\n/g, "\n");
      const id = txt.match(/^---\n[\s\S]*?^id:\s*(.+)$/m)?.[1]?.trim();
      if (!id) errors.push(`${m}/chapitres/${f} : « id » manquant dans l'en-tête`);
      else {
        uniq(id, `${m}/chapitres/${f}`);
        chapitres.add(id);
      }
      for (const s of ["# Synthèse flash", "# Cours", "# Pièges classiques", "# Fiche mémo"])
        if (!txt.includes(`\n${s}\n`)) warn.push(`${m}/chapitres/${f} : section « ${s.slice(2)} » absente`);
      if ((txt.match(/\$\$/g) ?? []).length % 2) errors.push(`${m}/chapitres/${f} : nombre impair de $$ (formule non fermée)`);
    }
}

for (const m of matieres) {
  const dir = join(ROOT, m);
  if (!existsSync(dir)) continue;
  const q = existsSync(join(dir, "qcm.json")) ? readJson(join(dir, "qcm.json")) : [];
  for (const x of q ?? []) {
    const w = `${m}/qcm.json › ${x.id}`;
    uniq(x.id, w);
    if (!chapitres.has(x.chapitre)) errors.push(`${w} : chapitre inconnu « ${x.chapitre} »`);
    if (!x.question || !Array.isArray(x.choix) || x.choix.length < 2) errors.push(`${w} : question ou choix manquants`);
    if (!Array.isArray(x.bonnes) || !x.bonnes.length || x.bonnes.some((b: number) => b >= x.choix.length)) errors.push(`${w} : « bonnes » invalide`);
    if (!x.explication || !x.source) errors.push(`${w} : explication ou source manquante`);
  }
  const fc = existsSync(join(dir, "flashcards.json")) ? readJson(join(dir, "flashcards.json")) : [];
  for (const x of fc ?? []) {
    const w = `${m}/flashcards.json › ${x.id}`;
    uniq(x.id, w);
    if (!chapitres.has(x.chapitre)) errors.push(`${w} : chapitre inconnu`);
    if (!x.recto || !x.verso || !x.source) errors.push(`${w} : recto, verso ou source manquant`);
  }
  const exFiles = readdirSync(dir).filter((f) => /^exercices.*\.json$/.test(f));
  const ex = exFiles.flatMap((f) => (readJson(join(dir, f)) ?? []).map((x: any) => ({ ...x, _f: f })));
  for (const x of ex) {
    const w = `${m}/${x._f} › ${x.id}`;
    uniq(x.id, w);
    if (!chapitres.has(x.chapitre)) errors.push(`${w} : chapitre inconnu`);
    if (!x.titre || !x.enonce || !x.source) errors.push(`${w} : titre, énoncé ou source manquant`);
    checkEtapes(x.etapes, w);
  }
  const adir = join(dir, "annales");
  if (existsSync(adir) && statSync(adir).isDirectory())
    for (const f of readdirSync(adir).filter((x) => x.endsWith(".json"))) {
      const a = readJson(join(adir, f));
      if (!a) continue;
      const w = `${m}/annales/${f}`;
      uniq(a.id, w);
      if (a.matiere !== m) errors.push(`${w} : « matiere » devrait valoir « ${m} »`);
      if (!["CC", "CT", "Partiel", "Rattrapage", "Entraînement"].includes(a.type)) errors.push(`${w} : type inconnu`);
      for (const c of a.chapitres ?? []) if (!chapitres.has(c)) errors.push(`${w} : chapitre inconnu « ${c} »`);
      if (a.statut === "pret") {
        if (!a.exercices?.length) errors.push(`${w} : annale « pret » sans exercice`);
        for (const [i, e] of (a.exercices ?? []).entries()) checkEtapes(e.etapes, `${w} › exercice ${i + 1}`);
      }
    }
}

for (const w of warn) console.warn("⚠️ ", w);
if (errors.length) {
  for (const e of errors) console.error("❌", e);
  console.error(`\n${errors.length} erreur(s) dans content/ — corrige-les avant de publier.`);
  process.exit(1);
}
console.log(`✅ Contenu valide : ${chapitres.size} chapitres, ${ids.size} éléments identifiés.`);
