---
id: issue-triager
name: Issue triager
description: Label one open issue, reproduce it if you can, and leave a next-step comment.
maxIterations: 8
budget:
  maxUsd: 10
gates:
  - name: gh-available
    command: gh --version
completion:
  signal: COMPLETE
---

# Issue triager loop

You are running one iteration of an issue-triage loop.

## What you do this iteration

1. List open issues in this repo (`gh issue list`).
2. Pick **one** that has no label, or a stale "needs triage" state.
3. Read the body. If you can reproduce from the repo, say so in a comment.
4. Add the smallest honest labels (`bug`, `loop`, `docs`).
5. Comment the next step (fix, needs info, or not a loop).
6. If every open issue is already labeled and has a next step, write `COMPLETE`.

## What you must not do

- Do not close an issue unless the reporter confirmed it.
- Do not touch more than one issue per iteration.
- Do not invent labels the repo does not use.
