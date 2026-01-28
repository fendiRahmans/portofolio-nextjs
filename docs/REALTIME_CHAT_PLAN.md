# 📱 Perencanaan Fitur Chat Realtime + AI Assistant - Portfolio Next.js

> **Dokumen Perencanaan Teknis**  
> Tanggal: 28 Januari 2026  
> Project: portofolio-nextjs  
> Version: 2.0 (dengan AI Integration)

---

## 🤖 AI IMPLEMENTATION GUIDE

> **PENTING**: Section ini khusus untuk AI yang akan mengimplementasikan fitur ini.
> Baca section ini terlebih dahulu sebelum mulai coding.

### Quick Start Commands

```bash
# 1. Install dependencies (JALANKAN PERTAMA)
npm install pusher pusher-js uuid ai @ai-sdk/openai
npm install -D @types/uuid

# 2. Generate database migration setelah update schema
npm run db:generate
npm run db:push

# 3. Run development server
npm run dev
```

### Environment Variables (Tambahkan ke .env.local)

```env
# Pusher Configuration (dapatkan dari pusher.com)
PUSHER_APP_ID=your_app_id
PUSHER_KEY=your_key
PUSHER_SECRET=your_secret
PUSHER_CLUSTER=ap1

# Public (untuk client-side)
NEXT_PUBLIC_PUSHER_KEY=your_key
NEXT_PUBLIC_PUSHER_CLUSTER=ap1

# OpenAI Configuration
OPENAI_API_KEY=sk-your-openai-api-key

# Chat Configuration
CHAT_SESSION_EXPIRY_DAYS=7
```

### Existing Codebase Context

**Project Stack:**
- Next.js 16.1.2 dengan App Router
- React 19.2.3
- TypeScript 5
- Tailwind CSS 4
- Drizzle ORM 0.45.1 dengan MySQL
- Jose untuk JWT authentication
- Zod untuk validation

**Database Connection:**
```typescript
// File: src/db/index.ts
import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as schema from "./schema";

const connection = mysql.createPool(process.env.DATABASE_URL!);
export const db = drizzle(connection, { schema, mode: 'default' });
```

**Existing Tables (src/db/schema.ts):**
```typescript
// users - untuk admin authentication
export const users = mysqlTable('users', {
  id: int('id').autoincrement().primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password: varchar('password', { length: 255 }).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

// techStack - GUNAKAN INI UNTUK AI CONTEXT
export const techStack = mysqlTable('tech_stack', {
  id: int('id').autoincrement().primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description').notNull(),
  iconName: varchar('icon_name', { length: 255 }).notNull(),
  iconColor: varchar('icon_color', { length: 50 }).notNull(),
  bgColor: varchar('bg_color', { length: 50 }).notNull(),
  // ...timestamps
});

// career - GUNAKAN INI UNTUK AI CONTEXT
export const career = mysqlTable('career', {
  id: int('id').autoincrement().primaryKey(),
  year: varchar('year', { length: 100 }).notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  subtitle: varchar('subtitle', { length: 255 }).notNull(),
  description: text('description').notNull(),
  techStack: json('tech_stack').$type<string[]>(),
  keyProjects: json('key_projects').$type<string[]>(),
  projectList: json('project_list').$type<{ name: string; type?: string }[]>(),
  bulletPoints: json('bullet_points').$type<string[]>(),
  // ...timestamps
});

// about - GUNAKAN INI UNTUK AI CONTEXT
export const about = mysqlTable('about', {
  id: int('id').autoincrement().primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  location: varchar('location', { length: 255 }).notNull(),
  narrativeTitle: varchar('narrative_title', { length: 255 }).notNull(),
  narrativeContent: text('narrative_content').notNull(),
  coreValues: json('core_values').$type<{ icon: string; title: string; description: string }[]>(),
  interests: json('interests').$type<string[]>(),
  // ...timestamps
});
```

**Authentication (src/lib/auth.ts):**
```typescript
// Fungsi yang sudah ada - GUNAKAN INI
export async function verifySession(): Promise<JWTPayload | null>
// Returns { userId: number } jika valid, null jika tidak

// Untuk API routes, gunakan:
import { verifySession } from "@/lib/auth";
const session = await verifySession();
if (!session) {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}
```

**Middleware (src/middleware.ts):**
```typescript
// Sudah handle /admin/* routes
// /admin/login - public
// /admin/* lainnya - protected (redirect ke login jika tidak auth)
```

### Implementation Checklist

**FASE 1: Database Schema (Kerjakan Pertama)**
```
□ src/db/schema.ts
  - [ ] Tambah table: chatSettings
  - [ ] Tambah table: conversations  
  - [ ] Tambah table: messages
  - [ ] Tambah table: chatSessions
  - [ ] Tambah relations untuk semua table baru
```

**FASE 2: Library Setup**
```
□ src/lib/pusher/server.ts    - Pusher server instance
□ src/lib/pusher/client.ts    - Pusher client instance  
□ src/lib/ai/openai.ts        - OpenAI/Vercel AI setup
□ src/lib/ai/context-builder.ts - Build context dari portfolio data
□ src/lib/ai/prompts.ts       - System prompts
□ src/lib/chat/session.ts     - Visitor session management
□ src/lib/chat/utils.ts       - Helper functions
□ types/chat.ts               - TypeScript interfaces
```

**FASE 3: API Routes**
```
□ app/api/chat/session/route.ts       - POST: create/validate session
□ app/api/chat/send/route.ts          - POST: send message
□ app/api/chat/messages/route.ts      - GET: get messages
□ app/api/chat/conversations/route.ts - GET: list conversations (admin)
□ app/api/chat/conversations/[id]/route.ts - PATCH: update conversation
□ app/api/chat/settings/route.ts      - GET/PATCH: AI settings
□ app/api/chat/ai/respond/route.ts    - POST: generate AI response
□ app/api/pusher/auth/route.ts        - POST: channel authentication
```

**FASE 4: React Hooks**
```
□ src/hooks/useChat.ts        - Main chat state management
□ src/hooks/usePusher.ts      - Pusher connection hook
□ src/hooks/useTyping.ts      - Typing indicator hook
□ src/hooks/useAIStatus.ts    - AI status hook
```

**FASE 5: UI Components**
```
□ app/components/chat/ChatWindow.tsx       - Main chat window
□ app/components/chat/ChatMessage.tsx      - Single message
□ app/components/chat/ChatInput.tsx        - Input field
□ app/components/chat/ChatHeader.tsx       - Header dengan status
□ app/components/chat/AIBadge.tsx          - AI message badge
□ app/components/chat/AITypingIndicator.tsx - AI typing animation
□ app/components/chat/TypingIndicator.tsx  - User typing animation
□ app/components/chat/ConversationList.tsx - Admin: list view
□ app/components/chat/ConversationItem.tsx - Admin: single item
□ app/components/chat/AIToggleSwitch.tsx   - Admin: toggle AI
```

