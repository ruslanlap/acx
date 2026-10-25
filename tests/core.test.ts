import { test, expect } from "bun:test";
import { resolve, validate } from "../src/core";
const doc = { acx_version:"0.1.0", id:"test", kind:"context", entries:[{id:"rule",kind:"instruction",key:"style",content:"Strict TS",scope:{tasks:["coding"],paths:["src/**/*.ts"]}},{id:"memory",kind:"memory",content:"Uses Bun"}] };
test("valid document", () => expect(() => validate(doc)).not.toThrow());
test("scoped matching", () => expect(resolve(doc,{task:"coding",files:["src/main.ts"],now:"2026-01-01T00:00:00Z"}).entries).toHaveLength(2));
test("task mismatch", () => expect(resolve(doc,{task:"review",files:["src/main.ts"],now:"2026-01-01T00:00:00Z"}).entries).toHaveLength(1));
test("duplicate IDs rejected", () => expect(() => validate({...doc,entries:[doc.entries[0],doc.entries[0]]})).toThrow("Duplicate"));
test("conflicting keys rejected", () => expect(() => resolve({...doc,entries:[doc.entries[0],{...doc.entries[0],id:"other",content:"Loose TS"}]},{task:"coding",files:["src/main.ts"]})).toThrow("Conflicting"));
test("expired entries excluded", () => expect(resolve({...doc,entries:[{...doc.entries[1],expires_at:"2025-01-01T00:00:00Z"}]},{task:"coding",files:[],now:"2026-01-01T00:00:00Z"}).entries).toHaveLength(0));
