# v0.2.0-alpha.1 release checklist

This is a release candidate; **do not publish a GitHub Release or tag before CI passes on the final commit**.

1. Confirm CI success for the final commit on the default branch.
2. Run `bun install && bun run check && bun test`.
3. Run `bun run cli import examples/AGENTS.md --sections --out /tmp/project.acx.json`.
4. Run `bun run cli export /tmp/project.acx.json --target codex --out /tmp/CODEX_CONTEXT.md`.
5. Inspect the output and confirm that it contains the original Markdown content.
6. Create tag `v0.2.0-alpha.1` on the verified commit.
7. Publish a GitHub **pre-release** using the CHANGELOG entry.

No npm publication is intended: the package is currently private.
