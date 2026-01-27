import {
  mysqlTable,
  int,
  varchar,
  timestamp,
  text,
  json,
} from 'drizzle-orm/mysql-core';

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
