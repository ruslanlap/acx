# Changelog

## [0.2.0-alpha.1] — Unreleased prerelease candidate

### Added
- Draft ACX v0.1 JSON Schema and RFC
- Deterministic context resolver with task and path filtering
- Validation for duplicate IDs and instruction-key conflicts
- Markdown import, including opt-in heading-based section splitting
- Codex plain-text renderer and `export --target codex` CLI command
- GitHub Actions checks and automated tests

### Fixed
- Use AJV's JSON Schema 2020-12 implementation
- Correct recursive glob matching for paths directly under a directory

### Known limitations
- Schema version remains `0.1.0`; package version is `0.2.0-alpha.1`
- Generated Codex text is not automatically installed into an agent
- Markdown section import does not infer trust or authority
- No published package, release tag or benchmark yet
