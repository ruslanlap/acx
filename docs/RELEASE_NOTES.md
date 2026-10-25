# ACX v0.2.0-alpha.1

First experimental alpha of Agent Context Exchange (ACX).

## Highlights
- Local-first JSON context documents with provenance metadata
- Schema validation, scoped resolution, expiry filtering, duplicate-ID and instruction-key conflict detection
- Import from AGENTS.md (lossless or section-based)
- Export resolved context as plain text for Codex
- Bun CLI and automated tests

## Try it
```bash
git clone https://github.com/ruslanlap/acx.git
cd acx
bun install
bun test
bun run cli import examples/AGENTS.md --sections --out project.acx.json
bun run cli export project.acx.json --target codex --out CODEX_CONTEXT.md
```

## Caveats
This is a prototype, not a broadly adopted standard. ACX does not grant tool permissions. Exported context is not automatically installed in Codex. The schema remains version 0.1.0. There is no published npm package or benchmark demonstrating performance improvements.
