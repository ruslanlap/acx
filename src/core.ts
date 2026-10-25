import Ajv from "ajv";
import schema from "../spec/schema.json";

export type Entry = { id: string; kind: "instruction" | "memory" | "skill"; key?: string; content: string; scope?: { tasks?: string[]; paths?: string[] }; source?: { type: string; path?: string }; expires_at?: string | null };
export type Document = { acx_version: "0.1.0"; id: string; kind: "context"; entries: Entry[] };
export type Packet = { acx_version: string; context_id: string; entries: Entry[] };
const ajv = new Ajv({ allErrors: true, strict: false, validateFormats: false });
const validateSchema = ajv.compile(schema);

export function validate(input: unknown): asserts input is Document {
  if (!validateSchema(input)) throw new Error("Invalid ACX document: " + ajv.errorsText(validateSchema.errors));
  const doc = input as Document;
  const ids = new Set<string>();
  for (const entry of doc.entries) {
    if (ids.has(entry.id)) throw new Error("Duplicate entry ID: " + entry.id);
    ids.add(entry.id);
    if (entry.expires_at != null && !Number.isFinite(Date.parse(entry.expires_at))) throw new Error("Invalid expiry: " + entry.id);
  }
}

function globMatches(glob: string, path: string): boolean {
  const escaped = glob.replace(/[.+^${}()|[\]\\]/g, "\\$&");
  const pattern = escaped.replace(/\*\*\//g, "\u0001").replace(/\*\*/g, "\u0002").replace(/\*/g, "[^/]*").replace(/\u0001/g, "(?:.*/)?").replace(/\u0002/g, ".*").replace(/\?/g, "[^/]");
  return new RegExp("^" + pattern + "$").test(path);
}

export function resolve(input: unknown, options: { task: string; files: string[]; now?: string }): Packet {
  validate(input);
  const doc = input as Document;
  const now = Date.parse(options.now ?? new Date().toISOString());
  if (!Number.isFinite(now)) throw new Error("Invalid evaluation time");
  const entries = doc.entries.filter(e => {
    if (e.expires_at && Date.parse(e.expires_at) <= now) return false;
    if (e.scope?.tasks?.length && !e.scope.tasks.includes(options.task)) return false;
    if (e.scope?.paths?.length && !options.files.some(f => e.scope!.paths!.some(p => globMatches(p, f)))) return false;
    return true;
  }).sort((a,b) => a.id.localeCompare(b.id, "en"));
  const keyed = new Map<string, Entry>();
  for (const entry of entries) {
    if (entry.kind !== "instruction" || !entry.key) continue;
    const previous = keyed.get(entry.key);
    if (previous && previous.content !== entry.content) throw new Error("Conflicting instruction key: " + entry.key + " (" + previous.id + ", " + entry.id + ")");
    keyed.set(entry.key, entry);
  }
  return { acx_version: doc.acx_version, context_id: doc.id, entries };
}
