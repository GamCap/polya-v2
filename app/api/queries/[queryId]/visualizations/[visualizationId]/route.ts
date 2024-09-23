import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import db from "@/api/data/db";

export async function GET(
  request: NextRequest,
  { params }: { params: { queryId: string; visualizationId: string } }
) {
  await db.read();
  const { queries } = db.data!;
  const queryId = Number(params.queryId);
  const visualizationId = Number(params.visualizationId);
  const query = queries.find((q) => q.id === queryId);

  if (!query) {
    return NextResponse.json({ error: "Query not found" }, { status: 404 });
  }

  const visualization = query.visualizations.find(
    (v) => v.id === visualizationId
  );

  if (!visualization) {
    return NextResponse.json(
      { error: "Visualization not found" },
      { status: 404 }
    );
  }

  return NextResponse.json(visualization);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { queryId: string; visualizationId: string } }
) {
  await db.read();
  const { queries } = db.data!;
  const queryId = Number(params.queryId);
  const visualizationId = Number(params.visualizationId);
  const query = queries.find((q) => q.id === queryId);

  if (!query) {
    return NextResponse.json({ error: "Query not found" }, { status: 404 });
  }

  const visualization = query.visualizations.find(
    (v) => v.id === visualizationId
  );

  if (!visualization) {
    return NextResponse.json(
      { error: "Visualization not found" },
      { status: 404 }
    );
  }

  const { name, options } = await request.json();

  visualization.name = name || visualization.name;
  visualization.options = options || visualization.options;

  await db.write();

  return NextResponse.json(visualization);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { queryId: string; visualizationId: string } }
) {
  await db.read();
  const { queries } = db.data!;
  const queryId = Number(params.queryId);
  const visualizationId = Number(params.visualizationId);
  const query = queries.find((q) => q.id === queryId);

  if (!query) {
    return NextResponse.json({ error: "Query not found" }, { status: 404 });
  }

  query.visualizations = query.visualizations.filter(
    (v) => v.id !== visualizationId
  );

  await db.write();

  return new NextResponse(null, { status: 204 });
}
