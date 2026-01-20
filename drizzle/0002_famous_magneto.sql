CREATE TABLE `tech_stack` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text NOT NULL,
	`icon_name` varchar(255) NOT NULL,
	`icon_color` varchar(50) NOT NULL,
	`bg_color` varchar(50) NOT NULL,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `tech_stack_id` PRIMARY KEY(`id`)
);