**FASE 6: Pages**
```
□ app/chat/page.tsx              - Visitor chat page (Server Component)
□ app/chat/ChatPageClient.tsx    - Visitor chat (Client Component)
□ app/admin/chat/page.tsx        - Admin dashboard (Server Component)
□ app/admin/chat/ChatClient.tsx  - Admin dashboard (Client Component)
```

### Critical Implementation Notes

1. **Import Paths**: Gunakan alias `@/` untuk imports
   ```typescript
   import { db } from "@/db";
   import { verifySession } from "@/lib/auth";
   ```

2. **Server vs Client Components**: 
   - File dengan hooks/useState → tambah `'use client'` di baris pertama
   - API routes → selalu server-side
   - page.tsx bisa server component, buat Client component terpisah

3. **Drizzle Query Pattern**:
   ```typescript
   // Insert
   const [result] = await db.insert(tableName).values({ ... });
   const insertId = result.insertId;
   
   // Select
   const data = await db.query.tableName.findFirst({
     where: eq(tableName.id, id),
   });
   
   // Update
   await db.update(tableName)
     .set({ field: value })
     .where(eq(tableName.id, id));
   ```

4. **API Response Pattern**:
   ```typescript
   // Success
   return NextResponse.json({ success: true, data: { ... } }, { status: 200 });
   
   // Error
   return NextResponse.json({ success: false, error: 'Message' }, { status: 400 });
   ```

5. **Pusher Event Naming**: Gunakan kebab-case
   - `new-message`, `ai-typing`, `message-read`

6. **AI Context Building**: Fetch dari 3 tables:
   ```typescript
   const [techStackData, careerData, aboutData] = await Promise.all([
     db.query.techStack.findMany(),
     db.query.career.findMany(),
     db.query.about.findFirst(),
   ]);
   ```

### File Creation Order (Recommended)

```
1. types/chat.ts                    ← Define interfaces first
2. src/db/schema.ts                 ← Add new tables
3. Run: npm run db:generate && npm run db:push
4. src/lib/pusher/server.ts
5. src/lib/pusher/client.ts
6. src/lib/ai/prompts.ts
7. src/lib/ai/context-builder.ts
8. src/lib/ai/openai.ts
9. src/lib/chat/session.ts
10. src/lib/chat/utils.ts
11. app/api/chat/session/route.ts
12. app/api/pusher/auth/route.ts
13. app/api/chat/send/route.ts
14. app/api/chat/messages/route.ts
15. app/api/chat/ai/respond/route.ts
16. app/api/chat/settings/route.ts
17. app/api/chat/conversations/route.ts
18. app/api/chat/conversations/[id]/route.ts
19. src/hooks/usePusher.ts
20. src/hooks/useChat.ts
21. src/hooks/useTyping.ts
22. src/hooks/useAIStatus.ts
23. app/components/chat/* (all components)
24. app/chat/ChatPageClient.tsx
25. app/chat/page.tsx
26. app/admin/chat/ChatClient.tsx
27. app/admin/chat/page.tsx
```

---

## 📋 Daftar Isi

