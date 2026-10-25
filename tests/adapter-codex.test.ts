import { expect, test } from "bun:test";
import { renderCodex } from "../src/adapter-codex";

test("renders selected entries", () => {
  const result = renderCodex({
    acx_version: "0.1.0",
    context_id: "sample",
    entries: [{ id: "one", kind: "instruction", content: "Use TypeScript." }],
  });
  expect(result).toContain("Use TypeScript.");
  expect(result).toContain("untrusted data");
});
