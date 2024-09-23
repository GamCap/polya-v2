import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import db from "@/api/data/db";

export async function GET(
  request: NextRequest,
  { params }: { params: { executionId: string } }
) {
  await db.read();
  const { executions } = db.data!;
  const executionId = Number(params.executionId);
  const execution = executions.find((e) => e.executionId === executionId);

  if (!execution) {
    return NextResponse.json({ error: "Execution not found" }, { status: 404 });
  }

  return NextResponse.json(execution);
}
