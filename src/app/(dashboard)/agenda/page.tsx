"use client";

import { Table } from "@heroui/react";
import { usePollingResource } from "@/hooks/use-polling-resource";
import type { Appointment } from "@/types/appointment";

export default function AgendaPage() {
  const { data: appointments, isLoading } = usePollingResource<Appointment[]>(
    "/api/appointments",
    8000
  );

  return (
    <main className="flex-1 overflow-y-auto bg-background p-6">
      <div className="mb-4">
        <p className="label-mono text-muted">AGENDA · {appointments?.length ?? 0}</p>
      </div>

      <Table>
        <Table.ScrollContainer>
          <Table.Content aria-label="Citas solicitadas" className="min-w-[640px]">
            <Table.Header>
              <Table.Column isRowHeader>Nombre</Table.Column>
              <Table.Column>Teléfono</Table.Column>
              <Table.Column>Día/hora pedida</Table.Column>
              <Table.Column>Tema</Table.Column>
            </Table.Header>
            <Table.Body
              renderEmptyState={() => (
                <div className="flex flex-col items-center gap-2 py-16 text-center">
                  <p className="label-mono text-muted">
                    {isLoading ? "CARGANDO…" : "SIN CITAS"}
                  </p>
                  {!isLoading && (
                    <p className="text-sm text-muted">
                      Todavía no se pidió ninguna llamada por WhatsApp.
                    </p>
                  )}
                </div>
              )}
            >
              {(appointments ?? []).map((appointment, index) => (
                <Table.Row key={`${appointment.phone}-${index}`}>
                  <Table.Cell>{appointment.name || "—"}</Table.Cell>
                  <Table.Cell>{appointment.phone}</Table.Cell>
                  <Table.Cell>{appointment.requested_at || "—"}</Table.Cell>
                  <Table.Cell className="max-w-xs truncate">
                    {appointment.topic || "—"}
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
