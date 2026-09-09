export type Gate = {
  name: string;
  command: string;
};

export type LoopDefinition = {
  id: string;
  name: string;
  description: string;
  maxIterations: number;
  budget: {
    maxUsd: number;
  };
  gates: Gate[];
  completion: {
    signal: string;
  };
  prompt: string;
  sourcePath: string;
};

export type GateResult = {
  name: string;
  ok: boolean;
  exitCode: number;
  output: string;
};

export type IterationRecord = {
  n: number;
  startedAt: string;
  endedAt: string;
  agentExitCode: number;
  gates: GateResult[];
  accepted: boolean;
  complete: boolean;
};

export type LoopStatus = "idle" | "running" | "complete" | "failed" | "budget";

export type LoopState = {
  loopId: string;
  startedAt: string;
  updatedAt: string;
  spentUsd: number;
  status: LoopStatus;
  iterations: IterationRecord[];
};
