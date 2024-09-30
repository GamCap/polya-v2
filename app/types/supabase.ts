// types.ts
import { z } from "zod";

export const VisualizationType = z.enum(["table"]);
export const CustomFormatter = z.enum([
  "shortDate",
  "date",
  "number",
  "shortNumber",
  "fixedNumber",
  "percent",
  "currency",
  "posNeg",
  "email",
]);
export const ColumnAlignment = z.enum(["left", "center", "right"]);
export const FilterType = z.enum([
  "range",
  "boolean",
  "multi-select",
  "date-range",
]);
export const UnitEnum = z.enum(["timestamp", "none", "wei", "date"]);
export const ValueTypeEnum = z.enum([
  "TIMESTAMPTZ",
  "BIGINT",
  "NUMERIC",
  "INTEGER",
  "TEXT",
  "DATE",
]);

export const MetadataSchema = z.object({
  unit: UnitEnum,
  description: z.string().optional(),
  value_type: ValueTypeEnum,
});

export const FormatterOptionsSchema = z.object({
  regexPattern: z.string().optional(),
  dateFormat: z.string().optional(),
  customFormatter: CustomFormatter.optional(),
});

export const ColumnSchema = z.object({
  id: z.string(),
  label: z.string().optional(),
  visible: z.boolean().optional(),
  filterable: z.boolean().optional(),
  alignContent: ColumnAlignment.optional(),
  numberFormat: z.string().optional(),
  formatterOptions: FormatterOptionsSchema.optional(),
  filterType: FilterType.optional(),
  options: z.array(z.string()).optional(),
  metadata: MetadataSchema.optional(),
});

export const TableOptionsSchema = z.object({
  columns: z.array(ColumnSchema),
  pageSize: z.number().optional(),
  formatterOptions: z.record(FormatterOptionsSchema).optional(),
});

export const BaseVisualizationSchema = z.object({
  id: z.string(),
  queryId: z.string(),
  type: VisualizationType,
  name: z.string(),
  description: z.string().nullable().optional(),
  createdAt: z.string(),
});

export const TableVisualizationSchema = BaseVisualizationSchema.extend({
  type: z.literal("table"),
  options: TableOptionsSchema,
});

export const VisualizationSchema = z.discriminatedUnion("type", [
  TableVisualizationSchema,
  // Add other visualization schemas as needed
]);

export const ExecutionSchema = z.object({
  id: z.string(),
  queryId: z.string(),
  sql: z.string(),
  executedAt: z.string(),
  result: z.any(),
});

export const QuerySchema = z.object({
  id: z.string(),
  name: z.string().nullable(),
  query: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  ownerId: z.string(),
});

export const QueryDetailsSchema = QuerySchema.extend({
  visualizations: z.array(VisualizationSchema),
  executions: z.array(ExecutionSchema),
});

export type VisualizationType = z.infer<typeof VisualizationType>;
export type Column = z.infer<typeof ColumnSchema>;
export type TableOptions = z.infer<typeof TableOptionsSchema>;
export type Visualization = z.infer<typeof VisualizationSchema>;
export type Execution = z.infer<typeof ExecutionSchema>;
export type Query = z.infer<typeof QuerySchema>;
export type QueryDetails = z.infer<typeof QueryDetailsSchema>;
export type FormatterOptions = z.infer<typeof FormatterOptionsSchema>;
export type Metadata = z.infer<typeof MetadataSchema>;
export type UnitEnum = z.infer<typeof UnitEnum>;
export type ValueTypeEnum = z.infer<typeof ValueTypeEnum>;
