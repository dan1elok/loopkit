import assert from "node:assert/strict";
import { mkdtemp, readFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { describe, it } from "node:test";
import { runLoop } from "./runner.js";
import type { LoopDefinition } from "./types.js";

const loop: LoopDefinition = {
  id: "docs-freshness",
  name: "Docs freshness",
  description: "",
  maxIterations: 4,
  budget: { maxUsd: 5 },
  gates: [{ name: "ok", command: "true" }],
  completion: { signal: "COMPLETE" },
  prompt: "fix one stale doc",
  sourcePath: "x",
};

describe("runLoop", () => {
  it("prints a dry run without writing state", async () => {
    const cwd = await mkdtemp(path.join(tmpdir(), "loopkit-"));
    const result = await runLoop(loop, null, { cwd, dryRun: true });
    assert.match(result.printed, /loop: docs-freshness/);
    assert.match(result.printed, /fix one stale doc/);
    assert.equal(result.state.iterations.length, 0);
  });

  it("accepts an iteration when the agent emits COMPLETE and gates pass", async () => {
    const cwd = await mkdtemp(path.join(tmpdir(), "loopkit-"));
    const result = await runLoop(loop, null, {
      cwd,
      agent: "printf 'COMPLETE\\n'",
    });
    assert.equal(result.state.status, "complete");
    assert.equal(result.state.iterations[0]?.accepted, true);
    const saved = await readFile(path.join(cwd, ".loopkit", "state.json"), "utf8");
    assert.match(saved, /"status": "complete"/);
  });
});
