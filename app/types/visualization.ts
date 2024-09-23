import { Column, FormatterOptions } from "./column";

export type VisualizationType = "table" | "chart" | "graph" | "custom";

export interface BaseVisualization {
  id: number;
  type: VisualizationType;
  name: string;
  description?: string | null;
  createdAt: string; // ISO string
}

export interface TableOptions {
  columns: Column[];
  pageSize: number;
  sortColumn?: string;
  sortDirection?: "asc" | "desc";
  filters?: Record<string, any>;
  visibleColumns: string[];
  alignment?: Record<string, "left" | "center" | "right">;
  formatterOptions?: Record<string, FormatterOptions>;
}

export interface TableVisualization extends BaseVisualization {
  type: "table";
  options: TableOptions;
}

export type Visualization = TableVisualization;
