import { useRef, useState } from "react";
import { matieres } from "../lib/content";
import { exportJson, importJson, resetAll, today, update, useProgress } from "../lib/store";

export function ReglagesPage() {
  const p = useProgress();
  const file = useRef<HTMLInputElement>(null);
  const [msg, setMsg] = useState("");

  function exporter() {
    const blob = new Blob([exportJson()], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `revision-l3-progression-${today()}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
  }
  async function importer(mode: "fusionner" | "remplacer") {
    const f = file.current?.files?.[0];
    if (!f) return setMsg("Choisis d'abord un fichier.");
    try {
      importJson(await f.text(), mode);
      setMsg(mode === "fusionner" ? "Progression fusionnée ✅" : "Progression remplacée ✅");
    } catch (e) {
      setMsg("Import impossible : " + (e as Error).message);
    }
  }

  return (
    <div className="stack">
      <h1>Réglages</h1>

      <div className="card">
        <h3>🔄 Synchroniser ordi ↔ téléphone</h3>
        <p className="small">
          Ta progression est enregistrée dans ce navigateur. Pour la transférer : <strong>Exporter</strong> ici, envoie-toi le fichier (mail, Drive…), puis sur l'autre appareil <strong>Importer → Fusionner</strong>.
        </p>
        <button className="btn btn-primary" onClick={exporter}>
          ⬇️ Exporter ma progression
        </button>
        <input ref={file} type="file" accept="application/json,.json" />
        <div className="row gap wrap">
          <button className="btn btn-ghost" onClick={() => importer("fusionner")}>
            Importer → Fusionner
          </button>
          <button className="btn btn-ghost" onClick={() => confirm("Remplacer toute la progression de cet appareil ?") && importer("remplacer")}>
            Importer → Remplacer
          </button>
        </div>
        {msg && <p className="small">{msg}</p>}
      </div>

      <div className="card">
        <h3>🎨 Thème</h3>
        <select value={p.reglages.theme} onChange={(e) => update((pp) => void (pp.reglages.theme = e.target.value as "auto"))}>
          <option value="auto">Automatique (selon l'appareil)</option>
          <option value="sombre">Sombre</option>
          <option value="clair">Clair</option>
        </select>
      </div>

      <div className="card">
        <h3>🔢 Tolérance d'arrondi des réponses numériques</h3>
        <select value={p.reglages.tolerance} onChange={(e) => update((pp) => void (pp.reglages.tolerance = Number(e.target.value)))}>
          <option value={0.001}>Stricte (0,1 %)</option>
          <option value={0.01}>Normale (1 %)</option>
          <option value={0.02}>Souple (2 %)</option>
          <option value={0.05}>Très souple (5 %)</option>
        </select>
        <p className="muted small">Certains exercices imposent leur propre tolérance.</p>
      </div>

      <div className="card">
        <h3>📅 Dates d'examen</h3>
        <p className="muted small">Les dates par défaut sont dans content/config.json ; tu peux les surcharger ici (enregistré sur cet appareil).</p>
        {matieres.map((m) =>
          m.examens.map((e) => {
            const k = `${m.id}/${e.nom}`;
            return (
              <label key={k} className="date-row">
                <span>
                  {m.emoji} {m.court} — {e.nom}
                </span>
                <input type="date" value={p.reglages.examens[k] ?? e.date ?? ""} onChange={(ev) => update((pp) => void (pp.reglages.examens[k] = ev.target.value))} />
              </label>
            );
          }),
        )}
      </div>

      <div className="card">
        <h3>🗑️ Réinitialiser</h3>
        <button className="btn btn-ko" onClick={() => confirm("Effacer toute ta progression sur cet appareil ? (pense à exporter avant)") && resetAll()}>
          Tout effacer
        </button>
      </div>
    </div>
  );
}
