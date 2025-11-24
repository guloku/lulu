export enum MessageRole {
  USER = 'user',
  MODEL = 'model',
}

export interface Attachment {
  type: 'image';
  data: string; // base64
  mimeType: string;
}

export interface Message {
  id: string;
  role: MessageRole;
  text: string;
  timestamp: number;
  attachments?: Attachment[];
  isError?: boolean;
}

export interface Memory {
  id: string;
  category: 'pricing' | 'client' | 'preference' | 'misc';
  content: string;
}

export enum AppView {
  CHAT = 'chat',
  MEMORIES = 'memories',
  TEMPLATES = 'templates',
}

export interface ChatSessionConfig {
  memories: Memory[];
}
