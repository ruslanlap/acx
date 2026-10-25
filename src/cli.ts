import { readFile } from "node:fs/promises";
import { resolve, validate } from "./core";
const [command, file, ...args] = process.argv.slice(2);
function flag(name: string): string | undefined { const i = args.indexOf(name); return i >= 0 ? args[i + 1] : undefined; }
if (!["validate", "resolve"].includes(command ?? "") || !file) {
  console.error("Usage: bun src/cli.ts <validate|resolve> <file> [--task coding] [--file src/main.ts] [--now ISO_TIMESTAMP]");
  process.exit(2);
}
try {
  const input: unknown = JSON.parse(await readFile(file, "utf8"));
  if (command === "validate") { validate(input); console.log("ACX valid"); }
  else console.log(JSON.stringify(resolve(input, { task: flag("--task") ?? "coding", files: args.flatMap((v,i) => v === "--file" && args[i+1] ? [args[i+1]] : []), now: flag("--now") }), null, 2));
} catch (e) { console.error(e instanceof Error ? e.message : String(e)); process.exit(1); }
