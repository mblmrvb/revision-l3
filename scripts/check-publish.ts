// Vérifie que le site construit (dist/) ne contient ni fichier source brut ni chemin personnel.
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, extname } from "node:path";

const DIST = join(import.meta.dirname, "..", "dist");
const INTERDITS_EXT = [".pdf", ".pptx", ".ppt", ".xlsx", ".xls", ".xlsm", ".docx", ".doc", ".zip", ".jpg", ".jpeg", ".R", ".Rmd"];
const INTERDITS_TXT = [/[A-Z]:\\Users\\/i, /\/Users\/[a-z]/i, /OneDrive -/i, /Mon Drive/i, /My Drive/i, /GoogleDrive-/i, /CloudStorage/i,/\\Downloads\\/i];

const problemes: string[] = [];
function walk(dir: string) {
  for (const f of readdirSync(dir)) {
    const p = join(dir, f);
    if (statSync(p).isDirectory()) walk(p);
    else {
      if (INTERDITS_EXT.includes(extname(f)) || INTERDITS_EXT.includes(extname(f).toLowerCase())) problemes.push(`fichier source publié : ${p}`);
      if ([".html", ".js", ".css", ".json", ".webmanifest", ".txt"].includes(extname(f))) {
        const txt = readFileSync(p, "utf8");
        for (const re of INTERDITS_TXT) {
          const m = txt.match(re);
          if (m) problemes.push(`chemin/donnée personnelle « ${m[0]} » dans ${p}`);
        }
      }
    }
  }
}
walk(DIST);
if (problemes.length) {
  problemes.forEach((x) => console.error("❌", x));
  process.exit(1);
}
console.log("✅ dist/ ne contient aucun fichier source brut ni chemin personnel.");
