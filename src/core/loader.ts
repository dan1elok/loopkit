import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parseLoopMarkdown } from "./frontmatter.js";
import type { LoopDefinition } from "./types.js";

export function bundledLoopsRoot(): string {
  const here = path.dirname(fileURLToPath(import.meta.url));
  return path.resolve(here, "../../loops");
}

export async function loadLoop(id: string, loopsRoot = bundledLoopsRoot()): Promise<LoopDefinition> {
  const sourcePath = path.join(loopsRoot, id, "LOOP.md");
  const markdown = await readFile(sourcePath, "utf8");
  const loop = parseLoopMarkdown(markdown, sourcePath);
  if (loop.id !== id) {
    throw new Error(`Loop folder "${id}" does not match front matter id "${loop.id}"`);
  }
  return loop;
}

export async function listLoops(loopsRoot = bundledLoopsRoot()): Promise<LoopDefinition[]> {
  let entries: string[];
  try {
    entries = await readdir(loopsRoot);
  } catch {
    return [];
  }

  const loops: LoopDefinition[] = [];
  for (const entry of entries) {
    if (entry.startsWith(".")) continue;
    try {
      loops.push(await loadLoop(entry, loopsRoot));
    } catch {
      // skip folders that are not loops (README.md lives here too)
    }
  }
  return loops.sort((a, b) => a.id.localeCompare(b.id));
}
