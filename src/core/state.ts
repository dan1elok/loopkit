import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import type { LoopState } from "./types.js";

export function statePath(cwd: string): string {
  return path.join(cwd, ".loopkit", "state.json");
}

export function emptyState(loopId: string, now = new Date().toISOString()): LoopState {
  return {
    loopId,
    startedAt: now,
    updatedAt: now,
    spentUsd: 0,
    status: "idle",
    iterations: [],
  };
}

export async function readState(cwd: string): Promise<LoopState | null> {
  try {
    const raw = await readFile(statePath(cwd), "utf8");
    return JSON.parse(raw) as LoopState;
  } catch {
    return null;
  }
}

export async function writeState(cwd: string, state: LoopState): Promise<void> {
  const file = statePath(cwd);
  await mkdir(path.dirname(file), { recursive: true });
  await writeFile(file, `${JSON.stringify(state, null, 2)}\n`, "utf8");
}
