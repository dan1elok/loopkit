import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { isBudgetExhausted, remainingIterations, remainingUsd } from "./budget.js";
import { emptyState } from "./state.js";
import type { LoopDefinition } from "./types.js";

const loop: LoopDefinition = {
  id: "demo",
  name: "Demo",
  description: "",
  maxIterations: 3,
  budget: { maxUsd: 10 },
  gates: [],
  completion: { signal: "COMPLETE" },
  prompt: "",
  sourcePath: "x",
};

describe("budget", () => {
  it("counts remaining iterations", () => {
    const state = emptyState("demo");
    state.iterations = [
      {
        n: 1,
        startedAt: "",
        endedAt: "",
        agentExitCode: 0,
        gates: [],
        accepted: true,
        complete: false,
      },
    ];
    assert.equal(remainingIterations(loop, state), 2);
    assert.equal(remainingUsd(loop, state), 10);
    assert.equal(isBudgetExhausted(loop, state), false);
  });

  it("exhausts when spend hits the cap", () => {
    const state = emptyState("demo");
    state.spentUsd = 10;
    assert.equal(isBudgetExhausted(loop, state), true);
  });
});
