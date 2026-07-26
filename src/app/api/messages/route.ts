import { NextRequest, NextResponse } from "next/server";
import { n8nDashboardFetch } from "@/lib/n8n-dashboard";
import type { ChatMessage } from "@/types/conversation";

export async function GET(request: NextRequest) {
  const phone = request.nextUrl.searchParams.get("phone");

  if (!phone) {
    return NextResponse.json({ error: "phone is required" }, { status: 400 });
  }

  const response = await n8nDashboardFetch(
    `/dash/messages?phone=${encodeURIComponent(phone)}`
  );

  if (!response.ok) {
    return NextResponse.json({ error: "n8n_error" }, { status: 502 });
  }

  const rows = (await response.json()) as ChatMessage[];
  const messages = rows.filter((row) => row.phone).sort((a, b) => (a.ts < b.ts ? -1 : 1));

  return NextResponse.json(messages);
}
