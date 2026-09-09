---
id: trend-watcher
name: Trend watcher
description: Scan what changed in agentic-loop land and open a dated digest PR.
maxIterations: 4
budget:
  maxUsd: 8
gates:
  - name: digest-exists
    command: node -e "const fs=require('fs');const d=new Date();const y=d.getUTCFullYear();const m=String(d.getUTCMonth()+1).padStart(2,'0');process.exit(fs.existsSync('learn/trends/'+y+'-'+m+'.md')?0:1)"
completion:
  signal: COMPLETE
---

# Trend watcher loop

You are running one iteration of the education digest loop.

## What you do this iteration

1. Read `learn/resources.md` and the latest file in `learn/trends/`.
2. Find a small number of **new** public posts, repos, or release notes
   about agentic loops, verification gates, or harness engineering.
   Prefer primary sources. Skip listicles that only restate last month.
3. Write or update `learn/trends/YYYY-MM.md` (UTC month).
   Each item: one link, one sentence on why it matters, one sentence on
   what is still missing.
4. If the month file is already current and honest, write `COMPLETE`.

## What you must not do

- Do not dump 50 links.
- Do not add a project you did not open.
- Do not claim something is "the standard" unless the source does.
