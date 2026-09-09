# Why gates exist

A loop that cannot fail closed will burn tokens and ship breakage.

The agent proposes. The gate decides. If `npm test` fails, the iteration
is rejected no matter how confident the model sounded.

## Mechanical first

Prefer commands the repo already has:

- tests
- lint / typecheck
- `npm run build`
- a file-exists check (see `trend-watcher`)

An LLM-as-judge can sit **behind** those, not instead of them.

## What a failed gate means

Do not let the next iteration pretend the failed work landed. The
runner records `accepted: false`. The next pass should read
`.loopkit/state.json` and git, then try a smaller change.
