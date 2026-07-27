# The Ralph pattern

A Ralph loop restarts the same agent on the same prompt, over and over,
until the job is done.

Each pass gets a **fresh context window**. The agent does not carry the
chat forward. It reads the repo, the task file, and git history, does
**one** unit of work, verifies it, and exits. The outer script starts
it again.

## Why it works

Long chats rot. The model forgets constraints, repeats itself, or
"finishes" because the window is full. Resetting context and persisting
progress on disk avoids that.

## What LoopKit adds

The loop idea is not ours. The missing piece is **vertical loops**: a
ready protocol for a specific recurring job, plus gates that reject
work the tests do not accept.

A loop without a gate is just a retry storm with extra steps.

## Minimal shape

```text
while not complete and under budget:
  start agent with LOOP.md (fresh context)
  agent reads disk + git, does one unit, exits
  run gates
  if gates fail: reject the iteration
  if agent emitted COMPLETE and gates pass: stop
```
