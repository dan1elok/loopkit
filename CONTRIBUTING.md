# Contributing

## Add a loop

1. Create `loops/<id>/LOOP.md` with YAML front matter and a prompt.
2. `id` must match the folder name.
3. Give it at least one gate command the target repo can run.
4. One iteration = one verifiable unit of work.
5. Run `npx tsx src/cli.ts show <id>` and `run <id> --dry-run`.

## Runner changes

```bash
npm install
npm test
npm run typecheck
```

Keep the CLI small. New product behavior belongs in a loop or a gate,
not a new subcommand, until we have a reason.
