import { expect, test } from "bun:test";
import { importMarkdownSections } from "../src/import-markdown";

test("splits top-level Markdown into independently addressable entries", () => {
  const source = "# Rules\nUse strict TS.\n## Tests\nRun tests.\n";
  const doc = importMarkdownSections(source);
  expect(doc.entries).toHaveLength(2);
  expect(doc.entries.map(entry => entry.content).join("")).toBe(source);
});

test("does not split headings inside fenced code", () => {
  const source = "# Rules\n\`\`\`md\n# Not a heading\n\`\`\`\n## Tests\nRun tests.\n";
  const doc = importMarkdownSections(source);
  expect(doc.entries).toHaveLength(2);
  expect(doc.entries.map(entry => entry.content).join("")).toBe(source);
});

test("retains preamble before first heading", () => {
  const source = "Preamble\n# Rules\nDo this.\n";
  const doc = importMarkdownSections(source);
  expect(doc.entries).toHaveLength(2);
  expect(doc.entries.map(entry => entry.content).join("")).toBe(source);
});
