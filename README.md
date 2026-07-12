# LoopKit

Vertical agentic loops with verification gates.

You describe a recurring job. LoopKit runs an agent against it, iteration by
iteration, and only accepts work that passes mechanical checks (tests, lint,
typecheck, or a custom command). State lives on disk and in git — not in the
chat window.

This repo is early. The first loop is a dependency-upgrade protocol.

## Why

Generic "run an agent until done" wrappers already exist. What's missing is
**ready-to-run loops for specific jobs**: bump deps and actually fix the
breakage, hunt flaky tests, keep docs honest.

## Status

Sketching the loop format and the first protocol. Not a product yet.
