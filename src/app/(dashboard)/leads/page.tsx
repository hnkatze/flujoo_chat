"use client";

import { useState } from "react";
import { Label, ListBox, Select, Table } from "@heroui/react";
import { usePollingResource } from "@/hooks/use-polling-resource";
import type { Lead } from "@/types/lead";

const STATUS_OPTIONS = ["nuevo", "contactado", "ganado", "perdido"] as const;

function LeadStatusSelect({
  lead,
  onChanged,
}: {
  lead: Lead;
  onChanged: () => void;
}) {
  const [status, setStatus] = useState(lead.status || "nuevo");
  const [isSaving, setIsSaving] = useState(false);

  async function handleChange(value: string) {
    const previous = status;
    setStatus(value);
    setIsSaving(true);

    try {
      const response = await fetch("/api/leads/status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: lead.phone, status: value }),
      });
      if (!response.ok) throw new Error(String(response.status));
      onChanged();
    } catch {
      setStatus(previous);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <Select
      className="w-36"
      isDisabled={isSaving}
      value={status}
      onChange={(value) => handleChange(String(value))}
    >
      <Label className="sr-only">Estado del lead</Label>
      <Select.Trigger>
        <Select.Value />
        <Select.Indicator />
      </Select.Trigger>
      <Select.Popover>
        <ListBox>
          {STATUS_OPTIONS.map((option) => (
            <ListBox.Item key={option} id={option} textValue={option}>
              {option}
              <ListBox.ItemIndicator />
            </ListBox.Item>
          ))}
        </ListBox>
      </Select.Popover>
    </Select>
  );
}

export default function LeadsPage() {
  const {
    data: leads,
    isLoading,
    refetch,
  } = usePollingResource<Lead[]>("/api/leads", 8000);

  return (
    <main className="flex-1 overflow-y-auto bg-background p-6">
      <div className="mb-4">
        <p className="label-mono text-muted">LEADS · {leads?.length ?? 0}</p>
      </div>

      <Table>
        <Table.ScrollContainer>
          <Table.Content aria-label="Leads capturados" className="min-w-[760px]">
            <Table.Header>
              <Table.Column isRowHeader>Nombre</Table.Column>
              <Table.Column>Teléfono</Table.Column>
              <Table.Column>Correo</Table.Column>
              <Table.Column>Servicio</Table.Column>
              <Table.Column>Idea</Table.Column>
              <Table.Column>Estado</Table.Column>
            </Table.Header>
            <Table.Body
              renderEmptyState={() => (
                <div className="flex flex-col items-center gap-2 py-16 text-center">
                  <p className="label-mono text-muted">
                    {isLoading ? "CARGANDO…" : "SIN LEADS"}
                  </p>
                  {!isLoading && (
                    <p className="text-sm text-muted">
                      Todavía no se capturó ningún lead por WhatsApp.
                    </p>
                  )}
                </div>
              )}
            >
              {(leads ?? []).map((lead) => (
                <Table.Row key={lead.phone}>
                  <Table.Cell>{lead.name || "—"}</Table.Cell>
                  <Table.Cell>{lead.phone}</Table.Cell>
                  <Table.Cell>{lead.email || "—"}</Table.Cell>
                  <Table.Cell>{lead.service || "—"}</Table.Cell>
                  <Table.Cell className="max-w-xs truncate">{lead.idea || "—"}</Table.Cell>
                  <Table.Cell>
                    <LeadStatusSelect lead={lead} onChanged={refetch} />
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Content>
        </Table.ScrollContainer>
      </Table>
    </main>
  );
}
