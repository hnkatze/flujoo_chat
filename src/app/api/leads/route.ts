import { NextResponse } from "next/server";
import { n8nDashboardFetch } from "@/lib/n8n-dashboard";
import type { Lead } from "@/types/lead";

export async function GET() {
  const response = await n8nDashboardFetch("/dash/leads");

  if (!response.ok) {
    return NextResponse.json({ error: "n8n_error" }, { status: 502 });
  }

  const rows = (await response.json()) as Lead[];
  const leads = rows
    .filter((row) => row.phone)
    .sort((a, b) => ((a.createdAt ?? "") < (b.createdAt ?? "") ? 1 : -1));

  return NextResponse.json(leads);
}
