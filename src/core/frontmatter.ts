import { parse as parseYaml } from "yaml";
import type { LoopDefinition } from "./types.js";

const FRONTMATTER = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/;

type RawLoop = {
  id?: unknown;
  name?: unknown;
  description?: unknown;
  maxIterations?: unknown;
  budget?: { maxUsd?: unknown };
  gates?: unknown;
  completion?: { signal?: unknown };
};

function asString(value: unknown, field: string): string {
  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(`LOOP.md is missing a valid string field: ${field}`);
  }
  return value.trim();
}

function asNumber(value: unknown, field: string, fallback: number): number {
  if (value === undefined) return fallback;
  if (typeof value !== "number" || !Number.isFinite(value) || value <= 0) {
    throw new Error(`LOOP.md field ${field} must be a positive number`);
  }
  return value;
}

export function parseLoopMarkdown(markdown: string, sourcePath: string): LoopDefinition {
  const match = markdown.match(FRONTMATTER);
  if (!match) {
    throw new Error(`LOOP.md must start with YAML front matter: ${sourcePath}`);
  }

  const raw = parseYaml(match[1]) as RawLoop | null;
  if (!raw || typeof raw !== "object") {
    throw new Error(`LOOP.md front matter is not an object: ${sourcePath}`);
  }

  const gates = Array.isArray(raw.gates)
    ? raw.gates.map((gate, index) => {
        if (!gate || typeof gate !== "object") {
          throw new Error(`gates[${index}] must be an object`);
        }
        const row = gate as { name?: unknown; command?: unknown };
        return {
          name: asString(row.name, `gates[${index}].name`),
          command: asString(row.command, `gates[${index}].command`),
        };
      })
    : [];

  return {
    id: asString(raw.id, "id"),
    name: asString(raw.name, "name"),
    description: typeof raw.description === "string" ? raw.description.trim() : "",
    maxIterations: asNumber(raw.maxIterations, "maxIterations", 8),
    budget: {
      maxUsd: asNumber(raw.budget?.maxUsd, "budget.maxUsd", 15),
    },
    gates,
    completion: {
      signal: asString(raw.completion?.signal ?? "COMPLETE", "completion.signal"),
    },
    prompt: match[2].trim(),
    sourcePath,
  };
}

export function sawCompletionSignal(text: string, signal: string): boolean {
  const token = signal.trim();
  if (token === "") return false;
  const line = new RegExp(`^${escapeRegExp(token)}$`, "m");
  return line.test(text);
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
