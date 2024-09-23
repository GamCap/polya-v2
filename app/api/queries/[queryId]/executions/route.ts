import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import db from "@/api/data/db";
import { Execution } from "@/types";
import resultData from "@/api/data/result.json";

export async function GET(
  request: NextRequest,
  { params }: { params: { queryId: string } }
) {
  await db.read();
  const { queries } = db.data!;
  const queryId = Number(params.queryId);
  const query = queries.find((q) => q.id === queryId);

  if (!query) {
    return NextResponse.json({ error: "Query not found" }, { status: 404 });
  }

  return NextResponse.json(query.executions || []);
}

export async function POST(
  request: NextRequest,
  { params }: { params: { queryId: string } }
) {
  await db.read();
  const { queries, executions } = db.data!;
  const queryId = Number(params.queryId);
  const query = queries.find((q) => q.id === queryId);
  console.log("from api queries executions route.ts POST");
  console.log("queryId: ", queryId);
  console.log("query: ", query);
  console.log("queries: ", queries);

  if (!query) {
    return NextResponse.json({ error: "Query not found" }, { status: 404 });
  }

  const { sql } = await request.json();
  const newExecutionId = Date.now();

  const mockResult = resultData;

  const newExecution: Execution = {
    executionId: newExecutionId,
    queryId,
    sql,
    executedAt: new Date().toISOString(),
    result: mockResult,
  };

  console.log("newExecution: ", newExecution);
  console.log("executions: ", executions);

  executions.push(newExecution);

  query.executions.push(newExecutionId);

  await db.write();

  return NextResponse.json({ executionId: newExecutionId }, { status: 201 });
}
