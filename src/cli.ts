import { readFile, writeFile } from "node:fs/promises";
import { resolve, validate } from "./core";
import { importMarkdown, importMarkdownSections } from "./import-markdown";
import { renderCodex } from "./adapter-codex";

const [command, file, ...args] = process.argv.slice(2);
function flag(name: string): string | undefined {
  const i = args.indexOf(name);
  return i >= 0 ? args[i + 1] : undefined;
}
function files(): string[] {
  return args.flatMap((v, i) => v === "--file" && args[i + 1] ? [args[i + 1]] : []);
}
function usage(): never {
  console.error("Usage: acx <validate|resolve|import|export> <input> [--task coding] [--file src/main.ts] [--out output] [--target codex] [--now ISO]");
  process.exit(2);
}
if (!command || !file || !["validate", "resolve", "import", "export"].includes(command)) usage();

try {
  if (command === "import") {
    const markdown = await readFile(file, "utf8");
    const doc = args.includes("--sections") ? importMarkdownSections(markdown, file) : importMarkdown(markdown, file);
    validate(doc);
    const output = JSON.stringify(doc, null, 2) + "\n";
    if (flag("--out")) await writeFile(flag("--out")!, output);
    else process.stdout.write(output);
  } else {
    const input: unknown = JSON.parse(await readFile(file, "utf8"));
    if (command === "validate") {
      validate(input);
      console.log("ACX valid");
    } else {
      const packet = resolve(input, {
        task: flag("--task") ?? "coding",
        files: files(),
        now: flag("--now")
      });
      if (command === "resolve") console.log(JSON.stringify(packet, null, 2));
      else {
        if (flag("--target") !== "codex") throw new Error("Only --target codex is supported");
        const output = renderCodex(packet);
        if (flag("--out")) await writeFile(flag("--out")!, output);
        else process.stdout.write(output);
      }
    }
  }
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
}
