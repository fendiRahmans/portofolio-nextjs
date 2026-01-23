import { mysqlTable, serial, varchar, timestamp, text, json } from 'drizzle-orm/mysql-core';

export const users = mysqlTable('users', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password: varchar('password', { length: 255 }).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const techStack = mysqlTable('tech_stack', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description').notNull(),
  iconName: varchar('icon_name', { length: 255 }).notNull(),
  iconColor: varchar('icon_color', { length: 50 }).notNull(),
  bgColor: varchar('bg_color', { length: 50 }).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
});

export const career = mysqlTable('career', {
  id: serial('id').primaryKey(),
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

export const contact = mysqlTable('contact', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  message: text('message').notNull(),
  status: varchar('status', { length: 50 }).notNull().default('new'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
});

export const setting = mysqlTable('setting', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull().unique(),
  value: text('value').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
});

export const about = mysqlTable('about', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  location: varchar('location', { length: 255 }).notNull(),
  imageUrl: text('image_url').notNull(),
  narrativeTitle: varchar('narrative_title', { length: 255 }).notNull(),
  narrativeContent: text('narrative_content').notNull(),
  coreValues: json('core_values').$type<{ icon: string; title: string; description: string }[]>(),
  interests: json('interests').$type<string[]>(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
});
