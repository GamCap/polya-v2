export interface Execution {
  executionId: number;
  queryId: number;
  sql: string;
  executedAt: string;
  result: Record<string, any>[];
}
