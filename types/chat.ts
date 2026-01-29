// TypeScript interfaces untuk Chat System

export type SenderType = 'visitor' | 'admin' | 'ai';
export type ConversationStatus = 'active' | 'archived' | 'closed';

export interface Message {
  id: number;
  conversationId: number;
  senderId: string;
  senderType: SenderType;
  content: string;
  isRead: boolean;
  createdAt: Date | string;
}

export interface Conversation {
  id: number;
  visitorId: string;
  visitorName: string | null;
  visitorEmail: string | null;
  status: ConversationStatus;
  lastMessageAt: Date | string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
  messages?: Message[];
  unreadCount?: number;
}

export interface ChatSession {
  id: number;
  sessionId: string;
  visitorId: string;
  ipAddress: string | null;
  userAgent: string | null;
  lastActiveAt: Date | string;
  expiresAt: Date | string;
  createdAt: Date | string;
}

export interface ChatSettings {
  id: number;
  aiEnabled: boolean;
  aiModel: string;
  aiTemperature: number;
  systemPrompt: string;
  autoReplyDelay: number;
  createdAt: Date | string;
  updatedAt: Date | string;
}

// Pusher Events
export interface NewMessageEvent {
  id: number;
  conversationId: number;
  content: string;
  senderType: SenderType;
  senderId: string;
  createdAt: string;
}

export interface AITypingEvent {
  isTyping: boolean;
  conversationId: number;
}

export interface TypingEvent {
  senderType: SenderType;
  isTyping: boolean;
}

export interface MessageReadEvent {
  messageIds: number[];
  readAt: string;
}

export interface NewConversationAlert {
  conversationId: number;
  visitorName: string | null;
  firstMessage: string;
  createdAt: string;
}

// API Responses
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface SessionResponse {
  sessionToken: string;
  conversationId: number | null;
  expiresAt: string;
}

export interface SendMessageResponse {
  messageId: number;
  conversationId: number;
  aiResponse?: {
    messageId: number;
    content: string;
  };
}

// Portfolio Context for AI
export interface PortfolioContext {
  techStack: Array<{
    title: string;
    description: string;
  }>;
  career: Array<{
    year: string;
    title: string;
    subtitle: string;
    description: string;
    techStack?: string[];
    keyProjects?: string[];
  }>;
  about: {
    name: string;
    title: string;
    location: string;
    narrativeContent: string;
    interests?: string[];
  } | null;
}
