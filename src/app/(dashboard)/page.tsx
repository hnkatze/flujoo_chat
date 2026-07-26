"use client";

import { useState } from "react";
import { Sidebar } from "@/components/app-shell/sidebar";
import { ChatPanel } from "@/components/chat/chat-panel";
import { usePollingResource } from "@/hooks/use-polling-resource";
import type { Conversation } from "@/types/conversation";

export default function ChatsPage() {
  const { data: conversations, isLoading } = usePollingResource<Conversation[]>(
    "/api/conversations"
  );
  const [selectedPhone, setSelectedPhone] = useState<string | null>(null);

  const selectedConversation = conversations?.find((c) => c.phone === selectedPhone);

  return (
    <>
      <Sidebar
        conversations={conversations ?? []}
        isLoading={isLoading}
        selectedPhone={selectedPhone}
        onSelect={setSelectedPhone}
      />

      <main
        className={`min-w-0 flex-1 overflow-hidden bg-background md:block ${
          selectedPhone ? "block" : "hidden"
        }`}
      >
        {selectedPhone ? (
          <ChatPanel
            conversation={selectedConversation}
            phone={selectedPhone}
            onBack={() => setSelectedPhone(null)}
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-2 p-6 text-center md:p-8">
            <p className="label-mono text-muted">N°00 · SIN SELECCIÓN</p>
            <h1 className="text-lg font-semibold text-foreground md:text-xl">
              Elegí una conversación
            </h1>
            <p className="max-w-sm text-sm text-muted">
              Los mensajes del chat seleccionado van a aparecer acá.
            </p>
          </div>
        )}
      </main>
    </>
  );
}
