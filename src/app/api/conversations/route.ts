import { NextResponse } from "next/server";
import { n8nDashboardFetch } from "@/lib/n8n-dashboard";
import type { Conversation } from "@/types/conversation";

export async function GET() {
  const response = await n8nDashboardFetch("/dash/conversations");

  if (!response.ok) {
    return NextResponse.json({ error: "n8n_error" }, { status: 502 });
  }

  const rows = (await response.json()) as Conversation[];
  const conversations = rows
    .filter((row) => row.phone)
    .sort((a, b) => (a.last_seen < b.last_seen ? 1 : -1));

  return NextResponse.json(conversations);
}
