// npm run import-annales  [-- --dry-run]
//
// Inventorie le dossier d'annales « L3_EIF_Dauphine » (dossier Google Drive synchronisé OU export .zip du Drive),
// en LECTURE SEULE. Détecte les fichiers nouveaux / modifiés (empreinte SHA-256), les classe par matière, année,
// type et rôle (sujet / corrigé), crée une fiche « à traiter » par nouvelle annale dans content/<matiere>/annales/
// SANS JAMAIS écraser une fiche existante, et affiche un résumé.
//
// Le chemin est lu dans config.local.json (non versionné) : { "drive": "G:\\Mon Drive\\L3_EIF_Dauphine" }
// ou { "drive": ["C:\\Users\\...\\L3_EIF_Dauphine-...-001.zip", "...-002.zip"] }.
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { basename, dirname, extname, join, relative, sep } from "node:path";
import AdmZip from "adm-zip";

const ROOT = join(import.meta.dirname, "..");
const CONFIG = join(ROOT, "config.local.json");
const MANIFEST = join(ROOT, ".local", "annales-manifest.json");
const DRY = process.argv.includes("--dry-run");

const MATIERES: [RegExp, string][] = [
  [/\/micro/i, "micro"],
  [/comptabilit|\/compta/i, "compta"],
  [/produits et march|\/pmf/i, "pmf"],
  [/\/maths?\b/i, "maths"],
  [/\/stats?/i, "stats"],
  [/\/info\b|\/vba|\/iaf/i, "vba"],
];
const GOOGLE_NATIFS = [".gdoc", ".gsheet", ".gslides", ".gdraw", ".gform", ".gmap", ".gsite"];

interface Fichier { rel: string; size: number; lire: () => Buffer }
interface Entree { hash: string; size: number; matiere: string | null; type: string | null; annee: string | null; role: "sujet" | "corrige"; groupe: string | null; vu: string }
interface Manifest { source: string; maj: string; fichiers: Record<string, Entree> }

// ---------- 1. Trouver la source ----------
function candidats(): string[] {
  const out: string[] = [];
  for (const l of "DEFGHIJKLMNOPQRSTUVWXYZ")
    for (const d of ["Mon Drive", "My Drive"]) out.push(`${l}:\\${d}\\L3_EIF_Dauphine`);
  const cs = join(homedir(), "Library", "CloudStorage");
  if (existsSync(cs))
    for (const g of readdirSync(cs).filter((x) => x.startsWith("GoogleDrive-")))
      for (const d of ["Mon Drive", "My Drive"]) out.push(join(cs, g, d, "L3_EIF_Dauphine"));
  const dl = join(homedir(), "Downloads");
  if (existsSync(dl)) {
    const zips = readdirSync(dl).filter((f) => /^L3_EIF_Dauphine.*\.zip$/i.test(f)).sort().reverse();
    if (zips.length) out.push(join(dl, zips[0]));
  }
  return out.filter((p) => existsSync(p));
}

function sourceConfiguree(): string[] {
  if (existsSync(CONFIG)) {
    const c = JSON.parse(readFileSync(CONFIG, "utf8"));
    const d = Array.isArray(c.drive) ? c.drive : c.drive ? [c.drive] : [];
    const ok = d.filter((p: string) => existsSync(p));
    if (ok.length) return ok;
    console.warn(`⚠️  Le chemin de config.local.json est introuvable : ${d.join(", ")}`);
  }
  const c = candidats();
  if (!c.length) {
    console.error(
      "❌ Dossier « L3_EIF_Dauphine » introuvable.\n" +
        "   Crée le fichier config.local.json à la racine du projet avec par exemple :\n" +
        '   { "drive": "G:\\\\Mon Drive\\\\L3_EIF_Dauphine" }\n' +
        '   ou le chemin d\'un export zip : { "drive": "C:\\\\Users\\\\toi\\\\Downloads\\\\L3_EIF_Dauphine-....zip" }',
    );
    process.exit(1);
  }
  console.log(`📁 Source trouvée automatiquement : ${c[0]} (enregistrée dans config.local.json)`);
  if (!DRY) writeFileSync(CONFIG, JSON.stringify({ drive: c[0] }, null, 2));
  return [c[0]];
}

