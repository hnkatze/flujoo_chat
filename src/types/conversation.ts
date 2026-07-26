export interface Conversation {
  phone: string;
  name: string | null;
  last_message: string | null;
  last_seen: string;
  mode: "auto" | "human" | null;
  session_id: string;
  win_count: number;
  day_count: number;
}

export interface ChatMessage {
  phone: string;
  role: "user" | "assistant" | "human";
  message: string;
  session_id: string;
  ts: string;
}
