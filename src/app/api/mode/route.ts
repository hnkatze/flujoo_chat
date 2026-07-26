import { NextRequest, NextResponse } from "next/server";
import { n8nDashboardFetch } from "@/lib/n8n-dashboard";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { phone, mode } = body as { phone?: string; mode?: string };

  if (!phone) {
    return NextResponse.json({ error: "phone es requerido" }, { status: 400 });
  }

  const response = await n8nDashboardFetch("/dash/mode", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ phone, mode }),
  });

  if (!response.ok) {
    return NextResponse.json({ error: "n8n_error" }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
