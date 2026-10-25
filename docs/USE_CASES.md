# ACX practical use cases

These are reproducible demonstrations, **not measured performance claims**.

## 1. Monorepo context selection
A repository contains frontend, backend and infrastructure code. An agent editing Terraform should not receive unrelated UI conventions.

Create `examples/monorepo.acx.json` with path-scoped entries, then run:

```bash
bun run cli resolve examples/monorepo.acx.json --task coding --file infra/main.tf
bun run cli resolve examples/monorepo.acx.json --task coding --file web/src/App.tsx
```

Expected: each command returns the shared rule and the matching directory-specific rule, not the other directory's rule.

## 2. Conflicting policy detection
Two selected instruction entries with the same `key` and different `content` cause resolution to fail, rather than silently choosing one. See `tests/resolver-regression.test.ts`.

## 3. Markdown migration
Keep an existing `AGENTS.md`, import it, validate the resulting ACX document, and export Codex-readable text:

```bash
bun run cli import examples/AGENTS.md --sections --out project.acx.json
bun run cli validate project.acx.json
bun run cli export project.acx.json --target codex --out CODEX_CONTEXT.md
```

This is a migration prototype, not automatic integration into Codex.

## 4. Temporary guidance
An entry with `expires_at` is excluded after its expiry timestamp. This is useful for time-limited migration notes, but does not provide secure revocation of content already delivered to an agent.

## What remains unproven
No measured reductions in token usage, hallucinations, instruction collisions or execution time. A future benchmark should compare raw AGENTS.md against ACX on identical tasks, models and repositories.
