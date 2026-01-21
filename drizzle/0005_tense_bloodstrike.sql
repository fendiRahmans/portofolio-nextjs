CREATE TABLE `setting` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`value` text NOT NULL,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `setting_id` PRIMARY KEY(`id`),
	CONSTRAINT `setting_name_unique` UNIQUE(`name`)
);