// ---------- 2. Lister les fichiers (lecture seule) ----------
function lister(sources: string[]): { fichiers: Fichier[]; illisibles: string[] } {
  const fichiers: Fichier[] = [];
  const illisibles: string[] = [];
  for (const src of sources) {
    if (src.toLowerCase().endsWith(".zip")) {
      const zip = new AdmZip(src);
      for (const e of zip.getEntries()) {
        if (e.isDirectory) continue;
        const rel = e.entryName.replace(/^L3_EIF_Dauphine\//, "");
        fichiers.push({ rel, size: e.header.size, lire: () => e.getData() });
      }
    } else {
      const walk = (dir: string) => {
        let items: string[] = [];
        try {
          items = readdirSync(dir);
        } catch {
          illisibles.push(relative(src, dir) || ".");
          return;
        }
        for (const f of items) {
          const p = join(dir, f);
          let st;
          try {
            st = statSync(p);
          } catch {
            illisibles.push(relative(src, p));
            continue;
          }
          if (st.isDirectory()) walk(p);
          else fichiers.push({ rel: relative(src, p).split(sep).join("/"), size: st.size, lire: () => readFileSync(p) });
        }
      };
      walk(src);
    }
  }
  return { fichiers, illisibles };
}

// ---------- 3. Classer ----------
function classer(rel: string) {
  const p = "/" + rel;
  const estAnnale = /\/annales\//i.test(p);
  const matiere = /\/S2\//i.test(p) ? null : (MATIERES.find(([re]) => re.test(p))?.[1] ?? null);
  let type: string | null = null;
  if (/rattrapage/i.test(p)) type = "Rattrapage";
  else if (/\/CC\d?\//i.test(p) || /\bCC\b/i.test(basename(p))) type = "CC";
  else if (/\/partiel\//i.test(p)) type = "Partiel";
  else if (/\/CT\//i.test(p) || /\b(EF|FE|exam|final)\b/i.test(p)) type = "CT";
  // année lue dans les dossiers (pas dans le nom du fichier : un dossier « Autres » mélange plusieurs années)
  const d = "/" + dirname(rel) + "/";
  const ans = d.match(/(20\d\d)\s*-\s*(20\d\d)/) ?? d.match(/\/[^/]*?(20\d\d)[^/]*\//);
  const annee = ans ? (ans[2] ? `${ans[1]}-${ans[2]}` : `${ans[1]}-${Number(ans[1]) + 1}`) : null;
  const role: "sujet" | "corrige" = /corr(?:ig|ection)?(?![a-z])|corrig|r\S?sultats|results|solution/i.test(p) ? "corrige" : "sujet";
  // groupe = dossier de l'annale (sans les sous-dossiers Sujet/Corrigé/Correction/Enoncé)
  let groupeDir = dirname(rel).split("/").filter((s) => !/^(sujet|corrig[ée]|correction|enonc[ée])$/i.test(s)).join("/");
  if (!annee && type) groupeDir = groupeDir || rel;
  const groupe = estAnnale && matiere && type ? groupeDir : null;
  return { estAnnale, matiere, type, annee, role, groupe };
}

const slug = (s: string) =>
  s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

// Masque les noms d'étudiants dans les noms de fichiers (ex. « IAF2017_NOM_PRENOM_662.xlsm »).
const anonymiser = (f: string) => (/_[A-Z]{3,}_[A-Z]{3,}_\d+/.test(f) ? "copie d'étudiant (nom masqué)" + extname(f) : f);

// ---------- Programme principal ----------
const sources = sourceConfiguree();
const { fichiers, illisibles } = lister(sources);
const ancien: Manifest = existsSync(MANIFEST) ? JSON.parse(readFileSync(MANIFEST, "utf8")) : { source: "", maj: "", fichiers: {} };
const today = new Date().toISOString().slice(0, 10);
const nouveau: Manifest = { source: sources.map((s) => basename(s)).join(", "), maj: today, fichiers: {} };

const nouveaux: string[] = [];
const modifies: string[] = [];
const natifs: string[] = [];
const nonClasses: string[] = [];
const autresMatieres: string[] = [];
const vides: string[] = [];

for (const f of fichiers) {
  if (GOOGLE_NATIFS.includes(extname(f.rel).toLowerCase())) {
    natifs.push(f.rel);
    continue;
  }
  let buf: Buffer;
  try {
    buf = f.lire();
  } catch {
    illisibles.push(f.rel);
    continue;
  }
  if (buf.length === 0) {
    vides.push(f.rel);
    continue;
  }
  const hash = createHash("sha256").update(buf).digest("hex");
  const c = classer(f.rel);
  if (c.estAnnale && !c.groupe) (/^S2\//i.test(f.rel) ? autresMatieres : nonClasses).push(f.rel);
  const prev = ancien.fichiers[f.rel];
  if (!prev) nouveaux.push(f.rel);
  else if (prev.hash !== hash) modifies.push(f.rel);
  nouveau.fichiers[f.rel] = { hash, size: buf.length, matiere: c.matiere, type: c.type, annee: c.annee, role: c.role, groupe: c.groupe, vu: prev?.vu ?? today };
}
const supprimes = Object.keys(ancien.fichiers).filter((r) => !nouveau.fichiers[r]);

// Regroupement en annales
const groupes = new Map<string, Entree[] & { rels?: string[] }>();
const relsParGroupe = new Map<string, string[]>();
for (const [rel, e] of Object.entries(nouveau.fichiers)) {
  if (!e.groupe) continue;
  const k = `${e.matiere}|${e.groupe}`;
  if (!groupes.has(k)) {
    groupes.set(k, []);
    relsParGroupe.set(k, []);
  }
  groupes.get(k)!.push(e);
  relsParGroupe.get(k)!.push(rel);
}

const fichesCreees: string[] = [];
const aRevoir: string[] = [];
for (const [k, entrees] of groupes) {
  const [matiere, groupe] = k.split("|");
  const e0 = entrees[0];
  const an = e0.annee ? e0.annee.slice(0, 4) : slug(basename(groupe));
  const type = e0.type!;
  const sousGroupe = !e0.annee ? "" : /\/(CC\d|Exam \d|Autre|Autres)$/i.test(groupe) ? "-" + slug(basename(groupe)) : "";
  const id = `${matiere}-${slug(type)}-${an}${sousGroupe}`;
  const dir = join(ROOT, "content", matiere, "annales");
  const existants = existsSync(dir) ? readdirSync(dir).filter((f) => f.endsWith(".json")) : [];
  const fiche = existants.map((f) => ({ f, a: JSON.parse(readFileSync(join(dir, f), "utf8")) })).find((x) => x.a.id === id);
  const rels = relsParGroupe.get(k)!;
  if (fiche) {
    if (rels.some((r) => modifies.includes(r) || nouveaux.includes(r)) && ancien.maj)
      aRevoir.push(`${id} (${fiche.a.statut === "pret" ? "déjà traitée — un fichier source a changé, à vérifier" : "à traiter"})`);
    continue;
  }
  const a = {
    id,
    matiere,
    annee: e0.annee ?? "inconnue",
    type,
    titre: `${matiere === "vba" ? "VBA" : matiere[0].toUpperCase() + matiere.slice(1)} — ${type} ${e0.annee ?? basename(groupe)}`,
    dureeMin: 120,
    corrige: entrees.some((e) => e.role === "corrige") ? "officiel" : "aucun",
    horsProgramme: false,
    statut: "a-traiter",
    chapitres: [],
    incertitudes: [
      "Fiche créée automatiquement : chapitres couverts et statut « hors programme » à déterminer lors de la transcription.",
      ...(matiere === "micro" && type !== "CC" ? ["Examen final : la partie « équilibre dans l'incertain » (séances 7 à 10) est hors programme."] : []),
    ],
    sources: rels.map((r) => `Drive L3_EIF_Dauphine › ${dirname(r)}/${anonymiser(basename(r))}`),
    exercices: [],
  };
  fichesCreees.push(`${matiere}/annales/${id}.json (${rels.length} fichier(s)${a.corrige === "officiel" ? ", avec corrigé" : ", sans corrigé"})`);
  if (!DRY) {
    mkdirSync(dir, { recursive: true });
    writeFileSync(join(dir, `${id}.json`), JSON.stringify(a, null, 2) + "\n");
  }
}

if (!DRY) {
  mkdirSync(dirname(MANIFEST), { recursive: true });
  writeFileSync(MANIFEST, JSON.stringify(nouveau, null, 2));
}

// ---------- Résumé ----------
const parMat = new Map<string, number>();
for (const e of Object.values(nouveau.fichiers)) if (e.groupe) parMat.set(e.matiere!, (parMat.get(e.matiere!) ?? 0) + 1);
const liste = (t: string, l: string[], max = 25) => {
  if (!l.length) return;
  console.log(`\n${t} (${l.length})`);
  l.slice(0, max).forEach((x) => console.log("   • " + x));
  if (l.length > max) console.log(`   … et ${l.length - max} autre(s)`);
};
console.log(`\n=== import-annales ${DRY ? "(simulation, rien n'est écrit)" : ""} ===`);
console.log(`Source : ${sources.join(" ; ")}`);
console.log(`${fichiers.length} fichiers lus · ${groupes.size} annales repérées`);
console.log("Fichiers d'annales par matière : " + [...parMat].map(([m, n]) => `${m} ${n}`).join(" · "));
if (!ancien.maj) console.log("(Premier import : tout est « nouveau ».)");
else {
  liste("🆕 Nouveaux fichiers depuis le " + ancien.maj, nouveaux);
  liste("✏️  Fichiers modifiés", modifies);
  liste("🗑️  Fichiers disparus du Drive (rien n'est supprimé du site)", supprimes);
}
liste("📄 Fiches « à traiter » créées", fichesCreees, 60);
liste("🔁 Annales existantes concernées par un changement", aRevoir);
if (autresMatieres.length) console.log(`\n📦 Annales d'autres matières (S2 : gestion de portefeuille, assurances…) ignorées : ${autresMatieres.length} fichier(s)`);
liste("❓ Fichiers d'annales non classés (matière/type introuvable)", nonClasses);
liste("🔗 Fichiers Google natifs (simples liens) — exporte-les en PDF", natifs);
liste("⛔ Fichiers illisibles ou non disponibles hors connexion — rends-les « disponibles hors connexion »", illisibles);
liste("⚪ Fichiers vides (probablement en ligne uniquement)", vides);
console.log("\nÉtape suivante : demande à Claude de transcrire les fiches « à traiter » (le script ne rédige pas le contenu).");
