import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import db from "@/api/data/db";
import { Execution, Query } from "@/types";
import { Visualization } from "@/types/visualization";
import resultData from "@/api/data/result.json";

export async function GET(request: NextRequest) {
  await db.read();
  const { queries } = db.data!;
  return NextResponse.json(queries);
}

export async function POST(request: NextRequest) {
  await db.read();
  const { queries, executions } = db.data!;

  const { name, query: sql } = await request.json();
  const newQueryId = Date.now();
  const newVisualizationId = newQueryId + 1;
  const newExecutionId = newQueryId + 2;

  const mockResult = resultData;

  const newExecution: Execution = {
    executionId: newExecutionId,
    queryId: newQueryId,
    sql,
    executedAt: new Date().toISOString(),
    result: mockResult,
  };

  executions.push(newExecution);

  const defaultVisualization: Visualization = {
    id: newVisualizationId,
    type: "table",
    name: "Default Table",
    description: null,
    createdAt: new Date().toISOString(),
    options: {
      columns: Object.keys(mockResult[0]).map((column) => ({
        id: column,
        alignContent: "left",
      })),
      pageSize: 5,
      visibleColumns: Object.keys(mockResult[0]),
    },
  };

  const newQuery: Query = {
    id: newQueryId,
    name,
    query: sql,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    owner: {
      id: 1,
      name: "User",
      handle: "user",
    },
    visualizations: [defaultVisualization],
    executions: [newExecutionId],
  };

  queries.push(newQuery);

  await db.write();

  return NextResponse.json(
    {
      queryId: newQuery.id,
      visualizationId: defaultVisualization.id,
      executionId: newExecution.executionId,
    },
    { status: 201 }
  );
}
