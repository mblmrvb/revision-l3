// Bouton « Demander à Claude » : prépare un message et ouvre claude.ai (aucune clé, aucun coût).
export interface ContexteQuestion {
  matiere: string;
  chapitre?: string;
  type: string; // "notion", "QCM", "exercice", "annale"...
  enonce?: string;
  maReponse?: string;
  erreur?: string;
  source?: string;
  correction?: string;
}

const MAX_URL = 6000;

export function construirePrompt(ctx: ContexteQuestion, question: string): string {
  const lignes = [
    `Je révise la matière « ${ctx.matiere} » (L3 Économie appliquée, Paris-Dauphine)${ctx.chapitre ? `, chapitre « ${ctx.chapitre} »` : ""}.`,
    `Contexte (${ctx.type}) :`,
    ctx.enonce ? `- Énoncé / notion : ${ctx.enonce}` : "",
    ctx.maReponse ? `- Ma réponse : ${ctx.maReponse}` : "",
    ctx.erreur ? `- Ce qui n'allait pas : ${ctx.erreur}` : "",
    ctx.correction ? `- Correction de référence : ${ctx.correction}` : "",
    ctx.source ? `- Source du cours : ${ctx.source}` : "",
    "",
    `Ma question : ${question}`,
    "",
    "Consignes pour toi : guide-moi par indices progressifs avant de donner la solution complète, reste dans le programme de mon cours (signale si tu en sors), écris les formules en LaTeX, et termine par une question pour vérifier que j'ai compris.",
  ];
  return lignes.filter((l) => l !== "").join("\n").replace(/\n(?=Ma question|Consignes)/g, "\n\n");
}

/** Ouvre claude.ai avec le message pré-rempli ; s'il est trop long, il est copié dans le presse-papiers. */
export async function demanderAClaude(prompt: string): Promise<"prerempli" | "copie"> {
  let copie = false;
  try {
    await navigator.clipboard.writeText(prompt);
    copie = true;
  } catch {
    /* presse-papiers refusé */
  }
  const url = "https://claude.ai/new?q=" + encodeURIComponent(prompt);
  if (url.length <= MAX_URL) {
    window.open(url, "_blank", "noopener");
    return "prerempli";
  }
  window.open("https://claude.ai/new", "_blank", "noopener");
  return copie ? "copie" : "prerempli";
}
