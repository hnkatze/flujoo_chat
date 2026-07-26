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
        className={`max-w-[70%] px-4 py-2 ${
          isCustomer ? "bg-surface-secondary text-foreground" : "bg-foreground text-background"
        }`}
      >
        <p className={`label-mono mb-1 ${isCustomer ? "text-muted" : "opacity-70"}`}>
          {roleLabel}
        </p>
        <p className="whitespace-pre-wrap text-sm">{message.message}</p>
      </div>
    </div>
  );
}

export function ChatPanel({
  phone,
  conversation,
}: {
  phone: string;
  conversation?: Conversation;
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
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <div>
          <p className="font-medium text-foreground">{conversation?.name || phone}</p>
          <p className="label-mono text-muted">{phone}</p>
        </div>
        {isHuman ? (
          <Button size="sm" variant="outline" onPress={handleReturnToBot}>
            Devolver al bot
          </Button>
        ) : (
          <span className="label-mono text-success">AUTO</span>
        )}
      </div>

      <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto p-4">
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

      <form className="flex gap-2 border-t border-border p-3" onSubmit={handleSend}>
        <TextField
          aria-label="Mensaje de respuesta"
          className="flex-1"
          value={draft}
          onChange={setDraft}
        >
          <Input placeholder="Escribí una respuesta…" />
        </TextField>
        <Button isPending={isSending} type="submit">
          Enviar
        </Button>
      </form>
    </div>
  );
}
