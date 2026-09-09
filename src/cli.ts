#!/usr/bin/env node
import path from "node:path";
import { remainingIterations, remainingUsd } from "./core/budget.js";
import { bundledLoopsRoot, listLoops, loadLoop } from "./core/loader.js";
import { runLoop } from "./core/runner.js";
import { readState } from "./core/state.js";

type Args = {
  command: string;
  rest: string[];
  flags: Record<string, string | boolean>;
};

function parseArgs(argv: string[]): Args {
  const flags: Record<string, string | boolean> = {};
  const positional: string[] = [];
  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if (token.startsWith("--")) {
      const key = token.slice(2);
      const next = argv[i + 1];
      if (next && !next.startsWith("--")) {
        flags[key] = next;
        i += 1;
      } else {
        flags[key] = true;
      }
    } else {
      positional.push(token);
    }
  }
  return { command: positional[0] ?? "help", rest: positional.slice(1), flags };
}

function flag(flags: Record<string, string | boolean>, name: string): string | undefined {
  const value = flags[name];
  return typeof value === "string" ? value : undefined;
}

async function main(): Promise<void> {
  const { command, rest, flags } = parseArgs(process.argv.slice(2));
  const cwd = path.resolve(flag(flags, "cwd") ?? process.cwd());
  const loopsRoot = flag(flags, "loops") ?? bundledLoopsRoot();

  switch (command) {
    case "list": {
      const loops = await listLoops(loopsRoot);
      if (loops.length === 0) {
        process.stdout.write("No loops found.\n");
        return;
      }
      for (const loop of loops) {
        process.stdout.write(`${loop.id.padEnd(20)} ${loop.name}\n`);
      }
      return;
    }
    case "show": {
      const id = rest[0];
      if (!id) throw new Error("Usage: loopkit show <id>");
      const loop = await loadLoop(id, loopsRoot);
      process.stdout.write(`${loop.name} (${loop.id})\n${loop.description}\n\n${loop.sourcePath}\n`);
      return;
    }
    case "status": {
      const state = await readState(cwd);
      if (!state) {
        process.stdout.write("No .loopkit/state.json in this directory.\n");
        return;
      }
      const loop = await loadLoop(state.loopId, loopsRoot).catch(() => null);
      process.stdout.write(`loop: ${state.loopId}\n`);
      process.stdout.write(`status: ${state.status}\n`);
      process.stdout.write(`iterations: ${state.iterations.length}\n`);
      if (loop) {
        process.stdout.write(`remainingIterations: ${remainingIterations(loop, state)}\n`);
        process.stdout.write(`remainingUsd: ${remainingUsd(loop, state)}\n`);
      }
      return;
    }
    case "run": {
      const id = rest[0];
      if (!id) throw new Error("Usage: loopkit run <id> [--dry-run] [--agent <cmd>]");
      const loop = await loadLoop(id, loopsRoot);
      const maxIterations = flag(flags, "max-iterations");
      const result = await runLoop(loop, await readState(cwd), {
        cwd,
        agent: flag(flags, "agent"),
        dryRun: flags["dry-run"] === true,
        maxIterations: maxIterations ? Number(maxIterations) : undefined,
      });
      process.stdout.write(result.printed);
      if (result.state.status === "failed") process.exitCode = 1;
      return;
    }
    case "help":
    default:
      process.stdout.write(`loopkit — vertical agentic loops

Commands
  list                         bundled loops
  show <id>                    loop details
  run <id> --dry-run           print prompt and gates
  run <id> --agent <cmd>       one iteration (prompt on stdin)
  status                       read .loopkit/state.json

Flags
  --cwd <path>                 target repo (default: cwd)
  --loops <path>               loops root (default: bundled)
`);
  }
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  process.stderr.write(`${message}\n`);
  process.exitCode = 1;
});
