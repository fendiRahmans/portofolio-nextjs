CREATE TABLE `about` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`title` varchar(255) NOT NULL,
	`location` varchar(255) NOT NULL,
	`image_url` text NOT NULL,
	`narrative_title` varchar(255) NOT NULL,
	`narrative_content` text NOT NULL,
	`core_values` json,
	`interests` json,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `about_id` PRIMARY KEY(`id`)
);
