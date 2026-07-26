import type { Conversation } from "@/types/conversation";

function ConversationRow({
  conversation,
  isSelected,
  onSelect,
}: {
  conversation: Conversation;
  isSelected: boolean;
  onSelect: () => void;
}) {
  const isHuman = conversation.mode === "human";

  return (
    <button
      className={`flex w-full flex-col gap-1 border-b border-border px-4 py-3 text-left transition-colors ${
        isSelected ? "bg-foreground text-background" : "hover:bg-background"
      }`}
      type="button"
      onClick={onSelect}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="truncate font-medium">{conversation.name || conversation.phone}</span>
        <span
          className={`label-mono shrink-0 ${
            isSelected ? "" : isHuman ? "text-danger" : "text-success"
          }`}
        >
          {isHuman ? "HUMANO" : "AUTO"}
        </span>
      </div>
      <p className={`truncate text-sm ${isSelected ? "opacity-70" : "text-muted"}`}>
        {conversation.last_message || "—"}
      </p>
    </button>
  );
}

export function Sidebar({
  conversations,
  isLoading,
  selectedPhone,
  onSelect,
}: {
  conversations: Conversation[];
  isLoading?: boolean;
  selectedPhone?: string | null;
  onSelect?: (phone: string) => void;
}) {
  return (
    <aside className="flex w-80 shrink-0 flex-col border-r border-border bg-surface">
      <div className="border-b border-border px-4 py-3">
        <p className="label-mono text-muted">CONVERSACIONES · {conversations.length}</p>
      </div>

      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="flex flex-col items-center gap-2 px-6 py-16 text-center">
            <p className="label-mono text-muted">CARGANDO…</p>
          </div>
        ) : conversations.length === 0 ? (
          <div className="flex flex-col items-center gap-2 px-6 py-16 text-center">
            <p className="label-mono text-muted">SIN CONVERSACIONES</p>
            <p className="text-sm text-muted">
              Todavía no hay chats activos del bot de WhatsApp.
            </p>
          </div>
        ) : (
          conversations.map((conversation) => (
            <ConversationRow
              key={conversation.phone}
              conversation={conversation}
              isSelected={conversation.phone === selectedPhone}
              onSelect={() => onSelect?.(conversation.phone)}
            />
          ))
        )}
      </div>
    </aside>
  );
}
