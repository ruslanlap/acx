# ACX — Agent Context Exchange

Experimental, local-first context format and CLI for AI agents. **Draft v0.1 schema; v0.2 migration prototype. Not an adopted standard.**

## Features

- JSON Schema validation and duplicate-ID detection
- Deterministic task/path selection, expiry filtering and instruction-key conflict detection
- Lossless Markdown import (single instruction entry)
- Codex plain-text context export

## Quick start

Requires [Bun](https://bun.sh/).

```bash
bun install
bun run check
bun test
bun run cli import examples/AGENTS.md --out project.acx.json
bun run cli validate project.acx.json
bun run cli export project.acx.json --target codex --out CODEX_CONTEXT.md
bun run cli resolve examples/project.acx.json --task coding --file src/main.ts
```

The generated `CODEX_CONTEXT.md` is a context artifact, **not an automatically installed Codex configuration**. Feed it to your agent through an approved workflow; do not elevate repository content above host instructions.

## Design

- `spec/RFC-0001.md`: draft semantics and security model
- `spec/schema.json`: v0.1 document schema
- `src/core.ts`: resolver
- `src/import-markdown.ts`: lossless importer
- `src/adapter-codex.ts`: text renderer
- `src/cli.ts`: command-line interface

## Limitations

Markdown import does not parse headings into independent rules. Provenance is descriptive, not cryptographically verified. There is no semantic retrieval, remote registry or permission engine. CI results must be checked separately.

## License

MIT.
