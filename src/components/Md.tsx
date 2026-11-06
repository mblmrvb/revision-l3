// Rendu Markdown + formules KaTeX ($...$ et $$...$$).
// Blocs spéciaux :  :::ajout ... :::  (explication ajoutée)   :::methode ... :::   :::attention ... :::
// Lien source :  [Ch.1 p.3](src:)  → pastille « source ».
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import type { ReactNode } from "react";

const BLOCK = /^:::(ajout|methode|attention|exemple)[ \t]*\n([\s\S]*?)\n:::[ \t]*$/gm;

const LABELS: Record<string, string> = {
  ajout: "Explication ajoutée",
  methode: "Méthode",
  attention: "Attention",
  exemple: "Exemple / intuition finance — explication ajoutée",
};

function Plain({ text, inline }: { text: string; inline?: boolean }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm, remarkMath]}
      rehypePlugins={[rehypeKatex]}
      urlTransform={(u) => u}
      components={{
        p: ({ children }) => (inline ? <span>{children}</span> : <p>{children}</p>),
        a: ({ href, children }) =>
          href?.startsWith("src:") ? (
            <span className="src-chip" title="Source">📄 {children}</span>
          ) : (
            <a href={href} target="_blank" rel="noreferrer">
              {children}
            </a>
          ),
        table: ({ children }) => (
          <div className="table-wrap">
            <table>{children}</table>
          </div>
        ),
      }}
    >
      {text}
    </ReactMarkdown>
  );
}

export function Md({ text, inline }: { text: string; inline?: boolean }) {
  if (!text) return null;
  const src = text.replace(/\r\n/g, "\n");
  const parts: ReactNode[] = [];
  let last = 0;
  let m: RegExpExecArray | null;
  BLOCK.lastIndex = 0;
  let i = 0;
  while ((m = BLOCK.exec(src))) {
    if (m.index > last) parts.push(<Plain key={i++} text={src.slice(last, m.index)} />);
    parts.push(
      <div key={i++} className={`callout callout-${m[1]}`}>
        <div className="callout-title">{LABELS[m[1]]}</div>
        <Plain text={m[2]} />
      </div>,
    );
    last = m.index + m[0].length;
  }
  if (inline && parts.length === 0) return <Plain text={src} inline />;
  if (last < src.length) parts.push(<Plain key={i++} text={src.slice(last)} />);
  return <div className="md">{parts}</div>;
}
