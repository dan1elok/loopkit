---
id: dep-upgrade
name: Dependency upgrade
description: Bump one outdated dependency, fix the breakage, leave the suite green.
maxIterations: 8
budget:
  maxUsd: 15
gates:
  - name: tests
    command: npm test
  - name: lint
    command: npm run lint
completion:
  signal: COMPLETE
---

# Dependency upgrade loop

You are running one iteration of a dependency-upgrade loop.

## What you do this iteration

1. Read the repo. Find the package manager (npm, pnpm, pip, go, cargo).
2. List outdated dependencies. Pick **one** that is safe to attempt.
   Prefer patch/minor over major. Skip abandoned packages.
3. Bump it. Run the project's existing test and lint commands.
4. If something breaks, fix **only** what this bump broke.
5. Commit if the working tree is a git repo and the gates would pass.
6. If nothing remains to bump, write `COMPLETE` on its own line and stop.

## What you must not do

- Do not bump more than one dependency per iteration.
- Do not rewrite unrelated files to "clean things up".
- Do not claim COMPLETE if tests are failing or skipped.
- Do not invent a test runner. Use what the repo already has.

## Memory

Previous iterations left git history and, if present, `.loopkit/state.json`.
Read those before choosing the next dependency.
