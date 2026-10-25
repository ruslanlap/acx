import { test, expect } from "bun:test";
import { importMarkdown } from "../src/import-markdown";
import { resolve, validate } from "../src/core";
import { renderCodex } from "../src/adapter-codex";

test("Markdown is preserved exactly", () => {
  const original = "# Instructions\n\n- Keep all comments.\n";
  const doc = importMarkdown(original, "AGENTS.md");
  validate(doc);
  expect(doc.entries[0]?.content).toBe(original);
  expect(doc.entries[0]?.source?.path).toBe("AGENTS.md");
});

test("Markdown survives resolution and Codex rendering", () => {
  const doc = importMarkdown("Never delete tests.");
  const packet = resolve(doc, { task: "coding", files: [] });
  expect(renderCodex(packet)).toContain("Never delete tests.");
});

test("Empty Markdown is rejected", () => {
  expect(() => importMarkdown("  ")).toThrow("empty");
});
