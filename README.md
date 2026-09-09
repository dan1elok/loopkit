# LoopKit

Vertical agentic loops with verification gates.

Generic "run an agent until done" wrappers already exist. LoopKit ships
**ready protocols for specific recurring jobs**, plus mechanical gates that
reject work the tests do not accept.

Each iteration starts with a fresh context. Memory is the filesystem and
git history — not the chat.

## Bundled loops

| Loop | Job |
|------|-----|
| `dep-upgrade` | Bump one dependency, fix the breakage, leave the suite green |
| `docs-freshness` | Find one doc that drifted from the code and fix it |
| `trend-watcher` | Write the monthly digest in `learn/trends/` |

More loops belong here. A loop without a gate is a retry storm.

## Install

```bash
git clone https://github.com/dan1elok/loopkit.git
cd loopkit
npm install
```

Requires Node 20+.

## Usage

```bash
npx tsx src/cli.ts list
npx tsx src/cli.ts show dep-upgrade
npx tsx src/cli.ts run dep-upgrade --dry-run
npx tsx src/cli.ts run dep-upgrade --agent 'claude -p' --cwd /path/to/target-repo
npx tsx src/cli.ts status --cwd /path/to/target-repo
```

`--dry-run` prints the prompt and gates. It does not call a model.

`--agent` is any command that reads the prompt on stdin. Point it at
Claude Code, Codex, Cursor's headless agent, or a stub for tests.

State is written to `<cwd>/.loopkit/state.json`.

## How a loop is defined

A folder under `loops/<id>/LOOP.md`: YAML front matter + the prompt the
agent sees every iteration. See `loops/README.md`.

## Learn

The education hub lives in [`learn/`](learn/README.md):

- [The Ralph pattern](learn/patterns/ralph.md)
- [Why gates exist](learn/patterns/gates.md)
- [Curated resources](learn/resources.md)
- [Monthly trend digest](learn/trends/)

`trend-watcher` is meant to keep that digest honest.

## Status

Public v0. Not on npm yet. The runner, three loops, and the learn
section are the surface.

## License

MIT
