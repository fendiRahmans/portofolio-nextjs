import {
  mysqlTable,
  int,
  varchar,
  timestamp,
  text,
  json,
} from 'drizzle-orm/mysql-core';
import { relations } from 'drizzle-orm';

/* ================= USERS ================= */
export const users = mysqlTable('users', {
  id: int('id').autoincrement().primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password: varchar('password', { length: 255 }).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

/* ================= TECH STACK ================= */
export const techStack = mysqlTable('tech_stack', {
  id: int('id').autoincrement().primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description').notNull(),
  iconName: varchar('icon_name', { length: 255 }).notNull(),
  iconColor: varchar('icon_color', { length: 50 }).notNull(),
  bgColor: varchar('bg_color', { length: 50 }).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
});

/* ================= CAREER ================= */
export const career = mysqlTable('career', {
  id: int('id').autoincrement().primaryKey(),
  year: varchar('year', { length: 100 }).notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  subtitle: varchar('subtitle', { length: 255 }).notNull(),
  description: text('description').notNull(),
  icon: varchar('icon', { length: 50 }).notNull(),
  color: varchar('color', { length: 50 }).notNull(),
  techStack: json('tech_stack').$type<string[]>(),
  keyProjects: json('key_projects').$type<string[]>(),
  projectList: json('project_list').$type<{ name: string; type?: string }[]>(),
  bulletPoints: json('bullet_points').$type<string[]>(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
});

/* ================= CONTACT ================= */
export const contact = mysqlTable('contact', {
  id: int('id').autoincrement().primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  message: text('message').notNull(),
  status: varchar('status', { length: 50 }).notNull().default('new'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
});

/* ================= SETTING ================= */
export const setting = mysqlTable('setting', {
  id: int('id').autoincrement().primaryKey(),
  name: varchar('name', { length: 255 }).notNull().unique(),
  value: text('value').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
});

/* ================= ABOUT ================= */
export const about = mysqlTable('about', {
  id: int('id').autoincrement().primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  location: varchar('location', { length: 255 }).notNull(),
  imageUrl: text('image_url').notNull(),
  narrativeTitle: varchar('narrative_title', { length: 255 }).notNull(),
  narrativeContent: text('narrative_content').notNull(),
  coreValues: json('core_values')
    .$type<{ icon: string; title: string; description: string }[]>(),
  interests: json('interests').$type<string[]>(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
});

/* ================= CHAT SETTINGS ================= */
export const chatSettings = mysqlTable('chat_settings', {
  id: int('id').autoincrement().primaryKey(),
  aiEnabled: int('ai_enabled').notNull().default(1), // 1 = enabled, 0 = disabled
  aiModel: varchar('ai_model', { length: 100 }).notNull().default('gpt-4o-mini'),
  aiTemperature: int('ai_temperature').notNull().default(70), // 0-100, will be divided by 100
  systemPrompt: text('system_prompt').notNull(),
  autoReplyDelay: int('auto_reply_delay').notNull().default(2000), // milliseconds
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
});

/* ================= CONVERSATIONS ================= */
export const conversations = mysqlTable('conversations', {
  id: int('id').autoincrement().primaryKey(),
  visitorId: varchar('visitor_id', { length: 255 }).notNull(), // UUID for anonymous visitors
  visitorName: varchar('visitor_name', { length: 255 }),
  visitorEmail: varchar('visitor_email', { length: 255 }),
  status: varchar('status', { length: 50 }).notNull().default('active'), // active, archived, closed
  lastMessageAt: timestamp('last_message_at'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
});

/* ================= MESSAGES ================= */
export const messages = mysqlTable('messages', {
  id: int('id').autoincrement().primaryKey(),
  conversationId: int('conversation_id').notNull(),
  senderId: varchar('sender_id', { length: 255 }).notNull(), // visitorId or 'admin' or 'ai'
  senderType: varchar('sender_type', { length: 50 }).notNull(), // 'visitor', 'admin', 'ai'
  content: text('content').notNull(),
  isRead: int('is_read').notNull().default(0), // 0 = unread, 1 = read
  createdAt: timestamp('created_at').defaultNow(),
});

/* ================= CHAT SESSIONS ================= */
export const chatSessions = mysqlTable('chat_sessions', {
  id: int('id').autoincrement().primaryKey(),
  sessionId: varchar('session_id', { length: 255 }).notNull().unique(), // UUID
  visitorId: varchar('visitor_id', { length: 255 }).notNull(),
  ipAddress: varchar('ip_address', { length: 100 }),
  userAgent: text('user_agent'),
  lastActiveAt: timestamp('last_active_at').defaultNow(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

/* ================= RELATIONS ================= */
export const conversationsRelations = relations(conversations, ({ many }) => ({
  messages: many(messages),
}));

export const messagesRelations = relations(messages, ({ one }) => ({
  conversation: one(conversations, {
    fields: [messages.conversationId],
    references: [conversations.id],
  }),
}));
