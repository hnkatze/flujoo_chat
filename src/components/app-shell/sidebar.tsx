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
      className={`flex min-h-16 w-full flex-col justify-center gap-1 border-b border-border px-4 py-3 text-left transition-colors md:min-h-0 ${
        isSelected ? "bg-foreground text-background" : "hover:bg-background"
      }`}
      type="button"
      onClick={onSelect}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="min-w-0 truncate font-medium">
          {conversation.name || conversation.phone}
        </span>
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
  const isThreadOpen = Boolean(selectedPhone);

  return (
    <aside
      className={`w-full shrink-0 flex-col border-border bg-surface md:flex md:w-72 md:border-r lg:w-80 xl:w-96 ${
        isThreadOpen ? "hidden" : "flex"
      }`}
    >
      <div className="border-b border-border px-4 py-3">
        <p className="label-mono text-muted">CONVERSACIONES · {conversations.length}</p>
      </div>

      <div className="flex-1 overflow-y-auto overscroll-contain">
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
