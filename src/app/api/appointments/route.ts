import { NextResponse } from "next/server";
import { n8nDashboardFetch } from "@/lib/n8n-dashboard";
import type { Appointment } from "@/types/appointment";

export async function GET() {
  const response = await n8nDashboardFetch("/dash/appointments");

  if (!response.ok) {
    return NextResponse.json({ error: "n8n_error" }, { status: 502 });
  }

  const rows = (await response.json()) as Appointment[];
  const appointments = rows
    .filter((row) => row.phone)
    .sort((a, b) => ((a.createdAt ?? "") < (b.createdAt ?? "") ? 1 : -1));

  return NextResponse.json(appointments);
}
