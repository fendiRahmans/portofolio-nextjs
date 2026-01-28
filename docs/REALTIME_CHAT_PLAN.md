# 📱 Perencanaan Fitur Chat Realtime - Portfolio Next.js

> **Dokumen Perencanaan Teknis**  
> Tanggal: 28 Januari 2026  
> Project: portofolio-nextjs

---

## 📋 Daftar Isi

1. [Executive Summary](#1-executive-summary)
2. [Analisis Kebutuhan](#2-analisis-kebutuhan)
3. [Pilihan Teknologi](#3-pilihan-teknologi)
4. [Arsitektur Sistem](#4-arsitektur-sistem)
5. [Database Schema](#5-database-schema)
6. [API Design](#6-api-design)
7. [Struktur File & Folder](#7-struktur-file--folder)
8. [Implementasi Detail](#8-implementasi-detail)
9. [Security Considerations](#9-security-considerations)
10. [Testing Strategy](#10-testing-strategy)
11. [Deployment](#11-deployment)
12. [Timeline Implementasi](#12-timeline-implementasi)

---

## 1. Executive Summary

### 1.1 Tujuan
Menambahkan fitur chat realtime pada portfolio untuk memungkinkan pengunjung berkomunikasi langsung dengan pemilik portfolio secara real-time.

### 1.2 Scope
- **Visitor Chat**: Pengunjung dapat memulai percakapan tanpa login
- **Admin Dashboard**: Admin dapat melihat dan merespons semua chat
- **Realtime Updates**: Pesan terkirim dan diterima secara instan
- **Chat History**: Riwayat percakapan tersimpan di database
- **Notification**: Admin mendapat notifikasi saat ada pesan baru

### 1.3 Tech Stack yang Digunakan
| Komponen | Teknologi |
|----------|-----------|
| Frontend | Next.js 16, React 19, TypeScript |
| Backend | Next.js API Routes + Custom Server |
| Realtime | **Pusher Channels** (Rekomendasi) |
| Database | MySQL dengan Drizzle ORM |
| Auth | Jose (JWT) - sudah ada |
| Styling | Tailwind CSS |

---

## 2. Analisis Kebutuhan

### 2.1 Functional Requirements

#### Untuk Visitor (Guest)
| ID | Requirement | Priority |
|----|-------------|----------|
| FR-01 | Dapat memulai chat baru tanpa registrasi | High |
| FR-02 | Dapat mengirim pesan teks | High |
| FR-03 | Melihat status pesan (sent/delivered/read) | Medium |
| FR-04 | Menerima respons secara realtime | High |
| FR-05 | Chat widget floating di pojok kanan bawah | High |
| FR-06 | Menyimpan session chat dengan localStorage | Medium |
| FR-07 | Notifikasi suara saat ada pesan baru | Low |

#### Untuk Admin
| ID | Requirement | Priority |
|----|-------------|----------|
| FR-08 | Melihat daftar semua conversation | High |
| FR-09 | Membalas pesan visitor | High |
| FR-10 | Melihat informasi visitor (nama, email optional) | Medium |
| FR-11 | Menandai chat sebagai resolved/closed | Medium |
| FR-12 | Notifikasi realtime untuk pesan masuk | High |
| FR-13 | Melihat history chat | High |
| FR-14 | Online/offline status indicator | Medium |

### 2.2 Non-Functional Requirements

| ID | Requirement | Target |
|----|-------------|--------|
| NFR-01 | Latency pengiriman pesan | < 500ms |
| NFR-02 | Concurrent connections | 100+ visitors |
| NFR-03 | Message persistence | 100% reliability |
| NFR-04 | Uptime | 99.9% |
| NFR-05 | Mobile responsive | Full support |

---

## 3. Pilihan Teknologi

### 3.1 Perbandingan Solusi Realtime

| Kriteria | Socket.IO | Pusher | Ably | Firebase |
|----------|-----------|--------|------|----------|
| **Ease of Setup** | Medium | Easy | Easy | Easy |
| **Self-hosted** | ✅ Yes | ❌ No | ❌ No | ❌ No |
| **Scalability** | Manual | Auto | Auto | Auto |
| **Cost (Free Tier)** | Free | 200k msg/day | 6M msg/mo | 10GB/mo |
| **Next.js Compatibility** | Good* | Excellent | Excellent | Good |
| **Maintenance** | High | Low | Low | Low |

*Socket.IO dengan Next.js memerlukan custom server

### 3.2 Rekomendasi: **Pusher Channels**

**Alasan:**
1. **No Custom Server Needed**: Bekerja sempurna dengan Next.js App Router
2. **Generous Free Tier**: 200k messages/day, 100 concurrent connections
3. **Simple Integration**: SDK yang mature untuk client & server
4. **Reliable**: 99.999% uptime SLA
5. **Built-in Features**: Presence channels, private channels, webhooks

### 3.3 Alternatif: Socket.IO (Self-Hosted)

Jika ingin full control dan self-hosted:

**Kelebihan:**
- Gratis sepenuhnya
- Full control over infrastructure
- No third-party dependency

**Kekurangan:**
- Memerlukan custom server (tidak bisa pure Next.js)
- Perlu handle scaling sendiri
- Kompleksitas deployment lebih tinggi

---

## 4. Arsitektur Sistem

### 4.1 High-Level Architecture (Pusher)

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────────────┐              ┌─────────────────────┐       │
│  │   Visitor Chat  │              │    Admin Dashboard   │       │
│  │     Widget      │              │      Chat Panel      │       │
│  └────────┬────────┘              └──────────┬──────────┘       │
│           │                                   │                  │
│           │    Pusher Client SDK             │                  │
│           │    (pusher-js)                   │                  │
│           └──────────────┬───────────────────┘                  │
│                          │                                       │
└──────────────────────────┼───────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                      PUSHER CHANNELS                             │
│                   (Cloud Service)                                │
│                                                                  │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐      │
│  │   Private   │  │  Presence   │  │    Webhooks to      │      │
│  │  Channels   │  │  Channels   │  │    Next.js API      │      │
│  └─────────────┘  └─────────────┘  └─────────────────────┘      │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                         BACKEND                                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                  Next.js API Routes                      │    │
│  │                                                          │    │
│  │  /api/chat/send        - Send message                   │    │
│  │  /api/chat/messages    - Get messages                   │    │
│  │  /api/chat/conversations - List conversations           │    │
│  │  /api/pusher/auth      - Pusher channel auth            │    │
│  │  /api/pusher/webhook   - Pusher webhooks                │    │
│  │                                                          │    │
│  └─────────────────────────────────────────────────────────┘    │
│                          │                                       │
│                          ▼                                       │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                   Drizzle ORM                            │    │
│  │                                                          │    │
│  │  conversations, messages, chat_sessions                  │    │
│  │                                                          │    │
│  └─────────────────────────────────────────────────────────┘    │
│                          │                                       │
│                          ▼                                       │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                     MySQL Database                       │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 4.2 Data Flow

```
Visitor Mengirim Pesan:
=======================

1. Visitor → [Chat Widget] → POST /api/chat/send
2. API Route → [Validate & Save to DB]
3. API Route → [Pusher Server SDK] → Trigger event
4. Pusher → [WebSocket] → Admin Dashboard
5. Admin Dashboard → [Update UI realtime]


Admin Membalas Pesan:
=====================

1. Admin → [Admin Panel] → POST /api/chat/send
2. API Route → [Validate Auth & Save to DB]
3. API Route → [Pusher Server SDK] → Trigger event
4. Pusher → [WebSocket] → Visitor Widget
5. Visitor Widget → [Update UI realtime]
```

### 4.3 Channel Strategy

```
Channels:
=========

1. private-conversation-{conversationId}
   - Untuk komunikasi antara visitor dan admin dalam satu conversation
   - Events: new-message, message-read, typing

2. presence-admin-chat
   - Untuk admin presence (online/offline status)
   - Events: member-added, member-removed

3. private-admin-notifications
   - Untuk notifikasi ke semua admin
   - Events: new-conversation, new-message-alert
```

---

## 5. Database Schema

### 5.1 ERD (Entity Relationship Diagram)

```
┌─────────────────────┐       ┌─────────────────────┐
│    conversations    │       │      messages       │
├─────────────────────┤       ├─────────────────────┤
│ id (PK)            │───┐   │ id (PK)            │
│ visitor_id         │   │   │ conversation_id(FK)│───┐
│ visitor_name       │   │   │ sender_type        │   │
│ visitor_email      │   │   │ sender_id          │   │
│ status             │   │   │ content            │   │
│ last_message_at    │   └───│ is_read            │   │
│ created_at         │       │ created_at         │   │
│ updated_at         │       └─────────────────────┘   │
└─────────────────────┘                                │
                                                       │
┌─────────────────────┐                                │
│   chat_sessions     │                                │
├─────────────────────┤                                │
│ id (PK)            │                                │
│ session_token      │                                │
│ conversation_id(FK)│────────────────────────────────┘
│ ip_address         │
│ user_agent         │
│ created_at         │
│ expires_at         │
└─────────────────────┘
```

### 5.2 Drizzle Schema Definition

```typescript
// src/db/schema.ts - Tambahan untuk Chat

import {
  mysqlTable,
  int,
  varchar,
  timestamp,
  text,
  boolean,
  mysqlEnum,
} from 'drizzle-orm/mysql-core';
import { relations } from 'drizzle-orm';

/* ================= CONVERSATIONS ================= */
export const conversations = mysqlTable('conversations', {
  id: int('id').autoincrement().primaryKey(),
  visitorId: varchar('visitor_id', { length: 100 }).notNull(),
  visitorName: varchar('visitor_name', { length: 255 }),
  visitorEmail: varchar('visitor_email', { length: 255 }),
  status: mysqlEnum('status', ['active', 'resolved', 'closed'])
    .notNull()
    .default('active'),
  lastMessageAt: timestamp('last_message_at').defaultNow(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
});

/* ================= MESSAGES ================= */
export const messages = mysqlTable('messages', {
  id: int('id').autoincrement().primaryKey(),
  conversationId: int('conversation_id')
    .notNull()
    .references(() => conversations.id, { onDelete: 'cascade' }),
  senderType: mysqlEnum('sender_type', ['visitor', 'admin']).notNull(),
  senderId: int('sender_id'), // null for visitor, user.id for admin
  content: text('content').notNull(),
  isRead: boolean('is_read').notNull().default(false),
  createdAt: timestamp('created_at').defaultNow(),
});

/* ================= CHAT SESSIONS ================= */
export const chatSessions = mysqlTable('chat_sessions', {
  id: int('id').autoincrement().primaryKey(),
  sessionToken: varchar('session_token', { length: 255 }).notNull().unique(),
  conversationId: int('conversation_id')
    .references(() => conversations.id, { onDelete: 'cascade' }),
  ipAddress: varchar('ip_address', { length: 45 }),
  userAgent: text('user_agent'),
  createdAt: timestamp('created_at').defaultNow(),
  expiresAt: timestamp('expires_at').notNull(),
});

/* ================= RELATIONS ================= */
export const conversationsRelations = relations(conversations, ({ many }) => ({
  messages: many(messages),
  sessions: many(chatSessions),
}));

export const messagesRelations = relations(messages, ({ one }) => ({
  conversation: one(conversations, {
    fields: [messages.conversationId],
    references: [conversations.id],
  }),
}));

export const chatSessionsRelations = relations(chatSessions, ({ one }) => ({
  conversation: one(conversations, {
    fields: [chatSessions.conversationId],
    references: [conversations.id],
  }),
}));
```

### 5.3 Migration SQL

```sql
-- drizzle/00XX_add_chat_tables.sql

CREATE TABLE `conversations` (
  `id` int AUTO_INCREMENT PRIMARY KEY,
  `visitor_id` varchar(100) NOT NULL,
  `visitor_name` varchar(255),
  `visitor_email` varchar(255),
  `status` enum('active', 'resolved', 'closed') NOT NULL DEFAULT 'active',
  `last_message_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_visitor_id` (`visitor_id`),
  INDEX `idx_status` (`status`)
);

CREATE TABLE `messages` (
  `id` int AUTO_INCREMENT PRIMARY KEY,
  `conversation_id` int NOT NULL,
  `sender_type` enum('visitor', 'admin') NOT NULL,
  `sender_id` int,
  `content` text NOT NULL,
  `is_read` boolean NOT NULL DEFAULT false,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`conversation_id`) REFERENCES `conversations`(`id`) ON DELETE CASCADE,
  INDEX `idx_conversation_id` (`conversation_id`),
  INDEX `idx_created_at` (`created_at`)
);

CREATE TABLE `chat_sessions` (
  `id` int AUTO_INCREMENT PRIMARY KEY,
  `session_token` varchar(255) NOT NULL UNIQUE,
  `conversation_id` int,
  `ip_address` varchar(45),
  `user_agent` text,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  `expires_at` timestamp NOT NULL,
  FOREIGN KEY (`conversation_id`) REFERENCES `conversations`(`id`) ON DELETE CASCADE,
  INDEX `idx_session_token` (`session_token`)
);
```

---

## 6. API Design

### 6.1 REST API Endpoints

#### 6.1.1 Chat Messages

```
POST /api/chat/send
===================
Description: Mengirim pesan baru
Auth: Session token (visitor) atau JWT (admin)

Request Body:
{
  "conversationId": number | null,  // null untuk conversation baru
  "content": string,
  "visitorName": string?,           // hanya untuk visitor
  "visitorEmail": string?           // hanya untuk visitor
}

Response (201):
{
  "success": true,
  "data": {
    "messageId": number,
    "conversationId": number,
    "content": string,
    "senderType": "visitor" | "admin",
    "createdAt": string
  }
}
```

```
GET /api/chat/messages
======================
Description: Mendapatkan pesan dalam conversation
Auth: Session token (visitor) atau JWT (admin)

Query Params:
- conversationId: number (required)
- limit: number (default: 50)
- before: number (cursor pagination)

Response (200):
{
  "success": true,
  "data": {
    "messages": [
      {
        "id": number,
        "content": string,
        "senderType": "visitor" | "admin",
        "isRead": boolean,
        "createdAt": string
      }
    ],
    "hasMore": boolean,
    "nextCursor": number | null
  }
}
```

#### 6.1.2 Conversations (Admin Only)

```
GET /api/chat/conversations
===========================
Description: Mendapatkan daftar conversations
Auth: JWT (admin only)

Query Params:
- status: "active" | "resolved" | "closed" | "all"
- limit: number (default: 20)
- page: number (default: 1)

Response (200):
{
  "success": true,
  "data": {
    "conversations": [
      {
        "id": number,
        "visitorName": string | null,
        "visitorEmail": string | null,
        "status": string,
        "lastMessage": {
          "content": string,
          "createdAt": string
        },
        "unreadCount": number,
        "createdAt": string
      }
    ],
    "pagination": {
      "total": number,
      "page": number,
      "limit": number,
      "totalPages": number
    }
  }
}
```

```
PATCH /api/chat/conversations/:id
=================================
Description: Update status conversation
Auth: JWT (admin only)

Request Body:
{
  "status": "active" | "resolved" | "closed"
}

Response (200):
{
  "success": true,
  "data": {
    "id": number,
    "status": string
  }
}
```

#### 6.1.3 Pusher Authentication

```
POST /api/pusher/auth
=====================
Description: Authenticate private/presence channels
Auth: Session token atau JWT

Request Body (auto dari Pusher SDK):
{
  "socket_id": string,
  "channel_name": string
}

Response (200):
{
  "auth": string,
  "channel_data"?: string  // untuk presence channels
}
```

#### 6.1.4 Visitor Session

```
POST /api/chat/session
======================
Description: Membuat atau memvalidasi session visitor
Auth: None (public)

Request Body:
{
  "sessionToken"?: string  // existing token untuk validasi
}

Response (200):
{
  "success": true,
  "data": {
    "sessionToken": string,
    "conversationId": number | null,
    "expiresAt": string
  }
}
```

### 6.2 Pusher Events

```typescript
// Event Types

// Dalam channel: private-conversation-{conversationId}
interface NewMessageEvent {
  event: 'new-message';
  data: {
    id: number;
    content: string;
    senderType: 'visitor' | 'admin';
    createdAt: string;
  };
}

interface MessageReadEvent {
  event: 'message-read';
  data: {
    messageIds: number[];
    readAt: string;
  };
}

interface TypingEvent {
  event: 'client-typing';
  data: {
    senderType: 'visitor' | 'admin';
    isTyping: boolean;
  };
}

// Dalam channel: private-admin-notifications
interface NewConversationAlert {
  event: 'new-conversation';
  data: {
    conversationId: number;
    visitorName: string | null;
    firstMessage: string;
    createdAt: string;
  };
}

interface NewMessageAlert {
  event: 'new-message-alert';
  data: {
    conversationId: number;
    messagePreview: string;
    senderType: 'visitor';
  };
}
```

---

## 7. Struktur File & Folder

### 7.1 Struktur Lengkap

```
portofolio-nextjs/
├── app/
│   ├── api/
│   │   ├── chat/
│   │   │   ├── send/
│   │   │   │   └── route.ts          # POST - kirim pesan
│   │   │   ├── messages/
│   │   │   │   └── route.ts          # GET - ambil pesan
│   │   │   ├── conversations/
│   │   │   │   ├── route.ts          # GET - list conversations
│   │   │   │   └── [id]/
│   │   │   │       └── route.ts      # PATCH - update status
│   │   │   └── session/
│   │   │       └── route.ts          # POST - manage session
│   │   └── pusher/
│   │       ├── auth/
│   │       │   └── route.ts          # POST - channel auth
│   │       └── webhook/
│   │           └── route.ts          # POST - webhook handler
│   │
│   ├── admin/
│   │   └── chat/
│   │       ├── page.tsx              # Admin chat dashboard
│   │       └── ChatClient.tsx        # Client component
│   │
│   └── components/
│       └── chat/
│           ├── ChatWidget.tsx        # Floating chat widget
│           ├── ChatWindow.tsx        # Chat window content
│           ├── ChatMessage.tsx       # Single message component
│           ├── ChatInput.tsx         # Input dengan typing indicator
│           ├── ChatHeader.tsx        # Header dengan status
│           ├── ConversationList.tsx  # Admin: list conversations
│           ├── ConversationItem.tsx  # Admin: single conversation
│           └── TypingIndicator.tsx   # Animasi typing
│
├── src/
│   ├── actions/
│   │   └── chat.ts                   # Server actions untuk chat
│   │
│   ├── db/
│   │   └── schema.ts                 # + conversations, messages, chatSessions
│   │
│   ├── lib/
│   │   ├── pusher/
│   │   │   ├── server.ts             # Pusher server instance
│   │   │   └── client.ts             # Pusher client instance
│   │   ├── chat/
│   │   │   ├── session.ts            # Session management
│   │   │   └── utils.ts              # Chat utilities
│   │   └── validations.ts            # + chat validations
│   │
│   └── hooks/
│       ├── useChat.ts                # Chat state management
│       ├── usePusher.ts              # Pusher connection hook
│       └── useTyping.ts              # Typing indicator hook
│
├── public/
│   └── sounds/
│       └── notification.mp3          # Notification sound
│
└── types/
    └── chat.ts                       # Type definitions
```

---

## 8. Implementasi Detail

### 8.1 Dependencies yang Diperlukan

```bash
# Install dependencies
npm install pusher pusher-js uuid

# Dev dependencies
npm install -D @types/uuid
```

**package.json additions:**
```json
{
  "dependencies": {
    "pusher": "^5.2.0",
    "pusher-js": "^8.4.0",
    "uuid": "^9.0.1"
  },
  "devDependencies": {
    "@types/uuid": "^9.0.8"
  }
}
```

### 8.2 Environment Variables

```env
# .env.local

# Pusher Configuration
PUSHER_APP_ID=your_app_id
PUSHER_KEY=your_key
PUSHER_SECRET=your_secret
PUSHER_CLUSTER=ap1

# Public (exposed to client)
NEXT_PUBLIC_PUSHER_KEY=your_key
NEXT_PUBLIC_PUSHER_CLUSTER=ap1

# Chat Configuration
CHAT_SESSION_EXPIRY_DAYS=7
```

### 8.3 Core Implementation Files

#### 8.3.1 Pusher Server Configuration

```typescript
// src/lib/pusher/server.ts
import Pusher from 'pusher';

if (!process.env.PUSHER_APP_ID) {
  throw new Error('PUSHER_APP_ID is not defined');
}

export const pusherServer = new Pusher({
  appId: process.env.PUSHER_APP_ID,
  key: process.env.PUSHER_KEY!,
  secret: process.env.PUSHER_SECRET!,
  cluster: process.env.PUSHER_CLUSTER!,
  useTLS: true,
});

// Helper functions
export const triggerConversationEvent = async (
  conversationId: number,
  event: string,
  data: unknown
) => {
  await pusherServer.trigger(
    `private-conversation-${conversationId}`,
    event,
    data
  );
};

export const triggerAdminNotification = async (
  event: string,
  data: unknown
) => {
  await pusherServer.trigger('private-admin-notifications', event, data);
};
```

#### 8.3.2 Pusher Client Configuration

```typescript
// src/lib/pusher/client.ts
import PusherClient from 'pusher-js';

let pusherClient: PusherClient | null = null;

export const getPusherClient = () => {
  if (!pusherClient) {
    pusherClient = new PusherClient(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
      authEndpoint: '/api/pusher/auth',
    });
  }
  return pusherClient;
};

export const subscribeToChatChannel = (conversationId: number) => {
  const client = getPusherClient();
  return client.subscribe(`private-conversation-${conversationId}`);
};

export const subscribeToAdminNotifications = () => {
  const client = getPusherClient();
  return client.subscribe('private-admin-notifications');
};
```

#### 8.3.3 Chat Widget Component

```typescript
// app/components/chat/ChatWidget.tsx
'use client';

import { useState, useEffect } from 'react';
import { useChat } from '@/hooks/useChat';
import ChatWindow from './ChatWindow';

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);
  const { 
    messages, 
    sendMessage, 
    isConnected, 
    visitorName,
    setVisitorName 
  } = useChat();

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-blue-600 
                   rounded-full shadow-lg flex items-center justify-center
                   hover:bg-blue-700 transition-colors z-50"
        aria-label="Open chat"
      >
        {hasUnread && (
          <span className="absolute -top-1 -right-1 w-4 h-4 
                          bg-red-500 rounded-full" />
        )}
        <ChatIcon />
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 h-[500px] 
                       bg-white rounded-2xl shadow-2xl z-50
                       flex flex-col overflow-hidden">
          <ChatWindow
            messages={messages}
            onSend={sendMessage}
            onClose={() => setIsOpen(false)}
            isConnected={isConnected}
            visitorName={visitorName}
            onSetVisitorName={setVisitorName}
          />
        </div>
      )}
    </>
  );
}
```

#### 8.3.4 useChat Hook

```typescript
// src/hooks/useChat.ts
'use client';

import { useState, useEffect, useCallback } from 'react';
import { getPusherClient, subscribeToChatChannel } from '@/lib/pusher/client';

interface Message {
  id: number;
  content: string;
  senderType: 'visitor' | 'admin';
  createdAt: string;
  isRead: boolean;
}

interface UseChatReturn {
  messages: Message[];
  sendMessage: (content: string) => Promise<void>;
  isConnected: boolean;
  isLoading: boolean;
  visitorName: string | null;
  setVisitorName: (name: string) => void;
  conversationId: number | null;
}

export function useChat(): UseChatReturn {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const [conversationId, setConversationId] = useState<number | null>(null);
  const [visitorName, setVisitorName] = useState<string | null>(null);

  // Initialize session
  useEffect(() => {
    const initSession = async () => {
      const storedToken = localStorage.getItem('chat_session_token');
      
      const response = await fetch('/api/chat/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionToken: storedToken }),
      });

      const { data } = await response.json();
      
      setSessionToken(data.sessionToken);
      setConversationId(data.conversationId);
      localStorage.setItem('chat_session_token', data.sessionToken);
      
      if (data.conversationId) {
        await loadMessages(data.conversationId);
        subscribeToChannel(data.conversationId);
      }
      
      setIsLoading(false);
    };

    initSession();
  }, []);

  // Subscribe to Pusher channel
  const subscribeToChannel = useCallback((convId: number) => {
    const channel = subscribeToChatChannel(convId);
    
    channel.bind('new-message', (data: Message) => {
      setMessages(prev => [...prev, data]);
    });

    channel.bind('pusher:subscription_succeeded', () => {
      setIsConnected(true);
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, []);

  // Load existing messages
  const loadMessages = async (convId: number) => {
    const response = await fetch(
      `/api/chat/messages?conversationId=${convId}`
    );
    const { data } = await response.json();
    setMessages(data.messages);
  };

  // Send message
  const sendMessage = async (content: string) => {
    const response = await fetch('/api/chat/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Session-Token': sessionToken || '',
      },
      body: JSON.stringify({
        conversationId,
        content,
        visitorName,
      }),
    });

    const { data } = await response.json();

    // If new conversation, subscribe to channel
    if (!conversationId && data.conversationId) {
      setConversationId(data.conversationId);
      subscribeToChannel(data.conversationId);
    }
  };

  return {
    messages,
    sendMessage,
    isConnected,
    isLoading,
    visitorName,
    setVisitorName,
    conversationId,
  };
}
```

#### 8.3.5 API Route - Send Message

```typescript
// app/api/chat/send/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { messages, conversations, chatSessions } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { pusherServer, triggerConversationEvent, triggerAdminNotification } from '@/lib/pusher/server';
import { verifyToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { conversationId, content, visitorName, visitorEmail } = body;

    // Determine sender type
    const authHeader = request.headers.get('Authorization');
    const sessionToken = request.headers.get('X-Session-Token');

    let senderType: 'visitor' | 'admin' = 'visitor';
    let senderId: number | null = null;

    // Check if admin
    if (authHeader?.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      const payload = await verifyToken(token);
      if (payload) {
        senderType = 'admin';
        senderId = payload.userId as number;
      }
    }

    // For visitors, validate session
    if (senderType === 'visitor' && sessionToken) {
      const session = await db.query.chatSessions.findFirst({
        where: eq(chatSessions.sessionToken, sessionToken),
      });

      if (!session || new Date(session.expiresAt) < new Date()) {
        return NextResponse.json(
          { success: false, error: 'Invalid session' },
          { status: 401 }
        );
      }
    }

    let convId = conversationId;

    // Create new conversation if needed
    if (!convId) {
      const [newConversation] = await db.insert(conversations).values({
        visitorId: sessionToken || crypto.randomUUID(),
        visitorName,
        visitorEmail,
        status: 'active',
      });

      convId = newConversation.insertId;

      // Update session with conversation
      if (sessionToken) {
        await db.update(chatSessions)
          .set({ conversationId: convId })
          .where(eq(chatSessions.sessionToken, sessionToken));
      }

      // Notify admins of new conversation
      await triggerAdminNotification('new-conversation', {
        conversationId: convId,
        visitorName,
        firstMessage: content.substring(0, 100),
        createdAt: new Date().toISOString(),
      });
    }

    // Insert message
    const [newMessage] = await db.insert(messages).values({
      conversationId: convId,
      senderType,
      senderId,
      content,
      isRead: false,
    });

    const messageData = {
      id: newMessage.insertId,
      content,
      senderType,
      createdAt: new Date().toISOString(),
      isRead: false,
    };

    // Update last message time
    await db.update(conversations)
      .set({ lastMessageAt: new Date() })
      .where(eq(conversations.id, convId));

    // Trigger realtime event
    await triggerConversationEvent(convId, 'new-message', messageData);

    // If visitor message, also notify admin channel
    if (senderType === 'visitor') {
      await triggerAdminNotification('new-message-alert', {
        conversationId: convId,
        messagePreview: content.substring(0, 50),
        senderType: 'visitor',
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        messageId: newMessage.insertId,
        conversationId: convId,
        ...messageData,
      },
    }, { status: 201 });

  } catch (error) {
    console.error('Error sending message:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to send message' },
      { status: 500 }
    );
  }
}
```

#### 8.3.6 Pusher Auth Endpoint

```typescript
// app/api/pusher/auth/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { pusherServer } from '@/lib/pusher/server';
import { verifyToken } from '@/lib/auth';
import { db } from '@/db';
import { chatSessions } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    const body = await request.formData();
    const socketId = body.get('socket_id') as string;
    const channelName = body.get('channel_name') as string;

    // Get auth token or session token
    const authHeader = request.headers.get('Authorization');
    const sessionToken = request.headers.get('X-Session-Token');

    // For admin channels
    if (channelName === 'private-admin-notifications') {
      if (!authHeader?.startsWith('Bearer ')) {
        return NextResponse.json(
          { error: 'Unauthorized' },
          { status: 403 }
        );
      }

      const token = authHeader.substring(7);
      const payload = await verifyToken(token);
      
      if (!payload) {
        return NextResponse.json(
          { error: 'Invalid token' },
          { status: 403 }
        );
      }

      const auth = pusherServer.authorizeChannel(socketId, channelName);
      return NextResponse.json(auth);
    }

    // For conversation channels
    if (channelName.startsWith('private-conversation-')) {
      const conversationId = channelName.split('-')[2];

      // Admin can access any conversation
      if (authHeader?.startsWith('Bearer ')) {
        const token = authHeader.substring(7);
        const payload = await verifyToken(token);
        
        if (payload) {
          const auth = pusherServer.authorizeChannel(socketId, channelName);
          return NextResponse.json(auth);
        }
      }

      // Visitor can only access their own conversation
      if (sessionToken) {
        const session = await db.query.chatSessions.findFirst({
          where: eq(chatSessions.sessionToken, sessionToken),
        });

        if (session?.conversationId?.toString() === conversationId) {
          const auth = pusherServer.authorizeChannel(socketId, channelName);
          return NextResponse.json(auth);
        }
      }

      return NextResponse.json(
        { error: 'Unauthorized for this conversation' },
        { status: 403 }
      );
    }

    return NextResponse.json(
      { error: 'Unknown channel' },
      { status: 400 }
    );

  } catch (error) {
    console.error('Pusher auth error:', error);
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    );
  }
}
```

---

## 9. Security Considerations

### 9.1 Authentication & Authorization

| Aspect | Implementation |
|--------|---------------|
| **Visitor Identity** | Session token (UUID v4) stored in localStorage |
| **Admin Identity** | JWT token dari existing auth system |
| **Channel Access** | Private channels dengan auth endpoint |
| **Rate Limiting** | 10 messages/minute per visitor |

### 9.2 Input Validation

```typescript
// src/lib/validations.ts - Tambahan untuk chat

import { z } from 'zod';

export const sendMessageSchema = z.object({
  conversationId: z.number().optional(),
  content: z.string()
    .min(1, 'Message cannot be empty')
    .max(2000, 'Message too long'),
  visitorName: z.string()
    .max(100)
    .optional(),
  visitorEmail: z.string()
    .email()
    .optional(),
});

export const createSessionSchema = z.object({
  sessionToken: z.string().uuid().optional(),
});
```

### 9.3 Security Checklist

- [ ] Sanitize all user inputs
- [ ] Validate session tokens on every request
- [ ] Use HTTPS only (Pusher TLS)
- [ ] Implement rate limiting
- [ ] Set proper CORS headers
- [ ] Validate Pusher webhook signatures
- [ ] Don't expose sensitive data in messages
- [ ] Implement message content moderation (optional)
- [ ] Log suspicious activities

---

## 10. Testing Strategy

### 10.1 Unit Tests

```typescript
// __tests__/chat/sendMessage.test.ts
import { describe, it, expect } from 'vitest';
import { sendMessageSchema } from '@/lib/validations';

describe('sendMessageSchema', () => {
  it('should validate valid message', () => {
    const result = sendMessageSchema.safeParse({
      content: 'Hello world',
    });
    expect(result.success).toBe(true);
  });

  it('should reject empty message', () => {
    const result = sendMessageSchema.safeParse({
      content: '',
    });
    expect(result.success).toBe(false);
  });
});
```

### 10.2 Integration Tests

```typescript
// __tests__/api/chat.test.ts
import { describe, it, expect, beforeAll, afterAll } from 'vitest';

describe('Chat API', () => {
  let sessionToken: string;

  beforeAll(async () => {
    // Create test session
    const res = await fetch('/api/chat/session', {
      method: 'POST',
    });
    const { data } = await res.json();
    sessionToken = data.sessionToken;
  });

  it('should send message and create conversation', async () => {
    const res = await fetch('/api/chat/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Session-Token': sessionToken,
      },
      body: JSON.stringify({
        content: 'Test message',
        visitorName: 'Test User',
      }),
    });

    expect(res.status).toBe(201);
    const { data } = await res.json();
    expect(data.conversationId).toBeDefined();
  });
});
```

### 10.3 E2E Tests

```typescript
// e2e/chat.spec.ts (Playwright)
import { test, expect } from '@playwright/test';

test('visitor can send and receive messages', async ({ page }) => {
  await page.goto('/');
  
  // Open chat widget
  await page.click('[aria-label="Open chat"]');
  
  // Enter name
  await page.fill('[data-testid="visitor-name"]', 'Test User');
  
  // Send message
  await page.fill('[data-testid="chat-input"]', 'Hello!');
  await page.click('[data-testid="send-button"]');
  
  // Verify message appears
  await expect(page.locator('[data-testid="message"]')).toContainText('Hello!');
});
```

---

## 11. Deployment

### 11.1 Pusher Setup

1. **Buat akun di Pusher**: https://pusher.com/
2. **Buat Channels app baru**
3. **Salin credentials ke `.env`**
4. **Enable client events** di dashboard (untuk typing indicator)

### 11.2 Environment Variables Checklist

**Production:**
```env
# Pusher (Required)
PUSHER_APP_ID=
PUSHER_KEY=
PUSHER_SECRET=
PUSHER_CLUSTER=

# Public
NEXT_PUBLIC_PUSHER_KEY=
NEXT_PUBLIC_PUSHER_CLUSTER=

# Database (existing)
DATABASE_URL=
```

### 11.3 Database Migration

```bash
# Generate migration
npm run db:generate

# Push to database
npm run db:push
```

### 11.4 Vercel Deployment Notes

- Pusher bekerja sempurna dengan Vercel serverless functions
- Tidak perlu custom server
- Environment variables set di Vercel Dashboard

---

## 12. Timeline Implementasi

### Phase 1: Foundation (2-3 hari)
- [ ] Setup Pusher account dan credentials
- [ ] Tambah database schema dan migration
- [ ] Buat Pusher server/client configuration
- [ ] Implement session management API

### Phase 2: Core Chat (3-4 hari)
- [ ] Implement send message API
- [ ] Implement get messages API  
- [ ] Implement Pusher auth endpoint
- [ ] Buat useChat hook
- [ ] Buat ChatWidget component

### Phase 3: Admin Dashboard (2-3 hari)
- [ ] Implement conversations list API
- [ ] Implement conversation status update API
- [ ] Buat admin chat page
- [ ] Buat ConversationList component
- [ ] Implement admin notifications

### Phase 4: Polish & Testing (2 hari)
- [ ] Add typing indicators
- [ ] Add sound notifications
- [ ] Responsive design adjustments
- [ ] Write tests
- [ ] Bug fixes

### Phase 5: Deployment (1 hari)
- [ ] Setup production Pusher
- [ ] Deploy database migrations
- [ ] Deploy to Vercel
- [ ] Smoke testing

**Total Estimasi: 10-13 hari**

---

## 📝 Catatan Tambahan

### Alternatif Self-Hosted dengan Socket.IO

Jika memilih Socket.IO, diperlukan:
1. Custom server (server.js) yang wrap Next.js
2. Deployment ke platform yang support WebSocket (Railway, Render, DigitalOcean)
3. Setup Redis adapter untuk scaling

### Future Enhancements

1. **File Attachments**: Upload gambar/file dalam chat
2. **Chat Bots**: Auto-reply untuk FAQ
3. **Analytics**: Track response time, satisfaction
4. **Multi-Admin**: Assign conversations ke admin tertentu
5. **Export Chat**: Download chat history sebagai PDF

---

**Dokumen ini akan diupdate sesuai kebutuhan selama implementasi.**

*Last updated: 28 Januari 2026*
