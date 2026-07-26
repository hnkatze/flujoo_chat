"use client";

import { useEffect, useRef, useState } from "react";
import { Button, Input, TextField } from "@heroui/react";
import { usePollingResource } from "@/hooks/use-polling-resource";
import type { ChatMessage, Conversation } from "@/types/conversation";

function MessageBubble({ message }: { message: ChatMessage }) {
  const isCustomer = message.role === "user";
  const roleLabel =
    message.role === "user" ? "CLIENTE" : message.role === "assistant" ? "BOT" : "TÚ";

  return (
    <div className={`flex ${isCustomer ? "justify-start" : "justify-end"}`}>
      <div
        className={`max-w-[85%] min-w-0 px-3 py-2 sm:max-w-[80%] sm:px-4 md:max-w-[75%] xl:max-w-[60%] ${
          isCustomer ? "bg-surface-secondary text-foreground" : "bg-foreground text-background"
        }`}
      >
        <p className={`label-mono mb-1 ${isCustomer ? "text-muted" : "opacity-70"}`}>
          {roleLabel}
        </p>
        <p className="text-sm break-words whitespace-pre-wrap">{message.message}</p>
      </div>
    </div>
  );
}

export function ChatPanel({
  phone,
  conversation,
  onBack,
}: {
  phone: string;
  conversation?: Conversation;
  onBack?: () => void;
}) {
  const { data: messages, isLoading } = usePollingResource<ChatMessage[]>(
    `/api/messages?phone=${encodeURIComponent(phone)}`,
    3000
  );
  const [draft, setDraft] = useState("");
  const [isSending, setIsSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [messages]);

  async function handleSend(event: React.FormEvent) {
    event.preventDefault();
    const message = draft.trim();
    if (!message || isSending) return;

    setIsSending(true);
    try {
      await fetch("/api/reply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, message }),
      });
      setDraft("");
    } finally {
      setIsSending(false);
    }
  }

  async function handleReturnToBot() {
    await fetch("/api/mode", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone, mode: "auto" }),
    });
  }

  const isHuman = conversation?.mode === "human";

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2 border-b border-border px-3 py-2 sm:gap-3 md:px-4 md:py-3">
        {onBack ? (
          <button
            aria-label="Volver a la lista de conversaciones"
            className="-ml-1 flex min-h-11 min-w-11 shrink-0 items-center justify-center text-foreground transition-colors hover:bg-surface-secondary md:hidden"
            type="button"
            onClick={onBack}
          >
            <svg
              aria-hidden="true"
              className="size-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="m15 18-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        ) : null}

        <div className="min-w-0 flex-1">
          <p className="truncate font-medium text-foreground">{conversation?.name || phone}</p>
          <p className="label-mono truncate text-muted">{phone}</p>
        </div>

        {isHuman ? (
          <Button
            className="min-h-11 shrink-0 md:min-h-0"
            size="sm"
            variant="outline"
            onPress={handleReturnToBot}
          >
            Devolver al bot
          </Button>
        ) : (
          <span className="label-mono shrink-0 text-success">AUTO</span>
        )}
      </div>

      <div
        ref={scrollRef}
        className="flex-1 space-y-3 overflow-x-hidden overflow-y-auto overscroll-contain p-3 sm:p-4 lg:px-6 xl:px-10"
      >
        {isLoading && !messages ? (
          <p className="label-mono text-center text-muted">CARGANDO…</p>
        ) : (messages ?? []).length === 0 ? (
          <p className="label-mono text-center text-muted">SIN MENSAJES</p>
        ) : (
          (messages ?? []).map((message, index) => (
            <MessageBubble key={`${message.ts}-${index}`} message={message} />
          ))
        )}
      </div>

      <form
        className="flex gap-2 border-t border-border p-3 sm:p-4 lg:px-6 xl:px-10"
        onSubmit={handleSend}
      >
        <TextField
          aria-label="Mensaje de respuesta"
          className="min-w-0 flex-1"
          value={draft}
          onChange={setDraft}
        >
          <Input className="min-h-11" placeholder="Escribí una respuesta…" />
        </TextField>
        <Button className="min-h-11 shrink-0" isPending={isSending} type="submit">
          Enviar
        </Button>
      </form>
    </div>
  );
}
