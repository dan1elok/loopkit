# AGENTS.md

LoopKit is a library of vertical agentic loops plus a small runner.

## Layout

- `src/core/` — parse, load, budget, gates, state, one-iteration runner
- `src/cli.ts` — list / show / run / status
- `loops/<id>/LOOP.md` — the product
- `learn/` — patterns, resources, monthly digest

## Rules

- Do not add a loop without a gate.
- Do not bump more than the loop's own unit of work in one iteration.
- Tests live next to the code as `*.test.ts` (`node:test`).
- After runner changes: `npm test` and `npm run typecheck`.
