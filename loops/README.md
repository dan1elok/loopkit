# Loop format

A loop is a folder under `loops/` with a `LOOP.md` file.

The file starts with YAML front matter, then a prompt the agent sees
each iteration.

```yaml
---
id: dep-upgrade
name: Dependency upgrade
maxIterations: 8
budget:
  maxUsd: 15
gates:
  - name: tests
    command: npm test
completion:
  signal: COMPLETE
---
```

## Rules

1. One iteration does one verifiable unit of work, then exits.
2. The filesystem and git history are memory. The chat is not.
3. Gates are mechanical. If a gate fails, the iteration is rejected.
4. The agent writes `COMPLETE` (or the configured signal) only when
   the job is actually done — not when it is tired.
