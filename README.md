# ACX — Agent Context Exchange

Experimental, local-first specification and CLI for portable AI-agent context. **Draft v0.1.0; not an established standard.**

## Goals

- Validate structured context and provenance.
- Select instructions deterministically by task and path.
- Detect duplicate IDs and conflicting scoped instructions.
- Produce auditable context packets for agent adapters.

## Quick start

```bash
bun install
bun test
bun run cli validate examples/project.acx.json
bun run cli resolve examples/project.acx.json --task coding --file src/main.ts
```

## Layout

- `spec/RFC-0001.md` — draft semantics and threat model
- `spec/schema.json` — JSON Schema
- `src/core.ts` — deterministic validation and resolution
- `src/cli.ts` — minimal CLI
- `examples/` — sample context

ACX does not grant permissions or execute tools. Adapters must respect their host's instruction hierarchy and security controls. Markdown import and agent-specific adapters are future milestones.

Contributions welcome; see CONTRIBUTING.md.
