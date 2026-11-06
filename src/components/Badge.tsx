import type { BadgeKind } from "../lib/types";

const TXT: Record<BadgeKind, string> = {
  ajout: "explication ajoutée",
  officiel: "corrigé officiel",
  propose: "corrigé proposé, non officiel",
  "hors-programme": "hors programme",
  "autre-formation": "autre formation",
};

export function Badge({ kind }: { kind: BadgeKind }) {
  return <span className={`badge badge-${kind}`}>{TXT[kind]}</span>;
}

export function Source({ text }: { text: string }) {
  if (!text) return null;
  return <div className="source">📄 Source : {text}</div>;
}
