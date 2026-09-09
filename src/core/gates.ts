import { exec } from "node:child_process";
import { promisify } from "node:util";
import type { Gate, GateResult } from "./types.js";

const execAsync = promisify(exec);

export async function runGates(gates: Gate[], cwd: string): Promise<GateResult[]> {
  const results: GateResult[] = [];
  for (const gate of gates) {
    results.push(await runGate(gate, cwd));
  }
  return results;
}

export async function runGate(gate: Gate, cwd: string): Promise<GateResult> {
  try {
    const { stdout, stderr } = await execAsync(gate.command, {
      cwd,
      timeout: 10 * 60 * 1000,
      maxBuffer: 2 * 1024 * 1024,
    });
    return {
      name: gate.name,
      ok: true,
      exitCode: 0,
      output: trimOutput(`${stdout}${stderr}`),
    };
  } catch (error) {
    const err = error as { code?: number; stdout?: string; stderr?: string; message?: string };
    return {
      name: gate.name,
      ok: false,
      exitCode: typeof err.code === "number" ? err.code : 1,
      output: trimOutput(`${err.stdout ?? ""}${err.stderr ?? err.message ?? ""}`),
    };
  }
}

export function allGatesPassed(results: GateResult[]): boolean {
  return results.every((result) => result.ok);
}

function trimOutput(value: string): string {
  const trimmed = value.trim();
  if (trimmed.length <= 4000) return trimmed;
  return `${trimmed.slice(0, 4000)}\n…truncated`;
}
