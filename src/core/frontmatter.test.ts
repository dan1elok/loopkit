import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { parseLoopMarkdown, sawCompletionSignal } from "./frontmatter.js";

const SAMPLE = `---
id: dep-upgrade
name: Dependency upgrade
description: Bump one dep.
maxIterations: 8
budget:
  maxUsd: 15
gates:
  - name: tests
    command: npm test
completion:
  signal: COMPLETE
---

# Prompt

Do one bump.
`;

describe("parseLoopMarkdown", () => {
  it("reads front matter and prompt", () => {
    const loop = parseLoopMarkdown(SAMPLE, "loops/dep-upgrade/LOOP.md");
    assert.equal(loop.id, "dep-upgrade");
    assert.equal(loop.gates[0]?.command, "npm test");
    assert.equal(loop.prompt.includes("Do one bump."), true);
  });

  it("rejects a file without front matter", () => {
    assert.throws(() => parseLoopMarkdown("# just a prompt\n", "x.md"));
  });
});

describe("sawCompletionSignal", () => {
  it("matches a lone COMPLETE line", () => {
    assert.equal(sawCompletionSignal("bumped lodash\nCOMPLETE\n", "COMPLETE"), true);
  });

  it("ignores COMPLETE inside a sentence", () => {
    assert.equal(sawCompletionSignal("not COMPLETE yet\n", "COMPLETE"), false);
  });
});
