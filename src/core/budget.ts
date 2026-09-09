import type { LoopDefinition, LoopState } from "./types.js";

export function remainingIterations(loop: LoopDefinition, state: LoopState, override?: number): number {
  const cap = override ?? loop.maxIterations;
  return Math.max(0, cap - state.iterations.length);
}

export function remainingUsd(loop: LoopDefinition, state: LoopState): number {
  return Math.max(0, loop.budget.maxUsd - state.spentUsd);
}

export function isBudgetExhausted(loop: LoopDefinition, state: LoopState, override?: number): boolean {
  return remainingIterations(loop, state, override) === 0 || remainingUsd(loop, state) === 0;
}
