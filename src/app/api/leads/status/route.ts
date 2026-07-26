import { NextRequest, NextResponse } from "next/server";
import { n8nDashboardFetch } from "@/lib/n8n-dashboard";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { phone, status } = body as { phone?: string; status?: string };

  if (!phone || !status) {
    return NextResponse.json({ error: "phone y status son requeridos" }, { status: 400 });
  }

  const response = await n8nDashboardFetch("/dash/leads/status", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ phone, status }),
  });

  if (!response.ok) {
    return NextResponse.json({ error: "n8n_error" }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
