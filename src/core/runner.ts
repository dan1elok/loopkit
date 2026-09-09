import { spawn } from "node:child_process";
import { isBudgetExhausted } from "./budget.js";
import { sawCompletionSignal } from "./frontmatter.js";
import { allGatesPassed, runGates } from "./gates.js";
import { emptyState, writeState } from "./state.js";
import type { LoopDefinition, LoopState } from "./types.js";

export type RunOptions = {
  cwd: string;
  agent?: string;
  dryRun?: boolean;
  maxIterations?: number;
  now?: () => string;
};

export type RunResult = {
  state: LoopState;
  printed: string;
};

export async function runLoop(
  loop: LoopDefinition,
  state: LoopState | null,
  options: RunOptions,
): Promise<RunResult> {
  const now = options.now ?? (() => new Date().toISOString());
  const current = state && state.loopId === loop.id ? state : emptyState(loop.id, now());

  if (options.dryRun) {
    const printed = renderDryRun(loop);
    return { state: current, printed };
  }

  if (!options.agent) {
    throw new Error("Pass --agent <command> or --dry-run");
  }

  if (current.status === "complete") {
    return { state: current, printed: `Loop ${loop.id} is already complete.\n` };
  }

  if (isBudgetExhausted(loop, current, options.maxIterations)) {
    current.status = "budget";
    current.updatedAt = now();
    await writeState(options.cwd, current);
    return { state: current, printed: `Budget exhausted for ${loop.id}.\n` };
  }

  const startedAt = now();
  const agent = await runAgent(options.agent, loop.prompt, options.cwd);
  const complete = sawCompletionSignal(agent.stdout, loop.completion.signal);
  const gates = await runGates(loop.gates, options.cwd);
  const accepted = agent.exitCode === 0 && allGatesPassed(gates);

  current.iterations.push({
    n: current.iterations.length + 1,
    startedAt,
    endedAt: now(),
    agentExitCode: agent.exitCode,
    gates,
    accepted,
    complete: accepted && complete,
  });
  current.updatedAt = now();
  current.status = accepted && complete ? "complete" : accepted ? "running" : "failed";

  await writeState(options.cwd, current);

  const printed = renderIteration(loop, current);
  return { state: current, printed };
}

function renderDryRun(loop: LoopDefinition): string {
  const gates = loop.gates.map((gate) => `  - ${gate.name}: ${gate.command}`).join("\n");
  return [
    `loop: ${loop.id}`,
    `name: ${loop.name}`,
    `maxIterations: ${loop.maxIterations}`,
    `budgetUsd: ${loop.budget.maxUsd}`,
    `signal: ${loop.completion.signal}`,
    `gates:`,
    gates || "  (none)",
    "",
    "--- prompt ---",
    loop.prompt,
    "",
  ].join("\n");
}

function renderIteration(loop: LoopDefinition, state: LoopState): string {
  const last = state.iterations[state.iterations.length - 1];
  if (!last) return "";
  const gateLines = last.gates
    .map((gate) => `  ${gate.ok ? "pass" : "fail"} ${gate.name}`)
    .join("\n");
  return [
    `iteration ${last.n} ${last.accepted ? "accepted" : "rejected"} (${state.status})`,
    gateLines || "  (no gates)",
    last.complete ? `signal ${loop.completion.signal} seen` : "",
    `state: .loopkit/state.json`,
    "",
  ]
    .filter((line) => line !== "")
    .join("\n");
}

function runAgent(command: string, prompt: string, cwd: string): Promise<{ exitCode: number; stdout: string }> {
  return new Promise((resolve, reject) => {
    const child = spawn(command, {
      cwd,
      shell: true,
      stdio: ["pipe", "pipe", "pipe"],
    });
    let stdout = "";
    child.stdout.on("data", (chunk: Buffer) => {
      stdout += chunk.toString();
    });
    child.stderr.on("data", (chunk: Buffer) => {
      stdout += chunk.toString();
    });
    child.on("error", reject);
    child.on("close", (code) => {
      resolve({ exitCode: code ?? 1, stdout });
    });
    child.stdin.on("error", (error: NodeJS.ErrnoException) => {
      if (error.code === "EPIPE") return;
      reject(error);
    });
    child.stdin.end(prompt);
  });
}
