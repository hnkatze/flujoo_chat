import { NextRequest, NextResponse } from "next/server";
import { n8nDashboardFetch } from "@/lib/n8n-dashboard";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { phone, message } = body as { phone?: string; message?: string };

  if (!phone || !message) {
    return NextResponse.json({ error: "phone y message son requeridos" }, { status: 400 });
  }

  const response = await n8nDashboardFetch("/dash/reply", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ phone, message }),
  });

  if (!response.ok) {
    return NextResponse.json({ error: "n8n_error" }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
