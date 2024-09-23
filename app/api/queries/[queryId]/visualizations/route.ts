import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import db from "@/api/data/db";
import { Visualization } from "@/types";

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

  return NextResponse.json(query.visualizations || []);
}

export async function POST(
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

  const { name, type, options } = await request.json();
  const newVisualizationId = Date.now();

  const newVisualization: Visualization = {
    id: newVisualizationId,
    name,
    type,
    createdAt: new Date().toISOString(),
    options,
  };

  query.visualizations.push(newVisualization);

  await db.write();

  return NextResponse.json(newVisualization, { status: 201 });
}
