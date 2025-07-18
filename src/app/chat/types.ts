export type ChatMessage = {
  role: string;
  content: string;
};

export type ChatSession = {
  id: string;
  title: string;
  messages: ChatMessage[];
  systemPrompt: string;
  createdAt: string;
  updatedAt: string;
};