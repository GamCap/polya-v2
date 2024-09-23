import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import db from "@/api/data/db";

export async function GET(
  request: NextRequest,
  { params }: { params: { queryId: string } }
) {
  await db.read();
  const { queries } = db.data!;
  const queryId = Number(params.queryId);
  const query = queries.find((q) => q.id === queryId);
  console.log("from api queries route.ts GET");
  if (!query) {
    return NextResponse.json({ error: "Query not found" }, { status: 404 });
  }

  return NextResponse.json(query);
}

export async function PUT(
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

  const { name, query: newQuery } = await request.json();

  query.name = name || query.name;
  query.query = newQuery || query.query;
  query.updatedAt = new Date().toISOString();

  await db.write();

  return NextResponse.json(query);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { queryId: string } }
) {
  await db.read();
  const { queries } = db.data!;
  const queryId = Number(params.queryId);
  const index = queries.findIndex((q) => q.id === queryId);

  if (index === -1) {
    return NextResponse.json({ error: "Query not found" }, { status: 404 });
  }

  queries.splice(index, 1);

  await db.write();

  return new NextResponse(null, { status: 204 });
}
