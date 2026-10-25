import { expect, test } from "bun:test";
import { resolve } from "../src/core";

function documentFor(pattern: string) {
  return {
    acx_version: "0.1.0",
    id: "regression",
    kind: "context",
    entries: [{ id: "rule", kind: "instruction", content: "Rule", scope: { paths: [pattern] } }]
  };
}

test("recursive glob matches immediate child", () => {
  expect(resolve(documentFor("src/**/*.ts"), { task: "coding", files: ["src/main.ts"] }).entries).toHaveLength(1);
});

test("recursive glob matches nested child", () => {
  expect(resolve(documentFor("src/**/*.ts"), { task: "coding", files: ["src/ui/button.ts"] }).entries).toHaveLength(1);
});

test("single star does not match nested child", () => {
  expect(resolve(documentFor("src/*.ts"), { task: "coding", files: ["src/ui/button.ts"] }).entries).toHaveLength(0);
});

test("conflicting instruction keys are rejected when selected", () => {
  const doc = {
    acx_version: "0.1.0", id: "regression", kind: "context",
    entries: [
      { id: "a", kind: "instruction", key: "style", content: "A", scope: { paths: ["src/**/*.ts"] } },
      { id: "b", kind: "instruction", key: "style", content: "B", scope: { paths: ["src/**/*.ts"] } }
    ]
  };
  expect(() => resolve(doc, { task: "coding", files: ["src/main.ts"] })).toThrow("Conflicting");
});