0. [🤖 AI Implementation Guide](#-ai-implementation-guide) ← **BACA INI DULU**
1. [Executive Summary](#1-executive-summary)
2. [Analisis Kebutuhan](#2-analisis-kebutuhan)
3. [Pilihan Teknologi](#3-pilihan-teknologi)
4. [Arsitektur Sistem](#4-arsitektur-sistem)
5. [Database Schema](#5-database-schema)
6. [API Design](#6-api-design)
7. [Struktur File & Folder](#7-struktur-file--folder)
8. [Implementasi Detail](#8-implementasi-detail)
9. [AI Integration](#9-ai-integration)
10. [Security Considerations](#10-security-considerations)
11. [Testing Strategy](#11-testing-strategy)
12. [Deployment](#12-deployment)
13. [Timeline Implementasi](#13-timeline-implementasi)

---

## 1. Executive Summary

### 1.1 Tujuan
Menambahkan fitur chat realtime pada portfolio dengan integrasi AI Assistant yang dapat menjawab pertanyaan pengunjung secara otomatis berdasarkan data portfolio (projects, tech stack, career history).

### 1.2 Scope
- **Dedicated Chat Page**: Halaman `/chat` terpisah untuk pengalaman chat yang lebih baik
- **AI Auto-Reply**: AI Assistant yang dapat menjawab otomatis saat admin tidak tersedia
- **Context-Aware AI**: AI dapat mengakses dan merespons berdasarkan data portfolio
- **Toggle Mode**: Admin dapat switch antara mode AI otomatis atau manual reply
- **Admin Dashboard**: Admin dapat melihat, merespons, dan mengelola semua chat
- **Realtime Updates**: Pesan terkirim dan diterima secara instan
- **Chat History**: Riwayat percakapan tersimpan di database

### 1.3 Tech Stack yang Digunakan
| Komponen | Teknologi |
|----------|-----------|
| Frontend | Next.js 16, React 19, TypeScript |
| Backend | Next.js API Routes |
| Realtime | **Pusher Channels** |
| AI | **OpenAI GPT-4** / **Vercel AI SDK** |
| Database | MySQL dengan Drizzle ORM |
| Auth | Jose (JWT) - sudah ada |
| Styling | Tailwind CSS |

---

## 2. Analisis Kebutuhan

### 2.1 Functional Requirements

#### Untuk Visitor (Guest)
| ID | Requirement | Priority |
|----|-------------|----------|
| FR-01 | Dapat mengakses halaman chat `/chat` tanpa login | High |
| FR-02 | Dapat memulai chat baru tanpa registrasi | High |
| FR-03 | Dapat mengirim pesan teks | High |
| FR-04 | Menerima respons dari AI atau Admin secara realtime | High |
| FR-05 | Melihat indikator apakah dijawab AI atau Admin | Medium |
| FR-06 | Menyimpan session chat dengan localStorage | Medium |
| FR-07 | Melihat status pesan (sent/delivered/read) | Low |
| FR-08 | Notifikasi suara saat ada pesan baru | Low |

#### Untuk AI Assistant
| ID | Requirement | Priority |
|----|-------------|----------|
| FR-09 | Dapat menjawab pertanyaan tentang portfolio secara otomatis | High |
| FR-10 | Mengakses data tech stack dari database | High |
| FR-11 | Mengakses data career/experience dari database | High |
| FR-12 | Mengakses data projects dari database | High |
| FR-13 | Mengakses data about/profile dari database | High |
| FR-14 | Merespons dengan konteks yang relevan | High |
| FR-15 | Fallback ke admin jika tidak bisa menjawab | Medium |

#### Untuk Admin
| ID | Requirement | Priority |
|----|-------------|----------|
| FR-16 | Toggle untuk mengaktifkan/menonaktifkan AI auto-reply | High |
| FR-17 | Melihat daftar semua conversation | High |
| FR-18 | Membalas pesan visitor secara manual | High |
| FR-19 | Take over conversation dari AI | High |
| FR-20 | Melihat informasi visitor (nama, email optional) | Medium |
| FR-21 | Menandai chat sebagai resolved/closed | Medium |
| FR-22 | Notifikasi realtime untuk pesan masuk | High |
| FR-23 | Melihat history chat termasuk respons AI | High |
| FR-24 | Online/offline status indicator | Medium |

### 2.2 Non-Functional Requirements

| ID | Requirement | Target |
|----|-------------|--------|
| NFR-01 | Latency pengiriman pesan | < 500ms |
| NFR-02 | AI response time | < 3 detik |
| NFR-03 | Concurrent connections | 100+ visitors |
| NFR-04 | Message persistence | 100% reliability |
| NFR-05 | Uptime | 99.9% |
| NFR-06 | Mobile responsive | Full support |

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

### 3.2 Rekomendasi: **Pusher Channels + OpenAI/Vercel AI SDK**

**Alasan Pusher:**
1. **No Custom Server Needed**: Bekerja sempurna dengan Next.js App Router
2. **Generous Free Tier**: 200k messages/day, 100 concurrent connections
3. **Simple Integration**: SDK yang mature untuk client & server
4. **Reliable**: 99.999% uptime SLA
5. **Built-in Features**: Presence channels, private channels, webhooks

**Alasan Vercel AI SDK:**
1. **Native Next.js Integration**: Dibuat khusus untuk Next.js
2. **Streaming Support**: Response AI yang smooth dengan streaming
3. **Multiple Providers**: Support OpenAI, Anthropic, Google, dll
4. **Edge Runtime Compatible**: Optimal performance
5. **Built-in Hooks**: `useChat`, `useCompletion` untuk React

### 3.3 AI Provider Options

| Provider | Model | Cost | Speed | Quality |
|----------|-------|------|-------|---------|
| **OpenAI** | GPT-4o-mini | $0.15/1M tokens | Fast | Excellent |
| OpenAI | GPT-4o | $2.50/1M tokens | Medium | Best |
| Anthropic | Claude 3 Haiku | $0.25/1M tokens | Fast | Excellent |
| Google | Gemini Pro | Free tier available | Fast | Good |

**Rekomendasi: GPT-4o-mini** - Balance terbaik antara cost, speed, dan quality untuk use case chat.

### 3.4 Alternatif: Socket.IO (Self-Hosted)

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

### 4.1 High-Level Architecture (Pusher + AI)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              FRONTEND                                        │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌───────────────────────┐              ┌─────────────────────────────┐     │
│  │   /chat Page          │              │    /admin/chat Dashboard     │     │
│  │   (Visitor Interface) │              │    (Admin Interface)         │     │
│  │                       │              │                              │     │
│  │  - Chat messages      │              │  - Conversation list         │     │
│  │  - AI/Admin indicator │              │  - Chat panel                │     │
│  │  - Typing indicator   │              │  - AI Toggle Switch          │     │
│  │                       │              │  - Take over button          │     │
│  └───────────┬───────────┘              └──────────────┬───────────────┘     │
│              │                                          │                    │
│              │         Pusher Client SDK               │                    │
│              │         (pusher-js)                     │                    │
│              └────────────────┬─────────────────────────┘                    │
│                               │                                              │
└───────────────────────────────┼──────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                         PUSHER CHANNELS                                      │
│                        (Cloud Service)                                       │
│                                                                              │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐                  │
│  │   Private   │  │  Presence   │  │    Webhooks to      │                  │
│  │  Channels   │  │  Channels   │  │    Next.js API      │                  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘                  │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                              BACKEND                                         │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │                      Next.js API Routes                                │  │
│  │                                                                        │  │
│  │  /api/chat/send           - Send message (triggers AI if enabled)     │  │
│  │  /api/chat/messages       - Get messages                              │  │
│  │  /api/chat/conversations  - List conversations (admin)                │  │
│  │  /api/chat/ai/respond     - AI generates response                     │  │
│  │  /api/chat/settings       - Get/Update AI toggle settings             │  │
│  │  /api/pusher/auth         - Pusher channel auth                       │  │
│  │                                                                        │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                          │                                                   │
│              ┌───────────┴───────────┐                                      │
│              ▼                       ▼                                      │
│  ┌─────────────────────┐  ┌─────────────────────────────────────────────┐  │
│  │    Drizzle ORM      │  │           AI Service Layer                   │  │
│  │                     │  │                                              │  │
│  │  - conversations    │  │  ┌─────────────────────────────────────┐    │  │
│  │  - messages         │  │  │      Portfolio Context Builder       │    │  │
│  │  - chat_sessions    │  │  │                                      │    │  │
│  │  - chat_settings    │  │  │  - Fetch tech_stack data            │    │  │
│  │  - tech_stack       │  │  │  - Fetch career data                │    │  │
│  │  - career           │  │  │  - Fetch about data                 │    │  │
│  │  - about            │  │  │  - Build system prompt              │    │  │
│  │                     │  │  └─────────────────────────────────────┘    │  │
│  └──────────┬──────────┘  │                     │                        │  │
│             │             │                     ▼                        │  │
│             │             │  ┌─────────────────────────────────────┐    │  │
│             │             │  │         OpenAI / Vercel AI          │    │  │
│             │             │  │                                      │    │  │
│             │             │  │  - GPT-4o-mini                      │    │  │
│             │             │  │  - Streaming responses              │    │  │
│             │             │  │  - Context-aware replies            │    │  │
│             │             │  └─────────────────────────────────────┘    │  │
│             │             └──────────────────────────────────────────────┘  │
│             ▼                                                               │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                        MySQL Database                                │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 4.2 Data Flow

```
Visitor Mengirim Pesan (AI Mode ON):
====================================

1. Visitor → [/chat Page] → POST /api/chat/send
2. API Route → [Save visitor message to DB]
3. API Route → [Check AI toggle setting]
4. If AI enabled:
   a. [Fetch portfolio context] → tech_stack, career, about
   b. [Build AI prompt with context]
   c. [Call OpenAI API] → Get AI response
   d. [Save AI response to DB]
   e. [Pusher] → Trigger 'new-message' event
5. Pusher → [WebSocket] → Visitor sees AI response
6. Pusher → [WebSocket] → Admin Dashboard updated


Visitor Mengirim Pesan (Manual Mode):
=====================================

1. Visitor → [/chat Page] → POST /api/chat/send
2. API Route → [Save visitor message to DB]
3. API Route → [Check AI toggle setting]
4. If AI disabled:
   a. [Pusher] → Trigger 'new-message' to Admin
   b. Admin receives notification
5. Admin → [/admin/chat] → POST /api/chat/send (reply)
6. API Route → [Save admin message to DB]
7. [Pusher] → Trigger 'new-message' event
8. Pusher → [WebSocket] → Visitor sees Admin response


Admin Take Over dari AI:
========================

1. Admin → [Toggle OFF AI] → PATCH /api/chat/settings
2. Admin → [Select conversation] → View chat
3. Admin → [Send message] → POST /api/chat/send
4. From this point, all responses are manual
```

### 4.3 Channel Strategy

```
Channels:
=========

1. private-conversation-{conversationId}
   - Untuk komunikasi antara visitor dan admin/AI dalam satu conversation
   - Events: 
     - new-message (pesan baru dari visitor/admin/AI)
     - message-read
     - typing
     - ai-typing (khusus saat AI sedang generate response)

2. presence-admin-chat
   - Untuk admin presence (online/offline status)
   - Events: member-added, member-removed

3. private-admin-notifications
   - Untuk notifikasi ke semua admin
   - Events: 
     - new-conversation
     - new-message-alert
     - ai-settings-changed
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
// src/db/schema.ts - Tambahan untuk Chat & AI

import {
  mysqlTable,
  int,
  varchar,
  timestamp,
  text,
  boolean,
  mysqlEnum,
  json,
} from 'drizzle-orm/mysql-core';
import { relations } from 'drizzle-orm';

/* ================= CHAT SETTINGS ================= */
export const chatSettings = mysqlTable('chat_settings', {
  id: int('id').autoincrement().primaryKey(),
  aiEnabled: boolean('ai_enabled').notNull().default(true),
  aiModel: varchar('ai_model', { length: 50 }).notNull().default('gpt-4o-mini'),
  aiSystemPrompt: text('ai_system_prompt'),
  aiTemperature: varchar('ai_temperature', { length: 10 }).default('0.7'),
  welcomeMessage: text('welcome_message'),
  offlineMessage: text('offline_message'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
});

/* ================= CONVERSATIONS ================= */
export const conversations = mysqlTable('conversations', {
  id: int('id').autoincrement().primaryKey(),
  visitorId: varchar('visitor_id', { length: 100 }).notNull(),
  visitorName: varchar('visitor_name', { length: 255 }),
  visitorEmail: varchar('visitor_email', { length: 255 }),
  status: mysqlEnum('status', ['active', 'resolved', 'closed'])
    .notNull()
    .default('active'),
  isAiHandled: boolean('is_ai_handled').notNull().default(true), // AI atau manual
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
  senderType: mysqlEnum('sender_type', ['visitor', 'admin', 'ai']).notNull(), // Tambah 'ai'
  senderId: int('sender_id'), // null for visitor & AI, user.id for admin
  content: text('content').notNull(),
  isRead: boolean('is_read').notNull().default(false),
  metadata: json('metadata'), // Untuk menyimpan info tambahan (e.g., AI model used, tokens)
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

CREATE TABLE `chat_settings` (
  `id` int AUTO_INCREMENT PRIMARY KEY,
  `ai_enabled` boolean NOT NULL DEFAULT true,
  `ai_model` varchar(50) NOT NULL DEFAULT 'gpt-4o-mini',
  `ai_system_prompt` text,
  `ai_temperature` varchar(10) DEFAULT '0.7',
  `welcome_message` text,
  `offline_message` text,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert default settings
INSERT INTO `chat_settings` (`ai_enabled`, `ai_model`, `welcome_message`, `offline_message`) 
VALUES (true, 'gpt-4o-mini', 'Halo! Ada yang bisa saya bantu?', 'Maaf, saya sedang tidak tersedia. Silakan tinggalkan pesan.');

CREATE TABLE `conversations` (
  `id` int AUTO_INCREMENT PRIMARY KEY,
  `visitor_id` varchar(100) NOT NULL,
  `visitor_name` varchar(255),
  `visitor_email` varchar(255),
  `status` enum('active', 'resolved', 'closed') NOT NULL DEFAULT 'active',
  `is_ai_handled` boolean NOT NULL DEFAULT true,
  `last_message_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_visitor_id` (`visitor_id`),
  INDEX `idx_status` (`status`)
);

CREATE TABLE `messages` (
  `id` int AUTO_INCREMENT PRIMARY KEY,
  `conversation_id` int NOT NULL,
  `sender_type` enum('visitor', 'admin', 'ai') NOT NULL,
  `sender_id` int,
  `content` text NOT NULL,
  `is_read` boolean NOT NULL DEFAULT false,
  `metadata` json,
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
Description: Mengirim pesan baru (auto-triggers AI response jika enabled)
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
    "senderType": "visitor" | "admin" | "ai",
    "createdAt": string,
    "aiResponsePending": boolean    // true jika AI akan membalas
  }
}

Flow Logic:
1. Save visitor message to DB
2. Check chatSettings.aiEnabled
3. If AI enabled AND senderType == 'visitor':
   - Trigger AI response asynchronously
   - Return with aiResponsePending: true
4. Broadcast message via Pusher
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
        "senderType": "visitor" | "admin" | "ai",
        "isRead": boolean,
        "metadata": object | null,
        "createdAt": string
      }
    ],
    "hasMore": boolean,
    "nextCursor": number | null
  }
}
```

#### 6.1.2 AI Response Endpoint

```
POST /api/chat/ai/respond
=========================
Description: Generate AI response untuk conversation
Auth: Internal (dipanggil dari /api/chat/send) atau JWT (admin untuk testing)

Request Body:
{
  "conversationId": number,
  "visitorMessage": string
}

Response (200):
{
  "success": true,
  "data": {
    "messageId": number,
    "content": string,
    "metadata": {
      "model": "gpt-4o-mini",
      "tokensUsed": number,
      "responseTime": number
    }
  }
}

Internal Process:
1. Fetch conversation history (last 10 messages)
2. Fetch portfolio context (tech_stack, career, about)
3. Build system prompt with context
4. Call OpenAI API with streaming
5. Save AI response to DB
6. Broadcast via Pusher
```

#### 6.1.3 Chat Settings (Admin Only)

```
GET /api/chat/settings
======================
Description: Get current chat & AI settings
Auth: JWT (admin only)

Response (200):
{
  "success": true,
  "data": {
    "aiEnabled": boolean,
    "aiModel": string,
    "aiTemperature": string,
    "welcomeMessage": string | null,
    "offlineMessage": string | null
  }
}
```

```
PATCH /api/chat/settings
========================
Description: Update chat & AI settings
Auth: JWT (admin only)

Request Body:
{
  "aiEnabled"?: boolean,
  "aiModel"?: string,
  "aiTemperature"?: string,
  "welcomeMessage"?: string,
  "offlineMessage"?: string,
  "aiSystemPrompt"?: string
}

Response (200):
{
  "success": true,
  "data": { /* updated settings */ }
}
```

#### 6.1.4 Conversations (Admin Only)

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
        "isAiHandled": boolean,
        "lastMessage": {
          "content": string,
          "senderType": "visitor" | "admin" | "ai",
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
Description: Update conversation (status, AI handling)
Auth: JWT (admin only)

Request Body:
{
  "status"?: "active" | "resolved" | "closed",
  "isAiHandled"?: boolean  // false = admin take over
}

Response (200):
{
  "success": true,
  "data": {
    "id": number,
    "status": string,
    "isAiHandled": boolean
  }
}
```

#### 6.1.5 Pusher Authentication

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

#### 6.1.6 Visitor Session

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
    "expiresAt": string,
    "welcomeMessage": string | null  // dari chat settings
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
    senderType: 'visitor' | 'admin' | 'ai';
    createdAt: string;
  };
}

interface AITypingEvent {
  event: 'ai-typing';
  data: {
    isTyping: boolean;
    conversationId: number;
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

interface AISettingsChangedEvent {
  event: 'ai-settings-changed';
  data: {
    aiEnabled: boolean;
    changedBy: string;
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
│   │   │   │       └── route.ts      # PATCH - update conversation
│   │   │   ├── session/
│   │   │   │   └── route.ts          # POST - manage visitor session
│   │   │   ├── settings/
│   │   │   │   └── route.ts          # GET/PATCH - AI & chat settings
│   │   │   └── ai/
│   │   │       └── respond/
│   │   │           └── route.ts      # POST - AI generate response
│   │   └── pusher/
│   │       ├── auth/
│   │       │   └── route.ts          # POST - channel auth
│   │       └── webhook/
│   │           └── route.ts          # POST - webhook handler
│   │
│   ├── chat/
│   │   ├── page.tsx                  # Visitor chat page (dedicated)
│   │   └── ChatPageClient.tsx        # Client component for chat
│   │
│   ├── admin/
│   │   └── chat/
│   │       ├── page.tsx              # Admin chat dashboard
│   │       └── ChatClient.tsx        # Client component
│   │
│   └── components/
│       └── chat/
│           ├── ChatWindow.tsx        # Chat window content
│           ├── ChatMessage.tsx       # Single message component
│           ├── ChatInput.tsx         # Input dengan typing indicator
│           ├── ChatHeader.tsx        # Header dengan status
│           ├── AIBadge.tsx           # Badge indicator for AI messages
│           ├── AITypingIndicator.tsx # Special AI typing animation
│           ├── ConversationList.tsx  # Admin: list conversations
│           ├── ConversationItem.tsx  # Admin: single conversation
│           ├── AIToggleSwitch.tsx    # Admin: toggle AI on/off
│           └── TypingIndicator.tsx   # Animasi typing
│
├── src/
│   ├── actions/
│   │   ├── chat.ts                   # Server actions untuk chat
│   │   └── chat-settings.ts          # Server actions untuk AI settings
│   │
│   ├── db/
│   │   └── schema.ts                 # + conversations, messages, chatSessions, chatSettings
│   │
│   ├── lib/
│   │   ├── pusher/
│   │   │   ├── server.ts             # Pusher server instance
│   │   │   └── client.ts             # Pusher client instance
│   │   ├── chat/
│   │   │   ├── session.ts            # Session management
│   │   │   └── utils.ts              # Chat utilities
│   │   ├── ai/
│   │   │   ├── openai.ts             # OpenAI client configuration
│   │   │   ├── context-builder.ts    # Build context from portfolio data
│   │   │   ├── prompts.ts            # System prompts
│   │   │   └── stream-handler.ts     # Handle streaming responses
│   │   └── validations.ts            # + chat validations
│   │
│   └── hooks/
│       ├── useChat.ts                # Chat state management
│       ├── usePusher.ts              # Pusher connection hook
│       ├── useTyping.ts              # Typing indicator hook
│       └── useAIStatus.ts            # AI status & typing hook
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
npm install pusher pusher-js uuid ai @ai-sdk/openai

# Dev dependencies
npm install -D @types/uuid
```

**package.json additions:**
```json
{
  "dependencies": {
    "pusher": "^5.2.0",
    "pusher-js": "^8.4.0",
    "uuid": "^9.0.1",
    "ai": "^3.4.0",
    "@ai-sdk/openai": "^0.0.66"
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

# OpenAI Configuration
OPENAI_API_KEY=sk-your-openai-api-key

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

#### 8.3.3 Visitor Chat Page Component

```typescript
// app/chat/page.tsx
import ChatPageClient from './ChatPageClient';

export const metadata = {
  title: 'Chat with Me | Portfolio',
  description: 'Have a conversation with me or my AI assistant',
};

export default function ChatPage() {
  return <ChatPageClient />;
}
```

```typescript
// app/chat/ChatPageClient.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { useChat } from '@/hooks/useChat';
import ChatMessage from '@/components/chat/ChatMessage';
import ChatInput from '@/components/chat/ChatInput';
import AITypingIndicator from '@/components/chat/AITypingIndicator';

export default function ChatPageClient() {
  const { 
    messages, 
    sendMessage, 
    isConnected, 
    isAITyping,
    visitorName,
    setVisitorName 
  } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isAITyping]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 
                    flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white/10 backdrop-blur-lg 
                      rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-white/20 px-6 py-4 border-b border-white/10">
          <h1 className="text-xl font-semibold text-white">Chat with Me</h1>
          <p className="text-sm text-gray-300">
            {isConnected ? (
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                Online - AI Assistant available
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 bg-yellow-400 rounded-full" />
                Connecting...
              </span>
            )}
          </p>
        </div>

        {/* Messages Area */}
        <div className="h-[500px] overflow-y-auto p-4 space-y-4">
          {/* Welcome message */}
          {messages.length === 0 && (
            <div className="text-center text-gray-400 mt-8">
              <p>👋 Hello! Feel free to ask me anything about my work,</p>
              <p>projects, or technical skills.</p>
            </div>
          )}
          
          {messages.map((message) => (
            <ChatMessage 
              key={message.id} 
              message={message} 
            />
          ))}
          
          {isAITyping && <AITypingIndicator />}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <ChatInput 
          onSend={sendMessage}
          disabled={!isConnected}
          visitorName={visitorName}
          onSetVisitorName={setVisitorName}
        />
      </div>
    </div>
  );
}
```

#### 8.3.4 ChatMessage Component with AI Badge

```typescript
// app/components/chat/ChatMessage.tsx
'use client';

import { Message } from '@/types/chat';
import AIBadge from './AIBadge';

interface ChatMessageProps {
  message: Message;
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const isVisitor = message.senderType === 'visitor';
  const isAI = message.senderType === 'ai';
  
  return (
    <div className={`flex ${isVisitor ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[80%] rounded-2xl px-4 py-2 ${
        isVisitor 
          ? 'bg-blue-600 text-white rounded-br-sm' 
          : isAI 
            ? 'bg-gradient-to-r from-purple-500/20 to-blue-500/20 text-white rounded-bl-sm border border-purple-500/30'
            : 'bg-white/20 text-white rounded-bl-sm'
      }`}>
        {/* AI Badge */}
        {isAI && (
          <div className="flex items-center gap-2 mb-1">
            <AIBadge />
          </div>
        )}
        
        {/* Admin indicator */}
        {message.senderType === 'admin' && (
          <span className="text-xs text-green-300 block mb-1">Admin</span>
        )}
        
        <p className="whitespace-pre-wrap">{message.content}</p>
        
        <span className={`text-xs mt-1 block ${
          isVisitor ? 'text-blue-200' : 'text-gray-400'
        }`}>
          {new Date(message.createdAt).toLocaleTimeString()}
        </span>
      </div>
    </div>
  );
}
```

```typescript
// app/components/chat/AIBadge.tsx
export default function AIBadge() {
  return (
    <span className="inline-flex items-center gap-1 text-xs bg-purple-500/30 
                     text-purple-200 px-2 py-0.5 rounded-full">
      <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
      </svg>
      AI Assistant
    </span>
  );
}
```

#### 8.3.5 AI Typing Indicator

```typescript
// app/components/chat/AITypingIndicator.tsx
export default function AITypingIndicator() {
  return (
    <div className="flex justify-start">
      <div className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 
                      rounded-2xl rounded-bl-sm px-4 py-3 border border-purple-500/30">
        <div className="flex items-center gap-2">
          <span className="text-xs text-purple-300">AI is thinking</span>
          <div className="flex gap-1">
            <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" 
                  style={{ animationDelay: '0ms' }} />
            <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" 
                  style={{ animationDelay: '150ms' }} />
            <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" 
                  style={{ animationDelay: '300ms' }} />
          </div>
        </div>
      </div>
    </div>
  );
}
```

#### 8.3.6 useChat Hook (Updated with AI)

```typescript
// src/hooks/useChat.ts
'use client';

import { useState, useEffect, useCallback } from 'react';
import { getPusherClient, subscribeToChatChannel } from '@/lib/pusher/client';

interface Message {
  id: number;
  content: string;
  senderType: 'visitor' | 'admin' | 'ai';
  createdAt: string;
  isRead: boolean;
}

interface UseChatReturn {
  messages: Message[];
  sendMessage: (content: string) => Promise<void>;
  isConnected: boolean;
  isLoading: boolean;
  isAITyping: boolean;
  visitorName: string | null;
  setVisitorName: (name: string) => void;
  conversationId: number | null;
}

export function useChat(): UseChatReturn {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isAITyping, setIsAITyping] = useState(false);
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
    
    // Listen for new messages
    channel.bind('new-message', (data: Message) => {
      setMessages(prev => [...prev, data]);
      setIsAITyping(false); // Clear AI typing when message arrives
    });

    // Listen for AI typing status
    channel.bind('ai-typing', (data: { isTyping: boolean }) => {
      setIsAITyping(data.isTyping);
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
    isAITyping,
    visitorName,
    setVisitorName,
    conversationId,
  };
}
```

#### 8.3.7 API Route - Send Message (Updated with AI)

```typescript
// app/api/chat/send/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { messages, conversations, chatSessions, chatSettings } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { pusherServer, triggerConversationEvent, triggerAdminNotification } from '@/lib/pusher/server';
import { verifyToken } from '@/lib/auth';
import { generateAIResponse } from '@/lib/ai/openai';

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
        isAiHandled: true, // Default to AI handling
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

    // Insert visitor message
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

    // If visitor message, check if AI should respond
    let aiResponsePending = false;
    if (senderType === 'visitor') {
      // Notify admin channel
      await triggerAdminNotification('new-message-alert', {
        conversationId: convId,
        messagePreview: content.substring(0, 50),
        senderType: 'visitor',
      });

      // Check chat settings and conversation AI status
      const settings = await db.query.chatSettings.findFirst();
      const conversation = await db.query.conversations.findFirst({
        where: eq(conversations.id, convId),
      });

      if (settings?.aiEnabled && conversation?.isAiHandled) {
        aiResponsePending = true;
        
        // Trigger AI typing indicator
        await triggerConversationEvent(convId, 'ai-typing', { isTyping: true });
        
        // Generate AI response asynchronously (don't await)
        generateAIResponse(convId, content).catch(console.error);
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        messageId: newMessage.insertId,
        conversationId: convId,
        ...messageData,
        aiResponsePending,
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

#### 8.3.8 Pusher Auth Endpoint

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

## 9. AI Integration

### 9.1 OpenAI Configuration

```typescript
// src/lib/ai/openai.ts
import { createOpenAI } from '@ai-sdk/openai';
import { generateText } from 'ai';
import { db } from '@/db';
import { messages, conversations, chatSettings } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import { buildPortfolioContext } from './context-builder';
import { triggerConversationEvent } from '@/lib/pusher/server';

const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateAIResponse(
  conversationId: number,
  visitorMessage: string
): Promise<void> {
  try {
    // Get chat settings
    const settings = await db.query.chatSettings.findFirst();
    
    // Get conversation history (last 10 messages for context)
    const history = await db.query.messages.findMany({
      where: eq(messages.conversationId, conversationId),
      orderBy: [desc(messages.createdAt)],
      limit: 10,
    });
    
    // Build portfolio context
    const portfolioContext = await buildPortfolioContext();
    
    // Build system prompt
    const systemPrompt = buildSystemPrompt(
      portfolioContext,
      settings?.aiSystemPrompt
    );
    
    // Build message history for context
    const messageHistory = history.reverse().map(msg => ({
      role: msg.senderType === 'visitor' ? 'user' : 'assistant' as const,
      content: msg.content,
    }));

    // Generate AI response
    const startTime = Date.now();
    const { text } = await generateText({
      model: openai(settings?.aiModel || 'gpt-4o-mini'),
      system: systemPrompt,
      messages: [
        ...messageHistory,
        { role: 'user', content: visitorMessage }
      ],
      temperature: parseFloat(settings?.aiTemperature || '0.7'),
      maxTokens: 500,
    });
    const responseTime = Date.now() - startTime;

    // Save AI response to database
    const [newMessage] = await db.insert(messages).values({
      conversationId,
      senderType: 'ai',
      senderId: null,
      content: text,
      isRead: false,
      metadata: {
        model: settings?.aiModel || 'gpt-4o-mini',
        responseTime,
      },
    });

    // Stop AI typing indicator
    await triggerConversationEvent(conversationId, 'ai-typing', { 
      isTyping: false 
    });

    // Broadcast AI message
    await triggerConversationEvent(conversationId, 'new-message', {
      id: newMessage.insertId,
      content: text,
      senderType: 'ai',
      createdAt: new Date().toISOString(),
      isRead: false,
    });

    // Update conversation last message time
    await db.update(conversations)
      .set({ lastMessageAt: new Date() })
      .where(eq(conversations.id, conversationId));

  } catch (error) {
    console.error('AI Response Error:', error);
    
    // Stop AI typing on error
    await triggerConversationEvent(conversationId, 'ai-typing', { 
      isTyping: false 
    });
    
    // Optionally send error message
    await triggerConversationEvent(conversationId, 'new-message', {
      id: Date.now(),
      content: 'Maaf, terjadi kesalahan. Silakan coba lagi atau tunggu admin membalas.',
      senderType: 'ai',
      createdAt: new Date().toISOString(),
      isRead: false,
    });
  }
}

function buildSystemPrompt(
  portfolioContext: string,
  customPrompt?: string | null
): string {
  const basePrompt = `Kamu adalah AI Assistant yang ramah untuk portfolio website.
Tugasmu adalah membantu visitor yang ingin mengetahui lebih lanjut tentang pemilik portfolio ini.

INSTRUKSI PENTING:
1. Jawab dalam bahasa yang sama dengan visitor (Indonesia atau English)
2. Berikan jawaban yang informatif namun ringkas (maksimal 3-4 kalimat)
3. Jika ditanya tentang sesuatu yang tidak ada di context, katakan bahwa kamu tidak memiliki informasi tersebut
4. Selalu bersikap profesional dan ramah
5. Jika visitor ingin menghubungi langsung, arahkan ke halaman contact

CONTEXT PORTFOLIO:
${portfolioContext}`;

  if (customPrompt) {
    return `${basePrompt}\n\nINSTRUKSI TAMBAHAN DARI ADMIN:\n${customPrompt}`;
  }

  return basePrompt;
}
```

### 9.2 Portfolio Context Builder

```typescript
// src/lib/ai/context-builder.ts
import { db } from '@/db';

interface PortfolioData {
  techStack: {
    name: string;
    category: string;
    proficiencyLevel: string | null;
  }[];
  career: {
    title: string;
    company: string;
    description: string | null;
    startDate: Date;
    endDate: Date | null;
    type: string;
  }[];
  about: {
    narrative: string | null;
    coreValues: string | null;
    interests: string | null;
  } | null;
}

export async function buildPortfolioContext(): Promise<string> {
  // Fetch all relevant portfolio data
  const techStack = await db.query.techStack.findMany({
    where: (tech, { eq }) => eq(tech.isActive, true),
  });

  const career = await db.query.career.findMany({
    where: (career, { eq }) => eq(career.isActive, true),
    orderBy: (career, { desc }) => [desc(career.startDate)],
  });

  const about = await db.query.about.findFirst();

  // Build context string
  let context = '';

  // About section
  if (about) {
    context += `## TENTANG PEMILIK PORTFOLIO\n`;
    if (about.narrative) {
      context += `${about.narrative}\n\n`;
    }
    if (about.coreValues) {
      const values = JSON.parse(about.coreValues as string);
      if (values.length > 0) {
        context += `Core Values: ${values.map((v: any) => v.title).join(', ')}\n\n`;
      }
    }
    if (about.interests) {
      const interests = JSON.parse(about.interests as string);
      if (interests.length > 0) {
        context += `Interests: ${interests.map((i: any) => i.name).join(', ')}\n\n`;
      }
    }
  }

  // Tech Stack section
  if (techStack.length > 0) {
    context += `## TECH STACK & SKILLS\n`;
    
    // Group by category
    const grouped = techStack.reduce((acc, tech) => {
      const cat = tech.category || 'Other';
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(tech);
      return acc;
    }, {} as Record<string, typeof techStack>);

    for (const [category, techs] of Object.entries(grouped)) {
      context += `${category}: ${techs.map(t => t.name).join(', ')}\n`;
    }
    context += '\n';
  }

  // Career/Experience section
  if (career.length > 0) {
    context += `## PENGALAMAN KERJA\n`;
    for (const job of career) {
      const endYear = job.endDate 
        ? new Date(job.endDate).getFullYear() 
        : 'Present';
      const startYear = new Date(job.startDate).getFullYear();
      
      context += `- ${job.title} at ${job.company} (${startYear}-${endYear})\n`;
      if (job.description) {
        context += `  ${job.description.substring(0, 200)}...\n`;
      }
    }
    context += '\n';
  }

  return context;
}
```

### 9.3 Admin Chat Settings API

```typescript
// app/api/chat/settings/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { chatSettings } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { verifyToken } from '@/lib/auth';
import { pusherServer } from '@/lib/pusher/server';

// GET - Fetch current settings
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const payload = await verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const settings = await db.query.chatSettings.findFirst();
    
    return NextResponse.json({
      success: true,
      data: settings || {
        aiEnabled: true,
        aiModel: 'gpt-4o-mini',
        aiTemperature: '0.7',
        welcomeMessage: null,
        offlineMessage: null,
      },
    });
  } catch (error) {
    console.error('Error fetching chat settings:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch settings' },
      { status: 500 }
    );
  }
}

// PATCH - Update settings
export async function PATCH(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const payload = await verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const body = await request.json();
    const {
      aiEnabled,
      aiModel,
      aiTemperature,
      welcomeMessage,
      offlineMessage,
      aiSystemPrompt,
    } = body;

    // Check if settings exist
    const existing = await db.query.chatSettings.findFirst();

    if (existing) {
      await db.update(chatSettings)
        .set({
          ...(aiEnabled !== undefined && { aiEnabled }),
          ...(aiModel && { aiModel }),
          ...(aiTemperature && { aiTemperature }),
          ...(welcomeMessage !== undefined && { welcomeMessage }),
          ...(offlineMessage !== undefined && { offlineMessage }),
          ...(aiSystemPrompt !== undefined && { aiSystemPrompt }),
        })
        .where(eq(chatSettings.id, existing.id));
    } else {
      await db.insert(chatSettings).values({
        aiEnabled: aiEnabled ?? true,
        aiModel: aiModel || 'gpt-4o-mini',
        aiTemperature: aiTemperature || '0.7',
        welcomeMessage,
        offlineMessage,
        aiSystemPrompt,
      });
    }

    // Broadcast AI settings change
    if (aiEnabled !== undefined) {
      await pusherServer.trigger('private-admin-notifications', 'ai-settings-changed', {
        aiEnabled,
        changedBy: payload.username || 'Admin',
      });
    }

    const updated = await db.query.chatSettings.findFirst();

    return NextResponse.json({
      success: true,
      data: updated,
    });
  } catch (error) {
    console.error('Error updating chat settings:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update settings' },
      { status: 500 }
    );
  }
}
```

### 9.4 Admin AI Toggle Component

```typescript
// app/components/chat/AIToggleSwitch.tsx
'use client';

import { useState } from 'react';

interface AIToggleSwitchProps {
  initialEnabled: boolean;
  onToggle: (enabled: boolean) => Promise<void>;
}

export default function AIToggleSwitch({ 
  initialEnabled, 
  onToggle 
}: AIToggleSwitchProps) {
  const [enabled, setEnabled] = useState(initialEnabled);
  const [isLoading, setIsLoading] = useState(false);

  const handleToggle = async () => {
    setIsLoading(true);
    try {
      await onToggle(!enabled);
      setEnabled(!enabled);
    } catch (error) {
      console.error('Failed to toggle AI:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-3 p-4 bg-white/10 rounded-lg">
      <div className="flex-1">
        <h3 className="text-white font-medium">AI Auto-Reply</h3>
        <p className="text-sm text-gray-400">
          {enabled 
            ? 'AI akan membalas chat secara otomatis'
            : 'Anda akan membalas chat secara manual'
          }
        </p>
      </div>
      <button
        onClick={handleToggle}
        disabled={isLoading}
        className={`relative inline-flex h-6 w-11 items-center rounded-full 
                   transition-colors focus:outline-none focus:ring-2 
                   focus:ring-blue-500 focus:ring-offset-2
                   ${enabled ? 'bg-blue-600' : 'bg-gray-600'}
                   ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full 
                     bg-white transition-transform
                     ${enabled ? 'translate-x-6' : 'translate-x-1'}`}
        />
      </button>
    </div>
  );
}
```

### 9.5 Admin Take Over Conversation

```typescript
// app/admin/chat/ChatClient.tsx (partial - Take Over functionality)
'use client';

import { useState } from 'react';
import AIToggleSwitch from '@/components/chat/AIToggleSwitch';

export default function AdminChatClient() {
  const [selectedConversation, setSelectedConversation] = useState<number | null>(null);
  const [globalAIEnabled, setGlobalAIEnabled] = useState(true);

  // Toggle global AI
  const handleGlobalAIToggle = async (enabled: boolean) => {
    const response = await fetch('/api/chat/settings', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getAuthToken()}`,
      },
      body: JSON.stringify({ aiEnabled: enabled }),
    });

    if (response.ok) {
      setGlobalAIEnabled(enabled);
    }
  };

  // Take over specific conversation
  const handleTakeOver = async (conversationId: number) => {
    const response = await fetch(`/api/chat/conversations/${conversationId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getAuthToken()}`,
      },
      body: JSON.stringify({ isAiHandled: false }),
    });

    if (response.ok) {
      // Update local state
      // Conversation will now be handled manually
    }
  };

  return (
    <div className="flex h-screen bg-gray-900">
      {/* Sidebar with settings */}
      <div className="w-80 border-r border-white/10 flex flex-col">
        {/* AI Toggle at top */}
        <div className="p-4 border-b border-white/10">
          <AIToggleSwitch 
            initialEnabled={globalAIEnabled}
            onToggle={handleGlobalAIToggle}
          />
        </div>

        {/* Conversation List */}
        <div className="flex-1 overflow-y-auto">
          {/* ... conversation items ... */}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat messages and input */}
      </div>
    </div>
  );
}
```

---

## 10. Security Considerations

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

## 11. Testing Strategy

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

## 12. Deployment

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

## 13. Timeline Implementasi

### Phase 1: Foundation (2-3 hari)
- [ ] Setup Pusher account dan credentials
- [ ] Setup OpenAI account dan API key
- [ ] Tambah database schema dan migration (termasuk chatSettings)
- [ ] Buat Pusher server/client configuration
- [ ] Implement session management API

### Phase 2: Core Chat (3-4 hari)
- [ ] Implement send message API
- [ ] Implement get messages API  
- [ ] Implement Pusher auth endpoint
- [ ] Buat useChat hook (dengan AI typing support)
- [ ] Buat Chat Page component (`/chat`)

### Phase 3: AI Integration (3-4 hari)
- [ ] Setup OpenAI/Vercel AI SDK
- [ ] Implement portfolio context builder
- [ ] Create AI response generator
- [ ] Implement chat settings API
- [ ] Add AI typing indicator
- [ ] Test AI responses dengan berbagai pertanyaan

### Phase 4: Admin Dashboard (3-4 hari)
- [ ] Implement conversations list API
- [ ] Implement conversation status update API
- [ ] Buat admin chat page (`/admin/chat`)
- [ ] Buat ConversationList component
- [ ] Implement AI Toggle Switch
- [ ] Implement Take Over conversation feature
- [ ] Implement admin notifications

### Phase 5: Polish & Testing (2-3 hari)
- [ ] Add typing indicators
- [ ] Add sound notifications
- [ ] Responsive design adjustments
- [ ] Write unit tests
- [ ] Write integration tests
- [ ] Bug fixes

### Phase 6: Deployment (1 hari)
- [ ] Setup production Pusher
- [ ] Setup production OpenAI API key
- [ ] Deploy database migrations
- [ ] Deploy to Vercel
- [ ] Smoke testing
- [ ] Monitor AI costs

**Total Estimasi: 14-19 hari**

---

## 📝 Catatan Tambahan

### AI Cost Estimation

| Usage | Tokens/day | Cost/month (GPT-4o-mini) |
|-------|-----------|--------------------------|
| Low (10 chats) | ~5,000 | ~$0.02 |
| Medium (50 chats) | ~25,000 | ~$0.11 |
| High (200 chats) | ~100,000 | ~$0.45 |

*Berdasarkan ~500 tokens per conversation (context + response)*

### Alternatif Self-Hosted dengan Socket.IO

Jika memilih Socket.IO, diperlukan:
1. Custom server (server.js) yang wrap Next.js
2. Deployment ke platform yang support WebSocket (Railway, Render, DigitalOcean)
3. Setup Redis adapter untuk scaling

### Future Enhancements

1. **File Attachments**: Upload gambar/file dalam chat
2. **Chat History Export**: Download chat history sebagai PDF
3. **Analytics Dashboard**: Track AI usage, response time, satisfaction
4. **Multi-Admin**: Assign conversations ke admin tertentu
5. **Scheduled Responses**: Auto-reply dengan delay untuk naturalness
6. **Sentiment Analysis**: Deteksi mood visitor untuk prioritas
7. **AI Fine-tuning**: Train model khusus untuk portfolio

---

**Dokumen ini akan diupdate sesuai kebutuhan selama implementasi.**

*Last updated: $(date)*
