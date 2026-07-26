export async function n8nDashboardFetch(path: string, init?: RequestInit): Promise<Response> {
  const baseUrl = process.env.N8N_DASHBOARD_URL;
  const token = process.env.N8N_DASHBOARD_TOKEN;

  if (!baseUrl || !token) {
    throw new Error("N8N_DASHBOARD_URL / N8N_DASHBOARD_TOKEN no están configurados");
  }

  return fetch(`${baseUrl}${path}`, {
    ...init,
    headers: { ...init?.headers, Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
}
