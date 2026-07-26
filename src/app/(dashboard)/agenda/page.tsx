"use client";

import { Table } from "@heroui/react";
import { usePollingResource } from "@/hooks/use-polling-resource";
import type { Appointment } from "@/types/appointment";

export default function AgendaPage() {
  const { data: appointments, isLoading } = usePollingResource<Appointment[]>(
    "/api/appointments",
    8000
  );

  const items = appointments ?? [];

  return (
    <main className="flex-1 overflow-y-auto bg-background px-4 py-5 sm:px-6 sm:py-6 lg:px-8">
      <div className="mb-4">
        <h1 className="label-mono text-muted">AGENDA · {items.length}</h1>
      </div>

      {items.length === 0 ? (
        <div className="flex flex-col items-center gap-2 py-12 text-center sm:py-16">
          <p className="label-mono text-muted">
            {isLoading ? "CARGANDO…" : "SIN CITAS"}
          </p>
          {!isLoading && (
            <p className="max-w-sm text-sm text-muted">
              Todavía no se pidió ninguna llamada por WhatsApp.
            </p>
          )}
        </div>
      ) : (
        <>
          <ul className="flex flex-col gap-3 lg:hidden">
            {items.map((appointment, index) => (
              <li
                key={`${appointment.phone}-${index}`}
                className="border border-border bg-surface p-4"
              >
                <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                  <h2 className="min-w-0 break-words text-base font-medium text-foreground">
                    {appointment.name || "—"}
                  </h2>
                  <p className="label-mono shrink-0 text-muted">
                    {appointment.requested_at || "—"}
                  </p>
                </div>

                <a
                  href={`tel:${appointment.phone}`}
                  className="-mx-2 mt-1 inline-flex min-h-11 items-center px-2 text-sm text-foreground underline underline-offset-4"
                >
                  {appointment.phone}
                </a>

                <p className="break-words text-sm text-muted">
                  {appointment.topic || "—"}
                </p>
              </li>
            ))}
          </ul>

          <div className="hidden lg:block">
            <Table>
              <Table.ScrollContainer>
                <Table.Content
                  aria-label="Citas solicitadas"
                  className="min-w-[640px]"
                >
                  <Table.Header>
                    <Table.Column isRowHeader>Nombre</Table.Column>
                    <Table.Column>Teléfono</Table.Column>
                    <Table.Column>Día/hora pedida</Table.Column>
                    <Table.Column>Tema</Table.Column>
                  </Table.Header>
                  <Table.Body>
                    {items.map((appointment, index) => (
                      <Table.Row key={`${appointment.phone}-${index}`}>
                        <Table.Cell>{appointment.name || "—"}</Table.Cell>
                        <Table.Cell>{appointment.phone}</Table.Cell>
                        <Table.Cell>{appointment.requested_at || "—"}</Table.Cell>
                        <Table.Cell className="max-w-xs xl:max-w-lg">
                          <span
                            className="block truncate"
                            title={appointment.topic || undefined}
                          >
                            {appointment.topic || "—"}
                          </span>
                        </Table.Cell>
                      </Table.Row>
                    ))}
                  </Table.Body>
                </Table.Content>
              </Table.ScrollContainer>
            </Table>
          </div>
        </>
      )}
    </main>
  );
}
