import type { Document, Entry } from "./core";

/** Preserve the entire Markdown document without interpreting its authority. */
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

/**
 * Optional section-level import. ATX headings outside fenced code blocks
 * delimit sections. Original text remains unchanged within each section.
 */
export function importMarkdownSections(markdown: string, path = "AGENTS.md"): Document {
  if (!markdown.trim()) throw new Error("Markdown input is empty");
  const lines = markdown.match(/[^\n]*\n|[^\n]+$/g) ?? [];
  const sections: string[] = [];
  let current = "";
  let fence: { marker: string; length: number } | null = null;
  for (const line of lines) {
    const trimmed = line.trimStart();
    const fenceMatch = /^(\`{3,}|~{3,})/.exec(trimmed);
    if (fenceMatch) {
      const marker = fenceMatch[1][0];
      const length = fenceMatch[1].length;
      if (!fence) fence = { marker, length };
      else if (marker === fence.marker && length >= fence.length) fence = null;
    }
    const heading = !fence && /^#{1,6}\s+\S/.test(trimmed);
    if (heading && current.trim()) {
      sections.push(current);
      current = "";
    }
    current += line;
  }
  if (current.trim()) sections.push(current);
  const entries: Entry[] = sections.map((content, index) => ({
    id: "section-" + String(index + 1).padStart(3, "0"),
    kind: "instruction",
    content,
    source: { type: "file", path }
  }));
  return { acx_version: "0.1.0", id: "imported-context", kind: "context", entries };
}
