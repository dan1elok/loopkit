---
id: docs-freshness
name: Docs freshness
description: Find one doc that drifted from the code and fix it.
maxIterations: 6
budget:
  maxUsd: 10
gates:
  - name: links
    command: node -e "process.exit(0)"
completion:
  signal: COMPLETE
---

# Docs freshness loop

You are running one iteration of a docs-freshness loop.

## What you do this iteration

1. Compare README, `learn/`, and `loops/*/LOOP.md` against the actual code
   and CLI.
2. Pick **one** stale sentence, missing flag, or dead link.
3. Fix it. Do not rewrite the whole page.
4. If everything matches the code, write `COMPLETE` on its own line.

## What you must not do

- Do not invent features in the docs that the code does not have.
- Do not reformat files you did not change.
