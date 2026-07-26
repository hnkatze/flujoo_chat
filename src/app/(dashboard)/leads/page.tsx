"use client";

import { useEffect, useState } from "react";
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

  useEffect(() => {
    setStatus(lead.status || "nuevo");
  }, [lead.status]);

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
      className="w-full max-w-full sm:w-48 lg:w-36"
      isDisabled={isSaving}
      value={status}
      onChange={(value) => handleChange(String(value))}
    >
      <Label className="sr-only">Estado del lead {lead.name || lead.phone}</Label>
      <Select.Trigger className="min-h-11 w-full lg:min-h-10">
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

function LeadField({
  label,
  value,
  className,
}: {
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <dt className="label-mono text-muted">{label}</dt>
      <dd className="mt-1 text-sm break-words text-foreground">{value || "—"}</dd>
    </div>
  );
}

function LeadCard({ lead, onChanged }: { lead: Lead; onChanged: () => void }) {
  return (
    <li className="border border-border bg-surface p-4 sm:p-5">
      <h2 className="text-base font-medium break-words text-foreground sm:text-lg">
        {lead.name || "—"}
      </h2>

      <dl className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <LeadField label="Teléfono" value={lead.phone} />
        <LeadField label="Correo" value={lead.email} />
        <LeadField label="Servicio" value={lead.service} />
        <LeadField label="Idea" value={lead.idea} className="sm:col-span-2" />

        <div className="sm:col-span-2">
          <dt className="label-mono mb-1 text-muted">Estado</dt>
          <dd>
            <LeadStatusSelect lead={lead} onChanged={onChanged} />
          </dd>
        </div>
      </dl>
    </li>
  );
}

function LeadsEmptyState({ isLoading }: { isLoading: boolean }) {
  return (
    <div className="flex flex-col items-center gap-2 px-4 py-12 text-center sm:py-16">
      <p className="label-mono text-muted">{isLoading ? "CARGANDO…" : "SIN LEADS"}</p>
      {!isLoading && (
        <p className="text-sm text-muted">
          Todavía no se capturó ningún lead por WhatsApp.
        </p>
      )}
    </div>
  );
}

export default function LeadsPage() {
  const {
    data: leads,
    isLoading,
    refetch,
  } = usePollingResource<Lead[]>("/api/leads", 8000);

  const items = leads ?? [];

  return (
    <main className="flex-1 overflow-y-auto bg-background px-4 py-5 sm:px-6 sm:py-6 lg:px-8">
      <div className="mx-auto w-full max-w-full xl:max-w-7xl">
        <div className="mb-4">
          <h1 className="label-mono text-muted">LEADS · {items.length}</h1>
        </div>

        <div className="lg:hidden">
          {items.length === 0 ? (
            <LeadsEmptyState isLoading={isLoading} />
          ) : (
            <ul className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4">
              {items.map((lead) => (
                <LeadCard key={lead.phone} lead={lead} onChanged={refetch} />
              ))}
            </ul>
          )}
        </div>

        <div className="hidden lg:block">
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
                  renderEmptyState={() => <LeadsEmptyState isLoading={isLoading} />}
                >
                  {items.map((lead) => (
                    <Table.Row key={lead.phone}>
                      <Table.Cell>{lead.name || "—"}</Table.Cell>
                      <Table.Cell>{lead.phone}</Table.Cell>
                      <Table.Cell>{lead.email || "—"}</Table.Cell>
                      <Table.Cell>{lead.service || "—"}</Table.Cell>
                      <Table.Cell className="max-w-xs truncate xl:max-w-md">
                        {lead.idea || "—"}
                      </Table.Cell>
                      <Table.Cell>
                        <LeadStatusSelect lead={lead} onChanged={refetch} />
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table.Content>
            </Table.ScrollContainer>
          </Table>
        </div>
      </div>
    </main>
  );
}
