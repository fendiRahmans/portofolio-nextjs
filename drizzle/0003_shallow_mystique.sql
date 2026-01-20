CREATE TABLE `career` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`year` varchar(100) NOT NULL,
	`title` varchar(255) NOT NULL,
	`subtitle` varchar(255) NOT NULL,
	`description` text NOT NULL,
	`icon` varchar(50) NOT NULL,
	`color` varchar(50) NOT NULL,
	`tech_stack` json,
	`key_projects` json,
	`project_list` json,
	`bullet_points` json,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `career_id` PRIMARY KEY(`id`)
);
