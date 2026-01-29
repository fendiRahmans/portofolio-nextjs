CREATE TABLE `chat_sessions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`session_id` varchar(255) NOT NULL,
	`visitor_id` varchar(255) NOT NULL,
	`ip_address` varchar(100),
	`user_agent` text,
	`last_active_at` timestamp DEFAULT (now()),
	`expires_at` timestamp NOT NULL,
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `chat_sessions_id` PRIMARY KEY(`id`),
	CONSTRAINT `chat_sessions_session_id_unique` UNIQUE(`session_id`)
);
--> statement-breakpoint
CREATE TABLE `chat_settings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`ai_enabled` int NOT NULL DEFAULT 1,
	`ai_model` varchar(100) NOT NULL DEFAULT 'gpt-4o-mini',
	`ai_temperature` int NOT NULL DEFAULT 70,
	`system_prompt` text NOT NULL,
	`auto_reply_delay` int NOT NULL DEFAULT 2000,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `chat_settings_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `conversations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`visitor_id` varchar(255) NOT NULL,
	`visitor_name` varchar(255),
	`visitor_email` varchar(255),
	`status` varchar(50) NOT NULL DEFAULT 'active',
	`last_message_at` timestamp,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `conversations_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `messages` (
	`id` int AUTO_INCREMENT NOT NULL,
	`conversation_id` int NOT NULL,
	`sender_id` varchar(255) NOT NULL,
	`sender_type` varchar(50) NOT NULL,
	`content` text NOT NULL,
	`is_read` int NOT NULL DEFAULT 0,
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `messages_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `about` MODIFY COLUMN `id` int AUTO_INCREMENT NOT NULL;--> statement-breakpoint
ALTER TABLE `career` MODIFY COLUMN `id` int AUTO_INCREMENT NOT NULL;--> statement-breakpoint
ALTER TABLE `contact` MODIFY COLUMN `id` int AUTO_INCREMENT NOT NULL;--> statement-breakpoint
ALTER TABLE `setting` MODIFY COLUMN `id` int AUTO_INCREMENT NOT NULL;--> statement-breakpoint
ALTER TABLE `tech_stack` MODIFY COLUMN `id` int AUTO_INCREMENT NOT NULL;--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `id` int AUTO_INCREMENT NOT NULL;