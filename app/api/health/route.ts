import { NextResponse } from "next/server";

export function GET() {
  return NextResponse.json({
    ok: true,
    app: "taskboard",
    timestamp: new Date().toISOString(),
  });
}
