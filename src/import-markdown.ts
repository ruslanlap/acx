import type { Document } from "./core";

/** Lossless Markdown import: preserves the full document as one untrusted instruction entry. */
export function importMarkdown(markdown: string, path = "AGENTS.md"): Document {
  if (!markdown.trim()) throw new Error("Markdown input is empty");
  return {
    acx_version: "0.1.0",
    id: "imported-context",
    kind: "context",
    entries: [{
      id: "markdown-instructions",
      kind: "instruction",
      content: markdown,
      source: { type: "file", path }
    }]
  };
}
